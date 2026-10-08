import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/db/prisma";
import { getSettings } from "@/lib/utils/settings";
import { z } from "zod";

const orderSchema = z.object({
  customerName: z.string().min(1).max(200),
  customerPhone: z.string().min(1).max(30),
  customerEmail: z.string().email().optional().nullable(),
  orderType: z.enum(["PICKUP", "DELIVERY"]),
  deliveryAddress: z.string().max(300).optional().nullable(),
  deliveryCity: z.string().max(100).optional().nullable(),
  deliveryState: z.string().max(50).optional().nullable(),
  deliveryZip: z.string().max(20).optional().nullable(),
  deliveryInstructions: z.string().max(300).optional().nullable(),
  specialInstructions: z.string().max(300).optional().nullable(),
  items: z
    .array(
      z.object({
        menuItemId: z.string().min(1),
        quantity: z.number().int().min(1).max(50),
        specialInstructions: z.string().max(200).optional().nullable(),
        addOnIds: z.array(z.string()).max(20).default([]),
      })
    )
    .min(1)
    .max(50),
});

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

async function nextOrderNumber() {
  const counter = await prisma.orderCounter.upsert({
    where: { id: "main" },
    update: { lastSeq: { increment: 1 } },
    create: { id: "main", lastSeq: 1 },
  });
  return `MW-${String(counter.lastSeq).padStart(6, "0")}`;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;

  if (data.orderType === "DELIVERY") {
    if (
      !data.deliveryAddress?.trim() ||
      !data.deliveryCity?.trim() ||
      !data.deliveryZip?.trim()
    ) {
      return NextResponse.json({ error: "Delivery address is incomplete." }, { status: 400 });
    }
  }

  const settings = await getSettings();

  if (data.orderType === "DELIVERY" && !settings.deliveryEnabled) {
    return NextResponse.json({ error: "Delivery is not available right now." }, { status: 400 });
  }

  // Look up every menu item and add-on from the database — never trust prices from the client.
  const menuItemIds = [...new Set(data.items.map((i) => i.menuItemId))];
  const dbItems = await prisma.menuItem.findMany({
    where: { id: { in: menuItemIds }, available: true },
    include: { addOns: true },
  });
  const itemsById = new Map(dbItems.map((i) => [i.id, i]));

  const resolvedItems: {
    menuItemId: string;
    itemNameSnapshot: string;
    priceSnapshot: number;
    quantity: number;
    specialInstructions: string | null | undefined;
    subtotal: number;
    addOns: { nameSnapshot: string; priceSnapshot: number }[];
  }[] = [];

  for (const line of data.items) {
    const dbItem = itemsById.get(line.menuItemId);
    if (!dbItem) {
      return NextResponse.json(
        { error: "One or more items in your cart are no longer available. Please refresh your cart." },
        { status: 400 }
      );
    }

    const availableAddOns = new Map(dbItem.addOns.filter((a) => a.available).map((a) => [a.id, a]));
    const resolvedAddOns: { nameSnapshot: string; priceSnapshot: number }[] = [];
    for (const addOnId of line.addOnIds) {
      const addOn = availableAddOns.get(addOnId);
      if (!addOn) {
        return NextResponse.json(
          { error: `An add-on for "${dbItem.name}" is no longer available. Please refresh your cart.` },
          { status: 400 }
        );
      }
      resolvedAddOns.push({ nameSnapshot: addOn.name, priceSnapshot: addOn.price });
    }

    const addOnTotal = resolvedAddOns.reduce((s, a) => s + a.priceSnapshot, 0);
    const lineSubtotal = round2((dbItem.price + addOnTotal) * line.quantity);

    resolvedItems.push({
      menuItemId: dbItem.id,
      itemNameSnapshot: dbItem.name,
      priceSnapshot: dbItem.price,
      quantity: line.quantity,
      specialInstructions: line.specialInstructions,
      subtotal: lineSubtotal,
      addOns: resolvedAddOns,
    });
  }

  const subtotal = round2(resolvedItems.reduce((s, i) => s + i.subtotal, 0));

  if (
    data.orderType === "DELIVERY" &&
    settings.deliveryMinimum != null &&
    subtotal < settings.deliveryMinimum
  ) {
    return NextResponse.json(
      { error: `Minimum order for delivery is $${settings.deliveryMinimum.toFixed(2)}.` },
      { status: 400 }
    );
  }

  const deliveryFee =
    data.orderType === "DELIVERY" && settings.deliveryEnabled && settings.deliveryFee != null
      ? settings.deliveryFee
      : 0;

  const tax = !settings.taxEnabled
    ? 0
    : settings.taxMode === "FLAT"
    ? round2(settings.taxFlatAmount ?? 0)
    : round2(subtotal * (settings.taxRate ?? 0));

  const total = round2(subtotal + deliveryFee + tax);

  const orderNumber = await nextOrderNumber();

  const order = await prisma.order.create({
    data: {
      orderNumber,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
      orderType: data.orderType,
      deliveryAddress: data.orderType === "DELIVERY" ? data.deliveryAddress : null,
      deliveryCity: data.orderType === "DELIVERY" ? data.deliveryCity : null,
      deliveryState: data.orderType === "DELIVERY" ? data.deliveryState : null,
      deliveryZip: data.orderType === "DELIVERY" ? data.deliveryZip : null,
      deliveryInstructions: data.orderType === "DELIVERY" ? data.deliveryInstructions : null,
      specialInstructions: data.specialInstructions,
      subtotal,
      deliveryFee,
      tax,
      total,
      items: {
        create: resolvedItems.map((item) => ({
          menuItemId: item.menuItemId,
          itemNameSnapshot: item.itemNameSnapshot,
          priceSnapshot: item.priceSnapshot,
          quantity: item.quantity,
          subtotal: item.subtotal,
          specialInstructions: item.specialInstructions,
          addOns: { create: item.addOns },
        })),
      },
    },
    include: { items: { include: { addOns: true } } },
  });

  return NextResponse.json(order, { status: 201 });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: { include: { addOns: true } } },
    take: 200,
  });
  return NextResponse.json(orders);
}
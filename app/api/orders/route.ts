import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/db/prisma";
import { getSettings } from "@/lib/utils/settings";
import { z } from "zod";

// NOTE: the client sends WHAT was ordered (which items, which add-ons, how many).
// It never sends prices, subtotal, tax, delivery fee, or total — those are always
// looked up fresh from the database below, so a tampered request can't change
// what anything costs.
const orderSchema = z.object({
  customerName: z.string().min(1),
  customerPhone: z.string().min(1),
  customerEmail: z.string().email().optional().nullable(),
  orderType: z.enum(["PICKUP", "DELIVERY"]),
  deliveryAddress: z.string().optional().nullable(),
  deliveryCity: z.string().optional().nullable(),
  deliveryState: z.string().optional().nullable(),
  deliveryZip: z.string().optional().nullable(),
  deliveryInstructions: z.string().optional().nullable(),
  specialInstructions: z.string().max(300).optional().nullable(),
  items: z
    .array(
      z.object({
        menuItemId: z.string().min(1),
        quantity: z.number().int().min(1).max(50),
        specialInstructions: z.string().optional().nullable(),
        addOnIds: z.array(z.string()).default([]),
      })
    )
    .min(1),
});

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
  const settings = await getSettings();

  // Look up every menu item referenced in the order, in one query, so we can
  // price everything from what's actually in the database right now.
  const menuItemIds = [...new Set(data.items.map((i) => i.menuItemId))];
  const menuItems = await prisma.menuItem.findMany({
    where: { id: { in: menuItemIds } },
    include: { addOns: true },
  });
  const menuItemById = new Map(menuItems.map((m) => [m.id, m]));

  const priced: {
    menuItemId: string;
    itemNameSnapshot: string;
    priceSnapshot: number;
    quantity: number;
    specialInstructions: string | null;
    subtotal: number;
    addOns: { nameSnapshot: string; priceSnapshot: number }[];
  }[] = [];

  for (const item of data.items) {
    const menuItem = menuItemById.get(item.menuItemId);
    if (!menuItem) {
      return NextResponse.json(
        { error: `One of the items in your cart is no longer available.` },
        { status: 400 }
      );
    }
    if (!menuItem.available) {
      return NextResponse.json(
        { error: `"${menuItem.name}" is currently unavailable. Please remove it and try again.` },
        { status: 400 }
      );
    }

    const addOnById = new Map(menuItem.addOns.map((a) => [a.id, a]));
    const resolvedAddOns: { nameSnapshot: string; priceSnapshot: number }[] = [];
    for (const addOnId of item.addOnIds) {
      const addOn = addOnById.get(addOnId);
      // An add-on ID that doesn't belong to this menu item, or isn't available, is dropped
      // rather than trusted — it can only ever be an add-on this specific item actually offers.
      if (!addOn || !addOn.available) continue;
      resolvedAddOns.push({ nameSnapshot: addOn.name, priceSnapshot: addOn.price });
    }

    const unitPrice = menuItem.price + resolvedAddOns.reduce((s, a) => s + a.priceSnapshot, 0);
    priced.push({
      menuItemId: menuItem.id,
      itemNameSnapshot: menuItem.name,
      priceSnapshot: menuItem.price,
      quantity: item.quantity,
      specialInstructions: item.specialInstructions ?? null,
      subtotal: unitPrice * item.quantity,
      addOns: resolvedAddOns,
    });
  }

  const subtotal = priced.reduce((s, i) => s + i.subtotal, 0);

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
    : settings.taxMode === "flat"
    ? settings.taxFlatAmount ?? 0
    : settings.taxRate
    ? subtotal * settings.taxRate
    : 0;

  const total = subtotal + deliveryFee + tax;

  const orderNumber = await nextOrderNumber();

  const order = await prisma.order.create({
    data: {
      orderNumber,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
      orderType: data.orderType,
      deliveryAddress: data.deliveryAddress,
      deliveryCity: data.deliveryCity,
      deliveryState: data.deliveryState,
      deliveryZip: data.deliveryZip,
      deliveryInstructions: data.deliveryInstructions,
      specialInstructions: data.specialInstructions,
      subtotal,
      deliveryFee,
      tax,
      total,
      items: {
        create: priced.map((item) => ({
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
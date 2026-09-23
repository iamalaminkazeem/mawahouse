import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/db/prisma";
import { z } from "zod";

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
  subtotal: z.number().min(0),
  deliveryFee: z.number().min(0).default(0),
  tax: z.number().min(0).default(0),
  total: z.number().min(0),
  items: z
    .array(
      z.object({
        menuItemId: z.string().optional().nullable(),
        itemNameSnapshot: z.string().min(1),
        priceSnapshot: z.number().min(0),
        quantity: z.number().min(1),
        specialInstructions: z.string().optional().nullable(),
        addOns: z
          .array(z.object({ nameSnapshot: z.string(), priceSnapshot: z.number() }))
          .default([]),
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
      subtotal: data.subtotal,
      deliveryFee: data.deliveryFee,
      tax: data.tax,
      total: data.total,
      items: {
        create: data.items.map((item) => ({
          menuItemId: item.menuItemId || undefined,
          itemNameSnapshot: item.itemNameSnapshot,
          priceSnapshot: item.priceSnapshot,
          quantity: item.quantity,
          subtotal:
            (item.priceSnapshot + item.addOns.reduce((s, a) => s + a.priceSnapshot, 0)) *
            item.quantity,
          specialInstructions: item.specialInstructions,
          addOns: {
            create: item.addOns.map((a) => ({
              nameSnapshot: a.nameSnapshot,
              priceSnapshot: a.priceSnapshot,
            })),
          },
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

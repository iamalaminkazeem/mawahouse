import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/db/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const addOn = await prisma.addOn.create({
    data: {
      name: body.name,
      price: parseFloat(body.price),
      menuItemId: body.menuItemId,
    },
  });
  return NextResponse.json(addOn, { status: 201 });
}

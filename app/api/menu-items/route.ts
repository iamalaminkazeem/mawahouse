import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/db/prisma";
import { menuItemSchema } from "@/lib/validations/menuItem";

export async function GET() {
  const items = await prisma.menuItem.findMany({
    orderBy: [{ categoryId: "asc" }, { sortOrder: "asc" }],
    include: { category: true },
  });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = menuItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const item = await prisma.menuItem.create({ data: parsed.data });
  return NextResponse.json(item, { status: 201 });
}

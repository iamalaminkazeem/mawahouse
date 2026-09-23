import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  const specials = await prisma.special.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json(specials);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const special = await prisma.special.create({
    data: {
      name: body.name,
      description: body.description || null,
      price: body.price ? parseFloat(body.price) : null,
      imageUrl: body.imageUrl || null,
      startDate: body.startDate ? new Date(body.startDate) : null,
      endDate: body.endDate ? new Date(body.endDate) : null,
    },
  });
  return NextResponse.json(special, { status: 201 });
}

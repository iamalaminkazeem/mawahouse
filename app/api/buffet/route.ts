import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  const entries = await prisma.buffetEntry.findMany({ orderBy: { createdAt: "asc" } });
  return NextResponse.json(entries);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const entry = await prisma.buffetEntry.create({
    data: {
      name: body.name,
      description: body.description || null,
      price: body.price ? parseFloat(body.price) : null,
      days: body.days || [],
      startTime: body.startTime || null,
      endTime: body.endTime || null,
    },
  });
  return NextResponse.json(entry, { status: 201 });
}

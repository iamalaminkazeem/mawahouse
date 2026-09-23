import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  const images = await prisma.galleryImage.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json(images);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const image = await prisma.galleryImage.create({
    data: {
      url: body.url,
      caption: body.caption || null,
      category: body.category || "other",
    },
  });
  return NextResponse.json(image, { status: 201 });
}

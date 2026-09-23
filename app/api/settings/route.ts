import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  const settings = await prisma.siteSettings.upsert({
    where: { id: "main" },
    update: {},
    create: { id: "main" },
  });
  return NextResponse.json(settings);
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  // these are never client-editable
  delete body.id;
  delete body.updatedAt;

  const settings = await prisma.siteSettings.update({
    where: { id: "main" },
    data: body,
  });

  // Refresh every public page (nav, footer, homepage, contact, etc.) right away
  revalidatePath("/", "layout");

  return NextResponse.json(settings);
}
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { imagekit } from "@/lib/storage/imagekit";

// Returns short-lived auth params so the browser can upload directly to ImageKit
// (the private key never reaches the client).
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const authParams = imagekit.getAuthenticationParameters();
  return NextResponse.json({
    ...authParams,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  });
}

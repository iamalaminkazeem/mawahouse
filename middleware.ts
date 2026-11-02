import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const maintenance = process.env.MAINTENANCE_MODE === "true";
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Admin area: must be signed in (the login page stays open)
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return NextResponse.next();
    if (!token) {
      const url = new URL("/admin/login", req.url);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Normal mode: nothing else to do
  if (!maintenance) return NextResponse.next();

  // Maintenance mode: signed-in admins can use the whole site
  if (token) return NextResponse.next();

  // Everyone else: allow only the login API and the maintenance page itself
  if (pathname.startsWith("/api/auth") || pathname === "/maintenance") {
    return NextResponse.next();
  }

  // Block orders and all other API calls
  if (pathname.startsWith("/api/")) {
    return NextResponse.json(
      { error: "MaWa House is temporarily closed for online orders." },
      { status: 503 }
    );
  }

  // Show the maintenance page for every other page
  return NextResponse.rewrite(new URL("/maintenance", req.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
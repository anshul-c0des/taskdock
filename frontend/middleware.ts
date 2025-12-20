import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token"); // JWT set by backend
  const { pathname } = req.nextUrl;

  // Allow public paths
  if (pathname.startsWith("/auth") || pathname === "/") {
    return NextResponse.next();
  }

  // Redirect to login if token is missing
  if (!token) {
    const loginUrl = new URL("/auth/login", req.url);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/tasks/:path*"], // protect dashboard & task pages
};

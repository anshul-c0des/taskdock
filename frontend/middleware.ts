import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname === "/" ||
    pathname.startsWith("/auth")
  ) {
    return NextResponse.next();
  }

  try {
    // Ask backend if user is authenticated
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/me`,
      {
        headers: {
          cookie: req.headers.get("cookie") || "",
        },
        credentials: "include",
      }
    );
    if (!res.ok) {
      throw new Error("Unauthorized");
    }

    return NextResponse.next();
  } catch {
    // Not authenticated → redirect before page renders
    const loginUrl = new URL("/auth/login", req.url);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/tasks/:path*"],
};

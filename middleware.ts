import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get("token")?.value || "";

  const cookieStore = cookies();
  const token2 = cookieStore.get("token");

  console.log({ token, token2, cookieStore, coo: request.cookies });

  if (!token) {
    if (pathname === "/") {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  const headersDefault = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    "x-app-key": `${process.env.NEXT_PUBLIC_APP_KEY}`,
  };

  const data = await (
    await fetch(process.env.NEXT_PUBLIC_URL_API + "/auth/check-token", {
      method: "POST",
      headers: {
        ...headersDefault,
      },
    })
  ).json();

  const { statusCode = 0 } = data;

  // Token valido
  if (statusCode === 0) {
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  } else {
    // Token invalido
    if (pathname === "/") {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|service-worker).*)"],
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const pathname = url.pathname;
  const queryParams = url.searchParams;
  const tokenRestorePassword = queryParams.get("token");
  const token =
    request.cookies.get("token")?.value || tokenRestorePassword || "";

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

  let statusCode = 0;
  // token valido = 0
  // token invalido = 1

  if (!tokenRestorePassword) {
    const data = await (
      await fetch(process.env.NEXT_PUBLIC_URL_API + "/auth/check-token", {
        method: "POST",
        headers: {
          ...headersDefault,
        },
      })
    ).json();

    statusCode = data.statusCode || 0;
  } else if (tokenRestorePassword) {
    const data = await (
      await fetch(
        process.env.NEXT_PUBLIC_URL_API + "/auth/check-token-restore-password",
        {
          method: "POST",
          headers: {
            ...headersDefault,
          },
          body: JSON.stringify({
            token: tokenRestorePassword,
          }),
        }
      )
    ).json();

    statusCode = data.statusCode || 0;
  }

  // Token valido
  if (statusCode === 0) {
    //console.log("token valido ************");

    if (pathname === "/" && !tokenRestorePassword) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  } else {
    //console.log("token invalido ************");

    const searchParams = url.searchParams;
    if (searchParams.has("token")) {
      searchParams.delete("token");
      url.search = searchParams.toString();
      return NextResponse.redirect(new URL(url.pathname, request.url));
    }

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

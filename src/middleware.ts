// src/middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { locales } from "@/i18n";

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_FILE.test(pathname) || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const hasLocale = locales.some((l) => pathname.startsWith(`/${l}`));
  if (!hasLocale) {
    const url = req.nextUrl.clone();
    url.pathname = `/en${pathname}`; // zvol výchozí jazyk
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};

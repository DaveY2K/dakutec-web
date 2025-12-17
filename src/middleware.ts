import { NextRequest, NextResponse } from "next/server";
import { isLocale, type Locale } from "@/i18n";

const PUBLIC_FILE = /\.(.*)$/;

function getDefaultLocaleForHost(hostname: string | null): Locale {
  const host = hostname?.split(":")[0].toLowerCase();

  if (host === "dakutec.cz" || host === "www.dakutec.cz") {
    return "cs";
  }

  // default pro dakutec.com (www i bez www) = angličtina
  return "en";
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hostname = req.headers.get("host");

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const pathLocale = pathname.split("/")[1];

  // když URL už má /cs, /en nebo /de, necháme ji být
  if (isLocale(pathLocale as Locale)) {
    return NextResponse.next();
  }

  // doména → výchozí jazyk
  const locale = getDefaultLocaleForHost(hostname);
  const url = req.nextUrl.clone();

  // /  → /cs nebo /en
  // /services → /cs/services nebo /en/services
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;

  // tady je rozdíl: REDIRECT místo REWRITE
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/|api/|favicon.ico|robots.txt|sitemap.xml|media/).*)"],
};

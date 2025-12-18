// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { isLocale, type Locale } from "@/i18n";

const PUBLIC_FILE = /\.(.*)$/;

function getHostType(hostname: string | null): "cz" | "com" | "other" {
  if (!hostname) return "other";

  const host = hostname.split(":")[0].toLowerCase();

  if (host === "dakutec.cz" || host === "www.dakutec.cz") return "cz";
  if (host === "dakutec.com" || host === "www.dakutec.com") return "com";

  // preview / localhost / vercel → chováme se jako "other"
  return "other";
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hostname = req.headers.get("host");

  // ignoruj statické soubory, next internals, api
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    PUBLIC_FILE.test(pathname) ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml"
  ) {
    return NextResponse.next();
  }

  const hostType = getHostType(hostname);

  const segments = pathname.split("/"); // ['', 'cs', 'services', ...]
  const maybeLocale = segments[1];
  const restPath = segments.slice(2).join("/"); // 'services', 'rfq', ...

  // helper pro redirect v rámci stejné domény
  const redirectSameHost = (locale: Locale) => {
    const url = req.nextUrl.clone();
    url.pathname =
      "/" + locale + (pathname === "/" ? "" : pathname); // "/" -> "/cs", "/services" -> "/cs/services"
    return NextResponse.redirect(url);
  };

  // helper pro redirect na jinou doménu
  const redirectToHost = (host: string, locale: Locale) => {
    const url = req.nextUrl.clone();
    url.protocol = "https:";
    url.hostname = host;
    url.pathname = "/" + locale + (restPath ? "/" + restPath : "");
    return NextResponse.redirect(url);
  };

  // ================== .CZ DOMÉNA ==================
  if (hostType === "cz") {
    // žádný prefix → přidáme /cs
    if (!isLocale(maybeLocale as Locale)) {
      return redirectSameHost("cs");
    }

    // /cs/... → necháme být
    if (maybeLocale === "cs") {
      return NextResponse.next();
    }

    // /en nebo /de na .cz → přesměrovat na .com
    if (maybeLocale === "en" || maybeLocale === "de") {
      return redirectToHost("dakutec.com", maybeLocale as Locale);
    }

    return NextResponse.next();
  }

  // ================== .COM DOMÉNA ==================
  if (hostType === "com") {
    // žádný prefix → default /en
    if (!isLocale(maybeLocale as Locale)) {
      return redirectSameHost("en");
    }

    // /cs/... na .com → přesměrovat na .cz
    if (maybeLocale === "cs") {
      return redirectToHost("dakutec.cz", "cs");
    }

    // /en nebo /de na .com → ok, necháme být
    if (maybeLocale === "en" || maybeLocale === "de") {
      return NextResponse.next();
    }

    return NextResponse.next();
  }

  // ================== OTHER (localhost, vercel preview…) ==================
  // Chováme se jako "mezinárodní" – všechny jazyky povoleny na jedné doméně

  if (!isLocale(maybeLocale as Locale)) {
    // default EN, ale bez cross-domain redirectů
    return redirectSameHost("en");
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/|api/|favicon.ico|robots.txt|sitemap.xml|media/).*)"],
};

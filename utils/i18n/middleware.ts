import { NextResponse } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { NextRequest } from "next/server";
import { locales, Locale, defaultLocale } from "./constants";

function getLocale(request: NextRequest): string {
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLocale && locales.includes(cookieLocale as Locale)) {
    return cookieLocale;
  }

  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  return match(languages, locales, defaultLocale);
}

export function handleLocale(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const urlLocale = pathname.match(/^\/([a-z]{2})(\/|$)/)?.[1] as
    | Locale
    | undefined;

  if (urlLocale && locales.includes(urlLocale)) {
    const response = NextResponse.next();
    if (request.cookies.get("NEXT_LOCALE")?.value !== urlLocale) {
      response.cookies.set("NEXT_LOCALE", urlLocale, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
      });
    }
    return response;
  }

  const shouldHandlePath = !pathname.match(
    /^\/(?:_next|api|favicon\.ico|public\/|images\/|static\/|.*\.(svg|png|jpg|jpeg|gif|ico)$)/
  );
  if (!shouldHandlePath) return null;

  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;

  const response = NextResponse.redirect(request.nextUrl);
  response.cookies.set("NEXT_LOCALE", locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  return response;
}

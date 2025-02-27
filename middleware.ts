import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";
import { handleLocale } from "@/utils/i18n/middleware";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  const localeResponse = handleLocale(request);
  const supabaseResponse = await updateSession(request);

  // Priority to authentication redirections
  if (supabaseResponse?.status === 307 || supabaseResponse?.status === 308) {
    if (localeResponse) {
      localeResponse.cookies.getAll().forEach((cookie) => {
        supabaseResponse.cookies.set(cookie.name, cookie.value, cookie);
      });
    }
    return supabaseResponse;
  }

  if (localeResponse) {
    supabaseResponse?.cookies.getAll().forEach((cookie) => {
      localeResponse.cookies.set(cookie.name, cookie.value, cookie);
    });
    return localeResponse;
  }

  return supabaseResponse || NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|public/|images/|static/|api|sitemap\\.xml|robots\\.txt|.*\\..*$).*)",
  ],
};

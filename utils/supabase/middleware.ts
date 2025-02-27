import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { ROUTES_CONFIG, matchRoutePattern } from "@/utils/auth/routes-config";
import { locales, Locale } from "@/utils/i18n/constants";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // Paths
  const { pathname } = request.nextUrl;
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, "");

  // Ignore static assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/public") ||
    pathname === "/favicon.ico"
  ) {
    return supabaseResponse;
  }

  // Locale
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  const currentLocale = locales.includes(cookieLocale as Locale)
    ? cookieLocale
    : "en";

  // Check both with and without locale
  const matchedRoute = matchRoutePattern(pathWithoutLocale, ROUTES_CONFIG);
  const isProtectedRoute = matchedRoute?.protected ?? false;
  const isAuthRoute = matchedRoute && !matchedRoute.protected;

  // Supabase
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthenticated = !!user;

  // Redirect if necessary
  if (!isAuthenticated && isProtectedRoute) {
    const redirectUrl = new URL(`/${currentLocale}/login`, request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (isAuthenticated && isAuthRoute) {
    const redirectPath = matchedRoute?.redirectTo || "/";
    return NextResponse.redirect(
      new URL(`/${currentLocale}${redirectPath}`, request.url)
    );
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}

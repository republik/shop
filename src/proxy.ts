import {
  ANALYTICS_COOKIE_NAME,
  collectAnalyticsParams,
  toAnalyticsCookie,
} from "@/lib/analytics";
import { NextRequest, NextResponse } from "next/server";

const ANALYTICS_COOKIE_MAX_AGE = 60 * 60 * 24; // 24h

export async function proxy(req: NextRequest) {
  const analyticsParams = collectAnalyticsParams(
    Object.fromEntries(req.nextUrl.searchParams.entries()),
  );

  if (Object.keys(analyticsParams).length > 0) {
    const url = req.nextUrl.clone();
    Object.keys(analyticsParams).forEach((key) => {
      url.searchParams.delete(key);
    });
    const res = NextResponse.redirect(url.toString());
    res.cookies.set(ANALYTICS_COOKIE_NAME, toAnalyticsCookie(analyticsParams), {
      maxAge: ANALYTICS_COOKIE_MAX_AGE,
    });
    return res;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - monitoring (Sentry tunnel route)
     * - graphql (API proxy)
     * - __plsb (Plausible proxy)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|monitoring|graphql|__plsb).*)",
  ],
};

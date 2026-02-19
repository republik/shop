import { ANALYTICS_COOKIE_NAME, collectAnalyticsParams } from "@/lib/analytics";
import { NextRequest, NextResponse } from "next/server";

const ANALYTICS_COOKIE_MAX_AGE = 60 * 60 * 24; // 24h

export async function proxy(req: NextRequest) {
  /**
   * Proxy requests to /graphql to the API with authentication headers
   */
  if (req.nextUrl.pathname === "/graphql") {
    const headers = new Headers(req.headers);
    headers.set("x-api-gateway-client", "shop");
    headers.set("x-api-gateway-token", process.env.API_GATEWAY_TOKEN ?? "");

    const res = NextResponse.rewrite(new URL(process.env.API_URL), {
      request: {
        headers,
      },
    });

    return res;
  }

  /**
   * Store analytics params in a cookie
   */
  const analyticsParams = collectAnalyticsParams(
    Object.fromEntries(req.nextUrl.searchParams.entries()),
  );

  if (Object.keys(analyticsParams).length > 0) {
    const res = NextResponse.next();
    res.cookies.set(ANALYTICS_COOKIE_NAME, JSON.stringify(analyticsParams), {
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
     * - __plsb (Plausible proxy)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|monitoring|__plsb).*)",
  ],
};

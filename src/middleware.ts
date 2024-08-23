import {
  ANALYTICS_COOKIE_NAME,
  collectAnalyticsParams,
  toAnalyticsCookie,
} from "@/lib/analytics";
import { NextRequest, NextResponse } from "next/server";

const ANALYTICS_COOKIE_MAX_AGE = 60 * 60 * 24 * 3; // 3 days

const CURTAIN_COOKIE_NAME = "OpenSesame";
const CURTAIN_PASSTHROUGH_PATHS = [
  "/api/",
  "/_next/",
  "/static/",
  "/favicon.ico",
  "/.well-known/",
];

type Middleware = (req: NextRequest) => NextResponse | Promise<NextResponse>;

/**
 * A HoC that returns a wrapped middleware hidden behind a curtain.
 * The curtain prevents the user from accessing the website unless the correct path is entered
 * or the correct cookie is set.
 * Once the curtain is lifted, the cookie renews itself and the user can access the website.
 * @param middleware The middleware to wrap
 * @returns The wrapped middleware
 */
function curtainHOC(middleware: Middleware): Middleware {
  const BACKDOOR_URL = process.env.CURTAIN_BACKDOOR_URL;
  if (!BACKDOOR_URL) {
    return middleware;
  }

  return async (req: NextRequest) => {
    const cookieValue = req.cookies.get(CURTAIN_COOKIE_NAME)?.value || "";
    const cookieValueDecoded = Buffer.from(cookieValue, "base64").toString();
    const userAgent = req.headers.get("user-agent");

    if (
      CURTAIN_PASSTHROUGH_PATHS.some((path) =>
        req.nextUrl.pathname.startsWith(path)
      )
    ) {
      return middleware(req);
    }

    const hasBackdoorCookie = cookieValueDecoded === BACKDOOR_URL;
    const hasBypassQueryparam =
      req.nextUrl.searchParams.get("open_sesame") ===
      BACKDOOR_URL.replace(/^\//, "");

    const isBackdoorPath = req.nextUrl.pathname === BACKDOOR_URL;
    const isAllowedUserAgent =
      userAgent &&
      process.env.CURTAIN_UA_ALLOW_LIST &&
      (process.env.CURTAIN_UA_ALLOW_LIST || "")
        .split(",")
        .some((ua) => userAgent.includes(ua));

    if (
      !isBackdoorPath &&
      !hasBackdoorCookie &&
      !hasBypassQueryparam &&
      !isAllowedUserAgent
    ) {
      return new NextResponse("No shopping for you!", {
        status: 401,
      });
    }

    // helper to attach the curtain cookie to the response
    const applyCurtainCookie = (res: NextResponse): NextResponse => {
      if (res) {
        const b64backdoorURL = Buffer.from(BACKDOOR_URL).toString("base64");
        res.cookies.set(CURTAIN_COOKIE_NAME, b64backdoorURL, {
          maxAge: 60 * 60 * 24 * 30, // 30 days
        });
      }
      return res;
    };

    if (isBackdoorPath) {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      return applyCurtainCookie(NextResponse.redirect(url.toString()));
    }

    if (hasBypassQueryparam) {
      const url = req.nextUrl.clone();
      url.searchParams.delete("open_sesame");
      return applyCurtainCookie(NextResponse.redirect(url.toString()));
    }

    const res = await middleware(req);

    return applyCurtainCookie(res);
  };
}

function analyticsHOC(middleware: Middleware): Middleware {
  return async (req: NextRequest) => {
    const res = await middleware(req);
    const analyticsParams = collectAnalyticsParams(
      Object.fromEntries(req.nextUrl.searchParams.entries())
    );

    if (Object.keys(analyticsParams).length > 0) {
      const url = req.nextUrl.clone();
      Object.keys(analyticsParams).forEach((key) => {
        url.searchParams.delete(key);
      });
      const res = NextResponse.redirect(url.toString());
      res.cookies.set(
        ANALYTICS_COOKIE_NAME,
        toAnalyticsCookie(analyticsParams),
        {
          maxAge: ANALYTICS_COOKIE_MAX_AGE,
        }
      );
      return res;
    }

    return res;
  };
}

async function middlewareFunc(req: NextRequest): Promise<NextResponse> {
  return NextResponse.next();
}

export const middleware = analyticsHOC(curtainHOC(middlewareFunc));

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

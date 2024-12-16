import { cookies } from "next/headers";

const allowedParamsRe = /^(utm_|rep_|referrer|source)/;

export type AnalyticsObject = Record<string, string>;

export function collectAnalyticsParams(
  params: Record<string, string>
): AnalyticsObject {
  const analyticsParams = Object.fromEntries(
    Object.entries(params).filter(([key]) => allowedParamsRe.test(key))
  );
  return analyticsParams;
}

export const ANALYTICS_COOKIE_NAME = "republik-analytics-params";

export function toAnalyticsCookie(object: AnalyticsObject): string {
  return JSON.stringify(object);
}

function fromAnalyticsCookie(cookie: string): AnalyticsObject {
  try {
    const object = JSON.parse(cookie);
    return collectAnalyticsParams(object);
  } catch {
    return {};
  }
}

export function readAnalyticsParamsFromCookie(): AnalyticsObject {
  const cookie = cookies().get(ANALYTICS_COOKIE_NAME);
  if (!cookie) {
    return {};
  }
  return fromAnalyticsCookie(cookie.value);
}

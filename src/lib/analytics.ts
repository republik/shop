import { cookies } from "next/headers";
import { z } from "zod";

export type AnalyticsObject = Record<string, string>;

const ParamTuple = z.tuple([
  z.string().regex(/^(utm_[a-z_]+|rep_[a-z_]+|referrer|source)$/),
  z.string(),
]);

export function collectAnalyticsParams(
  params: Record<string, unknown>,
): AnalyticsObject {
  const analyticsParams = Object.fromEntries(
    Object.entries(params).flatMap((entry) => {
      const result = ParamTuple.safeParse(entry);
      return result.success ? [result.data] : [];
    }),
  );
  return analyticsParams;
}

export const ANALYTICS_COOKIE_NAME = "republik-analytics-params";

function fromAnalyticsCookie(cookie: string): AnalyticsObject {
  try {
    const object = JSON.parse(cookie);
    return collectAnalyticsParams(object);
  } catch {
    return {};
  }
}

export async function readAnalyticsParamsFromCookie(): Promise<AnalyticsObject> {
  const cookie = (await cookies()).get(ANALYTICS_COOKIE_NAME);
  if (!cookie) {
    return {};
  }
  return fromAnalyticsCookie(cookie.value);
}

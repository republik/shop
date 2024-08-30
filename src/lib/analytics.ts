import * as v from "valibot";

const analyticsSearchParams = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "referrer_id",
] as const;

type AnalyticsParameter = (typeof analyticsSearchParams)[number];

export type AnalyticsObject = Partial<Record<AnalyticsParameter, string>>;

const AnalyticsSearchParamsSchema = v.looseObject({
  utm_source: v.optional(v.pipe(v.unknown(), v.transform(String))),
  utm_medium: v.optional(v.pipe(v.unknown(), v.transform(String))),
  utm_campaign: v.optional(v.pipe(v.unknown(), v.transform(String))),
  utm_term: v.optional(v.pipe(v.unknown(), v.transform(String))),
  utm_content: v.optional(v.pipe(v.unknown(), v.transform(String))),
  referrer_id: v.optional(v.pipe(v.unknown(), v.transform(String))),
});

export function collectAnalyticsParams(
  object: Record<string, unknown>
): AnalyticsObject {
  const { success, output, issues } = v.safeParse(
    AnalyticsSearchParamsSchema,
    object
  );
  if (!success) {
    console.error("Failed to parse Analytics-params", issues);
    return {};
  }
  const analyticsParams = Object.fromEntries(
    Object.entries(output).filter(([key]) =>
      analyticsSearchParams.includes(key as unknown as AnalyticsParameter)
    )
  ) as AnalyticsObject;
  return analyticsParams;
}

export const ANALYTICS_COOKIE_NAME = "SUBSCRIPTION_CONTEXT";

export function toAnalyticsCookie(object: AnalyticsObject): string {
  return JSON.stringify(object);
}

export function fromAnalyticsCookie(cookie: string): AnalyticsObject {
  const object = JSON.parse(cookie);
  return collectAnalyticsParams(object);
}

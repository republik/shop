import * as v from "valibot";

const utmParams = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

type UtmParam = (typeof utmParams)[number];

export type UtmObject = Partial<Record<UtmParam, string>>;

const UtmSearchParamsSchema = v.object({
  utm_source: v.optional(v.pipe(v.unknown(), v.transform(String))),
  utm_medium: v.optional(v.pipe(v.unknown(), v.transform(String))),
  utm_campaign: v.optional(v.pipe(v.unknown(), v.transform(String))),
  utm_term: v.optional(v.pipe(v.unknown(), v.transform(String))),
  utm_content: v.optional(v.pipe(v.unknown(), v.transform(String))),
});

/**
 * Retrieve all UTM parameters from am object
 * @param searchParams
 * @returns Record<utm_params, string>
 */
export function collectUtmParams(searchParams: URLSearchParams): UtmObject {
  const params = Object.fromEntries(searchParams.entries());
  const { success, output } = v.safeParse(UtmSearchParamsSchema, params);
  return success ? output : {};
}

export const UTM_COOKIE_NAME = "utm";

export function toUtmCookie(utm: UtmObject): string {
  return JSON.stringify(utm);
}

export function fromUtmCookie(cookie: string): UtmObject {
  const object = JSON.parse(cookie);
  const { success, output } = v.safeParse(UtmSearchParamsSchema, object);
  return success ? output : {};
}

"use server";

import { CreateCheckoutSessionDocument } from "#graphql/republik-api/__generated__/gql/graphql";
import {
  ANALYTICS_COOKIE_NAME,
  AnalyticsObject,
  fromAnalyticsCookie,
} from "@/lib/analytics";
import { getClient } from "@/lib/graphql/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CHECKOUT_SESSION_ID_COOKIE } from "./components/checkout";

function readAnalyticsParamsFromCookie(): AnalyticsObject {
  const cookie = cookies().get(ANALYTICS_COOKIE_NAME);
  if (!cookie) {
    return {};
  }
  return fromAnalyticsCookie(cookie.value);
}

export async function createCheckout(formData: FormData): Promise<void> {
  const subscriptionType = formData.get("subscriptionType")?.toString() ?? "";
  const price = formData.get("price");

  const gqlClient = getClient();

  // TODO Add back analytics params
  // const analyticsParams = readAnalyticsParamsFromCookie();

  const { data, error } = await gqlClient.mutation(
    CreateCheckoutSessionDocument,
    {
      offerId: subscriptionType,
      customPrice: price ? Number(price) * 100 : undefined,
    }
  );

  if (!data?.createCheckoutSession || error) {
    console.error(error);
    throw Error("noin");
  }

  cookies().set(
    CHECKOUT_SESSION_ID_COOKIE,
    data.createCheckoutSession.sessionId,
    {
      expires: 1000 * 60 * 30, // expire after30min
    }
  );

  redirect(`/angebot/${subscriptionType}`);
}

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

  const promoItems = formData.getAll("promoItem");

  const gqlClient = getClient();

  const analyticsParams = readAnalyticsParamsFromCookie();

  const { data, error } = await gqlClient.mutation(
    CreateCheckoutSessionDocument,
    {
      offerId: subscriptionType,
      customPrice: price ? Number(price) * 100 : undefined,
      metadata: analyticsParams,
      returnUrl: `${process.env.NEXT_PUBLIC_URL}/angebot/${subscriptionType}?return_from_checkout=true&session_id={CHECKOUT_SESSION_ID}`,
      promotionItems: promoItems.map((item) => {
        return {
          id: item.toString(),
          quantity: 1, // hard-coded to 1
        };
      }),
    }
  );

  if (!data?.createCheckoutSession || error) {
    console.error(error);
    throw Error("Checkout session could not be created");
  }

  redirect(`?session_id=${data.createCheckoutSession.sessionId}`);
}

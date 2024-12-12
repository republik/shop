"use server";

import { CreateCheckoutSessionDocument } from "#graphql/republik-api/__generated__/gql/graphql";
import { CHECKOUT_SESSION_ID_COOKIE } from "@/app/angebot/[slug]/constants";
import { readAnalyticsParamsFromCookie } from "@/lib/analytics";
import { getClient } from "@/lib/graphql/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createCheckout(formData: FormData): Promise<void> {
  const subscriptionType = formData.get("subscriptionType")?.toString() ?? "";
  const price = formData.get("price");

  const gqlClient = getClient();

  const analyticsParams = readAnalyticsParamsFromCookie();

  const { data, error } = await gqlClient.mutation(
    CreateCheckoutSessionDocument,
    {
      offerId: subscriptionType,
      customPrice: price ? Number(price) * 100 : undefined,
      metadata: analyticsParams,
      returnUrl: `${process.env.NEXT_PUBLIC_URL}/angebot/${subscriptionType}?return_from_checkout=true&session_id={CHECKOUT_SESSION_ID}`,
    }
  );

  if (!data?.createCheckoutSession || error) {
    console.error(error);
    throw Error("Checkout session could not be created");
  }

  cookies().set(
    CHECKOUT_SESSION_ID_COOKIE,
    data.createCheckoutSession.sessionId,
    {
      maxAge: 1000 * 60 * 30, // expire after30min
    }
  );

  redirect(`/angebot/${subscriptionType}`);
}

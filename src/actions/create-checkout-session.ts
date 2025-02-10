"use server";

import { CreateCheckoutSessionDocument } from "#graphql/republik-api/__generated__/gql/graphql";
import { readAnalyticsParamsFromCookie } from "@/lib/analytics";
import { getClient } from "@/lib/graphql/client";
import { redirect } from "next/navigation";

type CreateCheckoutState = {};

export async function createCheckoutSession(
  previousState: CreateCheckoutState,
  formData: FormData
): Promise<CreateCheckoutState> {
  const offerId = formData.get("offerId")?.toString() ?? "";
  const price = formData.get("price");

  const promoCode = formData.get("promoCode");

  const gqlClient = await getClient();

  const analyticsParams = await readAnalyticsParamsFromCookie();

  const { data, error } = await gqlClient.mutation(
    CreateCheckoutSessionDocument,
    {
      offerId: offerId,
      customPrice: price ? Number(price) * 100 : undefined,
      metadata: analyticsParams,
      promoCode: promoCode ? String(promoCode) : undefined,
      returnUrl: `${process.env.NEXT_PUBLIC_URL}/angebot/${offerId}?return_from_checkout=true&session_id={CHECKOUT_SESSION_ID}`,
    }
  );

  if (!data?.createCheckoutSession || error) {
    console.error(error);
    throw Error("Checkout session could not be created");
  }

  redirect(
    `?session_id=${data.createCheckoutSession.sessionId}&promo_code=${promoCode}`
  );
}

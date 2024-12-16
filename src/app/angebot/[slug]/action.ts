"use server";

import { CreateCheckoutSessionDocument } from "#graphql/republik-api/__generated__/gql/graphql";
import { readAnalyticsParamsFromCookie } from "@/lib/analytics";
import { getClient } from "@/lib/graphql/client";
import { redirect } from "next/navigation";

export async function createCheckout(formData: FormData): Promise<void> {
  const offerId = formData.get("offerId")?.toString() ?? "";
  const price = formData.get("price");

  const promoItems = formData.getAll("promoItem");

  const gqlClient = getClient();

  const analyticsParams = readAnalyticsParamsFromCookie();

  const { data, error } = await gqlClient.mutation(
    CreateCheckoutSessionDocument,
    {
      offerId: offerId,
      customPrice: price ? Number(price) * 100 : undefined,
      metadata: analyticsParams,
      returnUrl: `${process.env.NEXT_PUBLIC_URL}/angebot/${offerId}?return_from_checkout=true&session_id={CHECKOUT_SESSION_ID}`,
      complimentaryItems: promoItems.map((item) => {
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

"use server";

import { CreateCheckoutSessionDocument } from "#graphql/republik-api/__generated__/gql/graphql";
import { readAnalyticsParamsFromCookie } from "@/lib/analytics";
import { getClient } from "@/lib/graphql/client";
import * as z from "zod";

const CheckoutSessionInput = z.object({
  offerId: z.string(),
  promoCode: z.string().optional(),
  donationAmount: z.coerce.number().optional(),
  donationRecurring: z.coerce.boolean(),
  discountOption: z.string().optional(),
  discountReason: z.string().optional(),
  birthyear: z.string().optional(),
});

type CreateCheckoutState = {
  sessionId?: string;
};

export async function createCheckoutSession(
  previousState: CreateCheckoutState,
  formData: FormData
): Promise<CreateCheckoutState> {
  const {
    offerId,
    promoCode,
    donationAmount,
    donationRecurring,
    discountOption,
    discountReason,
    birthyear,
  } = CheckoutSessionInput.parse(Object.fromEntries(formData));

  const gqlClient = await getClient();

  const analyticsParams = await readAnalyticsParamsFromCookie();

  const { data, error } = await gqlClient.mutation(
    CreateCheckoutSessionDocument,
    {
      offerId: offerId,
      metadata: { ...analyticsParams, reason: discountReason, birthyear },
      promoCode,
      customDonation: donationAmount
        ? { amount: donationAmount, recurring: donationRecurring }
        : null,
      selectedDiscount: discountOption ?? null,
      returnUrl: `${process.env.NEXT_PUBLIC_URL}/angebot/${offerId}?return_from_checkout=true&session_id={CHECKOUT_SESSION_ID}`,
    }
  );

  if (!data?.createCheckoutSession || error) {
    console.error(error);
    throw Error("Checkout session could not be created");
  }

  return {
    sessionId: data.createCheckoutSession.sessionId,
  };
}

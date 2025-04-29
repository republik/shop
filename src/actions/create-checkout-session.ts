"use server";

import { CreateCheckoutSessionDocument } from "#graphql/republik-api/__generated__/gql/graphql";
import { readAnalyticsParamsFromCookie } from "@/lib/analytics";
import { getClient } from "@/lib/graphql/client";

type CreateCheckoutState = {
  sessionId?: string;
  donationOption?: string;
};

export async function createCheckoutSession(
  previousState: CreateCheckoutState,
  formData: FormData
): Promise<CreateCheckoutState> {
  const offerId = formData.get("offerId")?.toString() ?? "";
  const donationOption = formData.get("donationOption")?.toString();
  const customDonation = formData.get("customDonation")?.toString();
  const discountOption = formData.get("discountOption")?.toString();
  const discountReason = formData.get("discountReason")?.toString();
  const promoCode = formData.get("promoCode")?.toString();
  const donationRecurring = formData.has("donationRecurring");

  const donationAmount =
    donationOption === "CUSTOM" && customDonation
      ? parseInt(customDonation, 10) * 100 // customDonation is a user-provided field in francs, we need to convert to cents
      : donationOption
      ? parseInt(donationOption, 10)
      : undefined;

  const gqlClient = await getClient();

  const analyticsParams = await readAnalyticsParamsFromCookie();

  const { data, error } = await gqlClient.mutation(
    CreateCheckoutSessionDocument,
    {
      offerId: offerId,
      metadata: { ...analyticsParams, reason: discountReason },
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
    donationOption,
  };
}

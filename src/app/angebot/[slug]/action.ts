"use server";

import { getClient } from "@/lib/apollo/client";
import { AboTypes, checkoutConfig } from "./lib/config";
import { initStripe } from "./lib/stripe/server";
import { MeDocument } from "#graphql/republik-api/__generated__/gql/graphql";

interface CheckoutSessionResponse {
  clientSecret: string;
}

export async function initializeCheckout(
  aboTypes: AboTypes,
  userEmail?: string
): Promise<CheckoutSessionResponse> {
  const meRes = await getClient().query({ query: MeDocument });
  const aboConfig = checkoutConfig[aboTypes];
  const stripe = await initStripe(aboConfig.stripeAccount);

  const [price, coupon] = await Promise.all([
    stripe.prices.retrieve(aboConfig.priceId),
    aboConfig.couponCode
      ? stripe.coupons.retrieve(aboConfig.couponCode).catch(() => null)
      : null,
  ]);

  const isEliglibleForDiscount = meRes.data?.me?.memberships?.length == 0;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    ui_mode: "embedded",
    // success_url: `${process.env.NEXT_PUBLIC_URL}/angebot/${aboTypes}/success`,
    // cancel_url: `${process.env.NEXT_PUBLIC_URL}/angebot/${aboTypes}?cancled`,
    customer_email: userEmail,
    line_items: [
      {
        price: price.id,
        quantity: 1,
      },
    ],
    currency: price.currency,
    discounts:
      isEliglibleForDiscount && coupon ? [{ coupon: coupon.id }] : undefined,
    return_url: `${process.env.NEXT_PUBLIC_URL}/angebot/${aboTypes}/success`,
  });

  if (!session.client_secret) {
    throw new Error("No client_secret in checkout session");
  }

  return {
    clientSecret: session.client_secret,
  };
}

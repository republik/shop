import Stripe from "stripe";
import { initStripe } from "./stripe/server";
import { StripeAccount } from "./stripe/types";

export type AboPurchaseOptions = {
  stripeAccount: StripeAccount;
  productId: string;
  priceId: string;
  couponCode?: string;
  // TODO: check how to properly assign existing customer.
  userEmail?: string;
};

type AboPurchaseSession = {
  clientSecret: string;
};

/**
 * Initialize a checkout session for an abo purchase with the given params.
 * @param productId - The stripe-product-id.
 * @param priceId - The stripe price-id.
 * @param couponCodeId - The stripe coupon-code.
 */
export async function initAboPurchase({
  stripeAccount,
  productId,
  priceId,
  couponCode,
  userEmail,
}: AboPurchaseOptions): Promise<Stripe.Checkout.Session> {
  const stripe = initStripe(stripeAccount);

  const [product, price] = await Promise.all([
    stripe.products.retrieve(productId).catch((err) => {
      console.error("Failed to retrieve product", err);
      // TODO: Sentry
      throw err;
    }),
    stripe.prices.retrieve(priceId).catch((err) => {
      console.error("Failed to retrieve price", err);
      // TODO: Sentry
      throw err;
    }),
  ]);

  if (!price.unit_amount || !price.recurring) {
    // TODO: handle this error properly
    throw new Error("Missing unit amount or recurring");
  }

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "chf",
          product: product.id,
          unit_amount: price.unit_amount!,
          recurring: {
            interval: price.recurring.interval,
            interval_count: price.recurring.interval_count,
          },
        },
        quantity: 1,
      },
    ],
    billing_address_collection: "required",
    // TODO: check docs if this might cause issues
    discounts: couponCode ? [{ coupon: couponCode }] : undefined,
    return_url: `${process.env.NEXT_PUBLIC_URL}/checkout/success`,
    mode: "subscription",
    // FIXME: typings are not yet updated to include custom-checkout
    ui_mode: "custom" as any,
    // TODO: should we hardcode this?
    locale: "de",
    customer_email: userEmail || undefined,
  });

  if (!session.client_secret) {
    // TODO: handle this error properly
    throw new Error("Missing client secret");
  }

  return session;
}

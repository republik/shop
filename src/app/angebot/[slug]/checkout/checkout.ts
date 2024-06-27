"use server";

import { fetchMe } from "@/lib/auth/fetch-me";
import { AboTypes, checkoutConfig } from "../lib/config";
import { initStripe } from "../lib/stripe/server";

interface CheckoutSessionResponse {
  clientSecret: string;
}

export async function initializeCheckout(
  aboTypes: AboTypes,
  options: {
    email?: string;
    userPrice?: number;
  }
): Promise<CheckoutSessionResponse> {
  const me = await fetchMe();
  const aboConfig = checkoutConfig[aboTypes];
  const stripe = await initStripe(aboConfig.stripeAccount);

  const [price, product, coupon] = await Promise.all([
    stripe.prices.retrieve(aboConfig.priceId),
    stripe.products.retrieve(aboConfig.productId),
    aboConfig.couponCode
      ? stripe.coupons.retrieve(aboConfig.couponCode).catch(() => null)
      : null,
  ]);

  const isEliglibleForDiscount = me?.memberships?.length == 0;
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    ui_mode: "embedded",
    customer_email: options.email,
    line_items: [
      {
        price:
          !!options.userPrice && aboConfig.customPrice ? undefined : price.id,
        price_data:
          !!options.userPrice && aboConfig.customPrice
            ? {
                product: product.id,
                unit_amount: options.userPrice,
                currency: price.currency,
                recurring: {
                  interval: "year",
                  interval_count: 1,
                },
              }
            : undefined,
        quantity: 1,
      },
    ],
    currency: price.currency,
    discounts:
      isEliglibleForDiscount && coupon ? [{ coupon: coupon.id }] : undefined,
    return_url: `${process.env.NEXT_PUBLIC_URL}/angebot/${aboTypes}`,
    locale: "de",
    billing_address_collection: "required",
  });

  if (!session.client_secret) {
    throw new Error("No client_secret in checkout session");
  }

  return {
    clientSecret: session.client_secret,
  };
}

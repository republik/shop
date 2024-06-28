"use server";

import { fetchMe } from "@/lib/auth/fetch-me";
import { AboTypes, checkoutConfig } from "./lib/config";
import { initStripe } from "./lib/stripe/server";
import { UTM_COOKIE_NAME, UtmObject, fromUtmCookie } from "@/lib/utm";
import { cookies } from "next/headers";
import { CHECKOUT_SESSION_ID_COOKIE } from "./checkout/checkout";
import { redirect } from "next/navigation";

function getUTM(): UtmObject {
  const utmCookie = cookies().get(UTM_COOKIE_NAME);
  if (!utmCookie) {
    return {};
  }
  return fromUtmCookie(utmCookie.value);
}

interface CheckoutOptions {
  email?: string;
  userPrice?: number;
  utm?: UtmObject;
}

async function initializeCheckout(
  aboType: AboTypes,
  options: CheckoutOptions
): Promise<void> {
  const me = await fetchMe();
  const aboConfig = checkoutConfig[aboType];
  const stripe = await initStripe(aboConfig.stripeAccount);

  const [price, product, coupon] = await Promise.all([
    stripe.prices.retrieve(aboConfig.priceId),
    stripe.products.retrieve(aboConfig.productId),
    aboConfig.couponCode
      ? stripe.coupons.retrieve(aboConfig.couponCode).catch(() => null)
      : null,
  ]);
  const isEliglibleForDiscount = me?.memberships?.length == 0;
  const utmObj = getUTM();

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
    return_url: `${process.env.NEXT_PUBLIC_URL}/angebot/${aboType}/checkout`,
    locale: "de",
    billing_address_collection: "required",
    subscription_data: {
      metadata: { ...utmObj },
    },
  });

  if (!session.client_secret) {
    throw new Error("No client_secret in checkout session");
  }

  cookies().set(CHECKOUT_SESSION_ID_COOKIE, session.id);
}

export async function createCheckout(formData: FormData): Promise<{}> {
  const aboType = formData.get("aboType") as string;
  const price = formData.get("price");

  if (!aboType) {
    throw new Error("Abo type not given");
  }
  if (!Object.keys(checkoutConfig).includes(aboType)) {
    throw new Error(
      `Invalid AboType '${aboType}'. AboType must be one of ${String(
        Object.keys(checkoutConfig)
      )}`
    );
  }

  const me = await fetchMe();
  const aboConfig = checkoutConfig[aboType as AboTypes];

  await initializeCheckout(aboType, {
    email: me?.email || undefined,
    userPrice: aboConfig.customPrice
      ? Math.max(240, price ? Number(price) : 0) * 100
      : undefined,
  });

  redirect(`/angebot/${aboType}/checkout`);
}

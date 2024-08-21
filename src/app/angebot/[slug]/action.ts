"use server";

import { fetchMe } from "@/lib/auth/fetch-me";
import { AboTypes, CheckoutConfig } from "./lib/config";
import {
  getAccountPaymentsConfiguration,
  initStripe,
} from "./lib/stripe/server";
import { UTM_COOKIE_NAME, UtmObject, fromUtmCookie } from "@/lib/utm";
import { cookies } from "next/headers";
import { CHECKOUT_SESSION_ID_COOKIE } from "./components/checkout";
import { redirect } from "next/navigation";
import { StripeAccount } from "./lib/stripe/types";
import { Me } from "@/lib/auth/types";
import { isEligibleForEntryCoupon } from "@/lib/auth/discount-eligability";

function getUTM(): UtmObject {
  const utmCookie = cookies().get(UTM_COOKIE_NAME);
  if (!utmCookie) {
    return {};
  }
  return fromUtmCookie(utmCookie.value);
}

function getRelevantStripeCustomer(
  me: Me,
  stripeAccount: StripeAccount
): string | undefined {
  switch (stripeAccount) {
    case "REPUBLIK":
      return me?.stripeCustomerRepublik?.customerId;
    case "PROJECT_R":
      return me?.stripeCustomerProjectR?.customerId;
    default:
      return undefined;
  }
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
  const aboConfig = CheckoutConfig[aboType];
  const stripe = await initStripe(aboConfig.stripeAccount);

  const [price, product, coupon] = await Promise.all([
    stripe.prices.retrieve(aboConfig.priceId),
    stripe.products.retrieve(aboConfig.productId),
    aboConfig.couponCode
      ? stripe.coupons.retrieve(aboConfig.couponCode).catch(() => null)
      : null,
  ]);
  const utmObj = getUTM();

  const stripeCustomer = getRelevantStripeCustomer(
    me!,
    aboConfig.stripeAccount
  );

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    ui_mode: "embedded",
    customer: stripeCustomer,
    customer_email: !stripeCustomer ? options.email : undefined,
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
      isEligibleForEntryCoupon(me) && coupon
        ? [{ coupon: coupon.id }]
        : undefined,
    return_url: `${process.env.NEXT_PUBLIC_URL}/angebot/${aboType}?session_id={CHECKOUT_SESSION_ID}`,
    locale: "de",
    redirect_on_completion: "if_required",
    billing_address_collection: "required",
    subscription_data: {
      metadata: { ...utmObj },
    },
    consent_collection: {
      terms_of_service: "required",
    },
    payment_method_configuration: getAccountPaymentsConfiguration(
      aboConfig.stripeAccount
    ),
    saved_payment_method_options: {
      payment_method_save: "enabled",
    },
  });

  if (!session.client_secret) {
    throw new Error("No client_secret in checkout session");
  }

  cookies().set(CHECKOUT_SESSION_ID_COOKIE, session.id, {
    expires: 1000 * 60 * 30, // expire after30min
  });
}

export async function createCheckout(formData: FormData): Promise<{}> {
  const aboType = formData.get("aboType");
  const price = formData.get("price");

  if (!aboType || typeof aboType !== "string") {
    throw new Error("Abo type not given");
  }

  if (!Object.keys(CheckoutConfig).includes(aboType)) {
    throw new Error(
      `Invalid AboType '${aboType}'. AboType must be one of ${String(
        Object.keys(CheckoutConfig)
      )}`
    );
  }

  const me = await fetchMe();
  const aboConfig = CheckoutConfig[aboType as AboTypes];

  await initializeCheckout(aboType, {
    email: me?.email || undefined,
    userPrice: aboConfig.customPrice
      ? Math.max(240, price ? Number(price) : 0) * 100
      : undefined,
  });

  redirect(`/angebot/${aboType}`);
}

export async function getMe(): Promise<Me | null> {
  return fetchMe();
}

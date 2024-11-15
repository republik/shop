import Stripe from "stripe";

const API_VERSION = "2020-08-27; custom_checkout_beta=v1";

function initStripe(company: string): Stripe {
  const stripeSecretKey = process.env[`STRIPE_SECRET_KEY_${company}`] ?? "";

  return new Stripe(stripeSecretKey, {
    // @ts-expect-error - custom_checkout_beta is not a valid API version
    apiVersion: API_VERSION,
  });
}

export async function getCheckoutSession(company: string, sessionId: string) {
  const stripe = initStripe(company);
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  return { status: session.status, clientSecret: session.client_secret };
}

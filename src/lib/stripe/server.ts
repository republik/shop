import Stripe from "stripe";

const API_VERSION = "2025-08-27.basil";

function initStripe(company: string): Stripe {
  const stripeSecretKey = process.env[`STRIPE_SECRET_KEY_${company}`];

  if (!stripeSecretKey) {
    throw new Error(
      `Couldn't initialize Stripe: STRIPE_SECRET_KEY_${company} is undefined`
    );
  }

  return new Stripe(stripeSecretKey, {
    apiVersion: API_VERSION,
  });
}

export type CheckoutSessionData = {
  email: string | null | undefined;
} & Pick<Stripe.Checkout.Session, "id" | "status" | "client_secret">;

export async function expireCheckoutSession(
  company: string,
  sessionId: string,
  customerId?: string | null
) {
  const stripe = initStripe(company);
  try {
    const session = await getCheckoutSession(company, sessionId, customerId);

    if (session) {
      await stripe.checkout.sessions.expire(session.id);
      console.log("Expired session", session.id);
    }
  } catch (e) {
    // No need to log the error?
  }
}

export async function getCheckoutSession(
  company: string,
  sessionId: string,
  customerId?: string | null
): Promise<CheckoutSessionData | undefined> {
  const stripe = initStripe(company);
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (customerId && session.customer && session.customer !== customerId) {
      return;
    }

    return {
      id: session.id,
      status: session.status,
      client_secret: session.client_secret,
      email: session.customer_email ?? session.customer_details?.email,
    };
  } catch (e) {
    // No need to log the error?
  }
  return undefined;
}

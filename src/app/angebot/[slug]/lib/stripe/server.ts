import Stripe from "stripe";

const API_VERSION = "2020-08-27; custom_checkout_beta=v1";

function initStripe(company: string): Stripe {
  const stripeSecretKey = process.env[`STRIPE_SECRET_KEY_${company}`] ?? "";

  return new Stripe(stripeSecretKey, {
    // @ts-expect-error - custom_checkout_beta is not a valid API version
    apiVersion: API_VERSION,
  });
}

type SessionData = Pick<
  Stripe.Checkout.Session,
  "id" | "status" | "client_secret"
>;

export async function expireCheckoutSession(
  company: string,
  sessionId: string,
  customerId?: string | null
) {
  try {
    const stripe = initStripe(company);
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
): Promise<SessionData | undefined> {
  try {
    const stripe = initStripe(company);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.customer !== customerId) {
      return;
    }

    return {
      id: session.id,
      status: session.status,
      client_secret: session.client_secret,
    };
  } catch (e) {
    // No need to log the error?
  }
  return undefined;
}

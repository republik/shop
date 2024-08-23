import { cookies } from "next/headers";
import { initStripe } from "../lib/stripe/server";
import { CheckoutView } from "./checkout-view";
import { SubscriptionConfiguration } from "../lib/stripe/types";
import { SuccessView } from "./success-view";

export const CHECKOUT_SESSION_ID_COOKIE = "checkoutSessionId";

interface CheckoutProps {
  sessionId: string;
  clientSecret: string;
  stripeAccount: SubscriptionConfiguration["stripeAccount"];
}

export default async function Checkout(props: CheckoutProps) {
  const stripe = await initStripe(props.stripeAccount);
  const session = await stripe.checkout.sessions.retrieve(props.sessionId);

  if (!session.client_secret) {
    return <p>Something is wrong</p>;
  }

  if (session.status === "open") {
    return (
      <CheckoutView
        clientSecret={session.client_secret}
        stripeAccount={props.stripeAccount}
      />
    );
  }

  if (session.status === "complete") {
    return <SuccessView />;
  }

  if (session.status === "expired") {
    // TODO: Should we return the user to the non checkout page
    return <p>Session expired.</p>;
  }

  // TODO: render alert with error message
  throw new Error("Invalid checkout state");
}

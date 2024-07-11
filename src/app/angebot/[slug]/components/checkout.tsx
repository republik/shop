import { cookies } from "next/headers";
import { initStripe } from "../lib/stripe/server";
import { CheckoutView } from "./checkout-view";
import { AboConfiguration } from "../lib/stripe/types";

export const CHECKOUT_SESSION_ID_COOKIE = "checkoutSessionId";

interface CheckoutProps {
  sessionId: string;
  clientSecret: string;
  stripeAccount: AboConfiguration["stripeAccount"];
}

export default async function Checkout(props: CheckoutProps) {
  const sessionId = cookies().get(CHECKOUT_SESSION_ID_COOKIE)?.value;

  const stripe = await initStripe(props.stripeAccount);
  const session = await stripe.checkout.sessions.retrieve(sessionId!);

  if (session.status === "complete") {
    return <p>Thanks for your purchase!</p>;
  }

  if (session.status === "expired") {
    // TODO: Should we return the user to the non checkout page
    return <p>Session expired.</p>;
  }

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

  // TODO: sentry? this should never happen.
  throw new Error("Oh no");
}

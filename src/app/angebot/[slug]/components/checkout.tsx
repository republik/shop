import { initStripe } from "../lib/stripe/server";
import { CheckoutView } from "./checkout-view";
import { SubscriptionConfiguration } from "../lib/stripe/types";
import { SuccessView } from "./success-view";
import { ErrorView } from "./error-view";

export const CHECKOUT_SESSION_ID_COOKIE = "checkoutSessionId";

interface CheckoutProps {
  sessionId: string;
  clientSecret: string;
  stripeAccount: SubscriptionConfiguration["stripeAccount"];
  afterRedirect?: boolean;
}

export default async function Checkout(props: CheckoutProps) {
  const stripe = await initStripe(props.stripeAccount);
  const session = await stripe.checkout.sessions.retrieve(props.sessionId);

  if (session.status === "complete") {
    return <SuccessView />;
  }

  if (!session.client_secret) {
    return <p>Something is wrong</p>;
  }

  if (session.status === "open" && props.afterRedirect) {
    // we need to display an error message if the session is still open after a redirect
    return (
      <>
        <ErrorView />
        <CheckoutView
          clientSecret={session.client_secret}
          stripeAccount={props.stripeAccount}
        />
      </>
    );
  }

  if (session.status === "open") {
    return (
      <>
        <CheckoutView
          clientSecret={session.client_secret}
          stripeAccount={props.stripeAccount}
        />
      </>
    );
  }

  if (session.status === "expired") {
    // TODO: Should we return the user to the non checkout page
    return <p>Session expired.</p>;
  }

  // TODO: render alert with error message
  throw new Error("Invalid checkout state");
}

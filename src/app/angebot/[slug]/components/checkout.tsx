import { useTranslations } from "next-intl";
import Stripe from "stripe";
import { SubscriptionConfiguration } from "../lib/stripe/types";
import { CheckoutView } from "./checkout-view";
import { SuccessView } from "./success-view";
import { getTranslations } from "next-intl/server";

export const CHECKOUT_SESSION_ID_COOKIE = "checkoutSessionId";

interface CheckoutProps {
  session: Stripe.Checkout.Session;
  stripeAccount: SubscriptionConfiguration["stripeAccount"];
  afterRedirect?: boolean;
}

export default async function Checkout(props: CheckoutProps) {
  const t = await getTranslations();

  if (props.session.status === "complete") {
    return <SuccessView />;
  }

  if (props.session.status === "open") {
    if (!props.session.client_secret) {
      throw new Error("Stripe Client sercet missing");
    }
    // we need to display an error message if the session is still open after a redirect
    const errors = props.afterRedirect
      ? [
          {
            title: t("checkout.checkout.failed.title"),
            description: t("checkout.checkout.failed.description"),
          },
        ]
      : [];
    return (
      <CheckoutView
        clientSecret={props.session.client_secret}
        stripeAccount={props.stripeAccount}
        errors={errors}
      />
    );
  }

  // We should never end up here because the check for the expired session is on the parent page
}

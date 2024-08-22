"use client";

import { useState } from "react";
import { SubscriptionConfiguration } from "../lib/stripe/types";
import { initStripe } from "../lib/stripe/client";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { SuccessView } from "./success-view";

interface CheckoutViewProps {
  clientSecret: string;
  stripeAccount: SubscriptionConfiguration["stripeAccount"];
}

export function CheckoutView({
  clientSecret,
  stripeAccount,
}: CheckoutViewProps) {
  const stripe = initStripe(stripeAccount);
  const [success, setSuccess] = useState(false);

  if (success) {
    return <SuccessView />;
  }

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider
        stripe={stripe}
        options={{
          clientSecret,
          onComplete: () => {
            setSuccess(true);
          },
        }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}

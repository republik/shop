"use client";

import { useEffect, useState } from "react";
import { AboPurchaseOptions, StripeAccount } from "../lib/stripe/types";
import { initStripe } from "../lib/stripe/client";
import { Stripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { toast } from "sonner";

function useStripe(account: StripeAccount) {
  const [stripe, setStripe] = useState<Stripe | null>(null);

  useEffect(() => {
    initStripe(account).then((s) => {
      setStripe(() => s);
    });
    return () => {
      setStripe(null);
    };
  }, [account, setStripe]);

  return stripe;
}

interface CheckoutViewProps {
  clientSecret: string;
  aboPurchaseOptions: AboPurchaseOptions;
}

export function CheckoutView({
  clientSecret,
  aboPurchaseOptions,
}: CheckoutViewProps) {
  const stripe = useStripe(aboPurchaseOptions.stripeAccount);

  if (!stripe || !clientSecret) {
    return <p>Loading...</p>;
  }

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider
        stripe={stripe}
        options={{
          clientSecret,
          onComplete() {
            toast.success("Abokauf erfolgreich");
          },
        }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}

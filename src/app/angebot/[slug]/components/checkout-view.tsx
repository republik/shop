"use client";

import { useState } from "react";
import { AboPurchaseOptions } from "../lib/stripe/types";
import { initStripe } from "../lib/stripe/client";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SuccessView } from "./success-view";

interface CheckoutViewProps {
  clientSecret: string;
  aboPurchaseOptions: AboPurchaseOptions;
}

export function CheckoutView({
  clientSecret,
  aboPurchaseOptions,
}: CheckoutViewProps) {
  const stripe = initStripe(aboPurchaseOptions.stripeAccount);
  const [success, setSuccess] = useState(false);

  if (success) {
    <SuccessView />;
  }

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider
        stripe={stripe}
        options={{
          clientSecret,
          onComplete() {
            setSuccess(true);
          },
        }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}

"use client";

import { ErrorMessage } from "@/components/checkout/error-message";
import { loadStripe } from "@/lib/stripe/client";
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { useState } from "react";

interface CheckoutViewProps {
  clientSecret: string | null | undefined;
  company: string;
  errors: { title: string; description: string }[];
}

export function EmbeddedCheckoutView({
  clientSecret,
  company,
  errors,
}: CheckoutViewProps) {
  const [complete, setComplete] = useState(false);
  return (
    <div id="checkout">
      {errors.map((e) => (
        <ErrorMessage
          key={e.title}
          title={e.title}
          description={e.description}
        />
      ))}
      <EmbeddedCheckoutProvider
        stripe={loadStripe(company)}
        options={{
          clientSecret,
          onComplete: () => {
            setComplete(true);
            window.location.reload();
          },
        }}
      >
        {!complete && <EmbeddedCheckout />}
      </EmbeddedCheckoutProvider>
    </div>
  );
}

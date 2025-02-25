"use client";

import { ErrorMessage } from "@/components/checkout/error-message";
import { loadStripe } from "@/lib/stripe/client";
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";

interface CheckoutViewProps {
  clientSecret: string;
  company: string;
  errors: { title: string; description: string }[];
}

export function EmbeddedCheckoutView({
  clientSecret,
  company,
  errors,
}: CheckoutViewProps) {
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
        }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}

"use client";

import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { loadStripe } from "../lib/stripe/client";
import { ErrorMessage } from "./error-message";

interface CheckoutViewProps {
  clientSecret: string;
  company: string;
  errors: { title: string; description: string }[];
}

export function CheckoutView({
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
          onComplete: () => {
            window.location.reload();
          },
        }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}

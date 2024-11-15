"use client";

import { useState } from "react";
import { loadStripe } from "../lib/stripe/client";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { SuccessView } from "./success-view";
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
  const [success, setSuccess] = useState(false);

  if (success) {
    return <SuccessView />;
  }

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
            setSuccess(true);
          },
        }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}

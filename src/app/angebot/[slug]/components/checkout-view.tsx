"use client";

import { useState } from "react";
import { SubscriptionConfiguration } from "../lib/stripe/types";
import { initStripe } from "../lib/stripe/client";
import {
  EmbeddedCheckoutProvider,
  // EmbeddedCheckout,
  CustomCheckoutProvider,
  PaymentElement,
  useCustomCheckout,
} from "@stripe/react-stripe-js";
import { SuccessView } from "./success-view";
import { ErrorMessage } from "./error-message";
import { Button } from "@/components/ui/button";

interface CheckoutViewProps {
  clientSecret: string;
  stripeAccount: SubscriptionConfiguration["stripeAccount"];
  errors: { title: string; description: string }[];
}

function CheckoutSubmit({}) {
  const { canConfirm, confirmationRequirements, confirm } = useCustomCheckout();
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    confirm().then((result) => {
      if (result.error) {
        // Confirmation failed. Display the error message.
        console.error(result.error);
      }
      setLoading(false);
    });
  };
  console.log(confirmationRequirements);
  return (
    <Button disabled={!canConfirm || loading} onClick={handleClick}>
      KAUFEN
    </Button>
  );
}

export function CheckoutView({
  clientSecret,
  stripeAccount,
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
      <CustomCheckoutProvider
        stripe={initStripe(stripeAccount)}
        options={{
          clientSecret,
          // onComplete: () => {
          //   setSuccess(true);
          // },

          elementsOptions: { appearance: { theme: "flat" } },
        }}
      >
        <form>
          Hello custom checkout!
          <PaymentElement
            options={{ terms: { card: "never", paypal: "never" } }}
          />
          <CheckoutSubmit />
        </form>
        {/* <EmbeddedCheckout /> */}
      </CustomCheckoutProvider>
    </div>
  );
}

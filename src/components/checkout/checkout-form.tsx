"use client";

import { Button } from "@/components/ui/button";
import {
  AddressElement,
  PaymentElement,
  useCheckout,
} from "@stripe/react-stripe-js";

export function CheckoutForm() {
  const {
    canConfirm,
    confirmationRequirements,
    confirm,
    status,
    discountAmounts,
    total,
    lineItems,
  } = useCheckout();

  return (
    <form
      action={async () => {
        const checkoutResult = await confirm();

        if (checkoutResult.type === "error") {
          console.error(checkoutResult.error);
        }
      }}
    >
      <AddressElement
        options={{ mode: "billing", autocomplete: { mode: "disabled" } }}
      />
      <PaymentElement options={{ terms: { card: "never", paypal: "never" } }} />

      <pre>{JSON.stringify(lineItems, null, 2)}</pre>
      <pre>{JSON.stringify(discountAmounts, null, 2)}</pre>
      <pre>{JSON.stringify(total, null, 2)}</pre>

      <Button type="submit" size="large">
        Bezahlön für {total.total}
      </Button>
    </form>
  );
}

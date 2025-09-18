"use client";

import { ErrorMessage } from "@/components/checkout/error-message";
import { PaymentSummary } from "@/components/checkout/payment-summary";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { loadStripe } from "@/lib/stripe/client";
import {
  CheckoutProvider,
  PaymentElement,
  useCheckout,
} from "@stripe/react-stripe-js/checkout";
import { AlertCircleIcon } from "lucide-react";

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
      <CheckoutProvider
        stripe={loadStripe(company)}
        options={{
          fetchClientSecret: async () => {
            return clientSecret;
          },
          // onComplete: () => {
          //   setComplete(true);
          //   window.location.reload();
          // },
          elementsOptions: {
            // loader: "never",
            appearance: {
              theme: "stripe",
              variables: {
                fontFamily: "GT-America-Standard",
                fontWeightMedium: "500",
                fontSizeSm: "14px",
                borderRadius: "4px",
                spacingUnit: "0.25rem",
                focusBoxShadow: "none",
              },

              rules: {
                ".AccordionItem": {
                  borderColor: "transparent",
                  boxShadow: "none",
                  paddingLeft: "0",
                  paddingRight: "0",
                },
                ".Input": {
                  boxShadow: "none",
                },
              },
            },
            fonts: [
              {
                family: "GT-America-Standard",
                src: `url(https://cdn.repub.ch/s3/republik-assets/fonts/gt-america-standard-regular.woff)
      format('woff'),
    url(https://cdn.repub.ch/s3/republik-assets/fonts/gt-america-standard-regular.ttf)
      format('truetype')`,
                weight: "400",
              },
              {
                family: "GT-America-Standard",
                src: `url(https://cdn.repub.ch/s3/republik-assets/fonts/gt-america-standard-medium.woff)
      format('woff'),
    url(https://cdn.repub.ch/s3/republik-assets/fonts/gt-america-standard-medium.ttf)
      format('truetype')`,
                weight: "500",
              },
            ],
          },
        }}
      >
        <CheckoutForm />
      </CheckoutProvider>
    </div>
  );
}

type CheckoutFormState =
  | {
      type: "error";
      error: { message: string };
    }
  | {
      type: "success";
    }
  | {
      type: "initial";
    };

function CheckoutForm() {
  const checkoutState = useCheckout();

  console.log(checkoutState);

  switch (checkoutState.type) {
    case "loading":
      return <div>Loading ...</div>;
    case "error":
      return <div>Error: {checkoutState.error.message}</div>;
    case "success":
      return (
        <form
          action={async () => {
            const checkoutResult = await checkoutState.checkout.confirm();

            console.log(checkoutResult);
          }}
        >
          <PaymentSummary checkoutState={checkoutState} />

          {checkoutState.checkout.lastPaymentError ? (
            <Alert variant="error">
              <AlertCircleIcon />
              <AlertTitle>Ups</AlertTitle>
              <AlertDescription>
                <>{checkoutState.checkout.lastPaymentError.message}</>
              </AlertDescription>
            </Alert>
          ) : null}

          <PaymentElement
            options={{
              layout: "accordion",
            }}
          />

          <Button
            size="large"
            type="submit"
            disabled={!checkoutState.checkout.canConfirm}
          >
            Bezahlen
          </Button>
          <pre>
            {JSON.stringify(checkoutState.checkout, null, 2)}
            // A formatted total amount Total:{" "}
            {checkoutState.checkout.total.total.minorUnitsAmount}
          </pre>
        </form>
      );
  }
}

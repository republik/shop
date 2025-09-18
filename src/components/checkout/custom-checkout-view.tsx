"use client";

import { ErrorMessage } from "@/components/checkout/error-message";
import { PaymentSummary } from "@/components/checkout/payment-summary";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { loadStripe } from "@/lib/stripe/client";
import { css } from "@/theme/css";
import {
  CheckoutProvider,
  PaymentElement,
  useCheckout,
} from "@stripe/react-stripe-js/checkout";
import {
  type StripeCheckoutConfirmResult,
  type StripeElementsOptions,
} from "@stripe/stripe-js";
import { useTranslations } from "next-intl";
import { useActionState, useState } from "react";

interface CheckoutViewProps {
  clientSecret: string;
  company: string;
}

const elementsOptions: StripeElementsOptions = {
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
        borderColor: "rgba(0,0,0,0.25)",
        boxShadow: "none",
        paddingLeft: "16px",
        paddingRight: "16px",
      },
      ".Input": {
        boxShadow: "none",
      },
      ".Label": {
        fontWeight: "500",
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
};

export function CheckoutView({ clientSecret, company }: CheckoutViewProps) {
  return (
    <div id="checkout">
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
          elementsOptions,
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
  const [formState, formAction, isPending] =
    useActionState<StripeCheckoutConfirmResult | null>(async () => {
      if (checkoutState.type === "success") {
        const confirmResult = await checkoutState.checkout.confirm();
        return confirmResult;
      }
      return null;
    }, null);

  const t = useTranslations();

  console.log("state", checkoutState);

  switch (checkoutState.type) {
    case "loading":
      return <Spinner />;
    case "error":
      return (
        <ErrorMessage
          title={t("error.generic.title")}
          description={t("error.generic.message")}
        />
      );
    case "success":
      return (
        <form
          action={formAction}
          className={css({
            display: "flex",
            flexDirection: "column",
            gap: "4",
          })}
        >
          <PaymentSummary checkoutState={checkoutState} />

          {checkoutState.checkout.lastPaymentError ? (
            <ErrorMessage
              title={t("checkout.checkout.failed.title")}
              description={checkoutState.checkout.lastPaymentError.message}
            />
          ) : null}

          {formState?.type === "error" ? (
            <ErrorMessage
              title={t("checkout.checkout.failed.title")}
              description={formState.error.message}
            />
          ) : null}

          <h2
            className={css({
              textStyle: "h3Sans",
            })}
          >
            {t("checkout.checkout.paymentMethod")}
          </h2>

          <PaymentElement
            options={{
              layout: "accordion",
              terms: {
                card: "never",
                applePay: "never",
                googlePay: "never",
                paypal: "never",
              },
            }}
          />

          <p>AGB einverstanden ja/nein</p>

          <Button
            size="large"
            type="submit"
            disabled={!checkoutState.checkout.canConfirm}
            loading={isPending}
          >
            Bezahlen
          </Button>

          <p>Bla blah Abbuchen, Kündigen</p>

          <details>
            <summary>Debug Checkout State</summary>
            <pre>{JSON.stringify(checkoutState.checkout, null, 2)}</pre>
          </details>
        </form>
      );
  }
}

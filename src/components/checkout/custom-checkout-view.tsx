"use client";

import {
  OfferAvailability,
  type OfferCheckoutQuery,
} from "#graphql/republik-api/__generated__/gql/graphql";
import { ErrorMessage } from "@/components/checkout/error-message";
import { PaymentSummary } from "@/components/checkout/payment-summary";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import type { Me } from "@/lib/auth/types";
import type { CheckoutSessionData } from "@/lib/checkout-session";
import type { CheckoutState } from "@/lib/checkout-state";
import { useFormatCurrency } from "@/lib/hooks/use-format";
import { loadStripe } from "@/lib/stripe/client";
import { css } from "@/theme/css";
import {
  CheckoutProvider,
  PaymentElement,
  useCheckout,
} from "@stripe/react-stripe-js/checkout";
import type {
  StripeCheckoutConfirmResult,
  StripeElementsOptions,
} from "@stripe/stripe-js";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useActionState, type ReactNode } from "react";

const translationLinks = {
  privacyLink: (chunks: ReactNode) => (
    <Link
      key="privacyPolicyLink"
      href={`${process.env.NEXT_PUBLIC_MAGAZIN_URL}/datenschutz`}
      target="_blank"
      rel="noreferrer"
    >
      {chunks}
    </Link>
  ),
  tosLink: (chunks: ReactNode) => (
    <Link
      key="tosLink"
      href={`${process.env.NEXT_PUBLIC_MAGAZIN_URL}/agb`}
      target="_blank"
      rel="noreferrer"
    >
      {chunks}
    </Link>
  ),
  statutesLink: (chunks: ReactNode) => (
    <Link
      key="statutesLink"
      href={`${process.env.NEXT_PUBLIC_MAGAZIN_URL}/statuten`}
      target="_blank"
      rel="noreferrer"
    >
      {chunks}
    </Link>
  ),
};

interface CheckoutViewProps {
  checkoutState: Extract<CheckoutState, { step: "PAYMENT" }>;
}

const elementsOptions: StripeElementsOptions = {
  // loader: "never",
  appearance: {
    theme: "stripe",
    variables: {
      fontFamily: "GT-America-Standard",
      fontWeightMedium: "500",
      fontSizeSm: "14px",
      colorPrimary: "#000",
      colorText: "#000",
      colorTextSecondary: "rgba(0,0,0,0.55)",
      colorDanger: "#dc2626",
      borderRadius: "0.25rem",
      spacingUnit: "0.25rem",
      focusBoxShadow: "none",
      gridRowSpacing: "1rem",

      accordionItemSpacing: "1rem",
    },

    rules: {
      ".AccordionItem": {
        paddingLeft: "16px",
        paddingRight: "16px",
        borderColor: "rgba(0,0,0,0.25)",
        borderRadius: "0.5rem",
        boxShadow: "none",
        fontSize: "var(--fontSizeBase)",
      },
      ".Input, .Block": {
        boxShadow: "none",
        borderColor: "rgba(0,0,0,0.25)",
      },
      ".Label": {
        fontWeight: "500",
        marginBottom: "6px",
      },
      ".p-GridCell": {
        marginBottom: "16px",
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

export function CheckoutView({ checkoutState }: CheckoutViewProps) {
  return (
    <CheckoutProvider
      stripe={loadStripe(checkoutState.offer.company)}
      options={{
        clientSecret: checkoutState.checkoutSession.clientSecret ?? "",
        // onComplete: () => {
        //   setComplete(true);
        //   window.location.reload();
        // },
        elementsOptions,
      }}
    >
      <CheckoutForm checkoutState={checkoutState} />
    </CheckoutProvider>
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

function CheckoutForm({
  checkoutState: { offer, me, checkoutSession },
}: CheckoutViewProps) {
  const formatPrice = useFormatCurrency("CHF");
  const stripeCheckoutState = useCheckout();
  const [formState, formAction, isPending] =
    useActionState<StripeCheckoutConfirmResult | null>(async () => {
      if (stripeCheckoutState.type === "success") {
        const confirmResult = await stripeCheckoutState.checkout.confirm();
        return confirmResult;
      }
      return null;
    }, null);

  const t = useTranslations();

  const startInfo =
    offer.availability === OfferAvailability.Upgradeable &&
    offer.__typename === "SubscriptionOffer" &&
    me?.activeMagazineSubscription &&
    offer.startDate &&
    checkoutSession.breakdown
      ? t.rich("checkout.checkout.summary.startInfo", {
          startDate: new Date(offer.startDate),
          currentSubscription: me.activeMagazineSubscription.type,
          amount: formatPrice(checkoutSession.breakdown?.total),
          b: (chunks) => (
            <b
              className={css({
                whiteSpace: "nowrap",
                fontWeight: "medium",
              })}
            >
              {chunks}
            </b>
          ),
        })
      : undefined;

  switch (stripeCheckoutState.type) {
    case "loading":
      return (
        <div
          className={css({
            display: "flex",
            flexGrow: 1,
            placeContent: "center",
            placeItems: "center",
          })}
        >
          <Spinner size="large" />
        </div>
      );
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
          <PaymentSummary
            checkoutState={stripeCheckoutState}
            startInfo={startInfo}
          />

          {stripeCheckoutState.checkout.lastPaymentError ? (
            <ErrorMessage
              title={t("checkout.checkout.failed.title")}
              description={
                stripeCheckoutState.checkout.lastPaymentError.message
              }
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
              mt: "4",
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

          <p className={css({ mt: "4" })}>
            <Checkbox
              name="terms"
              value="termsAccepted"
              type="checkbox"
              required
            >
              {offer.company === "PROJECT_R"
                ? t.rich("checkout.checkout.terms.PROJECT_R", translationLinks)
                : t.rich("checkout.checkout.terms.REPUBLIK", translationLinks)}
            </Checkbox>
          </p>

          <Button
            size="large"
            type="submit"
            disabled={!stripeCheckoutState.checkout.canConfirm}
            loading={isPending}
          >
            {t("checkout.actions.pay")}
          </Button>
        </form>
      );
  }
}

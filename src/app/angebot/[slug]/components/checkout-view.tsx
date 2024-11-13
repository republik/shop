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
import { css } from "@/theme/css";
import { vstack } from "@/theme/patterns";
import { useClient } from "urql";
import { UpdateMeDocument } from "#graphql/republik-api/__generated__/gql/graphql";

interface CheckoutViewProps {
  me: { firstName?: string | null; lastName?: string | null };
  clientSecret: string;
  stripeAccount: SubscriptionConfiguration["stripeAccount"];
  errors: { title: string; description: string }[];
}

function CheckoutForm({
  me,
}: {
  me: { firstName?: string | null; lastName?: string | null };
}) {
  const { canConfirm, confirmationRequirements, confirm, status } =
    useCustomCheckout();
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const gql = useClient();

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

  return (
    <form
      action={async (formData: FormData) => {
        console.log(formData.get("toc"));

        setLoading(true);

        const updatedMe = await gql.mutation(UpdateMeDocument, {
          firstName: formData.get("firstName") as string | null,
          lastName: formData.get("lastName") as string | null,
        });

        if (!updatedMe.data) {
          throw Error("Noo");
        }

        const checkoutResult = await confirm();

        if (checkoutResult.error) {
          console.error(checkoutResult.error);
        }

        setLoading(false);
      }}
    >
      <div
        className={vstack({
          gap: "4",
          alignItems: "stretch",
          w: "full",
          maxW: "lg",
        })}
      >
        <label
          htmlFor={"first-name"}
          className={css({
            fontWeight: "medium",
            fontSize: "sm",
          })}
        >
          Vorname
        </label>
        <input
          id={"first-name"}
          name="firstName"
          type="text"
          defaultValue={me.firstName ?? ""}
          className={css({
            borderWidth: "1px",
            borderColor: "text",
            borderRadius: "sm",
            p: "2",
          })}
        ></input>

        <label
          htmlFor={"last-name"}
          className={css({
            fontWeight: "medium",
            fontSize: "sm",
          })}
        >
          Nachname
        </label>
        <input
          id={"last-name"}
          name="lastName"
          type="text"
          defaultValue={me.lastName ?? ""}
          className={css({
            borderWidth: "1px",
            borderColor: "text",
            borderRadius: "sm",
            p: "2",
          })}
        ></input>

        <span>Status: {status.type}</span>
        <PaymentElement
          options={{ terms: { card: "never", paypal: "never" } }}
        />

        <label
          htmlFor={"toc"}
          className={css({
            // fontWeight: "medium",
            fontSize: "sm",
          })}
        >
          <input
            id="toc"
            type="checkbox"
            name="toc"
            checked={termsAccepted}
            onChange={(e) => {
              setTermsAccepted(e.currentTarget.checked);
            }}
          />
          <span>Ich bin mit allem einverstanden!</span>
        </label>
        <Button
          loading={loading}
          type="submit"
          disabled={!canConfirm || !termsAccepted || loading}
        >
          KAUFEN
        </Button>
      </div>
    </form>
  );
}

export function CheckoutView({
  me,
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

          elementsOptions: {
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
        <CheckoutForm me={me} />
      </CustomCheckoutProvider>
    </div>
  );
}

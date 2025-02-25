"use client";

import { CheckoutForm } from "@/components/checkout/checkout-form";
import { ErrorMessage } from "@/components/checkout/error-message";
import { loadStripe } from "@/lib/stripe/client";
import { CheckoutProvider } from "@stripe/react-stripe-js";

interface CheckoutViewProps {
  clientSecret: string;
  company: string;
  errors: { title: string; description: string }[];
}

export function ElementsCheckoutView({
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
          clientSecret,

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
        <CheckoutForm />
        {/* <EmbeddedCheckout /> */}
      </CheckoutProvider>
    </div>
  );
}

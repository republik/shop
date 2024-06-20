"use client";

import { useEffect, useState } from "react";
import {
  AboPurchaseOptions,
  AboTypeData,
  StripeAccount,
} from "../lib/stripe/types";
import { initStripe } from "../lib/stripe/client";
import { Stripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import {
  AddressElement,
  PaymentElement,
  ExpressCheckoutElement,
  useCustomCheckout,
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { AboTypes } from "../lib/config";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

const renderPrice = (unitAmount: number, currency: string): string => {
  return ` ${currency.toUpperCase()} ${(unitAmount / 100).toFixed(2)}`;
};

function useStripe(account: StripeAccount) {
  const [stripe, setStripe] = useState<Stripe | null>(null);

  useEffect(() => {
    initStripe(account).then((s) => {
      setStripe(() => s);
    });
    return () => {
      setStripe(null);
    };
  }, [account, setStripe]);

  return stripe;
}

function Checkout() {
  const checkout = useCustomCheckout();
  const router = useRouter();

  async function onSubmit() {
    if (!checkout.canConfirm) {
      return;
    }
    const loadingToast = toast.loading("Zahlung wird verarbeitet...");

    const { error } = await checkout.confirm();
    if (error) {
      toast(error.message);
    } else {
      toast.success("Success");
      router.push("success");
    }
    toast.dismiss(loadingToast);
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={() => onSubmit()}>
      <div className="space-y-2 p-4 border border-gray-300/40 divide-y divide-y-300/40">
        {checkout.lineItems.map((item) => (
          <div key={item.id} className="">
            <h2 className="text-lg font-bold">{item.name}</h2>
            <p>{renderPrice(item.unitAmount, checkout.currency)}</p>
            {item.recurring && (
              <p className="italic">
                ℹ️ Wird im Interval von {item.recurring.intervalCount}{" "}
                {item.recurring.interval} automatisch verlängert. Jederzeit
                kündbar
              </p>
            )}
          </div>
        ))}
      </div>
      <details>
        <summary>Checkout data</summary>
        <pre>{JSON.stringify(checkout, null, 2)}</pre>
      </details>
      <Input readOnly value={checkout.email || undefined} />
      <ExpressCheckoutElement onConfirm={() => toast("foo")} />
      <PaymentElement />
      <AddressElement options={{ mode: "billing" }} />
      <Button disabled={!checkout.canConfirm} type="submit">
        Kaufen für {checkout.total.total! / 100} CHF
      </Button>
    </form>
  );
}

interface CheckoutViewProps {
  aboType: AboTypes;
  aboPurchaseOptions: AboPurchaseOptions;
  aboData: AboTypeData;
  email?: string;
  clientSecret: string;
}

export function CheckoutView(props: CheckoutViewProps) {
  const stripe = useStripe(props.aboPurchaseOptions.stripeAccount);

  if (!stripe || !props.clientSecret) {
    return <p>Loading...</p>;
  }

  return (
    // <CustomCheckoutProvider
    //   stripe={stripe}
    //   options={{
    //     clientSecret: props.clientSecret,
    //     elementsOptions: {
    //       loader: "always",
    //       appearance: {
    //         variables: {
    //           borderRadius: "var(--border-radius)",
    //         },
    //       },
    //     },
    //   }}
    // >
    // <Checkout />
    // </CustomCheckoutProvider>
    <div>
      <div id="checkout">
        <EmbeddedCheckoutProvider
          stripe={stripe}
          options={{
            clientSecret: props.clientSecret,
          }}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </div>
    </div>
  );
}

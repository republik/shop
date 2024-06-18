"use client";
import {
  CustomCheckoutProvider,
  PaymentElement,
  AddressElement,
  useCustomCheckout,
} from "@stripe/react-stripe-js";
import { Stripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { initStripe } from "../lib/stripe/client";
import { toast } from "sonner";
import * as v from "valibot";
import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MeDocument,
  MeQuery,
} from "../../../../../graphql/republik-api/__generated__/gql/graphql";
import { useQuery } from "@apollo/client";

const CheckoutSchema = v.object({
  email: v.pipe(v.string(), v.email()),
});

// Infer output TypeScript type of login schema
type CheckoutData = v.InferOutput<typeof CheckoutSchema>;

interface CheckoutFormProps {
  onSuccess: () => Promise<void>;
  existingCustomer?: boolean;
  emailValue?: string;
}

function CheckoutForm({
  onSuccess,
  existingCustomer,
  emailValue,
}: CheckoutFormProps) {
  const checkout = useCustomCheckout();
  const form = useForm<CheckoutData>({
    resolver: valibotResolver(CheckoutSchema),
    defaultValues: {
      email: emailValue,
    },
  });

  async function handleSubmit(data: CheckoutData) {
    console.log(data);
    checkout.updateEmail(data.email);
    const loadingToastId = toast.loading("Confirming payment");
    await checkout
      .confirm()
      .then((res) => {
        if (res.error) {
          toast.error("Failed to confirm payment", {
            description: res.error.message,
          });
          return;
        }
        toast.success("Payment confirmed");
        toast.dismiss(loadingToastId);
        onSuccess();
      })
      .catch((err) => {
        toast.error("Failed to confirm payment", {
          description: err.message,
        });
        toast.dismiss(loadingToastId);
      });
  }

  return (
    <div className="space-y-4">
      <div>
        <Form {...form}>
          <form
            className="flex flex-col gap-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="rick.astley@example.com"
                      {...field}
                      disabled={existingCustomer}
                    />
                  </FormControl>
                  <FormDescription>The email to your account.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <PaymentElement options={{ layout: "accordion" }} />
            <AddressElement
              options={{
                mode: "billing",
                defaultValues: {
                  address: {
                    country: "CH",
                  },
                },
              }}
            />
            <Button
              type="submit"
              disabled={!checkout.canConfirm || form.formState.isSubmitting}
            >
              Abonement erstellen
            </Button>
          </form>
        </Form>
      </div>
      <details>
        <summary>Checkout state</summary>
        <pre className="p-4 font-mono text-xs">
          {JSON.stringify(checkout, null, 2)}
        </pre>
      </details>
    </div>
  );
}

function PurchaseDetails() {
  const checkout = useCustomCheckout();

  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-xl font-bold">Purchase Details</h2>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold">Product</h3>
          <ul>
            {checkout.lineItems.map((item) => (
              <li key={item.id}>
                <h4>{item.name}</h4>
                <p>{item.description}</p>
                <p>
                  {checkout.currency.toUpperCase()}{" "}
                  {(item.amountSubtotal / 100).toFixed(2)}
                </p>
                {checkout.recurring && (
                  <p>
                    Recurring: {checkout.recurring.interval}{" "}
                    {checkout.recurring.intervalCount} for{" "}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-bold">Price</h3>
          <p>
            {checkout.currency.toUpperCase()}{" "}
            {(checkout.total.subtotal / 100).toFixed(2)}
          </p>
        </div>
      </div>
      <details>
        <summary>Checkout data</summary>
        <pre className="font-mono p-2 bg-gray-200 text-xs rounded border border-gray-600">
          {JSON.stringify(checkout, null, 2)}
        </pre>
      </details>
    </div>
  );
}

interface CheckoutProps {
  clientSecret: string;
  customer?: MeQuery["me"];
}

export function Checkout({ clientSecret }: CheckoutProps) {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const { data } = useQuery(MeDocument);

  useEffect(() => {
    initStripe("REPUBLIK")
      .then(setStripe)
      .catch((err) => {
        toast.error("Failed to load Stripe", {
          description: err.message,
        });
      });
  }, []);

  if (!stripe) {
    return <p>Loading...</p>;
  }

  return (
    <CustomCheckoutProvider
      stripe={stripe}
      options={{
        clientSecret,
        elementsOptions: {
          loader: "always",
          appearance: {
            variables: {
              borderRadius: "var(--border-radius)",
            },
          },
        },
      }}
    >
      <div className="px-16 py-4 grid w-full grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <PurchaseDetails />
        </div>
        <CheckoutForm
          existingCustomer={!!data?.me}
          emailValue={data?.me?.email || undefined}
          onSuccess={async () => {
            toast.success("Welcome!");
          }}
        />
      </div>
    </CustomCheckoutProvider>
  );
}

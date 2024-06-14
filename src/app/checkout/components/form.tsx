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

const CheckoutSchema = v.object({
  email: v.pipe(v.string(), v.email()),
});

// Infer output TypeScript type of login schema
type CheckoutData = v.InferOutput<typeof CheckoutSchema>;

interface CheckoutFormProps {
  actionText?: string;
  onSubmit: (data: CheckoutData) => Promise<void>;
}

function CheckoutForm({ actionText, onSubmit }: CheckoutFormProps) {
  const checkout = useCustomCheckout();
  const form = useForm<CheckoutData>({
    resolver: valibotResolver(CheckoutSchema),
  });

  async function handleSubmit(data: CheckoutData) {
    console.log(data);
    checkout.updateEmail(data.email);
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
        console.log(res);
      })
      .catch((err) => {
        toast.error("Failed to confirm payment", {
          description: err.message,
        });
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
                    <Input placeholder="rick.astley@example.com" {...field} />
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

interface CheckoutProps {
  clientSecret: string;
}

export function Checkout({ clientSecret }: CheckoutProps) {
  const [stripe, setStripe] = useState<Stripe | null>(null);

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
      <CheckoutForm onSubmit={async (data) => {}} />
    </CustomCheckoutProvider>
  );
}

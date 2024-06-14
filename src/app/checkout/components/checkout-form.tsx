"use client";
import {
  CustomCheckoutProvider,
  useCustomCheckout,
} from "@stripe/react-stripe-js";
import { Stripe } from "@stripe/stripe-js";

interface CheckoutFormProps {}

function CheckoutForm({}: CheckoutFormProps) {
  const checkout = useCustomCheckout();
  return (
    <pre className="p-4 font-mono">{JSON.stringify(checkout, null, 2)}</pre>
  );
}

interface CheckoutProps {
  stripe: Stripe;
  clientSecret: string;
}

export function Checkout({ clientSecret }: CheckoutProps) {
  const stripe = 
  return (
    <CustomCheckoutProvider stripe={stripe} options={{ clientSecret }}>
      <CheckoutForm />
    </CustomCheckoutProvider>
  );
}

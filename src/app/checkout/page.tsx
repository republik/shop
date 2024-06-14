import { PageLayout } from "@/components/layout";
import { CustomCheckoutProvider } from "@stripe/react-stripe-js";
import { initStripe } from "./lib/stripe/client";
import { Checkout } from "./components/checkout-form";
import { createStripeSession } from "./lib/stripe/session";

export default async function Page() {
  return (
    <PageLayout>
      <h1>Checkout Page</h1>
      <Checkout stripe={stripe} clientSecret={clientSecret} />
    </PageLayout>
  );
}

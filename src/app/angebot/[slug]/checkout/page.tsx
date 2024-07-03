import { notFound, redirect } from "next/navigation";
import { CHECKOUT_SESSION_ID_COOKIE } from "./checkout";
import { fetchMe } from "@/lib/auth/fetch-me";
import { CheckoutView } from "../components/checkout-view";
import { checkoutConfig } from "../lib/config";
import { cookies } from "next/headers";
import { initStripe } from "../lib/stripe/server";

export default async function CheckoutPage({
  params,
}: {
  params: { slug: string; session_id?: string };
}) {
  const me = await fetchMe();
  const sessionId =
    params?.session_id || cookies().get(CHECKOUT_SESSION_ID_COOKIE)?.value;
  if (!me || !sessionId) {
    console.log("Redirecting " + JSON.stringify({ me, sessionId }, null, 2));
    redirect(`/angebot/${params.slug}`);
  }

  const stripe = await initStripe(checkoutConfig[params.slug].stripeAccount);
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (!session) {
    redirect(`/angebot/${params.slug}`);
  }

  const aboConfig = checkoutConfig[params.slug];

  if (session.status === "complete") {
    return <p>Thanks for your purchase!</p>;
  }

  if (session.status === "expired") {
    // TODO: Should we return the user to the non checkout page
    return <p>Session expired.</p>;
  }

  if (!session.client_secret) {
    redirect(`/angebot/${params.slug}`);
  }

  if (session.status === "open") {
    return (
      <CheckoutView
        clientSecret={session.client_secret}
        aboPurchaseOptions={aboConfig}
      />
    );
  }

  // TODO: sentry? this should never happen.

  redirect(`/angebot/${params.slug}`);
}

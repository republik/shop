import { redirect } from "next/navigation";
import { initializeCheckout } from "./checkout";
import { fetchMe } from "@/lib/auth/fetch-me";
import { CheckoutView } from "../components/checkout-view";
import { checkoutConfig } from "../lib/config";

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { price?: string };
}) {
  const me = await fetchMe();
  // The checkout is only accessible for logged in users
  if (!me) {
    redirect(`/angebot/${params.slug}`);
  }

  const { clientSecret } = await initializeCheckout(params.slug, {
    email: me?.email || undefined,
    userPrice: searchParams.price
      ? Math.max(240 * 100, Number(searchParams.price))
      : undefined,
  });

  const aboConfig = checkoutConfig[params.slug];

  return (
    <CheckoutView clientSecret={clientSecret} aboPurchaseOptions={aboConfig} />
  );
}

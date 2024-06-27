import { checkoutConfig } from "./lib/config";
import { initStripe } from "./lib/stripe/server";
import { notFound, redirect } from "next/navigation";
import { StripeService } from "./lib/stripe/service";
import { fetchMe } from "@/lib/auth/fetch-me";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PriceSelector } from "./components/price-selector";

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const me = await fetchMe();
  const aboConfig = checkoutConfig[params.slug];

  if (me && !aboConfig.customPrice) {
    // Proceed to checkout
    redirect(`/angebot/${params.slug}/checkout`);
  }

  const stripe = await initStripe(aboConfig.stripeAccount);
  const aboData = await StripeService(stripe)
    .getAboTypeData(aboConfig)
    .catch((error) => {
      console.error(error);
      return notFound();
    });

  return (
    <div>
      <details>
        <summary>Available product data</summary>
        <pre className="text-xs font-mono">
          {JSON.stringify(aboData, null, 2)}
        </pre>
      </details>
      {!me && <p>[ LOGIN-FORM ]</p>}
      {aboConfig.customPrice ? (
        <PriceSelector aboType={params.slug} />
      ) : (
        <Button asChild>
          <Link href={`/angebot/${params.slug}/checkout`}>Jetzt kaufen</Link>
        </Button>
      )}
    </div>
  );
}

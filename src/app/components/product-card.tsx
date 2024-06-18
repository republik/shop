import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { initPurchase } from "../action";
import {
  AboTypes,
  aboTypesMeta,
  checkoutConfig,
} from "../checkout/[slug]/lib/config";
import { AboPurchaseOptions } from "../checkout/[slug]/lib/action";
import { initStripe } from "../checkout/[slug]/lib/stripe/server";
import { BuyButton } from "./buy-button";

type ProductCardProps = {
  aboType: AboTypes;
  aboPurchaseOptions: AboPurchaseOptions;
};

export async function ProductCard({
  aboType,
  aboPurchaseOptions,
}: ProductCardProps) {
  const meta = aboTypesMeta[aboType];
  const stripe = await initStripe(aboPurchaseOptions.stripeAccount);
  const [product, price] = await Promise.all([
    stripe.products.retrieve(aboPurchaseOptions.productId),
    stripe.prices.retrieve(aboPurchaseOptions.priceId),
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{meta.title}</CardTitle>
        <CardDescription>{meta.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul>
          <li>✅ Im Abo enthalten!</li>
          <li>✅ Das auch</li>

          <li>
            {meta.projectR ? "✅" : "❌"} Du wirst Teil der Project-R
            Genossenschaft
          </li>
        </ul>
        <details>
          <summary>data</summary>
          {JSON.stringify(product, null, 2)}
          {JSON.stringify(price, null, 2)}
        </details>
      </CardContent>
      <CardFooter>
        <BuyButton aboType={aboType} price={price.unit_amount || undefined} />
      </CardFooter>
    </Card>
  );
}

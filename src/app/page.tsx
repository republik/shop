import { ProductCard } from "./components/product-card";
import { SubscriptionsConfiguration } from "./angebot/[slug]/lib/config";
import { container, grid } from "@/theme/patterns";
import { fetchMe } from "@/lib/auth/fetch-me";

export default async function Home() {
  const me = await fetchMe();

  return (
    <div className={container({ gap: "16" })}>
      <div
        className={grid({
          gap: "4",
          gridTemplateColumns: "[1fr]",
          md: {
            gridTemplateColumns: "[repeat(auto-fit, minmax(24rem, 1fr))]",
          },
        })}
      >
        {Object.entries(SubscriptionsConfiguration).map(
          ([subscriptionType, subscriptionConfiguration]) => (
            <ProductCard
              key={subscriptionType}
              me={me}
              subscriptionType={subscriptionType}
              subscriptionConfiguration={subscriptionConfiguration}
            />
          )
        )}
      </div>
    </div>
  );
}

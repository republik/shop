import { ProductCard } from "./components/product-card";
import { CheckoutConfig } from "./angebot/[slug]/lib/config";
import { container, grid } from "@/theme/patterns";

export default async function Home() {
  const config = CheckoutConfig;

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
        {Object.entries(config).map(([aboType, config]) => (
          <ProductCard
            key={aboType}
            aboType={aboType}
            aboPurchaseOptions={config}
          />
        ))}
      </div>
    </div>
  );
}

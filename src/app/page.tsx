import { ProductCard } from "./components/product-card";
import { checkoutConfig } from "./angebot/[slug]/lib/config";
import { container, grid, hstack } from "@/theme/patterns";

export default async function Home() {
  const config = checkoutConfig;

  return (
    <div className={container({ gap: "16" })}>
      <div
        className={grid({
          gap: "4",
          gridTemplateColumns: "[repeat(auto-fit, minmax(24rem, 1fr))]",
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

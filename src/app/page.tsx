import { ProductCard } from "./components/product-card";
import { checkoutConfig } from "./angebot/[slug]/lib/config";

export default async function Home() {
  const config = checkoutConfig;

  return (
    <div className="flex flex-col gap-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

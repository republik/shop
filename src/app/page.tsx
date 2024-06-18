import { Login } from "@/components/login";
import { checkoutConfig } from "./checkout/[slug]/lib/config";
import { ProductCard } from "./components/product-card";

export default async function Home() {
  const config = checkoutConfig;

  return (
    <div className="flex flex-col gap-16">
      <div className="mx-auto">
        <Login />
      </div>
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

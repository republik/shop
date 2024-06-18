"use client";
import { Button } from "@/components/ui/button";
import { initPurchase } from "./action";
import { Login } from "@/components/login";
import { checkoutConfig } from "./checkout/[slug]/lib/config";

export default function Home() {
  return (
    <div className="flex flex-col justify-content items-center gap-16">
      <Login />
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(checkoutConfig).map(([aboType, config]) => (
          <Button key={aboType} onClick={() => initPurchase(aboType)}>
            Purchase {aboType}
          </Button>
        ))}
      </div>
    </div>
  );
}

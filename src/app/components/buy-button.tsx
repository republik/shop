"use client";

import { Button } from "@/components/ui/button";
import { initPurchase } from "../action";
import { AboTypes } from "../checkout/[slug]/lib/config";

type BuyButtonProps = {
  aboType: AboTypes;
  // Price in Rappen
  price?: number;
};

export function BuyButton({ aboType, price }: BuyButtonProps) {
  return (
    <Button className="w-full" onClick={() => initPurchase(aboType)}>
      Kaufen {price && <>für CHF {(price / 100).toFixed(2)}</>}
    </Button>
  );
}

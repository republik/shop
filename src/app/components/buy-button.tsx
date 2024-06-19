"use client";

import { Button } from "@/components/ui/button";
import { initPurchase } from "../action";
import { AboTypes } from "../checkout/[slug]/lib/config";
import { useQuery } from "@apollo/client";
import { MeDocument } from "../../../graphql/republik-api/__generated__/gql/graphql";

type BuyButtonProps = {
  aboType: AboTypes;
  // Price in Rappen
  price?: number;
};

export function BuyButton({ aboType, price }: BuyButtonProps) {
  const queryRes = useQuery(MeDocument);
  return (
    <Button
      className="w-full"
      onClick={() =>
        initPurchase(aboType, queryRes.data?.me?.email || undefined)
      }
    >
      Kaufen {price && <>für CHF {(price / 100).toFixed(2)}</>}
    </Button>
  );
}

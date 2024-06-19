"use client";

import { Button } from "@/components/ui/button";
import { AboTypes } from "../checkout/[slug]/lib/config";
import { useQuery } from "@apollo/client";
import { MeDocument } from "../../../graphql/republik-api/__generated__/gql/graphql";
import { toast } from "sonner";

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
      onClick={() => {
        toast.loading("Kauf wird vorbereitet...");
        window.location.assign(`/checkout/${aboType}`);
      }}
    >
      Kaufen {price && <>für CHF {(price / 100).toFixed(2)}</>}
    </Button>
  );
}

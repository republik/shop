"use client";

import { Button } from "@/components/ui/button";
import { useQuery } from "@apollo/client";
import { MeDocument } from "../../../graphql/republik-api/__generated__/gql/graphql";
import { toast } from "sonner";
import { AboTypes } from "../angebot/[slug]/checkout/lib/config";

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
        window.location.assign(`/${aboType}/checkout`);
      }}
    >
      Kaufen {price && <>für CHF {(price / 100).toFixed(2)}</>}
    </Button>
  );
}

"use client";

import { MeQuery } from "#graphql/republik-api/__generated__/gql/graphql";
import { FormEventHandler, useCallback, useId, useState } from "react";
import { AboTypes } from "./lib/config";
import { AboPurchaseOptions, AboTypeData } from "./lib/stripe/types";
import { Button } from "@/components/ui/button";
import { createCheckout, initializeCheckout } from "./action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useFormState, useFormStatus } from "react-dom";

interface PreCheckoutProps {
  me: MeQuery["me"];
  aboType: AboTypes;
  aboConfig: AboPurchaseOptions;
  // aboData: AboTypeData;
  initialPrice?: number;
}

export function PreCheckout(props: PreCheckoutProps) {
  const { aboType, aboConfig, initialPrice } = props;
  const [isLoading, setLoading] = useState(false);
  const [price, setPrice] = useState(Math.max(240, initialPrice || 240));
  const priceId = useId();

  return (
    <form action={createCheckout} onSubmit={() => setLoading(true)}>
      {aboConfig.customPrice && (
        <fieldset className="flex flex-col gap-2">
          <label htmlFor={priceId} className="font-bold">
            Ihr gewählter Preis ist CHF {price} / Jahr
          </label>
          <input
            id={priceId}
            type="range"
            name="price"
            min={240}
            max={1000}
            step={5}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        </fieldset>
      )}
      <input type="text" name="aboType" hidden defaultValue={aboType} />

      <Button type="submit" disabled={isLoading}>
        Jetzt kaufen
      </Button>
    </form>
  );
}

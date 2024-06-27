"use client";
import { Button } from "@/components/ui/button";
import { redirect } from "next/dist/server/api-utils";
import { useId, useState } from "react";
import { AboTypes } from "../lib/config";
import { useRouter } from "next/navigation";

export function PriceSelector(props: { aboType: AboTypes }) {
  const router = useRouter();
  const [price, setPrice] = useState(240);
  const priceId = useId();

  return (
    <form
      className="flex flex-col gap-4 max-w-lg mx-auto"
      onSubmit={(e) => {
        e.preventDefault();
        const url = new URL(
          `/angebot/${props.aboType}/checkout`,
          window.location.origin
        );
        url.searchParams.set("price", String(price * 100));
        router.push(url.toString());
      }}
    >
      <fieldset className="flex flex-col gap-2">
        <label htmlFor={priceId} className="font-bold">
          Ihr gewählter Preis
        </label>
        <input
          id={priceId}
          type="range"
          name="price"
          min="240"
          max="1000"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value) || 240)}
        />
      </fieldset>
      <Button type="submit">Für CHF {price} kaufen</Button>
    </form>
  );
}

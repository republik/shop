"use client";

import { GetOfferQuery } from "#graphql/republik-api/__generated__/gql/graphql";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { css } from "@/theme/css";
import { useTranslations } from "next-intl";
import { useCallback, useId, useMemo, useState } from "react";
import { createCheckout } from "../action";
import CheckoutPricingTable, { CheckoutItem } from "./checkout-table";

interface PreCheckoutProps {
  initialPrice?: number;
  offer: NonNullable<GetOfferQuery["offer"]>;
}

export function PreCheckout({ initialPrice, offer }: PreCheckoutProps) {
  const t = useTranslations();

  const [isLoading, setLoading] = useState(false);
  const [userPrice, setUserPrice] = useState(
    Math.max(240, initialPrice || 240)
  );
  const priceId = useId();

  const renderPrice = useCallback(
    (price: number | null) =>
      price != null
        ? `${(price / 100).toFixed(0)} ${offer.price?.currency.toUpperCase()}`
        : null,
    [offer.price]
  );

  const checkoutItems: CheckoutItem[] = useMemo(() => {
    const items: CheckoutItem[] = [];
    if (offer.customPrice) {
      items.push({
        label: "Mitgliedschaft mit selbst gewähltem Preis",
        amount: userPrice,
        hidden: true,
      });
    } else {
      items.push({
        label: offer.name,
        amount: offer.price.amount / 100,
        hidden: true,
      });
    }
    if (offer.discount && !offer.customPrice) {
      items.push({
        label: offer.discount.name || "Rabatt",
        amount:
          -1 * (offer.discount.amountOff ? offer.discount.amountOff / 100 : 0),
        /*(((offer.discount.percent_off ?? 0) / 100) *
                (stripeSubscriptionItems.price.unit_amount ?? 0)) /
              100)*/
      });
    }
    return items;
  }, [offer.name, offer.price, offer.customPrice, offer.discount, userPrice]);

  return (
    <form
      action={createCheckout}
      onSubmit={() => {
        setLoading(true);
      }}
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: "4",
      })}
    >
      <input
        type="text"
        name="subscriptionType"
        hidden
        readOnly
        defaultValue={offer.id}
      />
      <div
        className={css({
          spaceY: "[6px]",
        })}
      >
        <h3
          className={css({
            textStyle: "2xl",
            fontWeight: "medium",
          })}
        >
          {offer.name}
        </h3>
        <p
          className={css({
            textStyle: "md",
          })}
        >
          {t("checkout.preCheckout.pricePerInterval", {
            price: renderPrice(
              offer.customPrice
                ? userPrice * 100 // since all other price values from stripe are in 'Rappen'
                : offer.price.amount
            ),
            interval: t(
              // @ts-expect-error FIXME possibly unknown interval
              `checkout.preCheckout.intervals.${offer.customPrice ? "year" : offer.price.recurring?.interval}`
            ),
          })}
        </p>
      </div>
      {offer.customPrice && (
        <fieldset
          className={css({
            display: "flex",
            flexDirection: "column",
            gap: "2",
          })}
        >
          <label htmlFor={priceId} className="sr-only">
            {t("checkout.preCheckout.customPrice", {
              price: userPrice,
            })}
          </label>
          <Slider
            id={priceId}
            name="price"
            min={offer.customPrice.min}
            max={offer.customPrice.max}
            step={offer.customPrice.step}
            value={[userPrice]}
            onValueChange={(e) => setUserPrice(e?.[0])}
          />
          <input
            id={priceId}
            className={css({
              visibility: "hidden",
            })}
            readOnly
            type="range"
            name="price"
            min={240}
            max={1000}
            step={5}
            value={userPrice}
            onChange={(e) => setUserPrice(Number(e.target.value))}
          />
        </fieldset>
      )}
      <CheckoutPricingTable
        currency={offer.price.currency}
        items={checkoutItems}
      />

      <Button
        className={css({
          width: "max",
        })}
        type="submit"
        loading={isLoading}
        disabled={isLoading}
      >
        {t("checkout.preCheckout.action")}
      </Button>
    </form>
  );
}

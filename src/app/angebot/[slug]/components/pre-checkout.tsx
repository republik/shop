"use client";

import { useCallback, useId, useMemo, useState } from "react";
import { AboMeta, AboTypes } from "../lib/config";
import { AboConfiguration, AboStripeConfig } from "../lib/stripe/types";
import { Button } from "@/components/ui/button";
import { createCheckout } from "../action";
import { css } from "@/theme/css";
import CheckoutPricingTable, { CheckoutItem } from "./checkout-table";
import useTranslation from "next-translate/useTranslation";
import { Slider } from "@/components/ui/slider";
import { Me } from "@/lib/auth/types";
import { isEligibleForEntryCoupon } from "@/lib/auth/discount-eligability";

interface PreCheckoutProps {
  me: Me;
  aboType: AboTypes;
  aboConfig: AboConfiguration;
  aboData: AboStripeConfig;
  aboMeta: AboMeta;
  initialPrice?: number;
}

export function PreCheckout(props: PreCheckoutProps) {
  const { aboData, aboType, aboConfig, initialPrice, me } = props;
  const { t } = useTranslation();
  const [isLoading, setLoading] = useState(false);
  const [userPrice, setUserPrice] = useState(
    Math.max(240, initialPrice || 240)
  );
  const priceId = useId();

  const renderPrice = useCallback(
    (price: number | null) =>
      price != null
        ? `${(price / 100).toFixed(0)} ${aboData.price.currency.toUpperCase()}`
        : null,
    [aboData.price.currency]
  );

  const hasCoupon = useMemo(() => isEligibleForEntryCoupon(me), [me]);

  const checkoutItems: CheckoutItem[] = useMemo(() => {
    const items: CheckoutItem[] = [];
    if (aboConfig.customPrice) {
      items.push({
        label: "Mitgliedschaft mit selbst gewähltem Preis",
        amount: userPrice,
        hidden: true,
      });
    } else {
      items.push({
        label: aboData.product.name,
        amount: (aboData.price.unit_amount ?? 0) / 100,
        hidden: true,
      });
    }
    if (aboData.coupon && hasCoupon && !aboConfig.customPrice) {
      items.push({
        label: aboData.coupon.name || "Rabatt",
        amount: (-1 * (aboData.coupon.amount_off ?? 0)) / 100,
      });
    }
    return items;
  }, [
    aboConfig.customPrice,
    aboData.coupon,
    hasCoupon,
    aboData.price.unit_amount,
    aboData.product.name,
    userPrice,
  ]);

  return (
    <form
      action={createCheckout}
      onSubmit={() => setLoading(true)}
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: "4",
      })}
    >
      <input type="text" name="aboType" hidden defaultValue={aboType} />
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
          {props.aboMeta.title}
        </h3>
        <p
          className={css({
            textStyle: "md",
          })}
        >
          {t("checkout:preCheckout.pricePerInterval", {
            price: renderPrice(
              aboConfig.customPrice
                ? userPrice * 100 // since all other price values from stripe are in 'Rappen'
                : aboData.price.unit_amount
            ),
            interval: t(
              `checkout:preCheckout.intervals.${aboConfig.customPrice ? "year" : aboData.price.recurring?.interval}`
            ),
          })}
        </p>
      </div>
      {aboConfig.customPrice && (
        <fieldset
          className={css({
            display: "flex",
            flexDirection: "column",
            gap: "2",
          })}
        >
          <label htmlFor={priceId} className="sr-only">
            {t("checkout:preCheckout.cutomPrice", {
              price: userPrice,
            })}
          </label>
          <Slider
            id={priceId}
            name="price"
            min={240}
            max={1000}
            step={5}
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
        currency={aboData.price.currency}
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
        {t("checkout:preCheckout.action")}
      </Button>
    </form>
  );
}

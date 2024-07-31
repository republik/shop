"use client";

import { MeQuery } from "#graphql/republik-api/__generated__/gql/graphql";
import { useCallback, useId, useMemo, useState } from "react";
import { AboMeta, AboTypes } from "../lib/config";
import { AboConfiguration, AboStripeConfig } from "../lib/stripe/types";
import { Button } from "@/components/ui/button";
import { createCheckout } from "../action";
import { css } from "@/theme/css";
import CheckoutPricingTable, { CheckoutItem } from "./checkout-table";
import Trans from "next-translate/Trans";
import useTranslation from "next-translate/useTranslation";

interface PreCheckoutProps {
  me: MeQuery["me"];
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

  const isEligibleForCoupon = me?.memberships.length == 0;

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
    if (aboData.coupon && isEligibleForCoupon && !aboConfig.customPrice) {
      items.push({
        label: aboData.coupon.name || "Rabatt", // TODO: should we repor this to sentry?
        amount: (-1 * (aboData.coupon.amount_off ?? 0)) / 100,
      });
    }
    return items;
  }, [
    aboConfig.customPrice,
    aboData.coupon,
    isEligibleForCoupon,
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
            textStyle: "md",
            fontWeight: "medium",
          })}
        >
          {props.aboMeta.title}
        </h3>
        <div
          className={css({
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: "[19px]",
          })}
        >
          <Trans
            i18nKey="checkout:preCheckout.pricePerInterval"
            values={{
              price: renderPrice(
                aboConfig.customPrice
                  ? userPrice * 100 // since all other price values from stripe are in 'Rappen'
                  : aboData.price.unit_amount
              ),
              interval: t(
                `shop:preCheckout.intervals.${aboData.price.recurring?.interval}`
              ),
            }}
            components={[
              <p
                key="price"
                className={css({
                  textStyle: "2xl",
                  fontWeight: "medium",
                })}
              />,
              <p
                key="interval"
                className={css({
                  fontSize: "sm",
                })}
              />,
            ]}
          />
        </div>
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
          <input
            id={priceId}
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
        disabled={isLoading}
      >
        {t("checkout:preCheckout.action")}
      </Button>
    </form>
  );
}

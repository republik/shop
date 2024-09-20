"use client";

import { useCallback, useId, useMemo, useState } from "react";
import { SubscriptionMeta, SubscriptionTypes } from "../lib/config";
import {
  SubscriptionConfiguration,
  StripeSubscriptionItems,
} from "../lib/stripe/types";
import { Button } from "@/components/ui/button";
import { createCheckout } from "../action";
import { css } from "@/theme/css";
import CheckoutPricingTable, { CheckoutItem } from "./checkout-table";
import { useTranslations } from "next-intl";
import { Slider } from "@/components/ui/slider";
import { Me } from "@/lib/auth/types";
import { isEligibleForEntryCoupon } from "@/lib/auth/discount-eligability";
import { usePlausible } from "next-plausible";

interface PreCheckoutProps {
  me: Me;
  subscriptionType: SubscriptionTypes;
  subscriptionConfig: SubscriptionConfiguration;
  stripeSubscriptionItems: StripeSubscriptionItems;
  subscriptionMeta: SubscriptionMeta;
  initialPrice?: number;
}

export function PreCheckout(props: PreCheckoutProps) {
  const {
    stripeSubscriptionItems,
    subscriptionType,
    subscriptionConfig,
    initialPrice,
    me,
  } = props;
  const t = useTranslations();
  const [isLoading, setLoading] = useState(false);
  const [userPrice, setUserPrice] = useState(
    Math.max(240, initialPrice || 240)
  );
  const priceId = useId();

  const renderPrice = useCallback(
    (price: number | null) =>
      price != null
        ? `${(price / 100).toFixed(0)} ${stripeSubscriptionItems.price.currency.toUpperCase()}`
        : null,
    [stripeSubscriptionItems.price.currency]
  );

  // TODO: remove as coupon is not forwarded if not eligible as checked in [slug].tsx
  const hasCoupon = useMemo(() => isEligibleForEntryCoupon(me), [me]);

  const checkoutItems: CheckoutItem[] = useMemo(() => {
    const items: CheckoutItem[] = [];
    if (subscriptionConfig.customPrice) {
      items.push({
        label: "Mitgliedschaft mit selbst gewähltem Preis",
        amount: userPrice,
        hidden: true,
      });
    } else {
      items.push({
        label: stripeSubscriptionItems.product.name,
        amount: (stripeSubscriptionItems.price.unit_amount ?? 0) / 100,
        hidden: true,
      });
    }
    if (
      stripeSubscriptionItems.coupon &&
      hasCoupon &&
      !subscriptionConfig.customPrice
    ) {
      items.push({
        label: stripeSubscriptionItems.coupon.name || "Rabatt",
        amount: (-1 * (stripeSubscriptionItems.coupon.amount_off ?? 0)) / 100,
      });
    }
    return items;
  }, [
    subscriptionConfig.customPrice,
    stripeSubscriptionItems.coupon,
    hasCoupon,
    stripeSubscriptionItems.price.unit_amount,
    stripeSubscriptionItems.product.name,
    userPrice,
  ]);

  const total = useMemo(
    () =>
      checkoutItems.reduce((acc, item) => {
        return acc + item.amount;
      }, 0),
    [checkoutItems]
  );

  const plausible = usePlausible();

  return (
    <form
      action={createCheckout}
      onSubmit={() => {
        setLoading(true);
        plausible("Sales", {
          revenue: { currency: "CHF", amount: total },
        });
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
        defaultValue={subscriptionType}
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
          {props.subscriptionMeta.title}
        </h3>
        <p
          className={css({
            textStyle: "md",
          })}
        >
          {t("checkout.preCheckout.pricePerInterval", {
            price: renderPrice(
              subscriptionConfig.customPrice
                ? userPrice * 100 // since all other price values from stripe are in 'Rappen'
                : stripeSubscriptionItems.price.unit_amount
            ),
            interval: t(
              `checkout.preCheckout.intervals.${subscriptionConfig.customPrice ? "year" : stripeSubscriptionItems.price.recurring?.interval}`
            ),
          })}
        </p>
      </div>
      {subscriptionConfig.customPrice && (
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
            min={subscriptionConfig.customPrice.min}
            max={subscriptionConfig.customPrice.max}
            step={subscriptionConfig.customPrice.step}
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
        currency={stripeSubscriptionItems.price.currency}
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

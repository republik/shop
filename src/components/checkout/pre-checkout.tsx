"use client";

import { OfferCheckoutQuery } from "#graphql/republik-api/__generated__/gql/graphql";
import { createCheckoutSession } from "@/actions/create-checkout-session";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useFormatCurrency } from "@/lib/hooks/use-format";
import { css } from "@/theme/css";
import { AlertCircleIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useActionState, useId, useMemo, useState } from "react";
import CheckoutPricingTable, { CheckoutItem } from "./checkout-table";

interface PreCheckoutProps {
  initialPrice?: number;
  offer: NonNullable<OfferCheckoutQuery["offer"]>;
  promoCode?: string;
}

export function PreCheckout({
  initialPrice,
  offer,
  promoCode,
}: PreCheckoutProps) {
  const t = useTranslations();

  const formatPrice = useFormatCurrency(offer.price.currency);

  const [_, createCheckoutAction, createCheckoutPending] = useActionState(
    createCheckoutSession,
    {}
  );

  const [userPrice, setUserPrice] = useState(
    Math.max(240, initialPrice || 240)
  );
  const priceId = useId();

  const invalidPromoCode = promoCode !== undefined && !offer.discount;

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
      action={createCheckoutAction}
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: "4",
      })}
    >
      <input
        type="text"
        name="offerId"
        hidden
        readOnly
        defaultValue={offer.id}
      />
      <input
        type="text"
        name="promoCode"
        hidden
        readOnly
        defaultValue={promoCode}
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
          {offer.price.recurring
            ? t("checkout.preCheckout.pricePerInterval", {
                price: formatPrice(
                  offer.customPrice
                    ? userPrice // since all other price values from stripe are in 'Rappen'
                    : offer.price.amount / 100
                ),
                interval: t(
                  // @ts-expect-error FIXME possibly unknown interval
                  `checkout.preCheckout.intervals.${
                    offer.customPrice ? "year" : offer.price.recurring?.interval
                  }`
                ),
              })
            : formatPrice(
                offer.customPrice ? userPrice : offer.price.amount / 100
              )}
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

      {invalidPromoCode && (
        <Alert>
          <AlertCircleIcon />
          <AlertTitle>
            {t("checkout.preCheckout.invalidPromoCode.title")}
          </AlertTitle>
          <AlertDescription>
            {t("checkout.preCheckout.invalidPromoCode.description", {
              promoCode,
            })}
          </AlertDescription>
        </Alert>
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
        loading={createCheckoutPending}
        disabled={createCheckoutPending}
      >
        {t("checkout.preCheckout.action")}
      </Button>
    </form>
  );
}

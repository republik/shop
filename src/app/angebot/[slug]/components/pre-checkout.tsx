"use client";

import { GetOfferQuery } from "#graphql/republik-api/__generated__/gql/graphql";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { css } from "@/theme/css";
import { useTranslations } from "next-intl";
import { useCallback, useId, useMemo, useState } from "react";
import { createCheckout } from "../action";
import CheckoutPricingTable, { CheckoutItem } from "./checkout-table";
import { useFormatCurrency } from "@/lib/hooks/use-format";
import Image from "next/image";
import { flex, vstack } from "@/theme/patterns";

interface PreCheckoutProps {
  initialPrice?: number;
  offer: NonNullable<GetOfferQuery["offer"]>;
}

export function PreCheckout({ initialPrice, offer }: PreCheckoutProps) {
  const t = useTranslations();

  const formatPrice = useFormatCurrency(offer.price.currency);

  const [isLoading, setLoading] = useState(false);
  const [userPrice, setUserPrice] = useState(
    Math.max(240, initialPrice || 240)
  );
  const priceId = useId();

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
          {offer.price.recurring
            ? t("checkout.preCheckout.pricePerInterval", {
                price: formatPrice(
                  offer.customPrice
                    ? userPrice // since all other price values from stripe are in 'Rappen'
                    : offer.price.amount / 100
                ),
                interval: t(
                  // @ts-expect-error FIXME possibly unknown interval
                  `checkout.preCheckout.intervals.${offer.customPrice ? "year" : offer.price.recurring?.interval}`
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

      <CheckoutPricingTable
        currency={offer.price.currency}
        items={checkoutItems}
      />

      {offer.optionalItems?.map(({ id }) => {
        return (
          <fieldset key={id}>
            <div
              className={css({
                background: "#C2E6D6",
                p: "4",
                display: "flex",
                flexDirection: "column",
                gap: "4",
              })}
            >
              <Image
                className={css({
                  width: "[10rem]",
                  maxWidth: "full",
                  // alignSelf: "center",
                  mixBlendMode: "multiply",
                })}
                src="/assets/promo-book.jpg"
                width={320}
                height={320}
              />

              <h3
                className={css({
                  textStyle: "h3Sans",
                })}
              >
                {t(`overview.item.${id}.title`)}
              </h3>
              <p>
                {t.rich(`overview.item.${id}.info`, {
                  b: (chunks) => <strong>{chunks}</strong>,
                })}
              </p>
              <label>
                <input name={`amount-${id}`} type="checkbox"></input>
                {t(`overview.item.${id}.cta`)}
              </label>
              <p>
                <small>{t(`overview.item.${id}.ctaNote`)}</small>
              </p>
            </div>
          </fieldset>
        );
      })}

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

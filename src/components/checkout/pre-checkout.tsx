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
import { DonateOptions } from "@/components/checkout/donate-options";

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

  // TODO: get these from API
  const donationOptions =
    offer.id === "YEARLY"
      ? [
          {
            id: "DONATE_50",
            price: { amount: 5000, recurring: { interval: "year" } },
          },
          {
            id: "DONATE_100",
            price: { amount: 10000, recurring: { interval: "year" } },
          },
          {
            id: "DONATE_150",
            price: { amount: 15000, recurring: { interval: "year" } },
          },
        ]
      : null;

  const [donationOption, setDonationOption] = useState("NONE");

  const invalidPromoCode = promoCode !== undefined && !offer.discount;

  const checkoutItems: CheckoutItem[] = useMemo(() => {
    const items: CheckoutItem[] = [];

    items.push({
      label: offer.name,
      amount: offer.price.amount,
    });

    if (offer.discount && !offer.customPrice) {
      items.push({
        label: offer.discount.name || "Rabatt",
        amount: -1 * (offer.discount.amountOff ? offer.discount.amountOff : 0),
      });
    }

    const donation = donationOptions?.find(({ id }) => id === donationOption);
    if (donation) {
      items.push({
        label: "Spende",
        amount: donation.price.amount,
        hidden: true,
      });
    }

    return items;
  }, [
    offer.name,
    offer.price,
    offer.customPrice,
    offer.discount,
    donationOptions,
    donationOption,
  ]);

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
          spaceY: "2",
        })}
      >
        <CheckoutPricingTable
          currency={offer.price.currency}
          items={checkoutItems}
          extraItem={
            donationOptions ? (
              <DonateOptions
                options={donationOptions}
                onChange={(id) => {
                  setDonationOption(id);
                }}
                value={donationOption}
              />
            ) : null
          }
        />

        {/* TODO: this contains too many assumptions about discounts */}
        {/* <p>
          {offer.price.recurring
            ? offer.discount
              ? t.rich(
                  "checkout.preCheckout.priceDescriptionWithDiscount",
                  {
                    discountPrice: formatPrice(total),
                    price: formatPrice(offer.price.amount),
                    interval: t(
                      // @ts-expect-error FIXME possibly unknown interval
                      `checkout.preCheckout.intervals.${offer.customPrice ? "year" : offer.price.recurring?.interval}`
                    ),
                    b: (chunks) => <b>{chunks}</b>,
                  },
                  {}
                )
              : t.rich(
                  "checkout.preCheckout.priceDescription",
                  {
                    price: formatPrice(offer.price.amount),
                    interval: t(
                      // @ts-expect-error FIXME possibly unknown interval
                      `checkout.preCheckout.intervals.${offer.customPrice ? "year" : offer.price.recurring?.interval}`
                    ),
                    b: (chunks) => <b>{chunks}</b>,
                  },
                  {}
                )
            : formatPrice(offer.price.amount)}
        </p> */}
      </div>

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

      <Button
        size="large"
        type="submit"
        loading={createCheckoutPending}
        disabled={createCheckoutPending}
      >
        {t("checkout.preCheckout.action")}
      </Button>
    </form>
  );
}

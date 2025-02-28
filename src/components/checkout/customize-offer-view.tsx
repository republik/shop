"use client";

import { OfferCheckoutQuery } from "#graphql/republik-api/__generated__/gql/graphql";
import { createCheckoutSession } from "@/actions/create-checkout-session";
import {
  DonationChooser,
  OPTION_NONE,
} from "@/components/checkout/donation-chooser";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { css } from "@/theme/css";
import { AlertCircleIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useActionState, useMemo, useState } from "react";
import { LineItem, PricingTable } from "./pricing-table";

interface CustomizeOfferProps {
  offer: NonNullable<OfferCheckoutQuery["offer"]>;
  promoCode?: string;
}

export function CustomizeOfferView({ offer, promoCode }: CustomizeOfferProps) {
  const t = useTranslations();

  const [_, createCheckoutAction, createCheckoutPending] = useActionState(
    createCheckoutSession,
    {}
  );

  const donationOptions = offer.donationOptions;

  const [donationOption, setDonationOption] = useState(OPTION_NONE);

  const invalidPromoCode = promoCode !== undefined && !offer.discount;

  const lineItems: LineItem[] = useMemo(() => {
    const items: LineItem[] = [];

    items.push({
      label: offer.name,
      amount: offer.price.amount,
    });

    if (offer.discount /*&& !offer.customPrice*/) {
      items.push({
        label:
          offer.discount.name || t("checkout.preCheckout.discount.itemName"),
        amount: -1 * (offer.discount.amountOff ? offer.discount.amountOff : 0),
      });
    }

    const donation = donationOptions?.find(({ id }) => id === donationOption);
    if (donation) {
      items.push({
        label: t("checkout.preCheckout.donate.itemName"),
        amount: donation.price.amount,
        hidden: true,
      });
    }

    return items;
  }, [
    offer.name,
    offer.price,
    /* offer.customPrice, */
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
        <PricingTable
          currency={offer.price.currency}
          lineItems={lineItems}
          extraItem={
            donationOptions ? (
              <DonationChooser
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
        {t("checkout.actions.next")}
      </Button>
    </form>
  );
}

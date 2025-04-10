"use client";

import { type OfferCheckoutQuery } from "#graphql/republik-api/__generated__/gql/graphql";
import { createCheckoutSession } from "@/actions/create-checkout-session";
import { DiscountChooser } from "@/components/checkout/discount-chooser";
import {
  DonationChooser,
  OPTION_CUSTOM,
} from "@/components/checkout/donation-chooser";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useSessionStorage } from "@/lib/hooks/use-session-storage";
import { css } from "@/theme/css";
import { AlertCircleIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useActionState, useEffect, useMemo } from "react";
import { type LineItem, PricingTable } from "./pricing-table";

type DonationOptionParams = {
  donationOption: string;
  customDonation?: string;
};

type DiscountOptionParams = {
  discountOption: string;
  discountReason?: string;
};

interface CustomizeOfferProps {
  offer: NonNullable<OfferCheckoutQuery["offer"]>;
  promoCode?: string;
  onComplete: (params: {
    sessionId: string;
    donationOption?: DonationOptionParams;
    discountOption?: DiscountOptionParams;
  }) => Promise<void>;
}

export function CustomizeOfferView({
  offer,
  promoCode,
  onComplete,
}: CustomizeOfferProps) {
  const donationOptions = offer.donationOptions;
  const discountOptions = offer.discountOptions;

  const hasDonationOptions = donationOptions && donationOptions.length > 0;
  const hasDiscountOptions = discountOptions && discountOptions.length > 0;

  const t = useTranslations();

  const [state, createCheckoutAction, createCheckoutPending] = useActionState(
    createCheckoutSession,
    {}
  );

  const [donationOption, setDonationOption] =
    useSessionStorage("donationOption");
  const [customDonation, setCustomDonationOption] =
    useSessionStorage("customDonation");
  const [discountReason, setDiscountReason] =
    useSessionStorage("discountReason");
  const [discountOption, setDiscountOption] =
    useSessionStorage("discountOption");

  useEffect(() => {
    if (state.sessionId) {
      onComplete({
        sessionId: state.sessionId,
      });
    }
  }, [state, onComplete]);

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

    const donation =
      customDonation && donationOption === OPTION_CUSTOM
        ? {
            price: {
              amount: Math.max(0, parseInt(customDonation, 10) * 100),
            },
          }
        : donationOptions?.find(({ id }) => id === donationOption);

    if (donation) {
      items.push({
        label: t("checkout.preCheckout.donate.itemName"),
        amount: donation.price.amount,
        hidden: true,
      });
    }

    const selectedDiscount = discountOptions?.find(
      ({ id }) => id === discountOption
    );

    if (selectedDiscount) {
      items.push({
        label: t("checkout.preCheckout.reduced.itemName"),
        amount: -selectedDiscount.amountOff,
        hidden: true,
      });
    }

    return items;
  }, [
    offer.name,
    offer.price,
    offer.discount,
    donationOptions,
    donationOption,
    discountOptions,
    customDonation,
    discountOption,
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
            <>
              {hasDiscountOptions && (
                <DiscountChooser
                  // @ts-expect-error FIXME: id should not be nullable!
                  options={discountOptions}
                  discountOption={discountOption}
                  setDiscountOption={setDiscountOption}
                  discountReason={discountReason}
                  setDiscountReason={setDiscountReason}
                />
              )}
              {hasDonationOptions && (
                <DonationChooser
                  options={donationOptions}
                  donationOption={donationOption}
                  setDonationOption={setDonationOption}
                  customDonation={customDonation}
                  setCustomDonationOption={setCustomDonationOption}
                />
              )}
            </>
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

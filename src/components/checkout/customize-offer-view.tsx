"use client";

import {
  OfferAvailability,
  type OfferCheckoutQuery,
} from "#graphql/republik-api/__generated__/gql/graphql";
import { createCheckoutSession } from "@/actions/create-checkout-session";
import { DiscountChooser } from "@/components/checkout/discount-chooser";
import { DonationChooser } from "@/components/checkout/donation-chooser";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useSessionStorage } from "@/lib/hooks/use-session-storage";
import { css } from "@/theme/css";
import { AlertCircleIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useActionState, useEffect, useMemo, useState } from "react";
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
  const donationOptions = offer.suggestedDonations?.map((amount) => {
    return {
      id: `option_${amount}`,
      amount,
    };
  });
  const discountOptions = offer.discountOptions;

  const hasDonationOptions = donationOptions && donationOptions.length > 0;
  const hasDiscountOptions = discountOptions && discountOptions.length > 0;

  const recurringInterval = offer.price.recurring?.interval;

  const t = useTranslations();

  const [state, createCheckoutAction, createCheckoutPending] = useActionState(
    createCheckoutSession,
    {}
  );

  const [showOptions, setShowOptions] = useState(false);

  const [donationAmount, setDonationAmount] = useSessionStorage(
    `${offer.id}_donationAmount`
  );
  const [discountReason, setDiscountReason] = useSessionStorage(
    `${offer.id}_discountReason`
  );
  const [discountOption, setDiscountOption] = useSessionStorage(
    `${offer.id}_discountOption`
  );
  const [donationRecurring, setDonationRecurring] = useSessionStorage(
    `${offer.id}_donationRecurring`
  );

  useEffect(() => {
    if (state.sessionId) {
      onComplete({
        sessionId: state.sessionId,
      });
    }
  }, [state, onComplete]);

  const invalidPromoCode = promoCode !== undefined && !offer.discount;

  const resetDonation = () => {
    setDonationAmount("");
    setDonationRecurring("");
  };

  const resetDiscount = () => {
    setDiscountOption("");
    setDiscountReason("");
  };

  const selectedDonation = donationOptions?.find(
    ({ id }) => id === donationAmount
  );

  const lineItems: LineItem[] = useMemo(() => {
    const items: LineItem[] = [];

    const descriptionTranslationKey = `checkout.preCheckout.offer.${offer.id}.description`;
    // @ts-expect-error unknown message key
    const description = t.has(descriptionTranslationKey)
      ? // @ts-expect-error unknown message key
        t(descriptionTranslationKey)
      : undefined;

    const startDate =
      offer.availability === OfferAvailability.Upgradeable &&
      offer.__typename === "SubscriptionOffer" &&
      offer.startDate
        ? new Date(offer.startDate)
        : undefined;

    items.push({
      type: "OFFER",
      label: offer.name,
      description,
      amount: offer.price.amount,
      recurringInterval: offer.price.recurring?.interval,
      startDate,
    });

    if (offer.discount) {
      const isRepeating = offer.discount.duration === "repeating";
      const repeatingInterval = offer.discount.durationInMonths
        ? offer.price.recurring?.interval === "year"
          ? "year"
          : "month"
        : undefined;
      const repeating = offer.discount.durationInMonths
        ? offer.price.recurring?.interval === "year"
          ? Math.ceil(offer.discount.durationInMonths / 12)
          : offer.discount.durationInMonths
        : undefined;

      const infoTranslationKey = isRepeating
        ? `checkout.preCheckout.durationAvailable.repeating.${repeatingInterval}`
        : `checkout.preCheckout.durationAvailable.${offer.discount.duration}`;

      items.push({
        type: "DISCOUNT",
        label:
          offer.discount.name || t("checkout.preCheckout.discount.itemName"),
        amount: -1 * (offer.discount.amountOff ? offer.discount.amountOff : 0),
        duration: offer.discount.duration,
        repeating: repeating,
        // @ts-expect-error unknown message key
        info: t.has(infoTranslationKey)
          ? // @ts-expect-error unknown message key
            t(infoTranslationKey, { repeating })
          : null,
      });
    }

    if (donationAmount) {
      const recurringInterval =
        donationRecurring !== "once" && donationRecurring !== ""
          ? offer.price.recurring?.interval
          : undefined;

      const info =
        recurringInterval &&
        t("checkout.preCheckout.recurringInfo", {
          intervalAdjective: t.has(
            // @ts-expect-error unknown message key
            `checkout.preCheckout.intervalsAdjective.${recurringInterval}`
          )
            ? // @ts-expect-error unknown message key
              t(`checkout.preCheckout.intervalsAdjective.${recurringInterval}`)
            : t(`checkout.preCheckout.intervalsAdjective.auto`),
        });

      items.push({
        type: "DONATION",
        label: t("checkout.preCheckout.donate.itemName"),
        amount: Math.max(0, parseInt(donationAmount, 10)),
        recurringInterval,
        info,
        onChange: () => setShowOptions(true),
        onRemove: resetDonation,
      });
    }

    const selectedDiscount = discountOptions?.find(
      ({ id }) => id === discountOption
    );

    if (selectedDiscount) {
      items.push({
        type: "DISCOUNT",
        label: t("checkout.preCheckout.reduced.itemName"),
        amount: -selectedDiscount.amountOff,
        duration: selectedDiscount.duration,
        onChange: () => setShowOptions(true),
        onRemove: resetDiscount,
      });
    }

    return items;
  }, [
    offer.id,
    offer.name,
    offer.price,
    offer.discount,
    donationAmount,
    discountOptions,
    discountOption,
    donationRecurring,
    setShowOptions,
    resetDiscount,
    resetDonation,
    t,
  ]);

  const submitDisabled =
    createCheckoutPending ||
    (offer.id === "DONATION" &&
      !lineItems.some(({ type }) => type === "DONATION"));

  return (
    <form
      action={createCheckoutAction}
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: "4",
      })}
    >
      <input type="hidden" readOnly name="offerId" defaultValue={offer.id} />
      <input type="hidden" readOnly name="promoCode" defaultValue={promoCode} />

      {donationAmount && (
        <input
          type="hidden"
          readOnly
          name="donationAmount"
          value={donationAmount}
        />
      )}

      {donationRecurring && donationRecurring !== "once" && (
        <input type="hidden" readOnly name="donationRecurring" value="true" />
      )}

      {discountOption && (
        <input
          type="hidden"
          readOnly
          name="discountOption"
          value={discountOption}
        />
      )}

      {discountReason && (
        <input
          type="hidden"
          readOnly
          name="discountReason"
          value={discountReason}
        />
      )}

      <div
        className={css({
          spaceY: "2",
        })}
      >
        <PricingTable
          currency={offer.price.currency}
          lineItems={lineItems}
          extraItem={
            (hasDiscountOptions || hasDonationOptions) && (
              <>
                {hasDiscountOptions && (
                  <DiscountChooser
                    options={discountOptions}
                    discountOption={discountOption}
                    setDiscountOption={setDiscountOption}
                    discountReason={discountReason}
                    setDiscountReason={setDiscountReason}
                    showOptions={showOptions}
                    setShowOptions={setShowOptions}
                  />
                )}
                {hasDonationOptions && (
                  <DonationChooser
                    // @ts-expect-error possible not matching offer ID
                    offerId={offer.id}
                    recurringInterval={recurringInterval}
                    options={donationOptions}
                    donationAmount={donationAmount}
                    setDonationAmount={setDonationAmount}
                    donationRecurring={donationRecurring}
                    setDonationRecurring={setDonationRecurring}
                    showOptions={showOptions}
                    setShowOptions={setShowOptions}
                  />
                )}
              </>
            )
          }
        />
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
        disabled={submitDisabled}
      >
        {t("checkout.actions.next")}
      </Button>
    </form>
  );
}

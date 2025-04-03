"use client";

import { type OfferCheckoutQuery } from "#graphql/republik-api/__generated__/gql/graphql";
import { createCheckoutSession } from "@/actions/create-checkout-session";
import {
  DonationChooser,
  OPTION_CUSTOM,
  OPTION_NONE,
} from "@/components/checkout/donation-chooser";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { css } from "@/theme/css";
import { AlertCircleIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import {
  startTransition,
  useActionState,
  useEffect,
  useMemo,
  useOptimistic,
} from "react";
import { type LineItem, PricingTable } from "./pricing-table";
import { DiscountChooser } from "@/components/checkout/discount-chooser";

type DonationOptionParams = {
  donationOption: string;
  customDonation?: string;
};

type DiscountOptionParams = {
  discountOption: string;
};

interface CustomizeOfferProps {
  offer: NonNullable<OfferCheckoutQuery["offer"]>;
  promoCode?: string;
  onComplete: (params: {
    sessionId: string;
    donationOption?: DonationOptionParams;
  }) => Promise<void>;
}

export function CustomizeOfferView({
  offer,
  promoCode,
  onComplete,
}: CustomizeOfferProps) {
  const donationOptions = offer.donationOptions;
  const discountOptions = offer.discountOptions;

  const t = useTranslations();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [state, createCheckoutAction, createCheckoutPending] = useActionState(
    createCheckoutSession,
    {}
  );

  // Get/set donation option from url search params
  const actualDonationOption: DonationOptionParams = {
    donationOption: searchParams.get("donation_option") ?? OPTION_NONE,
    customDonation: searchParams.get("custom_donation") ?? undefined,
  };
  const [donationOption, setOptimisticDonationOption] = useOptimistic(
    actualDonationOption,
    (_, newState: DonationOptionParams) => {
      return newState;
    }
  );

  const setDonationOption = (value: string, customDonation?: string) => {
    const p = new URLSearchParams(searchParams);
    if (value !== OPTION_NONE) {
      p.set("donation_option", value);
    } else {
      p.delete("donation_option");
    }

    if (value === OPTION_CUSTOM && customDonation) {
      p.set("custom_donation", customDonation);
    } else {
      p.delete("custom_donation");
    }

    startTransition(() => {
      // Immediately change the selected option
      setOptimisticDonationOption({ donationOption: value, customDonation });
      // This refetches the page, which makes sure that the correct searchParams are used when navigating
      router.replace(`?${p}`);
    });
  };

  // Get/set discount option from url search params
  const actualDiscountOption: DiscountOptionParams = {
    discountOption: searchParams.get("discount_option") ?? OPTION_NONE,
  };
  const [discountOption, setOptimisticDiscountOption] = useOptimistic(
    actualDiscountOption,
    (_, newState: DiscountOptionParams) => {
      return newState;
    }
  );

  const setDiscountOption = (value: string, customDonation?: string) => {
    const p = new URLSearchParams(searchParams);
    if (value !== OPTION_NONE) {
      p.set("discount_option", value);
    } else {
      p.delete("discount_option");
    }

    startTransition(() => {
      // Immediately change the selected option
      setOptimisticDiscountOption({ discountOption: value });
      // This refetches the page, which makes sure that the correct searchParams are used when navigating
      router.replace(`?${p}`);
    });
  };

  useEffect(() => {
    if (state.sessionId) {
      onComplete({ sessionId: state.sessionId, donationOption });
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

    const donation = donationOption.customDonation
      ? {
          price: {
            amount: Math.max(
              0,
              parseInt(donationOption.customDonation, 10) * 100
            ),
          },
        }
      : donationOptions?.find(({ id }) => id === donationOption.donationOption);

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
            <>
              {discountOptions && (
                <DiscountChooser
                  options={discountOptions}
                  onChange={setDiscountOption}
                  value={discountOption.discountOption}
                />
              )}
              {donationOptions && (
                <DonationChooser
                  options={donationOptions}
                  onChange={setDonationOption}
                  value={donationOption.donationOption}
                  customDonationValue={donationOption.customDonation}
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

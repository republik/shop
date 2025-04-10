"use client";

import { Button } from "@/components/ui/button";
import { FormField, RadioOption } from "@/components/ui/form";
import { useFormatCurrency } from "@/lib/hooks/use-format";
import { css } from "@/theme/css";
import * as Collapsible from "@radix-ui/react-collapsible";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

export const OPTION_CUSTOM = "CUSTOM";

type DonationOption = {
  id: string;
  price: { amount: number; recurring?: { interval: string } | null };
};

export function DonationChooser({
  options,
  donationOption,
  setDonationOption,
  customDonation,
  setCustomDonationOption,
}: {
  options: DonationOption[];
  donationOption: string;
  setDonationOption: (value: string) => void;
  customDonation: string;
  setCustomDonationOption: (value: string) => void;
}) {
  const t = useTranslations();
  const tInterval = useTranslations("checkout.preCheckout.intervalsAdjective");
  const f = useFormatCurrency("CHF");
  const [shouldOpen, setOpen] = useState(false);

  // Always open when a donation option is set
  const open = donationOption !== "" || shouldOpen;

  return (
    <div
      className={css({
        width: "full",
        padding: "4",
        borderRadius: "sm",
        backgroundColor: "green.50",
        whiteSpace: "normal",
        spaceY: "3",
      })}
    >
      <h3 className={css({ fontWeight: "medium" })}>
        {t("checkout.preCheckout.donate.title")}
      </h3>
      <p>{t("checkout.preCheckout.donate.description")}</p>
      <Collapsible.Root open={open} onOpenChange={setOpen}>
        {!open && (
          <Collapsible.Trigger asChild>
            <Button variant="link" className={css({})}>
              {t("checkout.preCheckout.donate.showOptions")}
            </Button>
          </Collapsible.Trigger>
        )}

        <Collapsible.Content>
          <div
            role="radiogroup"
            className={css({
              spaceY: "3",
            })}
          >
            {options.map(({ id, price }) => {
              return (
                <RadioOption
                  key={id}
                  name="donationOption"
                  checked={donationOption === id}
                  value={id}
                  onChange={() => {
                    setDonationOption(id);
                    // reset custom donation
                    setCustomDonationOption("");
                  }}
                >
                  + {f(price.amount)}
                  {price.recurring
                    ? // @ts-expect-error interval
                      `, ${tInterval(price.recurring.interval)}`
                    : ""}
                </RadioOption>
              );
            })}

            <RadioOption
              key={OPTION_CUSTOM}
              name="donationOption"
              checked={donationOption === OPTION_CUSTOM}
              value={OPTION_CUSTOM}
              onChange={() => setDonationOption(OPTION_CUSTOM)}
            >
              {t("checkout.preCheckout.donate.optionCustom")}
            </RadioOption>

            {donationOption === "CUSTOM" && (
              <div
                className={css({
                  pl: "[calc(1.15em + var(--spacing-4))]",
                })}
              >
                <FormField
                  type="number"
                  min={0}
                  required
                  name="customDonation"
                  autoFocus
                  value={customDonation}
                  onChange={(e) =>
                    setCustomDonationOption(e.currentTarget.value)
                  }
                  label={t("checkout.preCheckout.donate.optionCustomField")}
                  hideLabel
                />
              </div>
            )}

            <Button
              variant="link"
              type="reset"
              hidden={!donationOption}
              onClick={() => {
                setOpen(false);
                setDonationOption("");
                setCustomDonationOption("");
              }}
            >
              {t("checkout.preCheckout.donate.reset")}
            </Button>
          </div>
        </Collapsible.Content>
      </Collapsible.Root>
    </div>
  );
}

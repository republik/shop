"use client";

import { Button } from "@/components/ui/button";
import { FormField, RadioOption } from "@/components/ui/form";
import { useFormatCurrency } from "@/lib/hooks/use-format";
import { css } from "@/theme/css";
import { useTranslations } from "next-intl";
import { Collapsible, ToggleGroup } from "radix-ui";
import { useState } from "react";

export const OPTION_CUSTOM = "CUSTOM";

type DonationOption = {
  id: string;
  amount: number;
};

export function DonationChooser({
  recurringInterval,
  options,
  donationOption,
  setDonationOption,
  customDonation,
  setCustomDonationOption,
  donationRecurring,
  setDonationRecurring,
}: {
  recurringInterval?: string;
  options: DonationOption[];
  donationOption: string;
  setDonationOption: (value: string) => void;
  customDonation: string;
  setCustomDonationOption: (value: string) => void;
  donationRecurring: string;
  setDonationRecurring: (value: string) => void;
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
            className={css({
              pb: "3",
            })}
          >
            {recurringInterval && (
              <ToggleGroup.Root
                type="single"
                value={donationRecurring || "once"}
                onValueChange={(value) => {
                  if (value) {
                    setDonationRecurring(value);
                  }
                }}
              >
                {["once", recurringInterval].map((interval) => (
                  <ToggleGroup.Item
                    key={interval}
                    value={interval}
                    className={css({
                      px: "2",
                      py: "1",
                      border: "[1px solid black]",
                      _firstOfType: {
                        borderTopLeftRadius: "sm",
                        borderBottomLeftRadius: "sm",
                      },
                      _lastOfType: {
                        borderTopRightRadius: "sm",
                        borderBottomRightRadius: "sm",
                      },
                      _checked: {
                        background: "text",
                        color: "text.inverted",
                      },
                    })}
                  >
                    {
                      // @ts-expect-error FIXME possibly unknown interval
                      tInterval(interval)
                    }
                  </ToggleGroup.Item>
                ))}
              </ToggleGroup.Root>
            )}
          </div>
          <div
            role="radiogroup"
            className={css({
              spaceY: "3",
            })}
          >
            {options.map(({ id, amount }) => {
              return (
                <RadioOption
                  key={id}
                  name="donationOption"
                  checked={donationOption === id}
                  value={amount.toString()}
                  onChange={() => {
                    setDonationOption(id);
                    // reset custom donation
                    setCustomDonationOption("");
                  }}
                >
                  {f(amount)}
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

            {donationRecurring && donationRecurring !== "once" && (
              <input
                type="hidden"
                readOnly
                name="donationRecurring"
                value="true"
              />
            )}

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
                setDonationRecurring("");
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

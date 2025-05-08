"use client";

import { OptionsDialogContent } from "@/components/checkout/options-dialog";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import { useFormatCurrency } from "@/lib/hooks/use-format";
import { css } from "@/theme/css";
import { XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Dialog, RadioGroup } from "radix-ui";
import { useState } from "react";

export const OPTION_CUSTOM = "CUSTOM";

type DonationOption = {
  id: string;
  amount: number;
};

type DonationChooserProps = {
  offerId: "YEARLY" | "BENEFACTOR";
  recurringInterval?: string;
  options: DonationOption[];
  donationAmount: string;
  setDonationAmount: (value: string) => void;
  donationRecurring: string;
  setDonationRecurring: (value: string) => void;
};

export function DonationChooser(props: DonationChooserProps) {
  const t = useTranslations(`checkout.preCheckout.donate.${props.offerId}`);

  const [open, setOpen] = useState(false);

  const handleSubmit = (formData: FormData) => {
    const customAmount = formData.get("customDonationAmount")?.toString();
    const amount = formData.get("donationAmount")?.toString();
    const recurring = formData.get("donationRecurring")?.toString() ?? "";

    props.setDonationAmount(
      customAmount
        ? (parseInt(customAmount, 10) * 100).toString()
        : amount ?? ""
    );
    props.setDonationRecurring(recurring);
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <div
        hidden={!!props.donationAmount}
        className={css({
          width: "full",
          padding: "4",
          borderRadius: "sm",
          backgroundColor: "[#FFD3EE]",
          whiteSpace: "normal",
          spaceY: "3",
        })}
      >
        <h3 className={css({ fontWeight: "medium" })}>{t("title")}</h3>
        <p>{t("description")}</p>

        <Dialog.Trigger asChild>
          <Button type="button" variant="outline" className={css({})}>
            {t("showOptions")}
          </Button>
        </Dialog.Trigger>
      </div>
      <OptionsDialogContent title={t("chooseAmount")}>
        <DonationChooserOptions {...props} onSubmit={handleSubmit} />
      </OptionsDialogContent>
    </Dialog.Root>
  );
}

/* <Button
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
</Button> */

function DonationChooserOptions({
  offerId,
  recurringInterval,
  options,
  // donationAmount,
  // setDonationAmount,
  // donationRecurring,
  // setDonationRecurring,
  onSubmit,
}: DonationChooserProps & { onSubmit: (data: FormData) => void }) {
  const tOffer = useTranslations(`checkout.preCheckout.donate.${offerId}`);
  const t = useTranslations(`checkout`);
  const tInterval = useTranslations("checkout.preCheckout.intervalsAdjective");
  const f = useFormatCurrency("CHF");

  return (
    <form
      onSubmit={(e) => {
        onSubmit(
          new FormData(
            e.currentTarget,
            // Pass the submitter (= the button that was used to submit the form), so its value is available in the FormData
            (e.nativeEvent as SubmitEvent).submitter
          )
        );
        e.preventDefault();
      }}
    >
      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          gap: "4",
          alignItems: "stretch",
        })}
      >
        {recurringInterval && (
          <RadioGroup.Root
            name="donationRecurring"
            defaultValue={recurringInterval}
            className={css({
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1",
              borderColor: "divider",
              borderStyle: "solid",
              borderWidth: 1,
              p: "[3px]",
              borderRadius: "md",
            })}
          >
            {["once", recurringInterval].map((interval) => (
              <RadioGroup.Item
                key={interval}
                value={interval}
                className={css({
                  px: "2",
                  py: "1",
                  borderStyle: "solid",
                  borderWidth: 1,
                  borderRadius: "sm",
                  color: "text.secondary",
                  borderColor: "transparent",

                  cursor: "pointer",
                  _hover: {
                    color: "primary",
                  },

                  _checked: {
                    borderColor: "primary",
                    background: "text",
                    color: "text.inverted",
                    _hover: {
                      color: "text.inverted",
                    },
                  },
                })}
              >
                {
                  // @ts-expect-error FIXME possibly unknown interval
                  tInterval(interval)
                }
              </RadioGroup.Item>
            ))}
          </RadioGroup.Root>
        )}

        {options.map(({ id, amount }) => {
          return (
            <Button
              variant="outline"
              className={css({ width: "full" })}
              key={id}
              type="submit"
              name="donationAmount"
              value={amount.toString()}
            >
              {f(amount)}
            </Button>
          );
        })}

        <FormField
          type="number"
          min={0}
          step={1}
          name="customDonationAmount"
          label={tOffer("optionCustom")}
        />

        <Button type="submit">{t("actions.choose")}</Button>
      </div>
    </form>
  );
}

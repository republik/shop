"use client";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/checkout/options-dialog";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import { useFormatCurrency } from "@/lib/hooks/use-format";
import { css } from "@/theme/css";
import { HandHeart, HandHeartIcon, HeartIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { RadioGroup } from "radix-ui";

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
  showOptions: boolean;
  setShowOptions: (value: boolean) => void;
  hideTrigger?: boolean;
};

export function DonationChooser({
  showOptions,
  setShowOptions,
  ...props
}: DonationChooserProps) {
  const t = useTranslations(`checkout.preCheckout.donate.${props.offerId}`);

  const handleSubmit = (formData: FormData) => {
    const customAmount = formData.get("customDonationAmount")?.toString();
    const amount = formData.get("donationAmount")?.toString();
    const recurring = formData.get("donationRecurring")?.toString() ?? "";

    props.setDonationAmount(
      customAmount
        ? (parseInt(customAmount, 10) * 100).toString()
        : amount ?? "",
    );
    props.setDonationRecurring(recurring);
    setShowOptions(false);
  };

  return (
    <Dialog open={showOptions} onOpenChange={setShowOptions}>
      <div
        style={{
          // @ts-expect-error custom css prop
          "--color-donation-highlight":
            props.offerId === "YEARLY" ? "#FFD3EE" : "#F2ECE6",
        }}
        hidden={!!props.donationAmount}
        className={css({
          width: "full",
          padding: "4",
          borderRadius: "lg",
          backgroundColor: "var(--color-donation-highlight)",
          fontSize: "sm",
          display: "grid",
          rowGap: "2",
          columnGap: "3",
          gridTemplateColumns: "auto 1fr",
          gridTemplateRows: "auto",

          "& > svg": {
            gridColumnStart: "1",
            gridColumnEnd: "1",
            color: "black",
            width: "5",
            height: "5",
          },
        })}
      >
        <HandHeartIcon />
        <div
          className={css({
            whiteSpace: "normal",
            spaceY: "3",
          })}
        >
          <h3 className={css({ fontWeight: "medium" })}>{t("title")}</h3>
          <p>{t("description")}</p>

          <DialogTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="small"
              className={css({})}
            >
              {t("showOptions")}
            </Button>
          </DialogTrigger>
        </div>
      </div>
      <DialogContent title={t("chooseAmount")}>
        <DonationChooserOptions {...props} onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
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
  donationAmount,
  // setDonationAmount,
  donationRecurring,
  // setDonationRecurring,
  onSubmit,
}: Omit<DonationChooserProps, "showOptions" | "setShowOptions"> & {
  onSubmit: (data: FormData) => void;
}) {
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
            (e.nativeEvent as SubmitEvent).submitter,
          ),
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
            defaultValue={donationRecurring || recurringInterval}
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
              className={css({
                width: "full",
              })}
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
          // defaultValue={parseInt(donationAmount, 10) / 100}
        />

        <Button type="submit">{t("actions.choose")}</Button>
      </div>
    </form>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { FormField, RadioOption } from "@/components/ui/form";
import { useFormatCurrency } from "@/lib/hooks/use-format";
import { css } from "@/theme/css";
import { visuallyHidden } from "@/theme/patterns";
import {
  CheckCheckIcon,
  CheckCircle2Icon,
  CheckCircleIcon,
  CheckIcon,
  XCircleIcon,
  XIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Dialog, RadioGroup, ToggleGroup } from "radix-ui";
import { useState } from "react";

export const OPTION_CUSTOM = "CUSTOM";

type DonationOption = {
  id: string;
  amount: number;
};

type DonationChooserProps = {
  recurringInterval?: string;
  options: DonationOption[];
  donationAmount: string;
  setDonationAmount: (value: string) => void;
  donationRecurring: string;
  setDonationRecurring: (value: string) => void;
};

export function DonationChooser(props: DonationChooserProps) {
  const t = useTranslations();

  const [open, setOpen] = useState(false);

  const handleSubmit = (formData: FormData) => {
    const customAmount = formData.get("customDonationAmount")?.toString();
    const amount = formData.get("donationAmount")?.toString();
    const recurring = formData.get("donationRecurring")?.toString() ?? "";

    console.log(Object.fromEntries(formData));

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
          backgroundColor: "pink.50",
          whiteSpace: "normal",
          spaceY: "3",
        })}
      >
        <h3 className={css({ fontWeight: "medium" })}>
          {t("checkout.preCheckout.donate.title")}
        </h3>
        <p>{t("checkout.preCheckout.donate.description")}</p>

        <Dialog.Trigger asChild>
          <Button type="button" variant="outline" className={css({})}>
            {t("checkout.preCheckout.donate.showOptions")}
          </Button>
        </Dialog.Trigger>
      </div>
      <Dialog.Portal>
        <Dialog.Overlay
          className={css({
            backgroundColor: "overlay",
            position: "fixed",
            color: "text",
            inset: "0",
            display: "grid",
            placeItems: "end center",
            overflowY: "auto",
            zIndex: 9999,

            _stateOpen: { animation: "fadeIn" },
            _stateClosed: {
              animation: "fadeOut",
            },
            sm: {
              placeItems: "center",
            },
          })}
        >
          <Dialog.Content
            aria-describedby={undefined}
            className={css({
              position: "relative",
              boxShadow: "sm",
              background: "background",
              width: "full",
              p: "8",
              _stateOpen: {
                animation: "slideUp",
              },
              _stateClosed: {
                animation: "slideDown",
              },

              sm: {
                width: "content.narrow",
                _stateOpen: { animation: "slideIn" },
                _stateClosed: {
                  animation: "slideOut",
                },
              },
            })}
          >
            <div
              className={css({
                display: "grid",
                gap: "4",
                gridTemplateColumns: "1fr max-content",
                alignItems: "start",
                mb: "4",
              })}
            >
              <Dialog.Title className={css({ textStyle: "h3Sans" })}>
                {t("checkout.preCheckout.donate.chooseAmount")}
              </Dialog.Title>
              <Dialog.Close className={css({})} aria-label="schliessen">
                <XIcon />
              </Dialog.Close>
            </div>
            <DonationChooserOptions {...props} onSubmit={handleSubmit} />
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
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
  recurringInterval,
  options,
  // donationAmount,
  // setDonationAmount,
  // donationRecurring,
  // setDonationRecurring,
  onSubmit,
}: DonationChooserProps & { onSubmit: (data: FormData) => void }) {
  const t = useTranslations();
  const tInterval = useTranslations("checkout.preCheckout.intervalsAdjective");
  const f = useFormatCurrency("CHF");

  const [recurring, setRecurring] = useState("once");

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
            defaultValue="once"
            className={css({
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
            })}
          >
            {["once", recurringInterval].map((interval) => (
              <RadioGroup.Item
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
          label={t("checkout.preCheckout.donate.optionCustom")}
        />

        <Button type="submit">{t("checkout.actions.choose")}</Button>
      </div>
    </form>
  );
}

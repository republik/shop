"use client";

import { OptionsDialogContent } from "@/components/checkout/options-dialog";
import { Button } from "@/components/ui/button";
import { RadioOption, TextArea } from "@/components/ui/form";
import { useFormatCurrency } from "@/lib/hooks/use-format";
import { css } from "@/theme/css";
import { useTranslations } from "next-intl";
import { Dialog } from "radix-ui";
import { useState } from "react";

type DiscountOption = {
  id: string;
  amountOff: number;
  duration: string;
};

export function DiscountChooser({
  options,
  discountOption,
  setDiscountOption,
  discountReason,
  setDiscountReason,
}: {
  options: DiscountOption[];
  discountOption: string;
  setDiscountOption: (value: string) => void;
  discountReason: string;
  setDiscountReason: (value: string) => void;
}) {
  const t = useTranslations(`checkout.preCheckout.reduced`);
  // const tInterval = useTranslations("checkout.preCheckout.intervalsAdjective");
  const f = useFormatCurrency("CHF");

  // const t = useTranslations(`checkout.preCheckout.r`);

  const [open, setOpen] = useState(false);

  const handleSubmit = (formData: FormData) => {
    const option = formData.get("discountOption")?.toString() ?? "";
    const reason = formData.get("discountReason")?.toString() ?? "";

    setDiscountOption(option);
    setDiscountReason(reason);
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <div
        hidden={!!discountOption}
        className={css({
          width: "full",
          padding: "4",
          borderRadius: "sm",
          backgroundColor: "[#E2FBA6]",
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
        <form
          onSubmit={(e) => {
            handleSubmit(
              new FormData(
                e.currentTarget,
                // Pass the submitter (= the button that was used to submit the form), so its value is available in the FormData
                (e.nativeEvent as SubmitEvent).submitter
              )
            );
            e.preventDefault();
          }}
        >
          {" "}
          <div
            className={css({
              spaceY: "3",
            })}
          >
            <TextArea
              label={t("reason")}
              required
              name="discountReason"
              rows={3}
              value={discountReason}
              onChange={(e) => {
                setDiscountReason(e.currentTarget.value);
              }}
            />

            {options.map(({ id, amountOff }) => {
              return (
                <Button
                  variant="outline"
                  className={css({ width: "full" })}
                  key={id}
                  type="submit"
                  name="discountOption"
                  value={id}
                >
                  {f(-1 * amountOff)}
                </Button>
              );
            })}
          </div>
        </form>
      </OptionsDialogContent>
    </Dialog.Root>
  );

  // return (
  //   <div
  //     className={css({
  //       width: "full",
  //       padding: "4",
  //       borderRadius: "sm",
  //       backgroundColor: "purple.100",
  //       whiteSpace: "normal",
  //       spaceY: "3",
  //     })}
  //   >
  //     <h3 className={css({ fontWeight: "medium" })}>
  //       {t("checkout.preCheckout.reduced.title")}
  //     </h3>
  //     <p>{t("checkout.preCheckout.reduced.description")}</p>

  //     <div>
  //       <TextArea
  //         label={t("checkout.preCheckout.reduced.reason")}
  //         required
  //         name="discountReason"
  //         rows={3}
  //         value={discountReason}
  //         onChange={(e) => {
  //           setDiscountReason(e.currentTarget.value);
  //         }}
  //       />
  //     </div>

  //   </div>
  // );
}

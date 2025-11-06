"use client";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/checkout/options-dialog";
import { Button } from "@/components/ui/button";
import { TextArea } from "@/components/ui/form";
import { useFormatCurrency } from "@/lib/hooks/use-format";
import { css } from "@/theme/css";
import { PercentIcon, PiggyBankIcon } from "lucide-react";
import { useTranslations } from "next-intl";
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
  showOptions,
  setShowOptions,
}: {
  options: DiscountOption[];
  discountOption: string;
  setDiscountOption: (value: string) => void;
  discountReason: string;
  setDiscountReason: (value: string) => void;
  showOptions: boolean;
  setShowOptions: (value: boolean) => void;
}) {
  const t = useTranslations(`checkout.preCheckout.reduced`);
  const f = useFormatCurrency("CHF");

  const handleSubmit = (formData: FormData) => {
    const option = formData.get("discountOption")?.toString() ?? "";
    const reason = formData.get("discountReason")?.toString() ?? "";

    setDiscountOption(option);
    setDiscountReason(reason);
    setShowOptions(false);
  };

  return (
    <Dialog open={showOptions} onOpenChange={setShowOptions}>
      <div
        hidden={!!discountOption}
        className={css({
          width: "full",
          padding: "4",
          borderRadius: "lg",
          backgroundColor: "[#E2FBA6]",
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
        <PercentIcon />
        <div className={css({ whiteSpace: "normal", spaceY: "3" })}>
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
        <form
          onSubmit={(e) => {
            handleSubmit(
              new FormData(
                e.currentTarget,
                // Pass the submitter (= the button that was used to submit the form), so its value is available in the FormData
                (e.nativeEvent as SubmitEvent).submitter,
              ),
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
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { RadioOption, TextArea } from "@/components/ui/form";
import { useFormatCurrency } from "@/lib/hooks/use-format";
import { css } from "@/theme/css";
import { useTranslations } from "next-intl";

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
  const t = useTranslations();
  // const tInterval = useTranslations("checkout.preCheckout.intervalsAdjective");
  const f = useFormatCurrency("CHF");

  return (
    <div
      className={css({
        width: "full",
        padding: "4",
        borderRadius: "sm",
        backgroundColor: "purple.100",
        whiteSpace: "normal",
        spaceY: "3",
      })}
    >
      <h3 className={css({ fontWeight: "medium" })}>
        {t("checkout.preCheckout.reduced.title")}
      </h3>
      <p>{t("checkout.preCheckout.reduced.description")}</p>

      <div>
        <TextArea
          label={t("checkout.preCheckout.reduced.reason")}
          required
          name="discountReason"
          rows={3}
          value={discountReason}
          onChange={(e) => {
            setDiscountReason(e.currentTarget.value);
          }}
        />
      </div>

      <div
        role="radiogroup"
        className={css({
          spaceY: "3",
        })}
      >
        {options.map(({ id, amountOff }) => {
          return (
            <RadioOption
              key={id}
              name="discountOption"
              checked={discountOption === id}
              value={id}
              onChange={() => {
                setDiscountOption(id);
              }}
            >
              - {f(amountOff)}
            </RadioOption>
          );
        })}
      </div>
    </div>
  );
}

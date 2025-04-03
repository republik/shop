"use client";

import { FormField, RadioOption } from "@/components/ui/form";
import { useFormatCurrency } from "@/lib/hooks/use-format";
import { css } from "@/theme/css";
import { useTranslations } from "next-intl";

export const OPTION_NONE = "";
export const OPTION_CUSTOM = "CUSTOM";

type DiscountOption = {
  id: string;
  amountOff: number;
};

export function DiscountChooser({
  options,
  value,
  onChange,
}: {
  options: DiscountOption[];
  value?: string;
  onChange: (option: string) => void;
}) {
  const t = useTranslations();
  const tInterval = useTranslations("checkout.preCheckout.intervalsAdjective");
  const f = useFormatCurrency("CHF");

  return (
    <div
      className={css({
        width: "full",
        padding: "4",
        borderRadius: "sm",
        backgroundColor: "purple.50",
        whiteSpace: "normal",
        spaceY: "3",
      })}
    >
      <h3 className={css({ fontWeight: "medium" })}>
        {t("checkout.preCheckout.reduced.title")}
      </h3>
      <p>{t("checkout.preCheckout.reduced.description")}</p>

      <div>
        <FormField
          label={t("checkout.preCheckout.reduced.reason")}
          required
          name="discountReason"
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
              checked={value === id}
              value={id}
              onChange={() => onChange(id)}
            >
              - {f(amountOff)}
            </RadioOption>
          );
        })}
      </div>
    </div>
  );
}

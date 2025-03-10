"use client";

import { RadioOption } from "@/components/ui/form";
import { useFormatCurrency } from "@/lib/hooks/use-format";
import { css } from "@/theme/css";
import { useTranslations } from "next-intl";

export const OPTION_NONE = "_NONE";

type DonationOption = {
  id: string;
  price: { amount: number; recurring?: { interval: string } | null };
};

export function DonationChooser({
  options,
  value,
  onChange,
}: {
  options: DonationOption[];
  value?: string;
  onChange: (id: string) => void;
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
        backgroundColor: "green.50",
        whiteSpace: "normal",
        spaceY: "3",
      })}
    >
      <h3 className={css({ fontWeight: "medium" })}>
        {t("checkout.preCheckout.donate.title")}
      </h3>
      <p>{t("checkout.preCheckout.donate.description")}</p>
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
              checked={value === id}
              value={id}
              onChange={() => onChange(id)}
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
          key={OPTION_NONE}
          name="donationOption"
          checked={value === OPTION_NONE}
          value={OPTION_NONE}
          onChange={() => onChange(OPTION_NONE)}
        >
          {t("checkout.preCheckout.donate.optionNone")}
        </RadioOption>
      </div>
    </div>
  );
}

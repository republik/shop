"use client";

import { RadioOption } from "@/components/ui/form";
import { useFormatCurrency } from "@/lib/hooks/use-format";
import { css } from "@/theme/css";
import { useTranslations } from "next-intl";

export function DonationChooser({
  options,
  value,
  onChange,
}: {
  options: {
    id: string;
    price: { amount: number; recurring?: { interval: string } };
  }[];
  value?: string;
  onChange: (id: string) => void;
}) {
  const t = useTranslations();
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
              selected={value === id}
              value={id}
              onChange={() => onChange(id)}
            >
              {f(price.amount)}
            </RadioOption>
          );
        })}

        <RadioOption
          key={"NONE"}
          name="donationOption"
          selected={value === "NONE"}
          value={"NONE"}
          onChange={() => onChange("NONE")}
        >
          Nein danke
        </RadioOption>
      </div>
    </div>
  );
}

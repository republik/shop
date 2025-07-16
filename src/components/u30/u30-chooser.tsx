"use client";

import giftBigSrc from "@/assets/gift-big.svg";
import giftSmallSrc from "@/assets/gift-small.svg";
import { U30Description } from "@/components/u30/u30-description";
import { u30Coupons } from "@/components/u30/u30-promo-codes";
import { cardButton } from "@/components/ui/card-button";
import { SelectField } from "@/components/ui/form";
import type { AnalyticsObject } from "@/lib/analytics";
import { css } from "@/theme/css";
import { token } from "@/theme/tokens";
import { useTranslations } from "next-intl";
import Image from "next/image";
import {
  type ChangeEventHandler,
  type ReactNode,
  useId,
  useState,
} from "react";

export function U30Chooser({
  analyticsParams,
}: {
  // TODO remove this again when we don't redirect to legacy /angebote
  analyticsParams?: AnalyticsObject;
}) {
  const t = useTranslations("landing.u30");
  const [option, setOption] = useState<string>("YEARLY");

  const handleOption: ChangeEventHandler<HTMLInputElement> = (e) => {
    setOption(e.currentTarget.value);
  };

  return (
    <>
      <Image
        src={giftBigSrc}
        width={327}
        height={200}
        hidden={option === "MONTHLY"}
        alt="Illustration grosses Paket"
      />
      <Image
        src={giftSmallSrc}
        width={327}
        height={200}
        hidden={option === "YEARLY"}
        alt="Illustration kleines Paket"
      />

      <form
        action={`/angebot`}
        method="GET"
        className={css({
          display: "flex",
          flexDirection: "column",
          gap: "8",
          width: "full",
        })}
      >
        {
          // TODO remove this again when we don't redirect to legacy /angebote
          analyticsParams
            ? Object.entries(analyticsParams).map(([k, v]) => {
                return <input key={k} name={k} value={v} hidden readOnly />;
              })
            : null
        }
        <div
          className={css({
            display: "flex",
            flexDirection: "column",
            gap: "2",
          })}
        >
          <Option
            value="YEARLY"
            selected={option === "YEARLY"}
            onChange={handleOption}
          >
            <strong>{t("options.yearly")}</strong> für CHF 99 pro Jahr
          </Option>
          <Option
            value="MONTHLY"
            selected={option === "MONTHLY"}
            onChange={handleOption}
          >
            <strong>{t("options.monthly")}</strong> für CHF 9 pro Monat
          </Option>

          <SelectField name="promo_code" label="Geburtsjahr" required>
            {u30Coupons.map(({ durationInMonths, promoCode }) => {
              // get birth year relative to current year and coupon duration
              const currentYear = new Date().getFullYear();
              const birthYearLabel = currentYear - 31 + durationInMonths / 12;

              return (
                <option value={promoCode} key={promoCode}>
                  {birthYearLabel}
                </option>
              );
            })}
          </SelectField>
        </div>

        <button
          type="submit"
          className={cardButton({ visual: "solid" })}
          style={{
            // @ts-expect-error custom css vars
            "--text": token("colors.text"),
            "--cta": token("colors.white"),
          }}
        >
          {t("cta")}
        </button>
      </form>

      <U30Description interval={option === "MONTHLY" ? "monthly" : "yearly"} />
    </>
  );
}

function Option({
  value,
  selected,
  children,
  onChange,
}: {
  value: string;
  selected: boolean;
  children: ReactNode;
  onChange: ChangeEventHandler<HTMLInputElement>;
}) {
  const id = useId();
  return (
    <label
      className={css({
        // borderWidth: 2,
        // borderStyle: "solid",
        // borderRadius: "5px",
        // borderColor: "disabled",
        w: "full",
        display: "flex",
        gap: "4",
        alignItems: "center",
        "&:has(:checked)": {
          borderColor: "text",
        },
        fontSize: "xl",
      })}
    >
      <input
        id={id}
        value={value}
        name="product"
        type="radio"
        checked={selected}
        onChange={onChange}
        className={css({
          flexShrink: 0,
          // Custom checkbox style, see https://moderncss.dev/pure-css-custom-styled-radio-buttons/
          appearance: "none",
          backgroundColor: "transparent",
          margin: "0",
          color: "current",
          width: "[1.15em]",
          height: "[1.15em]",
          borderWidth: 2,
          borderStyle: "solid",
          borderColor: "text",
          borderRadius: "full",
          display: "grid",
          placeContent: "center",
          outline: "none",
          _before: {
            content: '""',
            width: "[0.35em]",
            height: "[0.35em]",
            borderRadius: "full",
            backgroundColor: "transparent",
          },

          _checked: {
            backgroundColor: "text",
            _before: {
              backgroundColor: "text.inverted",
            },
          },
        })}
      />

      <span>{children}</span>
    </label>
  );
}

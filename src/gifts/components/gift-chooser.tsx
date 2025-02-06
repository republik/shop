"use client";

import { GiftDescription } from "@/gifts/components/gift-description";
import { cardButton } from "@/components/ui/card-button";
import { AnalyticsObject } from "@/lib/analytics";
import { css } from "@/theme/css";
import { token } from "@/theme/tokens";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { ChangeEventHandler, ReactNode, useId, useState } from "react";
import giftBigSrc from "../assets/gift-big.svg";
import giftSmallSrc from "../assets/gift-small.svg";

export function GiftChooser({
  analyticsParams,
}: {
  // TODO remove this again when we don't redirect to legacy /angebote
  analyticsParams?: AnalyticsObject;
}) {
  const t = useTranslations("landing.gifts");
  const [option, setOption] = useState<string>("ABO_GIVE");

  const handleOption: ChangeEventHandler<HTMLInputElement> = (e) => {
    setOption(e.currentTarget.value);
  };

  return (
    <>
      <Image
        src={giftBigSrc}
        width={327}
        height={200}
        hidden={option === "ABO_GIVE_MONTHS"}
        alt="Illustration grosses Paket"
      />
      <Image
        src={giftSmallSrc}
        width={327}
        height={200}
        hidden={option === "ABO_GIVE"}
        alt="Illustration kleines Paket"
      />

      <form
        action={`${process.env.NEXT_PUBLIC_MAGAZIN_URL}/angebote`}
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
            value="ABO_GIVE"
            selected={option === "ABO_GIVE"}
            onChange={handleOption}
          >
            <strong>{t("options.yearly")}</strong> CHF 222
          </Option>
          <Option
            value="ABO_GIVE_MONTHS"
            selected={option === "ABO_GIVE_MONTHS"}
            onChange={handleOption}
          >
            <strong>{t("options.monthly")}</strong> CHF 48
          </Option>
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

      <GiftDescription
        interval={option === "ABO_GIVE_MONTHS" ? "monthly" : "yearly"}
      />
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
        name="package"
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

"use client";

import { css } from "@/theme/css";
import { token } from "@/theme/tokens";
import { useTranslations } from "next-intl";
import Image from "next/image";
import GiftSVG from "../../../public/static/gift.svg";
import { cardButton } from "@/app/(overview)/card-button";
import { ChangeEventHandler, ReactNode, useId, useState } from "react";

export function GiftChooser() {
  const t = useTranslations("giftOverview");
  const [option, setOption] = useState<string>("ABO_GIVE");

  const handleOption: ChangeEventHandler<HTMLInputElement> = (e) => {
    setOption(e.currentTarget.value);
  };

  return (
    <>
      <Image
        src={GiftSVG}
        alt=""
        width={120}
        height={120}
        className={css({
          display: "block",
          transition: "transform",
        })}
        style={{
          transform: option === "ABO_GIVE_MONTHS" ? "scale(0.5)" : "scale(1)",
        }}
      />

      <form
        action={`${process.env.NEXT_PUBLIC_MAGAZIN_URL}/angebote`}
        className={css({
          display: "flex",
          flexDirection: "column",
          gap: "8",
          width: "full",
        })}
      >
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
            {t("options.yearly")}
          </Option>
          <Option
            value="ABO_GIVE_MONTHS"
            selected={option === "ABO_GIVE_MONTHS"}
            onChange={handleOption}
          >
            {t("options.monthly")}
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

      {children}
    </label>
  );
}

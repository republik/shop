"use client";

import { OfferOptionLabelOnly } from "@/components/campaign/offer-options";
import { Button } from "@/components/ui/button";
import { css } from "@/theme/css";
import { useState } from "react";

type DiscountOption = {
  promoCode: `SPRING26-OFF${number}` | "";
  amount: number;
  highlighted?: string;
};

// There needs to be one Stripe promo code for each discounted amount. (Promo codes are named after the amount *off*, but we display the final amount in the UI)
const DISCOUNT_OPTIONS: DiscountOption[] = [
  { promoCode: "SPRING26-OFF120", amount: 120, highlighted: "50 %" },
  { promoCode: "SPRING26-OFF60", amount: 180 },
  { promoCode: "", amount: 240 },
];

const radioContainerStyle = css({
  textAlign: "center",
  px: "2",
  py: "3",
  borderStyle: "solid",
  borderColor: "[#F0084C]",
  borderWidth: "[2px]",
  borderRadius: "sm",
  width: "full",
  whiteSpace: "nowrap",
  background: "transparent",
  color: "[#F0084C]",
  cursor: "pointer",
  position: "relative",
  userSelect: "none",
  _peerChecked: {
    background: "[#F0084C]",
    borderColor: "[#F0084C]",
    color: "white",
  },
  fontSize: "2xl",
  fontWeight: "medium",
});

export function Offers() {
  const [selectedPromoCode, setSelectedPromoCode] =
    useState<DiscountOption["promoCode"]>();

  return (
    <form
      method="GET"
      action="/angebot/YEARLY"
    >

      <div
        className={css({
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(60px, 1fr))",
          gap: "2",
          mb: "4",
          md: { gap: "4", mb: "6" },
        })}
      >
        {DISCOUNT_OPTIONS.map(({ promoCode, amount, highlighted }) => {
          return (
            <OfferOptionLabelOnly
              key={promoCode || "no-discount"}
              name={promoCode ? "promo_code" : undefined}
              value={promoCode}
              checked={selectedPromoCode === promoCode}
              onChange={() => {
                setSelectedPromoCode(promoCode);
              }}
              className="peer"
            >
              <div key={promoCode} className={radioContainerStyle}>
                <span className={css({ display: "block" })}>
                  <small
                    className={css({ fontWeight: "normal", fontSize: "xs" })}
                  >
                    CHF
                  </small>{" "}
                  <span>{amount}.–</span>
                </span>
                {highlighted && (
                  <span
                    className={css({
                      fontSize: "sm",
                      lineHeight: "1",
                      position: "absolute",
                      color: "[#FED9E1]",
                      background: "[#60031E]",
                      px: "2",
                      py: "1",
                      borderRadius: "xs",
                      top: "[-10px]",
                      left: "[10px]",
                    })}
                  >
                    {highlighted}
                  </span>
                )}
              </div>
            </OfferOptionLabelOnly>
          );
        })}
      </div>

      <Button
        size="large"
        type="submit"
        className={css({
          background: "[#60031E]",
          color: "white",
        })}
      >
        Weiter
      </Button>
    </form>
  );
}

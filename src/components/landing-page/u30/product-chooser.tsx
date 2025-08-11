"use client";

import { LandingPageOption } from "@/components/landing-page/product-option";
import { u30Coupons } from "@/components/landing-page/u30/coupons";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import type { AnalyticsObject } from "@/lib/analytics";
import { css } from "@/theme/css";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

type BirthYearState =
  | {
      state: "incomplete";
      birthYear: string;
    }
  | {
      state: "tooYoung";
      birthYear: string;
    }
  | {
      state: "tooOld";
      birthYear: string;
    }
  | {
      state: "valid";
      birthYear: string;
      promoCode: string;
    };

function getBirthYear(durationInMonths: number) {
  // get birth year relative to current year and coupon duration
  const currentYear = new Date().getFullYear();
  return currentYear - 31 + durationInMonths / 12;
}

export function U30Chooser({
  analyticsParams,
}: {
  // TODO remove this again when we don't redirect to legacy /angebote
  analyticsParams?: AnalyticsObject;
}) {
  const t = useTranslations("landing.u30");
  const [promoCode, setPromoCode] = useState<BirthYearState>({
    state: "incomplete",
    birthYear: "",
  });

  const minBirthYear = useMemo(
    () => getBirthYear(u30Coupons[0].durationInMonths),
    [u30Coupons]
  );

  const couponsByBirthYear = useMemo(() => {
    return new Map(
      u30Coupons.map(({ durationInMonths, promoCode }) => {
        return [getBirthYear(durationInMonths).toString(), promoCode];
      })
    );
  }, [u30Coupons]);

  const updatePromoCode = (birthYear: string) => {
    if (birthYear.length !== 4) {
      setPromoCode({
        state: "incomplete",
        birthYear,
      });
    } else if (couponsByBirthYear.has(birthYear)) {
      setPromoCode({
        state: "valid",
        birthYear,
        promoCode: couponsByBirthYear.get(birthYear)!,
      });
    } else if (parseInt(birthYear, 10) < minBirthYear) {
      setPromoCode({
        state: "tooOld",
        birthYear,
      });
    } else {
      setPromoCode({
        state: "tooYoung",
        birthYear,
      });
    }
  };

  return (
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
        <LandingPageOption name="product" value="YEARLY" defaultChecked>
          <strong>{t("options.yearly")}</strong> für CHF 99 pro Jahr
        </LandingPageOption>

        <LandingPageOption name="product" value="MONTHLY">
          <strong>{t("options.monthly")}</strong> für CHF 9 pro Monat
        </LandingPageOption>
      </div>

      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          gap: "2",
        })}
      >
        <p className={css({ fontSize: "lg" })}>{t("tellUsYourAge")}</p>

        {promoCode.state === "valid" && (
          <input
            type="hidden"
            name="promo_code"
            value={promoCode.promoCode}
          ></input>
        )}

        <FormField
          name=""
          hideLabel
          label={t("birthYear")}
          value={promoCode.birthYear}
          onChange={(e) => {
            updatePromoCode(e.currentTarget.value);
          }}
          type="number"
          required
        />

        <p>
          {promoCode.state === "tooOld"
            ? t("tooOld")
            : promoCode.state === "tooYoung"
              ? t("tooYoung")
              : ""}
        </p>
      </div>

      <Button type="submit" disabled={promoCode.state === "incomplete"}>
        {t("cta")}
      </Button>
    </form>
  );
}

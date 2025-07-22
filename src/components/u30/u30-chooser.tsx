"use client";

import { u30Coupons } from "@/components/u30/u30-coupons";
import { Button } from "@/components/ui/button";
import { SelectField } from "@/components/ui/form";
import { LandingPageOption } from "@/components/ui/landing-page-radio-option";
import type { AnalyticsObject } from "@/lib/analytics";
import { css } from "@/theme/css";
import { useTranslations } from "next-intl";

export function U30Chooser({
  analyticsParams,
}: {
  // TODO remove this again when we don't redirect to legacy /angebote
  analyticsParams?: AnalyticsObject;
}) {
  const t = useTranslations("landing.u30");

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

      <Button type="submit">{t("cta")}</Button>
    </form>
  );
}

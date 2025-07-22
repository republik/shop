"use client";

import { Button } from "@/components/ui/button";
import { LandingPageOption } from "@/components/ui/landing-page-radio-option";
import type { AnalyticsObject } from "@/lib/analytics";
import { css } from "@/theme/css";
import { useTranslations } from "next-intl";

export function GiftChooser({
  analyticsParams,
}: {
  // TODO remove this again when we don't redirect to legacy /angebote
  analyticsParams?: AnalyticsObject;
}) {
  const t = useTranslations("landing.gifts");

  return (
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
        <LandingPageOption name="package" value="ABO_GIVE" defaultChecked>
          <strong>{t("options.yearly")}</strong> CHF 222
        </LandingPageOption>

        <LandingPageOption name="package" value="ABO_GIVE_MONTHS">
          <strong>{t("options.monthly")}</strong> CHF 48
        </LandingPageOption>
      </div>

      <Button type="submit">{t("cta")}</Button>
    </form>
  );
}

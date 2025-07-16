import { css } from "@/theme/css";
import { visuallyHidden } from "@/theme/patterns";
import { getTranslations } from "next-intl/server";

import { Hero } from "@/components/layout/hero";
import { U30Chooser } from "@/components/u30/u30-chooser";
import { LandingPageLayout } from "@/layouts/landing-page";
import { readAnalyticsParamsFromCookie } from "@/lib/analytics";

export async function generateMetadata() {
  const t = await getTranslations("landing.u30");

  return {
    title: t("title"),
  };
}

export default async function GiftsPage() {
  const t = await getTranslations("landing.u30");

  // TODO remove this again when we don't redirect to legacy /angebote
  const analyticsParams = await readAnalyticsParamsFromCookie();

  return (
    <LandingPageLayout
      className={css({
        background: "[#B4B8AB]",
        "&:has([value='MONTHLY']:checked)": {
          background: "[#F4F9E9]",
        },
      })}
    >
      <Hero>
        <h1 className={visuallyHidden()}>{t("title")}</h1>
        <p className={css({ textStyle: "lead" })}>
          {t.rich("lead", {
            br: () => <br />,
          })}
        </p>
      </Hero>

      <U30Chooser analyticsParams={analyticsParams} />
    </LandingPageLayout>
  );
}

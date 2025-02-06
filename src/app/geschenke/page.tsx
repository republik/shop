import { css } from "@/theme/css";
import { visuallyHidden } from "@/theme/patterns";
import { getTranslations } from "next-intl/server";

import { GiftChooser } from "@/gifts/components/gift-chooser";
import { LandingPageLayout } from "@/layouts/landing-page";
import { Hero } from "@/components/layout/hero";
import { readAnalyticsParamsFromCookie } from "@/lib/analytics";

export async function generateMetadata() {
  const t = await getTranslations("landing.gifts");

  return {
    title: t("title"),
  };
}

export default async function GiftsPage() {
  const t = await getTranslations("landing.gifts");

  // TODO remove this again when we don't redirect to legacy /angebote
  const analyticsParams = await readAnalyticsParamsFromCookie();

  return (
    <LandingPageLayout
      className={css({
        background: "[#B7A5EC]",
        "&:has([value='ABO_GIVE_MONTHS']:checked)": {
          background: "[#EFAC9D]",
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

      <GiftChooser analyticsParams={analyticsParams} />
    </LandingPageLayout>
  );
}

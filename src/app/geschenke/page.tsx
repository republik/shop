import { css } from "@/theme/css";
import { visuallyHidden } from "@/theme/patterns";
import { getTranslations } from "next-intl/server";

import { GiftChooser } from "@/app/geschenke/gift-chooser";
import { Hero } from "@/components/layout/hero";
import { BackLink } from "@/components/ui/links";
import { readAnalyticsParamsFromCookie } from "@/lib/analytics";

export async function generateMetadata() {
  const t = await getTranslations("giftOverview");

  return {
    title: t("title"),
  };
}

export default async function GiftOverview() {
  const t = await getTranslations("giftOverview");

  // TODO remove this again when we don't redirect to legacy /angebote
  const analyticsParams = await readAnalyticsParamsFromCookie();

  return (
    <div
      className={css({
        width: "full",
        maxWidth: "content.narrow",
        mx: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8",
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

      <BackLink href={"/"}>{t("goBack")}</BackLink>
    </div>
  );
}

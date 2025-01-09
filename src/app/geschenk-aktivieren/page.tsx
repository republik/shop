import { css } from "@/theme/css";
import { visuallyHidden } from "@/theme/patterns";
import { getTranslations } from "next-intl/server";

import { GiftChooser } from "@/app/geschenke/gift-chooser";
import { Hero } from "@/components/layout/hero";
import { BackLink } from "@/components/ui/links";
import { readAnalyticsParamsFromCookie } from "@/lib/analytics";
import { cardButton } from "@/components/ui/card-button";
import { token } from "@/theme/tokens";
import Link from "next/link";

export async function generateMetadata() {
  const t = await getTranslations("giftRedeem");

  return {
    title: t("title"),
  };
}

export default async function GiftOverview() {
  const t = await getTranslations("giftRedeem");

  // TODO remove this again when we don't redirect to legacy /angebote
  const analyticsParams = readAnalyticsParamsFromCookie();

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

      <Link
        href="/geschenk-aktivieren/flow"
        type="submit"
        className={cardButton({ visual: "solid" })}
        style={{
          // @ts-expect-error custom css vars
          "--text": token("colors.text"),
          "--cta": token("colors.white"),
        }}
      >
        {t("cta")}
      </Link>

      <p>FAQ …</p>

      <BackLink href={"/"}>{t("goBack")}</BackLink>
    </div>
  );
}

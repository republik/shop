import giftBigSrc from "@/assets/gift-big.svg";
import giftSmallSrc from "@/assets/gift-small.svg";
import { DescriptionItem } from "@/components/landing-page/description-item";
import { U30Chooser } from "@/components/landing-page/u30/product-chooser";
import { Hero } from "@/components/layout/hero";
import { LandingPageLayout } from "@/components/landing-page/page-layout";
import { readAnalyticsParamsFromCookie } from "@/lib/analytics";
import { css } from "@/theme/css";
import { visuallyHidden } from "@/theme/patterns";
import { PiggyBankIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

export async function generateMetadata() {
  const t = await getTranslations("landing.u30");

  return {
    title: t("title"),
  };
}

const styles = {
  yearlyOnly: css({
    display: "block",
    ":has([value='MONTHLY']:checked) &": {
      display: "none",
    },
  }),
  monthlyOnly: css({
    display: "none",
    ":has([value='MONTHLY']:checked) &": {
      display: "block",
    },
  }),
};

export default async function U30LandingPage() {
  const t = await getTranslations("landing.u30");
  const tDescriptionItems = await getTranslations(
    "landing.u30.description.items"
  );

  const getText = (
    tKey: "dialog" | "general" | "briefings" | "disclaimer" | "allTheContent"
  ) =>
    tDescriptionItems.rich(tKey, {
      b: (chunks) => <b>{chunks}</b>,
      p: (chunks) => <p className={css({ mt: "2" })}>{chunks}</p>,
    });

  // TODO remove this again when we don't redirect to legacy /angebote
  const analyticsParams = await readAnalyticsParamsFromCookie();

  return (
    <LandingPageLayout
      className={css({
        background: "[#BCC9E9]",
        "&:has([value='MONTHLY']:checked)": {
          background: "[#C9F086]",
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

      <Image
        className={styles.yearlyOnly}
        src={giftBigSrc}
        width={327}
        height={200}
        alt="Illustration grosses Paket"
      />
      <Image
        className={styles.monthlyOnly}
        src={giftSmallSrc}
        width={327}
        height={200}
        alt="Illustration kleines Paket"
      />

      <U30Chooser analyticsParams={analyticsParams} />

      <ul
        className={css({
          display: "flex",
          flexDirection: "column",
          gap: "2",
          fontSize: "lg",
        })}
      >
        <DescriptionItem icon={<PiggyBankIcon />}>
          {getText("disclaimer")}
        </DescriptionItem>
        <DescriptionItem>{getText("general")}</DescriptionItem>
        <DescriptionItem>{getText("allTheContent")}</DescriptionItem>
        <DescriptionItem>{getText("briefings")}</DescriptionItem>
        <DescriptionItem>{getText("dialog")}</DescriptionItem>
      </ul>
    </LandingPageLayout>
  );
}

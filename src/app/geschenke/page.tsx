import giftBigSrc from "@/assets/gift-big.svg";
import giftSmallSrc from "@/assets/gift-small.svg";
import { GiftChooser } from "@/components/gifts/gift-chooser";
import { Hero } from "@/components/layout/hero";
import { DescriptionItem } from "@/components/overview/description-item";
import { LandingPageLayout } from "@/layouts/landing-page";
import { readAnalyticsParamsFromCookie } from "@/lib/analytics";
import { css } from "@/theme/css";
import { visuallyHidden } from "@/theme/patterns";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

export async function generateMetadata() {
  const t = await getTranslations("landing.gifts");

  return {
    title: t("title"),
  };
}

const styles = {
  yearlyOnly: css({
    display: "block",
    ":has([value='ABO_GIVE_MONTHS']:checked) &": {
      display: "none",
    },
  }),
  monthlyOnly: css({
    display: "none",
    ":has([value='ABO_GIVE_MONTHS']:checked) &": {
      display: "block",
    },
  }),
};

export default async function GiftsPage() {
  const t = await getTranslations("landing.gifts");
  const tDescriptionItems = await getTranslations(
    "landing.gifts.description.items"
  );

  const getText = (tKey: "dialog" | "general" | "briefings" | "goodie") =>
    tDescriptionItems.rich(tKey, {
      b: (chunks) => <b>{chunks}</b>,
      p: (chunks) => <p className={css({ mt: "2" })}>{chunks}</p>,
    });

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

      <GiftChooser analyticsParams={analyticsParams} />

      <ul
        className={css({
          display: "flex",
          flexDirection: "column",
          gap: "2",
          fontSize: "lg",
        })}
      >
        <DescriptionItem>{getText("general")}</DescriptionItem>
        <DescriptionItem>
          <span className={styles.yearlyOnly}>
            {" "}
            {tDescriptionItems.rich("allTheContent", {
              interval: "yearly",
              b: (chunks) => <b>{chunks}</b>,
            })}
          </span>
          <span className={styles.monthlyOnly}>
            {" "}
            {tDescriptionItems.rich("allTheContent", {
              interval: "monthly",
              b: (chunks) => <b>{chunks}</b>,
            })}
          </span>
        </DescriptionItem>
        <DescriptionItem>{getText("briefings")}</DescriptionItem>
        <DescriptionItem>{getText("dialog")}</DescriptionItem>
      </ul>
    </LandingPageLayout>
  );
}

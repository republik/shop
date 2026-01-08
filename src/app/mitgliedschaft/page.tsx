import { DescriptionItem } from "@/components/landing-page/description-item";
import { LandingPageLayout } from "@/components/landing-page/page-layout";
import { Hero } from "@/components/layout/hero";
import { OfferCardPrimary } from "@/components/overview/offer-cards";
import { css } from "@/theme/css";
import { visuallyHidden } from "@/theme/patterns";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("landing.gifts");

  return {
    title: t("title"),
  };
}

export default async function GiftsPage({
  searchParams,
}: {
  searchParams: Promise<{ promo_code?: string }>;
}) {
  const t = await getTranslations("overview");
  const tDescriptionItems = await getTranslations("overview.description.items");
  const { promo_code } = await searchParams;
  const getText = (tKey: Parameters<typeof tDescriptionItems>[0]) =>
    tDescriptionItems.rich(tKey, {
      b: (chunks) => <b>{chunks}</b>,
      p: (chunks) => <p className={css({ mt: "2" })}>{chunks}</p>,
    });

  return (
    <LandingPageLayout
      className={css({
        background: "[#DFD6C7]",
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

      <div className={css({ width: "full" })}>
        <OfferCardPrimary
          offerId="YEARLY"
          color="#324442"
          background="#9CC5B5"
          promoCode={promo_code}
        />
      </div>

      <ul
        className={css({
          display: "flex",
          flexDirection: "column",
          gap: "2",
          fontSize: "lg",
        })}
      >
        <DescriptionItem>{getText("general")}</DescriptionItem>
        <DescriptionItem>{getText("briefings")}</DescriptionItem>
        <DescriptionItem>{getText("dialog")}</DescriptionItem>
        <DescriptionItem>{getText("podcasts")}</DescriptionItem>
        <DescriptionItem>{getText("adFree")}</DescriptionItem>
        <DescriptionItem info={getText("projectRDescription")}>
          {getText("projectR")}
        </DescriptionItem>
      </ul>
    </LandingPageLayout>
  );
}

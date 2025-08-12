import { AboBanner } from "@/components/layout/abo-banner";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/layout/hero";
import { OfferDescription } from "@/components/overview/description";
import { GiftCard, RedeemCard } from "@/components/overview/gift-cards";
import {
  DonationCard,
  OfferCardPrimary,
  OfferGrid,
  OfferGridCompact,
  U30Card,
} from "@/components/overview/offer-cards";
import { css } from "@/theme/css";
import { visuallyHidden } from "@/theme/patterns";
import { getTranslations } from "next-intl/server";

export default async function Home() {
  const t = await getTranslations("overview");

  return (
    <div>
      <AboBanner />
      <div
        className={css({
          background: "[#DFD6C7]",
          py: "16",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16",
        })}
      >
        <Hero>
          <h1 className={visuallyHidden()}>{t("title")}</h1>
          <p className={css({ textStyle: "leadBold" })}>
            {t.rich("lead", {
              br: () => <br />,
            })}
          </p>
          <p className={css({ textStyle: "lead" })}>{t("cta")}</p>
        </Hero>

        <div
          className={css({
            width: "full",
            maxWidth: "content.wide",
            mx: "auto",
          })}
        >
          <OfferGridCompact>
            <OfferCardPrimary
              offerId="YEARLY"
              color="#324442"
              background="#9CC5B5"
            />
            <OfferCardPrimary
              offerId="MONTHLY"
              color="#D1CDD8"
              background="#383654"
              ctaColor="black"
            />
          </OfferGridCompact>
        </div>
        <OfferDescription />
      </div>

      <div
        className={css({
          width: "full",
          maxWidth: "content.wide",
          mx: "auto",
          my: "16",
        })}
      >
        <h2
          className={css({
            textStyle: "h2Sans",
            textAlign: "center",
            marginBlock: "16",
          })}
        >
          {t("more")}
        </h2>
        <OfferGrid>
          <OfferCardPrimary offerId="BENEFACTOR" background="#EFC07A" />
          <U30Card />
          <GiftCard />
          <RedeemCard />
          <DonationCard />
        </OfferGrid>
      </div>
      <Footer />
    </div>
  );
}

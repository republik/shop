import { OfferDescription } from "@/overview/components/description";
import { GiftCard, RedeemCard } from "@/overview/components/gift-cards";
import {
  OfferCardPrimary,
  OfferGrid,
  OfferGridCompact,
} from "@/overview/components/offer-cards";
import { AboBanner } from "@/components/layout/abo-banner";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/layout/hero";
import { readAnalyticsParamsFromCookie } from "@/lib/analytics";
import { css } from "@/theme/css";
import { visuallyHidden } from "@/theme/patterns";
import { getTranslations } from "next-intl/server";

export default async function Home() {
  const t = await getTranslations("overview");

  // TODO remove this again when we don't redirect to legacy /angebote
  const analyticsParams = await readAnalyticsParamsFromCookie();
  const analyticsSearchParams = new URLSearchParams(analyticsParams).toString();

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
          <OfferCardPrimary
            offerId="BENEFACTOR"
            background="#EFC07A"
            redirect={`${process.env.NEXT_PUBLIC_MAGAZIN_URL}/angebote?package=BENEFACTOR&${analyticsSearchParams}`}
          />
          <OfferCardPrimary
            offerId="STUDENT"
            background="#BCC9E9"
            redirect={`${process.env.NEXT_PUBLIC_MAGAZIN_URL}/angebote?package=ABO&userPrice=1&price=14000&reason=Ausbildung&${analyticsSearchParams}`}
          />
          <GiftCard />
          <RedeemCard />
        </OfferGrid>
      </div>
      <Footer />
    </div>
  );
}

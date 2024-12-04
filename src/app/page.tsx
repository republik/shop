import { OfferDescription } from "@/app/(overview)/description";
import { GiftCard, RedeemCard } from "@/app/(overview)/gift";
import {
  OfferCardPrimary,
  OfferGrid,
  OfferGridCompact,
} from "@/app/(overview)/offer";
import { AboBanner } from "@/components/layout/abo-banner";
import { Footer } from "@/components/layout/footer";
import { Logo } from "@/components/logo";
import { css } from "@/theme/css";
import { visuallyHidden } from "@/theme/patterns";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function Home() {
  const t = await getTranslations("overview");
  return (
    <div>
      <AboBanner />
      <div
        className={css({
          background: "[#DFD6C7]",
          pt: "16",
          pb: "12",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16",
        })}
      >
        <div
          className={css({
            width: "full",
            maxWidth: "breakpoint-sm",
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8",
            fontSize: "xl",
          })}
        >
          <Link href={process.env.NEXT_PUBLIC_MAGAZIN_URL} title="Republik">
            <Logo />
          </Link>
          <div className={css({ textAlign: "center" })}>
            <h1 className={visuallyHidden()}>{t("title")}</h1>
            <p className={css({ textStyle: "leadBold" })}>
              {t.rich("lead", {
                br: () => <br />,
              })}
            </p>
            <p className={css({ textStyle: "lead" })}>{t("cta")}</p>
          </div>
        </div>

        <div
          className={css({
            width: "full",
            maxWidth: "maxContentWidth",
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
          maxWidth: "maxContentWidth",
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
            redirect={`${process.env.NEXT_PUBLIC_MAGAZIN_URL}/angebote?package=BENEFACTOR`}
          />
          <OfferCardPrimary
            offerId="STUDENT"
            background="#BCC9E9"
            redirect={`${process.env.NEXT_PUBLIC_MAGAZIN_URL}/angebote?package=ABO&userPrice=1&price=14000&reason=Ausbildung`}
          />
          <GiftCard />
          <RedeemCard />
        </OfferGrid>
      </div>
      <Footer />
    </div>
  );
}

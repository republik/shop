import { OfferCardPrimary, OfferGrid } from "@/app/(overview)/offer";
import { Logo } from "@/components/logo";
import { css } from "@/theme/css";
import Link from "next/link";
import {getTranslations} from "next-intl/server";
import {OfferDescription} from "@/app/(overview)/description";
import {GiftCard, RedeemCard} from "@/app/(overview)/gift";

export default async function Home() {
  const t = await getTranslations("overview");
  return (
    <div>
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
          <div className={css({ textAlign: "center",  px: "6", })}>
            <h2 className={css({ textStyle: "h2Sans", })}>
              {t("lead")}
            </h2>
            <h3>{t("cta")}</h3>
          </div>
        </div>

        <div
          className={css({
            width: "full",
            maxWidth: "breakpoint-lg",
            mx: "auto",
          })}
        >
          <OfferGrid noGap>
            <OfferCardPrimary
              offerId="MONTHLY"
              color="#C2E6D6"
              background="#386447"
            />
            <OfferCardPrimary
              offerId="YEARLY"
              color="#9C0056"
              background="#FFADF7"
            />
          </OfferGrid>
        </div>
        <OfferDescription />
      </div>

      <div
        className={css({
          width: "full",
          maxWidth: "breakpoint-lg",
          mx: "auto",
          mt: "16",
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
          <OfferCardPrimary offerId="BENEFACTOR" background="#FFC266" />
          <OfferCardPrimary offerId="STUDENT" background="#BBC8FF" />
          <GiftCard />
          <RedeemCard />
        </OfferGrid>
      </div>
    </div>
  );
}

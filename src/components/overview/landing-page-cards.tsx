import { OfferCard } from "@/components/overview/offer-cards";
import { css, cx } from "@/theme/css";
import { linkOverlay } from "@/theme/patterns";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import schoolsIllu from "@/assets/landing-page-schools.png";
import institutionsIllu from "@/assets/landing-page-institutions.png";
import firstTimeVotersIllu from "@/assets/landing-page-first-time-voters.png";
import { cardButton } from "@/components/ui/card-button";
import Image, { type StaticImageData } from "next/image";

const titleStyle = css({
  fontSize: "3xl",
  lineHeight: "tight",
  textStyle: "sansSerifBold",
});
const lpBg = "#EFEFEF";

function Illu({ src, hide }: { src: StaticImageData; hide?: boolean }) {
  return (
    <div
      className={css({
        height: `[120px]`,
        py: "2",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...(hide ? { hideBelow: "md" } : {}),
      })}
    >
      <Image src={src} height={120} alt="gift image" />
    </div>
  );
}

export async function SchoolsCard() {
  const tSchools = await getTranslations("overview.schools");

  return (
    <OfferCard id="offer-for-schools" background={lpBg}>
      <Illu src={schoolsIllu} />

      <h2 className={titleStyle}>{tSchools("title")}</h2>

      <p className={css({ flexGrow: 1 })}>{tSchools("info")}</p>

      <div className={css({ mt: "auto" })}>
        <Link
          href="/schulen"
          className={cx(cardButton({ visual: "outline" }), linkOverlay())}
        >
          {tSchools("cta")}
        </Link>
      </div>
    </OfferCard>
  );
}

export async function InstitutionsCard() {
  const tInstitutions = await getTranslations("overview.institutions");

  return (
    <OfferCard id="offer-for-institutions" background={lpBg}>
      <Illu src={institutionsIllu} />

      <h2 className={titleStyle}>{tInstitutions("title")}</h2>

      <p>{tInstitutions("info")}</p>

      <div className={css({ mt: "auto" })}>
        <Link
          href="/institutionen"
          className={cx(cardButton({ visual: "outline" }), linkOverlay())}
        >
          {tInstitutions("cta")}
        </Link>
      </div>
    </OfferCard>
  );
}

export async function FirstTimeVotersCard() {
  const tFirstTimeVoters = await getTranslations("overview.first-time-voters");

  return (
    <OfferCard id="first-time-voters" background={lpBg}>
      <Illu src={firstTimeVotersIllu} />
      <h2 className={titleStyle}>{tFirstTimeVoters("title")}</h2>
      <p>{tFirstTimeVoters("info")}</p>
      <div className={css({ mt: "auto" })}>
        <Link
          href="/erstwaehlerinnen"
          className={cx(cardButton({ visual: "outline" }), linkOverlay())}
        >
          {tFirstTimeVoters("cta")}
        </Link>
      </div>
    </OfferCard>
  );
}

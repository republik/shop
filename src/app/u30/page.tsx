import illuSrc from "@/assets/u30.svg";
import { DescriptionItem } from "@/components/landing-page/description-item";
import { LandingPageLayout } from "@/components/landing-page/page-layout";
import { U30Chooser } from "@/components/landing-page/u30/product-chooser";
import { Hero } from "@/components/layout/hero";
import { css } from "@/theme/css";
import { PiggyBankIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

export async function generateMetadata() {
  const t = await getTranslations("landing.u30");

  return {
    title: t("title"),
  };
}

export default async function U30LandingPage() {
  const t = await getTranslations("landing.u30");
  const tDescriptionItems = await getTranslations(
    "landing.u30.description.items",
  );

  const getText = (tKey: Parameters<typeof tDescriptionItems>[0]) =>
    tDescriptionItems.rich(tKey, {
      b: (chunks) => <b>{chunks}</b>,
      p: (chunks) => <p className={css({ mt: "2" })}>{chunks}</p>,
    });

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
        <h1
          className={css({
            textStyle: "leadTitleSerif",
          })}
        >
          {t("title")}
        </h1>
        <p className={css({ textStyle: "lead" })}>
          {t.rich("lead", {
            br: () => <br />,
          })}
        </p>
      </Hero>

      <Image src={illuSrc} height={200} alt="Illustration" />

      <U30Chooser />

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

      <p className={css({ fontSize: "sm", color: "text.secondary" })}>
        {t("illustrationCredits")}
      </p>
    </LandingPageLayout>
  );
}

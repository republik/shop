import { DescriptionItem } from "@/components/landing-page/description-item";
import { LandingPageLayout } from "@/components/landing-page/page-layout";
import { Hero } from "@/components/layout/hero";
import { css } from "@/theme/css";
import { KeyIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { TallyFormEmbed } from "@/components/landing-page/tally-embed";
import type { Metadata } from "next";
import illu from "@/assets/landing-page-institutions.png";
import Image from "next/image";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("landing.institutionen");

  return {
    title: t("title"),
  };
}

export default async function InstitutionenLandingPage() {
  const t = await getTranslations("landing.institutionen");
  const tDescriptionItems = await getTranslations(
    "landing.institutionen.description.items",
  );
  const getText = (tKey: Parameters<typeof tDescriptionItems>[0]) =>
    tDescriptionItems.rich(tKey, {
      b: (chunks) => <b>{chunks}</b>,
      p: (chunks) => <p className={css({ mt: "2" })}>{chunks}</p>,
    });

  return (
    <LandingPageLayout
      className={css({
        background: "[#F2ECE6]",
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

      <Image src={illu} width={220} loading="eager" alt="illustration" />

      <div
        className={css({
          textAlign: "left",
          width: "full",
          fontSize: "lg",
          mt: "4",
        })}
      >
        <p>{t("intro")}</p>

        <ul
          className={css({
            display: "flex",
            flexDirection: "column",
            gap: "2",
            mt: "2",
            mb: "8",
          })}
        >
          <DescriptionItem icon={<KeyIcon />}>
            {getText("access")}
          </DescriptionItem>
          <DescriptionItem>{getText("price")}</DescriptionItem>
          <DescriptionItem>{getText("general")}</DescriptionItem>
        </ul>

        <p className={css({ fontSize: "md" })}>{t("info")}</p>
      </div>

      <div>
        <p className={css({ textStyle: "heavy" })}>{t("form")}</p>
        <TallyFormEmbed
          url="https://tally.so/embed/yPMQkd?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
          title={t("formtitle")}
        />
      </div>
    </LandingPageLayout>
  );
}

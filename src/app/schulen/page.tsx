import { DescriptionItem } from "@/components/landing-page/description-item";
import { LandingPageLayout } from "@/components/landing-page/page-layout";
import { Faq } from "@/app/schulen/faq";
import { Hero } from "@/components/layout/hero";
import { css } from "@/theme/css";
import { getTranslations } from "next-intl/server";
import { TallyFormEmbed } from "@/components/landing-page/tally-embed";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("landing.schools");

  return {
    title: t("title"),
  };
}

export default async function SchoolsLandingPage() {
  const t = await getTranslations("landing.schools");
  const tDescriptionItems = await getTranslations(
    "landing.schools.description.items",
  );
  const tFaq = await getTranslations("landing.schools.faq");
  const getText = (tKey: Parameters<typeof tDescriptionItems>[0]) =>
    tDescriptionItems.rich(tKey, {
      b: (chunks) => <b>{chunks}</b>,
      p: (chunks) => <p className={css({ mt: "2" })}>{chunks}</p>,
    });

  return (
    <LandingPageLayout
      className={css({
        background: "[#92C5FF]",
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

      <div
        className={css({
          textAlign: "left",
          width: "full",
          md: { fontSize: "lg" },
        })}
      >
        <p>
          {t.rich("intro", {
            b: (chunks) => <b>{chunks}</b>,
          })}
        </p>

        <ul
          className={css({
            display: "flex",
            flexDirection: "column",
            gap: "2",
            mt: "2",
            mb: "8",
          })}
        >
          <DescriptionItem>{getText("general")}</DescriptionItem>
          <DescriptionItem>{getText("audio")}</DescriptionItem>
          <DescriptionItem>{getText("archive")}</DescriptionItem>
        </ul>

        <p className={css({ fontSize: "sm" })}>{t("info")}</p>
      </div>

      <div>
        <p className={css({ textStyle: "heavy" })}>{t("form.intro")}</p>
        <TallyFormEmbed
          url="https://tally.so/embed/b54VOg?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
          title={t("form.title")}
        />
      </div>

      <Faq
        title={tFaq("title")}
        items={[
          {
            question: tFaq("items.ip.question"),
            answer: tFaq("items.ip.answer"),
          },
          {
            question: tFaq("items.price.question"),
            answer: tFaq("items.price.answer"),
          },
          {
            question: tFaq("items.duration.question"),
            answer: tFaq("items.duration.answer"),
          },
          {
            question: tFaq("items.conditions.question"),
            answer: tFaq("items.conditions.answer"),
          },
        ]}
      />
    </LandingPageLayout>
  );
}

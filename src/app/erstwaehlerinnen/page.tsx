import { LandingPageLayout } from "@/components/landing-page/page-layout";
import { Hero } from "@/components/layout/hero";
import { Button } from "@/components/ui/button";
import { css } from "@/theme/css";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import illu from "@/assets/landing-page-first-time-voters.png";
import { Faq } from "@/components/landing-page/faq";
import { CheckIcon, KeyIcon, MapPinIcon } from "lucide-react";
import { DescriptionItem } from "@/components/landing-page/description-item";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("landing.first-time-voters");

  return {
    title: t("title"),
  };
}

export default async function ErstwaehlerinnenLandingPage() {
  const t = await getTranslations("landing.first-time-voters");
  const tFaq = await getTranslations("landing.first-time-voters.faq");

  return (
    <LandingPageLayout className={css({ background: "[#FF9999]" })}>
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
        <p>{t("description")}</p>

        <ul
          className={css({
            display: "flex",
            flexDirection: "column",
            gap: "2",
            mt: "2",
            mb: "8",
          })}
        >
          <DescriptionItem icon={<CheckIcon />}>
            {t("items.age")}
          </DescriptionItem>
          <DescriptionItem icon={<MapPinIcon />}>
            {t("items.location")}
          </DescriptionItem>
        </ul>
      </div>
      <Button asChild size="large">
        <Link href="/erstwaehlerinnen/antrag">{t("cta")}</Link>
      </Button>

      <Faq
        title={tFaq("title")}
        items={[
          {
            question: tFaq("items.ip.question"),
            answer: tFaq.rich("items.ip.answer", {
              overviewLink: (chunks) => (
                <Link
                  href="/"
                  className={css({ textDecoration: "underline" })}
                >
                  {chunks}
                </Link>
              ),
            }),
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
      <div className={css({ display: "flex", flexDirection: "column", gap: "2" })}>
        <p>{tFaq("conclusion")}</p>
        <p>
          {tFaq.rich("conclusionContact", {
            emailLink: (chunks) => (
              <a
                href="mailto:kontakt@republik.ch"
                className={css({ textDecoration: "underline" })}
              >
                {chunks}
              </a>
            ),
          })}
        </p>
      </div>
    </LandingPageLayout>
  );
}

import { css } from "@/theme/css";
import { visuallyHidden } from "@/theme/patterns";
import { getTranslations } from "next-intl/server";

import { LandingPageLayout } from "@/layouts/landing-page";
import { Hero } from "@/components/layout/hero";
import { cardButton } from "@/components/ui/card-button";
import { token } from "@/theme/tokens";
import Link from "next/link";
import { featureFlagEnabled } from "@/lib/env";
import { notFound } from "next/navigation";

export async function generateMetadata() {
  const t = await getTranslations("landing.redeem");

  return {
    title: t("title"),
  };
}

export default async function GiftRedeemPage() {
  if (!(await featureFlagEnabled("gift-redeem"))) {
    return notFound();
  }

  const t = await getTranslations("landing.redeem");

  return (
    <LandingPageLayout className={css({ background: "[#B0B265]" })}>
      <Hero>
        <h1 className={visuallyHidden()}>{t("title")}</h1>
        <p className={css({ textStyle: "lead" })}>
          {t.rich("lead", {
            br: () => <br />,
          })}
        </p>
      </Hero>

      <Link
        href="/angebot/abholen/"
        type="submit"
        className={cardButton({ visual: "solid" })}
        style={{
          // @ts-expect-error custom css vars
          "--text": token("colors.text"),
          "--cta": token("colors.white"),
        }}
      >
        {t("cta")}
      </Link>

      <p>FAQ …</p>
    </LandingPageLayout>
  );
}

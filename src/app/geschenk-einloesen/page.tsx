import { css } from "@/theme/css";
import { visuallyHidden } from "@/theme/patterns";
import { getTranslations } from "next-intl/server";

import { Hero } from "@/components/layout/hero";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import { LandingPageLayout } from "@/components/landing-page/page-layout";
import { featureFlagEnabled } from "@/lib/env";
import { AlertCircleIcon } from "lucide-react";
import { notFound } from "next/navigation";
import Image from "next/image";

import giftOpenSrc from "@/assets/gift-open.svg";

export async function generateMetadata() {
  const t = await getTranslations("landing.redeem");

  return {
    title: t("title"),
  };
}

export default async function GiftRedeemPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
    voucher?: string;
  }>;
}) {
  if (!(await featureFlagEnabled("gift-redeem"))) {
    return notFound();
  }

  const { error, voucher } = await searchParams;

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

      <Image
        src={giftOpenSrc}
        width={140}
        height={140}
        alt="Illustration grosses Paket"
      />

      {error && (
        <Alert variant="info">
          <AlertCircleIcon />
          <AlertTitle>{t("invalidGiftCode.title")}</AlertTitle>

          <AlertDescription>
            {t("invalidGiftCode.description")}
          </AlertDescription>
        </Alert>
      )}

      <form
        action="/angebot/abholen"
        className={css({
          width: "full",
          spaceY: "4",
        })}
      >
        <FormField
          label={t("voucherFieldLabel")}
          name="voucher"
          autoFocus
          required
          placeholder={t("voucherFieldLabel")}
          hideLabel
          className={css({
            textAlign: "center",
            fontWeight: "medium",
          })}
          defaultValue={voucher}
        ></FormField>
        <Button type="submit" size="large">
          {t("cta")}
        </Button>
      </form>

      <p>FAQ …</p>
    </LandingPageLayout>
  );
}

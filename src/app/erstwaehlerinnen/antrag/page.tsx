import { Step } from "@/components/checkout/checkout-step";
import { PersonalInfoFormFirstTimeVoters } from "@/components/checkout/personal-info-form-first-time-voters";
import { UnavailableView } from "@/components/checkout/unavailable-view";
import { CenterContainer } from "@/components/layout/center-container";
import { LoginView } from "@/components/login/login-view";
import { fetchMe } from "@/lib/auth/fetch-me";
import { css } from "@/theme/css";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import heartSrc from "@/assets/heart.svg";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type PageProps = {
  searchParams: Promise<{ success?: string }>;
};

export default async function ErstwaehlerinnenAntragPage({
  searchParams,
}: PageProps) {
  const t = await getTranslations();
  const tFtv = await getTranslations("landing.first-time-voters");

  const { success } = await searchParams;
  const me = await fetchMe();

  if (success === "true") {
    return (
      <CenterContainer
        className={css({ background: "[#FF9999]", flexGrow: 1 })}
      >
        <Image src={heartSrc} width={64} height={64} alt="" />
        <h1 className={css({ textStyle: "h2Sans" })}>
          {tFtv("success.title")}
        </h1>
        <p>{tFtv("success.description")}</p>
        <Button asChild>
          <Link href={`${process.env.NEXT_PUBLIC_MAGAZIN_URL}`}>
            {tFtv("success.action")}
          </Link>
        </Button>
      </CenterContainer>
    );
  }

  if (!me) {
    return (
      <Step
        currentStep={1}
        maxStep={2}
        previousUrl="/erstwaehlerinnen"
        title={t("checkout.loginStep.title")}
      >
        <CenterContainer>
          <LoginView />
        </CenterContainer>
      </Step>
    );
  }

  if (me.activeMembership || me.activeMagazineSubscription) {
    return <UnavailableView reason="hasSubscription" />;
  }

  const hasActiveGrant = me.accessGrants?.some(
    (g) => !g.revokedAt && !g.invalidatedAt,
  );

  if (hasActiveGrant) {
    return <UnavailableView reason="hasAccessGrant" />;
  }

  async function onComplete() {
    "use server";
    redirect("/erstwaehlerinnen/antrag?success=true");
  }

  return (
    <Step
      currentStep={2}
      maxStep={2}
      previousUrl="/erstwaehlerinnen"
      title={t("checkout.personalInfo.title-first-time-voters")}
    >
      <h3 className={css({ fontSize: "md", fontWeight: "medium", mb: "4" })}>
        {t("checkout.personalInfo.intro-first-time-voters")}
      </h3>
      <PersonalInfoFormFirstTimeVoters
        me={me}
        addressRequired={true}
        onComplete={onComplete}
      />
    </Step>
  );
}

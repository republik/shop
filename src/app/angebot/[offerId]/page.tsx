import { Step } from "@/components/checkout/checkout-step";
import { CustomizeOfferView } from "@/components/checkout/customize-offer-view";
import { EmbeddedCheckoutView } from "@/components/checkout/embedded-checkout-view";
import { PersonalInfoForm } from "@/components/checkout/personal-info-form";
import {
  GiftSuccess,
  SubscriptionSuccess,
} from "@/components/checkout/success-view";
import { UnavailableView } from "@/components/checkout/unavailable-view";
import { LoginView } from "@/components/login/login-view";
import { getCheckoutState } from "@/lib/checkout-state";
import { fetchOffer } from "@/lib/offers";
import { expireCheckoutSession } from "@/lib/stripe/server";
import { css } from "@/theme/css";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound, redirect } from "next/navigation";

type PageSearchParams = {
  session_id?: string;
  promo_code?: string;
  donate_option?: string;
  return_from_checkout?: "true";
  step?: string;
};

type PageProps = {
  params: Promise<{ offerId: string }>;
  searchParams: Promise<PageSearchParams>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { offerId } = await params;
  const offer = await fetchOffer(offerId);

  return {
    title: offer?.name,
  };
}

export default async function OfferPage({ params, searchParams }: PageProps) {
  const t = await getTranslations();

  const { offerId } = await params;
  const { step, donate_option, promo_code, return_from_checkout, session_id } =
    await searchParams;

  const checkoutState = await getCheckoutState({
    offerId,
    step: step ?? "???",
    sessionId: session_id,
    promoCode: promo_code,
    donateOption: donate_option,
    returnFromCheckout: return_from_checkout === "true",
  });

  // const afterCheckoutRedirect = return_from_checkout === "true";
  // Early return in case login is needed

  // Max steps are hard-coded until we collect personal info in a separate step from checkout
  const maxStep = 3;

  if (checkoutState.step === "ERROR") {
    if (checkoutState.error === "NOT_FOUND") {
      notFound();
    }

    if (checkoutState.error === "EXPIRED") {
      redirect(`/angebot/${offerId}`);
    }
  }

  if (checkoutState.step === "LOGIN") {
    return (
      <div className={css({ px: "6", py: "4" })}>
        <LoginView />
      </div>
    );
  }

  // TODO: rework

  // redirect to appropriate shtep

  // const gotoParams = new URLSearchParams();
  // if (promo_code) {
  //   gotoParams.set("promo_code", promo_code);
  // }
  // if (donate_option) {
  //   gotoParams.set("donate_option", donate_option);
  // }

  // if (!checkoutSession && step !== "init") {
  //   gotoParams.set("step", "init");
  //   redirect(`/angebot/${offerId}?${gotoParams}`);
  // }

  async function goToOverview() {
    "use server";
    redirect("/");
  }

  if (checkoutState.step === "UNAVAILABLE") {
    return <UnavailableView reason={checkoutState.reason} />;
  }

  if (checkoutState.step === "INITIAL") {
    return (
      <Step
        currentStep={1}
        maxStep={maxStep}
        title={t("checkout.preCheckout.title")}
        goBack={goToOverview}
      >
        <CustomizeOfferView
          offer={checkoutState.offer}
          promoCode={promo_code}
        />
      </Step>
    );
  }

  if (checkoutState.step === "INFO") {
    async function goToCheckout() {
      "use server";
      redirect(`/angebot/${offerId}?session_id=${session_id}`);
    }

    async function resetCheckoutSession() {
      "use server";
      if (checkoutState.checkoutSession) {
        await expireCheckoutSession(
          checkoutState.offer.company,
          checkoutState.checkoutSession.id,
          checkoutState.me?.stripeCustomer?.customerId
        );
      }
      redirect(`/angebot/${offerId}`);
    }

    return (
      <Step
        currentStep={2}
        maxStep={maxStep}
        goBack={resetCheckoutSession}
        title={t("checkout.personalInfo.title")}
      >
        <PersonalInfoForm
          me={checkoutState.me}
          addressRequired={checkoutState.addressRequired}
          onComplete={goToCheckout}
        />
      </Step>
    );
  }

  async function goToInfo() {
    "use server";
    redirect(`/angebot/${offerId}?step=info&session_id=${session_id}`);
  }

  if (checkoutState.step === "PAYMENT") {
    return (
      <Step
        currentStep={3}
        maxStep={maxStep}
        goBack={goToInfo}
        title={t("checkout.checkout.title")}
      >
        <EmbeddedCheckoutView
          company={checkoutState.offer.company}
          clientSecret={checkoutState.checkoutSession.client_secret}
          errors={
            checkoutState.returnFromCheckout
              ? [
                  {
                    title: t("checkout.checkout.failed.title"),
                    description: t("checkout.checkout.failed.description"),
                  },
                ]
              : []
          }
        />
      </Step>
    );
  }

  if (checkoutState.step === "SUCCESS") {
    const isGift = checkoutState.offer.id.startsWith("GIFT_");

    return isGift ? (
      <GiftSuccess
        offer={checkoutState.offer}
        session={checkoutState.checkoutSession}
      />
    ) : (
      <SubscriptionSuccess
        offer={checkoutState.offer}
        session={checkoutState.checkoutSession}
      />
    );
  }

  // We should never end up here
  throw Error();
}

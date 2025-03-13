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
  donation_option?: string;
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
  const {
    step,
    donation_option,
    promo_code,
    return_from_checkout,
    session_id,
  } = await searchParams;

  const checkoutState = await getCheckoutState({
    offerId,
    step: step,
    sessionId: session_id,
    promoCode: promo_code,
    donationOption: donation_option,
    returnFromCheckout: return_from_checkout === "true",
  });

  const buildUrl = (params: {
    sessionId?: string | null;
    step?: string | null;
  }): string => {
    const p = new URLSearchParams();
    if (session_id) {
      p.set("session_id", session_id);
    }
    if (promo_code) {
      p.set("promo_code", promo_code);
    }
    if (donation_option) {
      p.set("donation_option", donation_option);
    }
    if (params.sessionId) {
      p.set("session_id", params.sessionId);
    } else if (params.sessionId === null) {
      p.delete("session_id");
    }
    if (params.step) {
      p.set("step", params.step);
    } else if (params.step === null) {
      p.delete("step");
    }
    return `/angebot/${offerId}?${p}`;
  };

  switch (checkoutState.step) {
    case "ERROR":
      switch (checkoutState.error) {
        case "NOT_FOUND":
          notFound();
        case "EXPIRED":
          redirect(buildUrl({ sessionId: null }));
        default:
          checkoutState.error satisfies never;
      }

    case "LOGIN":
      return (
        <div className={css({ px: "6", py: "4" })}>
          <LoginView />
        </div>
      );

    case "UNAVAILABLE":
      return <UnavailableView reason={checkoutState.reason} />;

    case "INITIAL":
      return (
        <Step
          currentStep={checkoutState.currentStep}
          maxStep={checkoutState.totalSteps}
          title={t("checkout.preCheckout.title")}
          previousUrl={"/"}
        >
          <CustomizeOfferView
            offer={checkoutState.offer}
            promoCode={promo_code}
            onComplete={async ({ sessionId, donationOption }) => {
              "use server";

              // Expire previous checkout session
              if (checkoutState.checkoutSession?.status === "open") {
                await expireCheckoutSession(
                  checkoutState.offer.company,
                  // Note: for some reason, when creating server actions as closure, this gets accessed early, so we need to keep the optional chaining operator on checkoutSession?.id
                  checkoutState.checkoutSession?.id,
                  checkoutState.me?.stripeCustomer?.customerId
                );
              }

              // Construct URL for next step
              const p = new URLSearchParams({
                step: checkoutState.offer.requiresLogin ? "info" : "payment",
                session_id: sessionId,
              });
              if (donationOption) {
                p.set("donation_option", donationOption);
              }
              if (promo_code) {
                p.set("promo_code", promo_code);
              }
              redirect(`/angebot/${offerId}/?${p}`);
            }}
          />
        </Step>
      );

    case "INFO":
      const checkoutStepUrl = buildUrl({
        step: "payment",
        sessionId: checkoutState.checkoutSession.id,
      });

      return (
        <Step
          currentStep={checkoutState.currentStep}
          maxStep={checkoutState.totalSteps}
          previousUrl={buildUrl({})}
          title={t("checkout.personalInfo.title")}
        >
          <PersonalInfoForm
            me={checkoutState.me}
            addressRequired={checkoutState.addressRequired}
            onComplete={async () => {
              "use server";
              redirect(checkoutStepUrl);
            }}
          />
        </Step>
      );

    case "PAYMENT":
      return (
        <Step
          currentStep={checkoutState.currentStep}
          maxStep={checkoutState.totalSteps}
          previousUrl={buildUrl({
            sessionId: checkoutState.checkoutSession.id,
            step: checkoutState.offer.requiresLogin ? "info" : null,
          })}
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

    case "SUCCESS":
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
    default:
      // Make sure all cases are handled
      checkoutState satisfies never;
  }

  // We should never end up here
  throw Error("State not handled");
}

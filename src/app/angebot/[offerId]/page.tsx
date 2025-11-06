import { OfferAvailability } from "#graphql/republik-api/__generated__/gql/graphql";
import { Step } from "@/components/checkout/checkout-step";
import { CheckoutView } from "@/components/checkout/custom-checkout-view";
import { CustomizeOfferView } from "@/components/checkout/customize-offer-view";
import { PersonalInfoForm } from "@/components/checkout/personal-info-form";
import {
  DonationSuccess,
  GiftSuccess,
  SubscriptionSuccess,
  UpgradeSuccess,
} from "@/components/checkout/success-view";
import { UnavailableView } from "@/components/checkout/unavailable-view";
import { CenterContainer } from "@/components/layout/center-container";
import { LoginView } from "@/components/login/login-view";
import { getCheckoutState } from "@/lib/checkout-state";
import { fetchOffer } from "@/lib/offers";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound, redirect } from "next/navigation";

type PageSearchParams = {
  order_id?: string;
  promo_code?: string;
  birthyear?: string;
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
  const { step, promo_code, birthyear, return_from_checkout, order_id } =
    await searchParams;

  const checkoutState = await getCheckoutState({
    offerId,
    step: step,
    orderId: order_id,
    promoCode: promo_code,
    returnFromCheckout: return_from_checkout === "true",
  });

  const buildUrl = (params: {
    orderId?: string | null;
    step?: string | null;
  }): string => {
    const p = new URLSearchParams();
    if (order_id) {
      p.set("order_id", order_id);
    }
    if (promo_code) {
      p.set("promo_code", promo_code);
    }
    if (birthyear) {
      p.set("birthyear", birthyear);
    }
    if (params.orderId) {
      p.set("order_id", params.orderId);
    } else if (params.orderId === null) {
      p.delete("order_id");
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
          redirect(buildUrl({ orderId: null }));
        default:
          checkoutState.error satisfies never;
      }

    case "LOGIN":
      return (
        <CenterContainer>
          <LoginView offer={checkoutState.offer} />
        </CenterContainer>
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
            birthyear={birthyear}
            activeSubscription={checkoutState.me?.activeMagazineSubscription}
            onComplete={async ({ orderId }) => {
              "use server";

              // Construct URL for next step
              const p = new URLSearchParams({
                step: checkoutState.requiresInfo ? "info" : "payment",
                order_id: orderId,
              });

              if (promo_code) {
                p.set("promo_code", promo_code);
              }
              if (birthyear) {
                p.set("birthyear", birthyear);
              }

              redirect(`/angebot/${offerId}/?${p}`);
            }}
          />
        </Step>
      );

    case "INFO":
      const checkoutStepUrl = buildUrl({
        step: "payment",
        orderId: checkoutState.checkoutSession.orderId,
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
            birthyear={birthyear}
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
            orderId: checkoutState.checkoutSession.orderId,
            step: checkoutState.offer.requiresLogin ? "info" : null,
          })}
          title={t("checkout.checkout.title")}
        >
          <CheckoutView
            offer={checkoutState.offer}
            activeSubscription={checkoutState.me?.activeMagazineSubscription}
            checkoutSession={checkoutState.checkoutSession}
          />
        </Step>
      );

    case "SUCCESS":
      const isDonation = checkoutState.offer.id === "DONATION";
      const isGift = checkoutState.offer.id.startsWith("GIFT_");
      const isUpgrade =
        checkoutState.offer.availability === OfferAvailability.Upgradeable ||
        checkoutState.offer.availability ===
          OfferAvailability.UnavailableUpgradePending;

      return isGift ? (
        <GiftSuccess
          offer={checkoutState.offer}
          session={checkoutState.checkoutSession}
        />
      ) : isDonation ? (
        <DonationSuccess
          offer={checkoutState.offer}
          session={checkoutState.checkoutSession}
        />
      ) : isUpgrade ? (
        <UpgradeSuccess
          me={checkoutState.me}
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

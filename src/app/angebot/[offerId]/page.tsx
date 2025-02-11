import { CheckoutView } from "@/components/checkout/checkout-view";
import { PreCheckout } from "@/components/checkout/pre-checkout";
import { Step } from "@/components/checkout/checkout-step";
import {
  GiftSuccess,
  SubscriptionSuccess,
} from "@/components/checkout/success-view";
import { LoginView } from "@/components/login/login-view";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { fetchMe } from "@/lib/auth/fetch-me";
import { fetchOffer } from "@/lib/offers";
import { checkIfUserCanPurchase } from "@/lib/product-purchase-guards";
import { expireCheckoutSession, getCheckoutSession } from "@/lib/stripe/server";
import { css } from "@/theme/css";
import { AlertCircleIcon } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ offerId: string }>;
  searchParams: Promise<{
    price: string;
    session_id?: string;
    promo_code?: string;
    return_from_checkout?: "true";
  }>;
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
  const { session_id, promo_code, return_from_checkout, price } =
    await searchParams;
  const { offerId } = await params;
  const offer = await fetchOffer(offerId, promo_code);

  if (!offer) {
    notFound();
  }

  const { company } = offer;

  const t = await getTranslations();
  const sessionId = session_id;
  const afterCheckoutRedirect = return_from_checkout === "true";
  const me = await fetchMe(company);

  // TODO determine based on future offer fields
  const isGift = offer.id.startsWith("GIFT_");
  const needsLogin = !isGift;

  // Early return in case login is needed
  if (needsLogin && !me) {
    return (
      <div className={css({ px: "6", py: "4" })}>
        <LoginView />
      </div>
    );
  }

  // Max steps are hard-coded until we collect personal info in a separate step from checkout
  const maxStep = 2;

  const checkoutSession = sessionId
    ? await getCheckoutSession(
        company,
        sessionId,
        me?.stripeCustomer?.customerId
      )
    : undefined;

  const canUserBuy = needsLogin
    ? me && checkIfUserCanPurchase(me, offer.id)
    : { available: true };

  async function goToOverview() {
    "use server";
    redirect("/");
  }

  if (!checkoutSession) {
    return (
      <Step
        currentStep={1}
        maxStep={maxStep}
        title={t("checkout.preCheckout.title")}
        goBack={goToOverview}
      >
        {canUserBuy?.available ? (
          <PreCheckout
            offer={offer}
            initialPrice={
              offer.customPrice && price ? Number(price) : undefined
            }
            promoCode={promo_code}
          />
        ) : (
          <Alert variant="info">
            <AlertCircleIcon />
            <AlertTitle>
              {t("checkout.preCheckout.unavailable.title")}
            </AlertTitle>

            <AlertDescription>
              {t(
                `checkout.preCheckout.unavailable.reasons.${canUserBuy?.reason === "hasSubscription" ? "hasSubscription" : "generic"}`
              )}
            </AlertDescription>
            <AlertDescription>
              <Link
                href="/"
                className={css({ textDecoration: "underline", marginTop: "2" })}
              >
                {t("checkout.preCheckout.unavailable.action")}
              </Link>
            </AlertDescription>
          </Alert>
        )}
      </Step>
    );
  }

  async function resetCheckoutSession() {
    "use server";
    if (sessionId) {
      await expireCheckoutSession(
        company,
        sessionId,
        me?.stripeCustomer?.customerId
      );
    }
    redirect(`/angebot/${offerId}`);
  }

  if (checkoutSession?.status === "open" && checkoutSession.client_secret) {
    return (
      <Step
        currentStep={2}
        maxStep={maxStep}
        goBack={resetCheckoutSession}
        title={t("checkout.checkout.title")}
      >
        <CheckoutView
          company={company}
          clientSecret={checkoutSession.client_secret}
          errors={
            afterCheckoutRedirect
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

  if (checkoutSession.status === "complete") {
    return isGift ? (
      <GiftSuccess offer={offer} session={checkoutSession} />
    ) : (
      <SubscriptionSuccess offer={offer} session={checkoutSession} />
    );
  }

  if (checkoutSession.status === "expired") {
    redirect(`/angebot/${offerId}`);
  }

  // We should never end up here
  redirect(`/angebot/${offerId}`);
}

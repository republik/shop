import { CheckoutView } from "@/app/angebot/[slug]/components/checkout-view";
import {
  GiftSuccess,
  SubscriptionSuccess,
} from "@/app/angebot/[slug]/components/success-view";
import { fetchOffer } from "@/app/angebot/[slug]/lib/offers";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { fetchMe } from "@/lib/auth/fetch-me";
import { css } from "@/theme/css";
import { AlertCircleIcon } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { LoginView, StepperSignOutButton } from "./components/login-view";
import { PreCheckout } from "./components/pre-checkout";
import { Step, Stepper, StepperChangeStepButton } from "./components/stepper";
import { checkIfUserCanPurchase } from "./lib/product-purchase-guards";
import { expireCheckoutSession, getCheckoutSession } from "./lib/stripe/server";

type PageProps = {
  params: { slug: string };
  searchParams: {
    price: string;
    session_id?: string;
    promo_code?: string;
    return_from_checkout?: "true";
  };
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const offer = await fetchOffer(params.slug);

  return {
    title: offer?.name,
  };
}

export default async function OfferPage({ params, searchParams }: PageProps) {
  const offer = await fetchOffer(params.slug, searchParams.promo_code);

  if (!offer) {
    notFound();
  }

  const { company } = offer;

  const t = await getTranslations();
  const sessionId = searchParams.session_id;
  const afterCheckoutRedirect = searchParams.return_from_checkout === "true";
  const me = await fetchMe(company);

  // TODO determine based on future offer fields
  const isGift = offer.id.startsWith("GIFT_");
  const needsLogin = !isGift;

  const checkoutSession = sessionId
    ? await getCheckoutSession(
        company,
        sessionId,
        me?.stripeCustomer?.customerId
      )
    : undefined;

  if (checkoutSession?.status === "expired") {
    redirect(params.slug);
  }

  if (checkoutSession?.status === "complete") {
    return isGift ? (
      <GiftSuccess offer={offer} session={checkoutSession} />
    ) : (
      <SubscriptionSuccess offer={offer} session={checkoutSession} />
    );
  }

  const loginStep: Step = {
    name: t("checkout.loginStep.title"),
    detail: me ? (
      <>
        <span>{me.email}</span>
        <StepperSignOutButton />
      </>
    ) : undefined,
    content: <LoginView />,
  };

  async function resetCheckoutSession() {
    "use server";
    if (sessionId) {
      await expireCheckoutSession(
        company,
        sessionId,
        me?.stripeCustomer?.customerId
      );
    }
    redirect(`/angebot/${params.slug}`);
  }

  const canUserBuy = needsLogin
    ? me && checkIfUserCanPurchase(me, offer.id)
    : { available: true };

  const productDetails: Step = {
    name: t("checkout.preCheckout.title"),
    detail: checkoutSession ? (
      <>
        <span data-testid="precheckout-summary">
          {offer.price.currency.toUpperCase()}{" "}
          {(offer.discount
            ? (offer.price.amount - offer.discount.amountOff) / 100
            : offer.price.amount / 100
          ).toFixed(2)}
        </span>
        <StepperChangeStepButton onChange={resetCheckoutSession} />
      </>
    ) : undefined,
    content: canUserBuy?.available ? (
      <PreCheckout
        offer={offer}
        initialPrice={
          offer.customPrice && searchParams.price
            ? Number(searchParams.price)
            : undefined
        }
        promoCode={searchParams.promo_code}
      />
    ) : (
      <Alert variant="info">
        <AlertCircleIcon />
        <AlertTitle>{t("checkout.preCheckout.unavailable.title")}</AlertTitle>

        <AlertDescription>
          {t(
            `checkout.preCheckout.unavailable.reasons.${canUserBuy?.reason === "hasSubscription" ? "hasSubscription" : "generic"}`
          )}
        </AlertDescription>
        <AlertDescription>
          <Link
            href={process.env.NEXT_PUBLIC_MAGAZIN_URL}
            className={css({ textDecoration: "underline", marginTop: "2" })}
          >
            {t("checkout.preCheckout.unavailable.action")}
          </Link>
        </AlertDescription>
      </Alert>
    ),
    disabled: (needsLogin && !me) || checkoutSession?.status === "open",
  };

  const checkoutStep: Step = {
    name: t("checkout.checkout.title"),
    content:
      checkoutSession?.status === "open" && checkoutSession.client_secret ? (
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
      ) : (
        // TODO: log to sentry and render alert
        <p>{t("error.generic")}</p>
      ),
    disabled: (needsLogin && !me) || !checkoutSession,
  };

  const steps: Step[] = needsLogin
    ? [loginStep, productDetails, checkoutStep]
    : [productDetails, checkoutStep];

  return (
    <>
      <h1
        className={css({
          textStyle: "lg",
          fontWeight: "bold",
          borderBottomWidth: "thin",
          borderBottomStyle: "solid",
          borderBottomColor: "text",
          paddingBottom: "4",
          marginBottom: "4",
        })}
      >
        {t("checkout.preCheckout.summary.title", {
          product: offer.name,
        })}
      </h1>
      <Stepper
        currentStep={steps.reduce(
          (acc, step, index) => (!step.disabled ? index : acc),
          0
        )}
        steps={steps}
      />
    </>
  );
}

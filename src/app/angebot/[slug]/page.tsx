import { getSubscriptionsConfiguration } from "@/app/angebot/[slug]/lib/get-config";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { isEligibleForEntryCoupon } from "@/lib/auth/discount-eligability";
import { fetchMe } from "@/lib/auth/fetch-me";
import { css } from "@/theme/css";
import { AlertCircleIcon } from "lucide-react";
import useTranslation from "next-translate/useTranslation";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Checkout, { CHECKOUT_SESSION_ID_COOKIE } from "./components/checkout";
import { LoginView, StepperSignOutButton } from "./components/login-view";
import { PreCheckout } from "./components/pre-checkout";
import { Step, Stepper, StepperChangeStepButton } from "./components/stepper";
import { SUBSCRIPTION_META } from "./lib/config";
import { checkIfUserCanPurchase } from "./lib/product-purchase-guards";
import { initStripe } from "./lib/stripe/server";
import { StripeService } from "./lib/stripe/service";
import type { Metadata, MetadataRoute } from "next";

type PageProps = {
  params: { slug: string };
  searchParams: { price: string; session_id?: string };
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const subscriptionMeta = SUBSCRIPTION_META[params.slug];

  return {
    title: subscriptionMeta?.title,
  };
}

export default async function ProductPage({ params, searchParams }: PageProps) {
  let subscriptionConfig;

  try {
    subscriptionConfig = getSubscriptionsConfiguration(params.slug);
  } catch {}

  if (!subscriptionConfig) {
    notFound();
  }

  const { t } = useTranslation();
  const subscriptionMeta = SUBSCRIPTION_META[params.slug];
  const sessionId =
    searchParams.session_id || cookies().get(CHECKOUT_SESSION_ID_COOKIE)?.value;
  const afterCheckoutRedirect = typeof searchParams.session_id === "string";
  const stripe = initStripe(subscriptionConfig.stripeAccount);
  const [me, checkoutSession, subscriptionData] = await Promise.all([
    fetchMe(),
    sessionId ? stripe.checkout.sessions.retrieve(sessionId) : null,
    StripeService(stripe).getStripeSubscriptionItems(subscriptionConfig),
  ]);

  const loginStep: Step = {
    name: t("checkout:loginStep.title"),
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
    cookies().delete(CHECKOUT_SESSION_ID_COOKIE);
    redirect(`/angebot/${params.slug}`);
  }

  const canUserBuy =
    me &&
    checkIfUserCanPurchase(
      me,
      subscriptionConfig.stripeAccount === "REPUBLIK" ? "MONTHLY" : "YEARLY"
    );

  const productDetails: Step = {
    name: t("checkout:preCheckout.title"),
    detail: checkoutSession ? (
      <>
        <span>
          {checkoutSession.currency?.toUpperCase()}{" "}
          {((checkoutSession?.amount_total || 0) / 100).toFixed(2)}
        </span>
        <StepperChangeStepButton onChange={resetCheckoutSession} />
      </>
    ) : undefined,
    content: canUserBuy?.available ? (
      <PreCheckout
        me={me!}
        subscriptionType={params.slug}
        subscriptionConfig={subscriptionConfig}
        subscriptionMeta={subscriptionMeta}
        stripeSubscriptionItems={{
          ...subscriptionData,
          coupon:
            isEligibleForEntryCoupon(me) && subscriptionData.coupon
              ? subscriptionData.coupon
              : null,
        }}
        initialPrice={
          subscriptionConfig.customPrice && searchParams.price
            ? Number(searchParams.price)
            : undefined
        }
      />
    ) : (
      <Alert variant="info">
        <AlertCircleIcon />
        <AlertTitle>{t("checkout:preCheckout.unavailable.title")}</AlertTitle>
        <AlertDescription>{canUserBuy?.reason}</AlertDescription>
        <AlertDescription>
          <Link
            href={process.env.NEXT_PUBLIC_MAGAZIN_URL}
            className={css({ textDecoration: "underline", marginTop: "2" })}
          >
            {t("checkout:preCheckout.unavailable.action")}
          </Link>
        </AlertDescription>
      </Alert>
    ),
    disabled: !me,
  };

  const checkoutStep: Step = {
    name: t("checkout:checkout.title"),
    content: checkoutSession ? (
      <Checkout
        stripeAccount={subscriptionConfig.stripeAccount}
        session={checkoutSession}
        afterRedirect={afterCheckoutRedirect}
      />
    ) : (
      // TODO: log to sentry and render alert
      <p>{t("error:generic")}</p>
    ),
    disabled: !checkoutSession || checkoutSession.status === "expired",
  };

  const steps: Step[] = [loginStep, productDetails, checkoutStep];

  return (
    <div
      className={css({
        maxWidth: "[calc(100vw - (2 * 1rem))]",
        width: "[510px]",
        mx: "auto",
      })}
    >
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
        {t("checkout:preCheckout.summary.title", {
          product: subscriptionMeta.title,
        })}
      </h1>
      <Stepper
        currentStep={steps.reduce(
          (acc, step, index) => (!step.disabled ? index : acc),
          0
        )}
        steps={steps}
      />
    </div>
  );
}

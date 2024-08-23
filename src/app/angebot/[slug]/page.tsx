import { SubscriptionsMeta, SubscriptionsConfiguration } from "./lib/config";
import { fetchMe } from "@/lib/auth/fetch-me";
import { PreCheckout } from "./components/pre-checkout";
import { Step, Stepper, StepperChangeStepButton } from "./components/stepper";
import Checkout, { CHECKOUT_SESSION_ID_COOKIE } from "./components/checkout";
import { cookies } from "next/headers";
import { initStripe } from "./lib/stripe/server";
import { StripeService } from "./lib/stripe/service";
import { css } from "@/theme/css";
import { redirect } from "next/navigation";
import { LoginView, StepperSignOutButton } from "./components/login-view";
import useTranslation from "next-translate/useTranslation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import Link from "next/link";
import { checkIfUserCanPurchase } from "./lib/product-purchase-guards";
import { isEligibleForEntryCoupon } from "@/lib/auth/discount-eligability";

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { price: string; session_id?: string };
}) {
  const { t } = useTranslation();
  const subscriptionConfig = SubscriptionsConfiguration[params.slug];
  const subscriptionMeta = SubscriptionsMeta[params.slug];
  const sessionId =
    searchParams.session_id || cookies().get(CHECKOUT_SESSION_ID_COOKIE)?.value;
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
        sessionId={checkoutSession.id}
        stripeAccount={subscriptionConfig.stripeAccount}
        clientSecret={checkoutSession.client_secret!}
      />
    ) : (
      // TODO: log to sentry
      <p>Something went wrong…</p>
    ),
    disabled: !checkoutSession,
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

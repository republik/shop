import { CheckoutView } from "@/app/angebot/[slug]/components/checkout-view";
import { SuccessView } from "@/app/angebot/[slug]/components/success-view";
import { CHECKOUT_SESSION_ID_COOKIE } from "@/app/angebot/[slug]/constants";
import { fetchOffer } from "@/app/angebot/[slug]/lib/offers";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { fetchMe } from "@/lib/auth/fetch-me";
import { css } from "@/theme/css";
import { AlertCircleIcon } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { LoginView, StepperSignOutButton } from "./components/login-view";
import { PreCheckout } from "./components/pre-checkout";
import { Step, Stepper, StepperChangeStepButton } from "./components/stepper";
import { checkIfUserCanPurchase } from "./lib/product-purchase-guards";
import { getCheckoutSession } from "./lib/stripe/server";

type PageProps = {
  params: { slug: string };
  searchParams: { price: string; session_id?: string };
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  // @ts-expect-error untyped slug
  const t = await getTranslations(`checkout.products.${params.slug}`);

  return {
    title: t.has("title") ? t("title") : undefined,
  };
}

export default async function ProductPage({ params, searchParams }: PageProps) {
  const offer = await fetchOffer(params.slug);

  if (!offer) {
    notFound();
  }

  const stripeAccount = params.slug === "MONTHLY" ? "REPUBLIK" : "PROJECT_R";

  const t = await getTranslations();
  // @ts-expect-error untyped slug
  const tProduct = await getTranslations(`checkout.products.${params.slug}`);
  const sessionId =
    searchParams.session_id || cookies().get(CHECKOUT_SESSION_ID_COOKIE)?.value;
  const afterCheckoutRedirect = typeof searchParams.session_id === "string";
  const me = await fetchMe();

  const checkoutSession = sessionId
    ? await getCheckoutSession(stripeAccount, sessionId)
    : undefined;

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
    cookies().delete(CHECKOUT_SESSION_ID_COOKIE);
    redirect(`/angebot/${params.slug}`);
  }

  const canUserBuy = me && checkIfUserCanPurchase(me, offer.id);

  const productDetails: Step = {
    name: t("checkout.preCheckout.title"),
    // FIXME: figure out a better check
    detail: sessionId ? (
      <>
        <span>
          {offer?.price?.currency?.toUpperCase()}{" "}
          {((offer?.price?.amount || 0) / 100).toFixed(2)}
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
    disabled: !me,
  };

  const checkoutStep: Step = {
    name: t("checkout.checkout.title"),
    content:
      checkoutSession?.status === "open" && checkoutSession.clientSecret ? (
        <CheckoutView
          stripeAccount={stripeAccount}
          clientSecret={checkoutSession.clientSecret}
          errors={[]}
        />
      ) : checkoutSession?.status === "complete" ? (
        <SuccessView />
      ) : (
        // TODO: log to sentry and render alert
        <p>{t("error.generic")}</p>
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
        {t("checkout.preCheckout.summary.title", {
          product: tProduct("title"),
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

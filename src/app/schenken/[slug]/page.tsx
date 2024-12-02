import { CompanyName } from "#graphql/republik-api/__generated__/gql/graphql";
import { CheckoutView } from "@/app/angebot/[slug]/components/checkout-view";
import { PreCheckout } from "@/app/angebot/[slug]/components/pre-checkout";
import {
  Step,
  Stepper,
  StepperChangeStepButton,
} from "@/app/angebot/[slug]/components/stepper";
import { SuccessView } from "@/app/angebot/[slug]/components/success-view";
import { CHECKOUT_SESSION_ID_COOKIE } from "@/app/angebot/[slug]/constants";
import { fetchOffer } from "@/app/angebot/[slug]/lib/offers";
import {
  expireCheckoutSession,
  getCheckoutSession,
} from "@/app/angebot/[slug]/lib/stripe/server";
import { fetchMe } from "@/lib/auth/fetch-me";
import { css } from "@/theme/css";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

type PageProps = {
  params: { slug: string };
  searchParams: {
    price: string;
    session_id?: string;
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

export default async function GiftOfferPage({
  params,
  searchParams,
}: PageProps) {
  const offer = await fetchOffer(params.slug);

  if (!offer) {
    notFound();
  }

  const { company } = offer;

  const t = await getTranslations();
  const sessionId =
    searchParams.session_id || cookies().get(CHECKOUT_SESSION_ID_COOKIE)?.value;
  const afterCheckoutRedirect = searchParams.return_from_checkout === "true";

  const me = await fetchMe(company);

  const checkoutSession = sessionId
    ? await getCheckoutSession(
        company,
        sessionId,
        me?.stripeCustomer?.customerId
      )
    : undefined;

  // const loginStep: Step = {
  //   name: t("checkout.loginStep.title"),
  //   detail: me ? (
  //     <>
  //       <span>{me.email}</span>
  //       <StepperSignOutButton />
  //     </>
  //   ) : undefined,
  //   content: <LoginView />,
  // };

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

  // const canUserBuy = me && checkIfUserCanPurchase(me, offer.id);

  const productDetails: Step = {
    name: t("checkout.preCheckout.title"),
    detail: checkoutSession ? (
      <>
        <span>
          {offer.price.currency.toUpperCase()}{" "}
          {(offer.discount
            ? (offer.price.amount - offer.discount.amountOff) / 100
            : offer.price.amount / 100
          ).toFixed(2)}
        </span>
        <StepperChangeStepButton onChange={resetCheckoutSession} />
      </>
    ) : undefined,
    content: <PreCheckout offer={offer} />,
    disabled: checkoutSession?.status === "open",
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
      ) : checkoutSession?.status === "complete" ? (
        <SuccessView />
      ) : (
        // TODO: log to sentry and render alert
        <p>{t("error.generic")}</p>
      ),
    disabled: !checkoutSession || checkoutSession.status === "expired",
  };

  const steps: Step[] = [productDetails, checkoutStep];

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
    </div>
  );
}

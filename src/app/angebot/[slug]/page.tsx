import { aboTypesMeta, CheckoutConfig } from "./lib/config";
import { fetchMe } from "@/lib/auth/fetch-me";
import { PreCheckout } from "./components/pre-checkout";
import { Step, Stepper } from "./components/stepper";
import Checkout, { CHECKOUT_SESSION_ID_COOKIE } from "./components/checkout";
import { cookies } from "next/headers";
import { initStripe } from "./lib/stripe/server";
import { StripeService } from "./lib/stripe/service";
import { css } from "@/theme/css";
import { redirect } from "next/navigation";
import { getClient } from "@/lib/graphql/client";
import {
  SignOutDocument,
  MeDocument,
} from "#graphql/republik-api/__generated__/gql/graphql";
import { LoginView } from "./components/login-view";
import useTranslation from "next-translate/useTranslation";

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { price: string };
}) {
  const { t } = useTranslation("shop");
  const aboConfig = CheckoutConfig[params.slug];
  const aboMeta = aboTypesMeta[params.slug];
  const sessionId = cookies().get(CHECKOUT_SESSION_ID_COOKIE)?.value;

  const stripe = initStripe(aboConfig.stripeAccount);
  const [me, checkoutSession, aboData] = await Promise.all([
    fetchMe(),
    sessionId ? stripe.checkout.sessions.retrieve(sessionId) : null,
    StripeService(stripe).getAboTypeData(aboConfig),
  ]);

  // TODO: if checkoutSession could be retrieved, ensure that the checkoutSession
  // is for the correct product received in 'AboData'

  async function logout() {
    "use server";
    const client = getClient();
    await client.request(SignOutDocument);

    const res = await client.request(MeDocument);
    if (res.me === null) {
      redirect(`/angebot/${params.slug}`);
    }
    throw new Error("Everything is broken");
  }

  const loginStep: Step = {
    name: "Konto",
    detail: me ? <span>{me.email}</span> : undefined,
    changeAction: me ? logout : undefined,
    content: <LoginView logoutAction={logout} />,
  };

  async function resetCheckoutSession() {
    "use server";
    cookies().delete(CHECKOUT_SESSION_ID_COOKIE);
    redirect(`/angebot/${params.slug}`);
  }

  const productDetails: Step = {
    name: "Abonnement",
    detail: checkoutSession ? (
      <span>
        {checkoutSession.currency?.toUpperCase()}{" "}
        {((checkoutSession?.amount_total || 0) / 100).toFixed(2)}
      </span>
    ) : undefined,
    changeAction: checkoutSession ? resetCheckoutSession : undefined,
    content: (
      <PreCheckout
        me={me}
        aboType={params.slug}
        aboConfig={aboConfig}
        aboMeta={aboMeta}
        aboData={{
          ...aboData,
          coupon: me?.memberships.length === 0 ? aboData.coupon : null,
        }}
        initialPrice={
          aboConfig.customPrice && searchParams.price
            ? Number(searchParams.price)
            : undefined
        }
      />
    ),
    disabled: !me,
  };

  const checkoutStep: Step = {
    name: "Bezahlen",
    content: checkoutSession ? (
      <Checkout
        sessionId={checkoutSession.id}
        stripeAccount={aboConfig.stripeAccount}
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
          product: aboMeta.title,
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

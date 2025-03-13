import { redeemGiftVoucher } from "@/actions/redeem-gift-voucher";
import { Step } from "@/components/checkout/checkout-step";
import { PersonalInfoForm } from "@/components/checkout/personal-info-form";
import {
  RedeemFailed,
  RedeemSuccess,
} from "@/components/checkout/redeem-result-view";
import { CenterContainer } from "@/components/layout/center-container";
import { LoginView } from "@/components/login/login-view";
import { featureFlagEnabled } from "@/lib/env";
import { getGiftRedeemState } from "@/lib/redeem-gift-state";
import { getTranslations } from "next-intl/server";
import { notFound, redirect } from "next/navigation";

export default async function RedeemGiftPage({
  searchParams,
}: {
  searchParams: Promise<{
    voucher?: string;
    step?: string;
  }>;
}) {
  if (!(await featureFlagEnabled("gift-redeem"))) {
    return notFound();
  }

  const { voucher, step } = await searchParams;
  const t = await getTranslations("checkout");

  const redeemState = await getGiftRedeemState({ step, voucher });

  console.log(redeemState);

  switch (redeemState.step) {
    case "ERROR": {
      switch (redeemState.error) {
        case "VOUCHER_MISSING":
          redirect("/geschenk-einloesen");

        case "VOUCHER_INVALID":
          redirect("/geschenk-einloesen?error=invalid");
        default:
          redeemState.error satisfies never;
      }
    }

    case "LOGIN":
      return (
        <CenterContainer>
          <LoginView />
        </CenterContainer>
      );

    case "LEGACY_CODE":
      return redirect(
        `${process.env.NEXT_PUBLIC_MAGAZIN_URL}/abholen?code=${redeemState.voucher}`
      );

    // case "INITIAL":
    //   return (
    //     <Step
    //       currentStep={redeemState.currentStep}
    //       maxStep={redeemState.totalSteps}
    //       previousUrl="/"
    //       title="Gutschein-Code"
    //     >
    //       <form>
    //         <FormField
    //           label="Gutschein-Code"
    //           type="text"
    //           name="code"
    //           autoFocus
    //         />
    //         <Button type="submit">Einlösen</Button>
    //       </form>
    //     </Step>
    //   );

    case "INFO":
      return (
        <Step
          currentStep={redeemState.currentStep}
          maxStep={redeemState.totalSteps}
          previousUrl={"/geschenk-einloesen"}
          title={t("personalInfo.title")}
        >
          <PersonalInfoForm
            // code={redeemState.voucher}
            me={redeemState.me}
            addressRequired={redeemState.addressRequired}
            onComplete={async () => {
              "use server";
              const redeem = await redeemGiftVoucher(redeemState.voucher);

              console.log(redeem);
              if (redeem.type === "success") {
                redirect(
                  `/angebot/abholen?step=success&voucher=${redeemState.voucher}`
                );
              } else {
                redirect(
                  `/angebot/abholen?step=redeem-failed&voucher=${redeemState.voucher}`
                );
              }
            }}
          />
        </Step>
      );

    case "SUCCESS":
      // TODO: decide what to do with aboType and starting
      return (
        <RedeemSuccess
          // aboType={redeemState.aboType}
          // starting={redeemState.starting}
          email={redeemState.me.email!}
        />
      );

    case "REDEEM_FAILED":
      return <RedeemFailed voucher={redeemState.voucher} />;

    default:
      // Make sure all cases are handled
      redeemState satisfies never;
  }

  redeemState satisfies never;
  // We should never end up here
  throw Error("State not handled");
}

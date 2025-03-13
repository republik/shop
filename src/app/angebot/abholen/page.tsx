import { redeemGiftVoucher } from "@/actions/redeem-gift-voucher";
import { Step } from "@/components/checkout/checkout-step";
import { PersonalInfoForm } from "@/components/checkout/personal-info-form";
import { RedeemSuccess } from "@/components/checkout/success-view";
import { LoginView } from "@/components/login/login-view";
import { featureFlagEnabled } from "@/lib/env";
import { getGiftRedeemState } from "@/lib/redeem-gift-state";
import { css } from "@/theme/css";
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
  const t = await getTranslations("checkout.redeem");

  const redeemState = await getGiftRedeemState({ step, voucher });

  console.log(redeemState);

  switch (redeemState.step) {
    case "ERROR": {
      switch (redeemState.error) {
        case "NO_CODE":
          redirect("/geschenk-einloesen");

        case "CODE_NOT_VALID":
          redirect("/geschenk-einloesen?error=invalid");
        default:
          redeemState.error satisfies never;
      }
    }

    case "LOGIN":
      return (
        <div className={css({ px: "6", py: "4" })}>
          <LoginView />
        </div>
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
          title={t("checkout.personalInfo.title")}
        >
          <p>Hallo {redeemState.me.name}</p>
          <p>CODE {redeemState.voucher}</p>

          <PersonalInfoForm
            // code={redeemState.voucher}
            me={redeemState.me}
            addressRequired={redeemState.addressRequired}
            onComplete={async () => {
              "use server";
              const redeem = await redeemGiftVoucher(redeemState.voucher);

              if (redeem) {
                redirect(`?step=success`);
              } else {
                redirect(`?error=invalid`);
              }
            }}
          />
        </Step>
      );

    case "SUCCESS":
      // TODO: decide what to do with aboType and starting
      return (
        <RedeemSuccess
          // aboType={aboType}
          // starting={starting}

          email={redeemState.me.email!}
        />
      );

    default:
      // Make sure all cases are handled
      redeemState satisfies never;
  }

  redeemState satisfies never;
  // We should never end up here
  throw Error("State not handled");
}

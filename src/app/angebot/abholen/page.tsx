import { ValidateGiftVoucherDocument } from "#graphql/republik-api/__generated__/gql/graphql";
import { LoginStatus } from "@/components/login/login-status";
import { LoginView } from "@/components/login/login-view";
import { RedeemSuccess } from "@/checkout/components/success-view";
import { FormField } from "@/components/ui/form";
import { PersonalInfoForm } from "@/checkout/components/personal-info-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { fetchMe } from "@/lib/auth/fetch-me";
import { getClient } from "@/lib/graphql/client";
import { css } from "@/theme/css";
import { AlertCircleIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import { featureFlagEnabled } from "@/lib/env";

async function validateCode(voucher: string) {
  const gql = await getClient();
  const { data } = await gql.query(ValidateGiftVoucherDocument, {
    voucher,
  });

  return data?.validateGiftVoucher ?? { valid: false, isLegacyVoucher: false };
}

export default async function RedeemGiftPage({
  searchParams,
}: {
  searchParams: Promise<{
    code?: string;
    success?: string;
    aboType?: string;
    starting?: string;
  }>;
}) {
  if (!(await featureFlagEnabled("gift-redeem"))) {
    return notFound();
  }

  const { code, success, aboType, starting } = await searchParams;
  const t = await getTranslations("checkout.redeem");

  const me = await fetchMe();

  if (!me) {
    return (
      <LoginView
        title="Hallooo"
        description="Melden Sie sich mit Ihrer E-Mail-Adresse an, um Ihr Geschenk einzulösen"
      />
    );
  }

  if (success === "true") {
    // TODO: decide what to do with aboType and starting
    return (
      <RedeemSuccess
        // aboType={aboType}
        // starting={starting}

        // @ts-expect-error Email should exist here because how can it not?
        email={me.email}
      />
    );
  }

  // Code Input Form
  if (!code) {
    return (
      <>
        <form>
          <FormField label="Gutschein-Code" type="text" name="code" />

          <Button type="submit">Einlösen</Button>
        </form>
      </>
    );
  }

  // Validate Code
  const { valid, isLegacyVoucher } = await validateCode(code);

  // TODO What if it's a legacy code? Redirect to republik.ch/abholen?code=XYZXYZ

  if (isLegacyVoucher) {
    return redirect(
      `${process.env.NEXT_PUBLIC_MAGAZIN_URL}/abholen?code=${code}`
    );
  }

  // TODO Do we show additional info about the code?

  if (!valid) {
    return (
      <>
        <LoginStatus />
        <Alert variant="info">
          <AlertCircleIcon />
          <AlertTitle>{t("invalidGiftCode.title")}</AlertTitle>

          <AlertDescription>
            {t("invalidGiftCode.description")}
          </AlertDescription>
        </Alert>
        <form>
          <FormField label="Gutschein-Code" type="text" name="code" autoFocus />

          <Button type="submit">Einlösen</Button>
        </form>
      </>
    );
  }

  // Final form to get Info and submit
  return (
    <div>
      <p>Hallo {me.name}</p>
      <p>CODE {code}</p>

      <PersonalInfoForm code={code} me={me} />
    </div>
  );
}

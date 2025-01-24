import { ValidateGiftVoucherDocument } from "#graphql/republik-api/__generated__/gql/graphql";
import { LoginView } from "@/app/angebot/[slug]/components/login-view";
import { PersonalInfoForm } from "@/app/angebot/abholen/components/personal-info-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { fetchMe } from "@/lib/auth/fetch-me";
import { getClient } from "@/lib/graphql/client";
import { css } from "@/theme/css";
import { AlertCircleIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

async function validateCode(voucher: string) {
  const { data } = await getClient().query(ValidateGiftVoucherDocument, {
    voucher,
  });

  return data?.validateGiftVoucher ?? { valid: false, isLegacyVoucher: false };
}

export default async function RedeemGiftPage({
  searchParams: { code },
}: {
  searchParams: { code?: string };
}) {
  const t = await getTranslations("giftRedeem");

  const me = await fetchMe();

  if (!me) {
    return <LoginView />;
  }

  // Code Input Form
  if (!code) {
    return (
      <form>
        <input
          type="text"
          name="code"
          className={css({
            borderWidth: "1px",
            borderColor: "text",
            borderRadius: "sm",
            p: "2",
          })}
        />

        <Button type="submit">GO</Button>
      </form>
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
      <Alert variant="info">
        <AlertCircleIcon />
        <AlertTitle>{t("invalidGiftCode.title")}</AlertTitle>

        <AlertDescription>{t("invalidGiftCode.description")}</AlertDescription>
      </Alert>
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

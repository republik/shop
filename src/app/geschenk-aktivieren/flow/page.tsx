import { LoginView } from "@/app/angebot/[slug]/components/login-view";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { fetchMe } from "@/lib/auth/fetch-me";
import { css } from "@/theme/css";
import { AlertCircleIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";

async function validateCode(code: string) {
  return code.length === 8;
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
  const isCodeValid = await validateCode(code);

  // TODO What if it's a legacy code? Redirect to republik.ch/abholen?code=XYZXYZ

  // TODO Do we show additional info about the code?

  if (!isCodeValid) {
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

      <form>
        <p>[Hier zusätzliche Infos abfragen]</p>

        <input name="code" type="text" hidden readOnly value={code} />
        <Button type="submit">JETZT EINLÖSEN</Button>
      </form>
    </div>
  );
}

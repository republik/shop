import { CenterContainer } from "@/components/layout/center-container";
import { Button } from "@/components/ui/button";
import { css } from "@/theme/css";
import { MessageSquareWarningIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export async function UnavailableView({ reason }: { reason?: string }) {
  const t = await getTranslations();

  return (
    <CenterContainer>
      <MessageSquareWarningIcon
        className={css({
          height: "10",
          width: "10",
        })}
      />
      <h1 className={css({ fontSize: "lg", fontWeight: "bold" })}>
        {t("checkout.preCheckout.unavailable.title")}
      </h1>

      <p className={css({ mb: "4" })}>
        {t(
          `checkout.preCheckout.unavailable.reasons.${
            reason === "hasSubscription" ? "hasSubscription" : "generic"
          }`
        )}
      </p>
      <Button asChild>
        <Link href={`/`}>{t("checkout.preCheckout.unavailable.action")}</Link>
      </Button>
    </CenterContainer>
  );
}

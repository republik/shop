import { Button } from "@/components/ui/button";
import { css } from "@/theme/css";
import { MessageSquareWarningIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

const containerStyle = css({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "4",
  textAlign: "center",
  margin: "auto",
});

export async function UnavailableView({ reason }: { reason?: string }) {
  const t = await getTranslations();

  return (
    <div className={containerStyle}>
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
          `checkout.preCheckout.unavailable.reasons.${reason === "hasSubscription" ? "hasSubscription" : "generic"}`
        )}
      </p>
      <Button asChild>
        <Link href={`/`}>{t("checkout.preCheckout.unavailable.action")}</Link>
      </Button>
    </div>
  );
}

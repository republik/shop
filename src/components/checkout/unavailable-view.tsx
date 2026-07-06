import { CenterContainer } from "@/components/layout/center-container";
import { Button } from "@/components/ui/button";
import { css } from "@/theme/css";
import { MessageSquareWarningIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

const REASON_KEYS = {
  hasSubscription: "checkout.preCheckout.unavailable.reasons.hasSubscription",
  hasAccessGrant: "checkout.preCheckout.unavailable.reasons.hasAccessGrant",
  needsMembershipForDonation:
    "checkout.preCheckout.unavailable.reasons.needsMembershipForDonation",
} as const;

type UnavailableReason = keyof typeof REASON_KEYS;

export async function UnavailableView({ reason }: { reason?: string }) {
  const t = await getTranslations();
  const reasonKey =
    reason && reason in REASON_KEYS
      ? REASON_KEYS[reason as UnavailableReason]
      : "checkout.preCheckout.unavailable.reasons.generic";

  return (
    <CenterContainer>
      <MessageSquareWarningIcon
        className={css({
          height: "10",
          width: "10",
        })}
      />
      <h1 className={css({ textStyle: "h2Sans" })}>
        {t("checkout.preCheckout.unavailable.title")}
      </h1>

      <p className={css({ mb: "4" })}>
        {t(reasonKey)}
      </p>
      <Button asChild>
        <Link href={`/`}>{t("checkout.preCheckout.unavailable.action")}</Link>
      </Button>
    </CenterContainer>
  );
}

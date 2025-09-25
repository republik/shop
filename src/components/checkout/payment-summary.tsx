import { Alert, AlertDescription } from "@/components/ui/alert";
import { useFormatCurrency } from "@/lib/hooks/use-format";
import { css } from "@/theme/css";
import type { CheckoutState } from "@stripe/react-stripe-js/checkout";
import { InfoIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

export function PaymentSummary({
  checkoutState,
  startInfo,
}: {
  checkoutState: CheckoutState;
  startInfo?: ReactNode;
}) {
  const t = useTranslations("checkout.checkout.summary");
  const formatPrice = useFormatCurrency("CHF");

  if (checkoutState.type !== "success") {
    return null;
  }

  const { total, taxAmounts } = checkoutState.checkout;

  return (
    <div>
      <div>{t("amountToPay")}:</div>
      <div
        className={css({
          fontWeight: "medium",
          fontSize: "2xl",
        })}
      >
        {formatPrice(total.total.minorUnitsAmount)}
      </div>

      {startInfo && (
        <div className={css({ mt: "4" })}>
          <Alert>
            <InfoIcon />
            <AlertDescription>{startInfo}</AlertDescription>
          </Alert>
        </div>
      )}

      {taxAmounts?.length ? (
        <div className={css({ fontSize: "sm", color: "text.secondary" })}>
          inkl.{" "}
          {formatPrice(taxAmounts[0].minorUnitsAmount, { displayRappen: true })}{" "}
          {taxAmounts[0].displayName}
        </div>
      ) : null}

      {/* <details>
        <summary>Details</summary>

        {lineItems.map((item) => {
          return (
            <div key={item.id}>
              {item.name} {formatPrice(item.subtotal.minorUnitsAmount)}(
              {item.recurring?.interval ?? "einmalig"})
            </div>
          );
        })}
      </details> */}
    </div>
  );
}

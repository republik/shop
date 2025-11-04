import { AlertDescription } from "@/components/ui/alert";
import { useFormatCurrency } from "@/lib/hooks/use-format";
import { css } from "@/theme/css";
import type { StripeCheckoutValue } from "@stripe/react-stripe-js/checkout";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

export function PaymentSummary({
  checkoutState,
  startInfo,
}: {
  checkoutState: {
    type: "success";
    checkout: StripeCheckoutValue;
  };
  startInfo?: ReactNode;
}) {
  const t = useTranslations("checkout.checkout.summary");
  const formatPrice = useFormatCurrency("CHF");

  if (checkoutState.type !== "success") {
    return null;
  }

  const { total, taxAmounts } = checkoutState.checkout;

  return (
    <div
      className={css({
        background: "background.light",
        borderRadius: "lg",
        p: "4",
        spaceY: "2",
      })}
    >
      <div>
        <h3>{t("amountToPay")}</h3>
        <div
          className={css({
            fontWeight: "medium",
            fontSize: "2xl",
          })}
          data-testid="payment-summary-total-amount"
        >
          {formatPrice(total.total.minorUnitsAmount)}
        </div>
      </div>

      {startInfo && (
        <div
          data-testid="payment-summary-description"
          className={css({
            borderColor: "divider",
            borderTopStyle: "solid",
            borderTopWidth: "1",
            pt: "2",
            fontSize: "md",
          })}
        >
          <AlertDescription>{startInfo}</AlertDescription>
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

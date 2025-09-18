import { useFormatCurrency } from "@/lib/hooks/use-format";
import { css } from "@/theme/css";
import type { CheckoutState } from "@stripe/react-stripe-js/checkout";
import { useTranslations } from "next-intl";

export function PaymentSummary({
  checkoutState,
}: {
  checkoutState: CheckoutState;
}) {
  const t = useTranslations("checkout.checkout.summary");
  const formatPrice = useFormatCurrency("CHF");

  if (checkoutState.type !== "success") {
    return null;
  }

  const { total, lineItems, taxAmounts } = checkoutState.checkout;

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

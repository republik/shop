"use client";
import { useFormatCurrency } from "@/lib/hooks/use-format";
import { css, cx } from "@/theme/css";
import { useTranslations } from "next-intl";
import { type ReactNode, useMemo } from "react";
export interface LineItem {
  type: "OFFER" | "DONATION" | "DISCOUNT";
  label: string;
  amount: number;
  hidden?: boolean;
  duration?: string;
  recurringInterval?: string;
}
interface PricingTableProps {
  currency: string;
  lineItems: LineItem[];
  extraItem?: ReactNode;
}

export function PricingTable({
  currency,
  lineItems,
  extraItem,
}: PricingTableProps) {
  const t = useTranslations();
  const formatPrice = useFormatCurrency(currency);

  const total = useMemo(
    () =>
      lineItems.reduce((acc, item) => {
        return acc + item.amount;
      }, 0),
    [lineItems]
  );

  const futureAmount = useMemo(
    () =>
      lineItems.reduce((sum, item) => {
        if (item.duration !== "once" && item.recurringInterval) {
          return sum + item.amount;
        }
        return sum;
      }, 0),
    [lineItems]
  );

  const recurringInterval = useMemo(
    () => lineItems.find((item) => item.recurringInterval)?.recurringInterval,
    [lineItems]
  );

  const showFuturePriceDescription =
    recurringInterval && total !== futureAmount;

  return (
    <>
      <table
        className={css({
          borderCollapse: "collapse",
          "& th, td": {
            pb: "4",
            // fontSize: "md",
            // fontWeight: "normal",
            // whiteSpace: "nowrap",
          },
          "& th:first-child": {
            width: "full",
            textAlign: "left",
            fontWeight: "medium",
          },
          "& tr > th + td:last-child": {
            textAlign: "right",
            pl: "[1ch]",
            // fontVariantNumeric: "tabular-nums",
          },
          "& tfoot > tr ": {
            fontWeight: "medium",
          },
          "& tfoot > tr:first-child > td,& tfoot > tr > th": {
            borderTopStyle: "solid",
            borderTopWidth: "1px",
            borderColor: "current",
            // fontSize: "lg",
            pt: "4",
            pb: "1",
          },
        })}
      >
        <thead>
          <tr className="sr-only">
            <th scope="col">
              {t("checkout.preCheckout.summary.table.heading.item")}
            </th>

            <th scope="col">
              {t("checkout.preCheckout.summary.table.heading.price")}
            </th>
          </tr>
        </thead>
        <tbody>
          {lineItems.map((item) => (
            <tr
              key={item.label}
              className={cx(item.hidden && "sr-only")}
              data-f={JSON.stringify(item)}
            >
              <th scope="row">{item.label}</th>
              <td>{formatPrice(item.amount)}</td>
            </tr>
          ))}

          {extraItem && (
            <tr>
              <td
                colSpan={2}
                className={css({
                  pl: "0",
                })}
              >
                {extraItem}
              </td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row">
              {t("checkout.preCheckout.summary.table.summary")}
            </th>
            <td data-testid="price-overview-total">{formatPrice(total)}</td>
          </tr>
          <tr>
            <td
              colSpan={2}
              data-testid="price-future-summary"
              className={css({
                fontSize: "sm",
                fontWeight: "normal",
                color: "text.secondary",
                textAlign: "right",
              })}
            >
              {total !== futureAmount
                ? t("checkout.preCheckout.futurePriceDescription", {
                    interval: t(
                      // @ts-expect-error FIXME possibly unknown interval
                      `checkout.preCheckout.intervals.${recurringInterval}`
                    ),
                    intervalAdjective: t(
                      // @ts-expect-error FIXME possibly unknown interval
                      `checkout.preCheckout.intervalsAdjective.${recurringInterval}`
                    ),
                    price: formatPrice(futureAmount),
                  })
                : t("checkout.preCheckout.priceDescription", {
                    interval: t(
                      // @ts-expect-error FIXME possibly unknown interval
                      `checkout.preCheckout.intervals.${recurringInterval}`
                    ),
                  })}
            </td>
          </tr>
        </tfoot>
      </table>
    </>
  );
}

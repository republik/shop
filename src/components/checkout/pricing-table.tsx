"use client";
import { Button } from "@/components/ui/button";
import { isKeyOfValue } from "@/lib/is-key-of-value";
import { useFormatCurrency } from "@/lib/hooks/use-format";
import { css, cx } from "@/theme/css";
import { HandHeartIcon, TicketPercentIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { type ReactNode, useMemo } from "react";
export interface LineItem {
  type: "OFFER" | "DONATION" | "DISCOUNT";
  label: string;
  description?: string;
  info?: string;
  amount: number;
  hidden?: boolean;
  duration?: string;
  repeating?: number;
  recurringInterval?: string;
  onChange?: (item: LineItem) => void;
  onRemove?: (item: LineItem) => void;
}
interface PricingTableProps {
  currency: string;
  lineItems: LineItem[];
  extraItem?: ReactNode;
}

const lineItemIcons = {
  OFFER: null,
  DISCOUNT: TicketPercentIcon,
  DONATION: HandHeartIcon,
} as const;

function SubscriptionPriceSummary({
  currency,
  futureAmount,
  total,
  recurringInterval,
  couponDuration,
  couponRepeating,
}: {
  currency: string;
  futureAmount: number;
  total: number;
  recurringInterval: string;
  couponDuration?: "once" | "forever" | "repeating" | string;
  couponRepeating?: number;
}) {
  const t = useTranslations();
  const formatPrice = useFormatCurrency(currency);

  if (!isKeyOfValue(recurringInterval, ["month", "year"])) {
    return null;
  }

  if (total !== futureAmount) {
    return (
      <>
        {t("checkout.preCheckout.priceDescriptionCouponOnce", {
          interval: t(`checkout.preCheckout.intervals.${recurringInterval}`),
          intervalAdjective: t(
            `checkout.preCheckout.intervalsAdjective.${recurringInterval}`
          ),
          price: formatPrice(futureAmount),
        })}
      </>
    );
  }

  if (couponDuration === "repeating" && couponRepeating) {
    return (
      <>
        {" "}
        {t("checkout.preCheckout.priceDescriptionCouponRepeating", {
          repeating: couponRepeating,
          interval: t(
            `checkout.preCheckout.intervalsPlural.${recurringInterval}`
          ),
          intervalAdjective: t(
            `checkout.preCheckout.intervalsAdjective.${recurringInterval}`
          ),
          price: formatPrice(futureAmount),
        })}
      </>
    );
  }

  return (
    <>
      {t("checkout.preCheckout.priceDescription", {
        interval: t(`checkout.preCheckout.intervals.${recurringInterval}`),
      })}
    </>
  );
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
        if (item.duration === "forever" || item.recurringInterval) {
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

  // One of "once" | "forever" | "repeating"
  const couponDuration = useMemo(() => {
    return lineItems.find((item) => item.duration)?.duration;
  }, [lineItems]);

  const couponRepeating = useMemo(() => {
    return lineItems.find((item) => item.repeating)?.repeating;
  }, [lineItems]);

  return (
    <>
      <table
        className={css({
          borderCollapse: "collapse",
          "& th, td": {
            py: "4",

            verticalAlign: "top",
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
            fontSize: "lg",
            fontWeight: "medium",
          },
          "& tfoot > tr > td": {
            py: "1",
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
          {lineItems.map((item) => {
            const Icon = lineItemIcons[item.type];

            return (
              <tr
                key={item.label}
                className={cx(
                  item.hidden && "sr-only",
                  css({
                    borderColor: "divider",
                    borderTopWidth: 1,
                    _firstOfType: { borderTop: "none" },
                  })
                )}
                data-f={JSON.stringify(item)}
              >
                <th scope="row">
                  <div
                    className={css({
                      fontSize: "lg",
                      display: "flex",
                      gap: "2",
                      alignItems: "center",
                    })}
                  >
                    {Icon && <Icon />}
                    {item.label}
                  </div>

                  {item.description && (
                    <p
                      className={css({
                        fontWeight: "normal",
                        mt: "2",
                      })}
                    >
                      {item.description}
                    </p>
                  )}

                  {item.info && (
                    <p
                      className={css({
                        fontWeight: "normal",
                        color: "text.tertiary",
                        mt: "2",
                        _firstLetter: { textTransform: "uppercase" },
                      })}
                    >
                      {item.info}
                    </p>
                  )}

                  {(item.onChange || item.onRemove) && (
                    <p
                      className={css({
                        display: "flex",
                        gap: "2",
                        mt: "2",
                        color: "text.tertiary",
                        fontWeight: "normal",
                      })}
                    >
                      {item.onChange && (
                        <Button
                          variant="link"
                          type="button"
                          onClick={() => {
                            item.onChange?.(item);
                          }}
                        >
                          {t("checkout.actions.change")}
                        </Button>
                      )}
                      {item.onRemove && (
                        <Button
                          variant="link"
                          type="button"
                          onClick={() => {
                            item.onRemove?.(item);
                          }}
                        >
                          {t("checkout.actions.remove")}
                        </Button>
                      )}
                    </p>
                  )}
                </th>
                <td className={css({ fontSize: "lg", fontWeight: "medium" })}>
                  {formatPrice(item.amount, { displayZeroAmount: false })}
                </td>
              </tr>
            );
          })}

          {extraItem && (
            <tr className="extra">
              <td
                colSpan={2}
                className={css({
                  p: "0",
                })}
              >
                {extraItem}
              </td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row" className={css({ fontSize: "xl" })}>
              {t("checkout.preCheckout.summary.table.summary")}
            </th>
            <td
              data-testid="price-overview-total"
              className={css({
                fontSize: "xl",
              })}
            >
              {formatPrice(total)}
            </td>
          </tr>

          {recurringInterval && (
            <>
              <tr>
                <td
                  colSpan={2}
                  data-testid="price-future-summary"
                  className={css({
                    fontSize: "md",
                    fontWeight: "normal",
                    // color: "text.secondary",
                    textAlign: "right",
                  })}
                >
                  <SubscriptionPriceSummary
                    currency={currency}
                    total={total}
                    futureAmount={futureAmount}
                    recurringInterval={recurringInterval}
                    couponDuration={couponDuration}
                    couponRepeating={couponRepeating}
                  />
                </td>
              </tr>
              <tr>
                <td
                  colSpan={2}
                  className={css({
                    fontSize: "md",
                    fontWeight: "normal",
                    color: "text.tertiary",
                    textAlign: "right",
                  })}
                >
                  {t("checkout.preCheckout.cancelableAnytime")}
                </td>
              </tr>
            </>
          )}
        </tfoot>
      </table>
    </>
  );
}

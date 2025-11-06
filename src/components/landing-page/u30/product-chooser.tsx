"use client";

import { LandingPageOption } from "@/components/landing-page/product-option";
import { U30_COUPONS } from "@/components/landing-page/u30/coupons";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import { css } from "@/theme/css";
import { AlertCircleIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useMemo, useState } from "react";

type BirthYearState =
  | {
      state: "incomplete";
      birthYear: string;
    }
  | {
      state: "tooYoung";
      birthYear: string;
    }
  | {
      state: "tooOld";
      birthYear: string;
    }
  | {
      state: "valid";
      birthYear: string;
      promoCode: string;
    };

function getBirthYear(durationInMonths: number) {
  // get birth year relative to current year and coupon duration
  const currentYear = new Date().getFullYear();
  return currentYear - 31 + durationInMonths / 12;
}

export function U30Chooser({}: {}) {
  const t = useTranslations("landing.u30");
  const [promoCode, setPromoCode] = useState<BirthYearState>({
    state: "incomplete",
    birthYear: "",
  });

  const minBirthYear = useMemo(
    () => getBirthYear(U30_COUPONS[0].durationInMonths),
    [],
  );

  const couponsByBirthYear = useMemo(() => {
    return new Map(
      U30_COUPONS.map(({ durationInMonths, promoCode }) => {
        return [getBirthYear(durationInMonths).toString(), promoCode];
      }),
    );
  }, []);

  const updatePromoCode = (birthYear: string) => {
    if (birthYear.length !== 4) {
      setPromoCode({
        state: "incomplete",
        birthYear,
      });
    } else if (couponsByBirthYear.has(birthYear)) {
      setPromoCode({
        state: "valid",
        birthYear,
        promoCode: couponsByBirthYear.get(birthYear)!,
      });
    } else if (parseInt(birthYear, 10) < minBirthYear) {
      setPromoCode({
        state: "tooOld",
        birthYear,
      });
    } else {
      setPromoCode({
        state: "tooYoung",
        birthYear,
      });
    }
  };

  return (
    <form
      action={`/angebot`}
      method="GET"
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: "8",
        width: "full",
      })}
    >
      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          gap: "2",
        })}
      >
        <LandingPageOption name="product" value="YEARLY" defaultChecked>
          <strong>{t("options.yearly")}</strong> für CHF 99
        </LandingPageOption>

        <LandingPageOption name="product" value="MONTHLY">
          <strong>{t("options.monthly")}</strong> für CHF 9
        </LandingPageOption>
      </div>

      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          gap: "2",
        })}
      >
        {promoCode.state === "valid" && (
          <input
            type="hidden"
            name="promo_code"
            value={promoCode.promoCode}
          ></input>
        )}

        <FormField
          name="birthyear"
          label={t("birthYearLabel")}
          value={promoCode.birthYear}
          onChange={(e) => {
            updatePromoCode(e.currentTarget.value);
          }}
          type="number"
          required
        />

        {promoCode.state === "tooOld" || promoCode.state === "tooYoung" ? (
          <Alert variant="info">
            <AlertCircleIcon />

            <AlertDescription>
              <p>
                {t.rich("notEligible", {
                  br: () => <br />,
                  overviewLink: (chunks) => <Link href="/">{chunks}</Link>,
                })}
              </p>
            </AlertDescription>
          </Alert>
        ) : null}
      </div>

      <Button type="submit" disabled={promoCode.state !== "valid"}>
        {t("cta")}
      </Button>
    </form>
  );
}

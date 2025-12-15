"use client";
import { CenterContainer } from "@/components/layout/center-container";
import { Button } from "@/components/ui/button";
import { css } from "@/theme/css";
import { HeartIcon, TicketXIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
export function RedeemSuccess({
  email,
}: {
  email: string;
  // aboType: string;
  // starting: string;
}) {
  const t = useTranslations("checkout.checkout.success.redeem");

  // const plausible = usePlausible();

  // useEffect(() => {
  //   plausible("Redeem Success", { props: { offer: aboType } });
  // }, [plausible, aboType]);

  return (
    <CenterContainer>
      <HeartIcon
        className={css({
          height: "10",
          width: "10",
          fill: "[#B7A5EC]",
        })}
      />
      <h1 className={css({ textStyle: "h2Sans" })}>{t("title")}</h1>
      <p className={css({ mb: "4" })}>
        {t.rich("description", {
          email: () => (
            <strong data-testid="success-recipient-email">{email}</strong>
          ),
        })}
      </p>
      <Button asChild>
        <Link href={`${process.env.NEXT_PUBLIC_MAGAZIN_URL}`}>
          {t("action")}
        </Link>
      </Button>
    </CenterContainer>
  );
}

export function RedeemFailed({
  voucher,
}: // aboType
// starting
{
  voucher: string;
}) {
  const t = useTranslations("checkout.checkout.failed.redeem");

  return (
    <CenterContainer>
      <TicketXIcon
        className={css({
          height: "10",
          width: "10",
        })}
      />
      <h1 className={css({ textStyle: "h2Sans" })}>{t("title")}</h1>
      <p className={css({ mb: "4" })}>
        {t.rich("description", {
          voucher: () => (
            <strong data-testid="failed-voucher">{voucher}</strong>
          ),
          contactEmail: () => (
            <strong>
              <a
                href={`mailto:kontakt@republik.ch?${new URLSearchParams({
                  subject: t("supportEmailSubject"),
                  body: t("supportEmailBody", { voucher }),
                })
                  .toString()
                  .replaceAll("+", "%20")}`}
              >
                kontakt@republik.ch
              </a>
            </strong>
          ),
        })}
      </p>
      <Button asChild>
        <Link href={`/`}>{t("action")}</Link>
      </Button>
    </CenterContainer>
  );
}

"use client";
import { Button } from "@/components/ui/button";
import useInterval from "@/lib/hooks/use-interval";
import { css } from "@/theme/css";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ComponentPropsWithoutRef, useState } from "react";
import { getMe } from "../action";
import { MagazineSubscriptionStatus } from "#graphql/republik-api/__generated__/gql/graphql";

const CheckCircleIcon = (props: ComponentPropsWithoutRef<"svg">) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" {...props}>
    <path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
  </svg>
);

export function SuccessView() {
  const { t } = useTranslation();
  const router = useRouter();

  const [subscriptionIsActive, setSubscriptionIsActive] = useState(false);

  useInterval(
    () => {
      getMe().then((me) => {
        if (
          me?.activeMagazineSubscription?.status ===
          MagazineSubscriptionStatus.Active
        ) {
          setSubscriptionIsActive(true);
          router.push(process.env.NEXT_PUBLIC_MAGAZIN_URL);
        }
      });
    },
    subscriptionIsActive ? null : 1_000
  );

  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: "4",
        p: "3",
      })}
    >
      <CheckCircleIcon
        className={css({
          height: "16",
          width: "16",
        })}
      />
      <h1
        className={css({
          fontSize: "lg",
          fontWeight: "bold",
        })}
      >
        {t("checkout:success.title")}
      </h1>
      <p> {t("checkout:success.description")}</p>
      <Button asChild className={css({ width: "max" })} loading>
        <Link
          href={`${process.env.NEXT_PUBLIC_MAGAZIN_URL}/einrichten?context=pledge&package=ABO`}
        >
          {t("checkout:success.action")}
        </Link>
      </Button>
    </div>
  );
}

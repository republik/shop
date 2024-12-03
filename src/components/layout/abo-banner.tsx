import {fetchMe} from "@/lib/auth/fetch-me";
import {ArrowRight} from "lucide-react";
import {css} from "@/theme/css";
import Link from "next/link";
import {getTranslations} from "next-intl/server";

export async function AboBanner() {
  const me = await fetchMe();
  if (!me) return null

  const { activeMembership, activeMagazineSubscription } = me
  if (!activeMembership && !activeMagazineSubscription ) return null

  const t = await getTranslations("overview.banner");

  return (
    <div className={css({ textAlign: "center", py: "3", fontWeight: "medium", lineHeight: "[1.2]" })}>
      <p className={css({
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          md: {
            flexDirection: "row",
            gap: "[3px]"
          }
        })}>
        <span>
          {t("status")}
        </span>
        <Link href={''}>
          {t("link")}
          <span className={css({ display: "inline-block", ml: "1", height: "[1rem]" })}><ArrowRight height="140%"/></span>
        </Link>
      </p>
    </div>
  );
}

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { BotIcon } from "lucide-react";
import { css } from "@/theme/css";

export default function NotFound() {
  const t = useTranslations();

  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        placeItems: "center",
        gap: "4",
        margin: "auto",
      })}
    >
      <BotIcon
        className={css({ color: "zinc.800", width: "10", height: "10" })}
      />
      <h1 className={css({ fontSize: "lg" })}>{t("notFound.title")}</h1>
      <Button asChild>
        <Link href="/">{t("notFound.buttonLabel")}</Link>
      </Button>
    </div>
  );
}

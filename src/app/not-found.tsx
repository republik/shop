import Link from "next/link";
import useTranslation from "next-translate/useTranslation";
import { Button } from "@/components/ui/button";
import { BotIcon } from "lucide-react";
import { css } from "@/theme/css";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "4",
      })}
    >
      <BotIcon
        className={css({ color: "zinc.800", width: "10", height: "10" })}
      />
      <h2 className={css({ fontSize: "lg" })}>{t("common:notFound.title")}</h2>
      <Button asChild>
        <Link href="/">{t("common:notFound.buttonLabel")}</Link>
      </Button>
    </div>
  );
}

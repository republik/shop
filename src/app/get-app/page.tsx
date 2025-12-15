import {
  APP_URL_APP_STORE,
  APP_URL_GOOGLE_PLAY,
  AppStoreButtons,
} from "@/components/checkout/app-download";
import { CenterContainer } from "@/components/layout/center-container";
import { Header } from "@/components/layout/header";
import { css } from "@/theme/css";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { userAgent } from "next/server";

export default async function GetApp({}: PageProps<"/get-app">) {
  const h = await headers();
  const { device, os } = userAgent({ headers: h });
  const t = await getTranslations("checkout.checkout.appDownload");

  if (device.type === "mobile" || device.type === "tablet") {
    if (os.name?.match(/^ios$/i)) {
      redirect(APP_URL_APP_STORE);
    }
    if (os.name?.match(/^android/i)) {
      redirect(APP_URL_GOOGLE_PLAY);
    }
  }

  return (
    <>
      <Header />
      <CenterContainer>
        <h1 className={css({ textStyle: "h2Sans" })}>{t("title")}</h1>
        <AppStoreButtons platform={os.name} />
      </CenterContainer>
    </>
  );
}

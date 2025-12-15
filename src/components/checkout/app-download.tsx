import { css } from "@/theme/css";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { userAgent } from "next/server";
import encodeQR from "qr";

import badgeAppStore from "@/assets/badge-app-store.svg";
import badgeGooglePlay from "@/assets/badge-google-play.svg";
import { CenterContainer } from "../layout/center-container";

export const APP_URL_APP_STORE =
  "https://apps.apple.com/ch/app/republik/id1392772910";
export const APP_URL_GOOGLE_PLAY =
  "https://play.google.com/store/apps/details?id=app.republik";

export function AppStoreButtons({
  platform,
}: {
  platform: string | undefined;
}) {
  const ios = !!platform?.match(/^ios$/i);
  const android = !!platform?.match(/^android$/i);

  // Show each button exclusively for its own platform or both

  const badgeStyle = css({
    width: "40",
  });
  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: "4",
      })}
    >
      {(ios || !android) && (
        <Link href={APP_URL_APP_STORE}>
          <Image className={badgeStyle} src={badgeAppStore} alt="App Store" />
        </Link>
      )}
      {(android || !ios) && (
        <Link href={APP_URL_GOOGLE_PLAY}>
          <Image
            className={badgeStyle}
            src={badgeGooglePlay}
            alt="Google Play"
          />
        </Link>
      )}
    </div>
  );
}

const qrSVG = encodeQR(
  new URL("/get-app", process.env.NEXT_PUBLIC_URL).toString(),
  "svg",
  { border: 0 },
);

function QRCode() {
  return (
    <Link href="/get-app">
      <div
        className={css({
          "& svg": {
            width: "40",
            height: "40",
          },
        })}
        dangerouslySetInnerHTML={{ __html: qrSVG }}
      />
    </Link>
  );
}

export async function AppDownload() {
  const t = await getTranslations("checkout.checkout.appDownload");
  const { device, os } = userAgent({ headers: await headers() });

  return (
    <div
      className={css({
        background: "[#EABAFE]",
      })}
    >
      <CenterContainer>
        <h2 className={css({ textStyle: "h2Sans" })}>{t("title")}</h2>
        <p className={css({ textStyle: "body" })}>{t("subtitle")}</p>

        {device.type === "mobile" || device.type === "tablet" ? (
          <AppStoreButtons platform={os.name} />
        ) : (
          <QRCode />
        )}
      </CenterContainer>
    </div>
  );
}

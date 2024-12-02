"use client";

import { css } from "@/theme/css";
import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="de">
      <body>
        <div
          className={css({
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "4",
            textAlign: "center",
          })}
        >
          <h1>Ein Fehler ist aufgetreten.</h1>
          <button onClick={() => reset()}>Seite neu laden</button>
        </div>
      </body>
    </html>
  );
}

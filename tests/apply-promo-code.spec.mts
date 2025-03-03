import { expect, test } from "@playwright/test";
import { getEmailCode } from "./lib/get-email-code.mts";

import { nanoid } from "nanoid";

const key = "YEARLY";
const name = "Jahresmitgliedschaft";

test(`Log in with a new email and apply a promo code to ${key} subscription`, async ({
  page,
}) => {
  const testId = nanoid(5);

  await page.goto(
    `/angebot/${key}?utm_source=test&utm_content=${testId}&promo_code=E2ETEST`
  );

  const testEmail = process.env.TEST_EMAIL_PATTERN?.replace(
    /\{suffix\}/,
    testId
  );

  if (!testEmail) {
    throw new Error("Forget to set TEST_EMAIL_PATTERN");
  }

  await page.getByLabel("E-Mail").fill(testEmail);
  await page.getByRole("button", { name: "Weiter" }).click();

  let code: string | undefined;

  await expect
    .poll(
      async () => {
        code = await getEmailCode(testEmail);
        return code;
      },

      { timeout: 10_000 }
    )
    .toBeDefined();

  // Pause for user to enter OTP from email
  await page.getByLabel("Code").fill(code!);

  await expect(
    page.getByRole("heading", {
      name: "Preisübersicht",
    })
  ).toBeVisible();

  await expect(page.getByTestId("price-overview-total")).toContainText("199");

  // For some reason we need to wait here for some Next.js BS
  await page.waitForTimeout(5000);

  await page.getByRole("button", { name: "Weiter" }).click();

  await expect(
    page.getByRole("heading", {
      name: "Persönliche Angaben",
    })
  ).toBeVisible();

  await page.getByLabel("Vorname").fill("Tester");
  await page.getByLabel("Nachname").fill("Tester");

  await page.getByLabel("Name", { exact: true }).fill("Tester Tester");
  await page.getByLabel("Strasse und Hausnummer").fill("Teststr. 42");
  await page.getByLabel("Postleitzahl").fill("4242");
  await page.getByLabel("Ort").fill("Testort");
  await page.getByLabel("Land").fill("Testland");

  await page.getByRole("button", { name: "Weiter" }).click();

  await expect(
    page.getByRole("heading", {
      name: "Bezahlen",
    })
  ).toBeVisible();

  const stripeFrame = page.frameLocator('[name="embedded-checkout"]');

  await expect(
    stripeFrame.getByTestId("product-summary-total-amount")
  ).toContainText("199");
});

import { test, expect } from "@playwright/test";
import { getEmailCode } from "./lib/get-email-code.mts";

import { nanoid } from "nanoid";
import { PRODUCTS } from "./lib/products.mts";

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
      name,
    })
  ).toBeVisible();

  await expect(
    page.getByRole("rowheader", {
      name: "Sonderangebot",
    })
  ).toBeVisible();
});

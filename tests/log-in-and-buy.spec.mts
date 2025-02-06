import { test, expect } from "@playwright/test";
import { getEmailCode } from "./lib/get-email-code.mts";

import { nanoid } from "nanoid";
import { PRODUCTS } from "./lib/products.mts";

PRODUCTS.forEach(({ key, name }) => {
  test(`Log in with a new email and buy a ${key} subscription`, async ({
    page,
  }) => {
    const testId = nanoid(5);

    await page.goto(`/angebot/${key}?utm_source=test&utm_content=${testId}`);

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

    // For some reason we need to wait here for some Next.js BS
    await page.waitForTimeout(5000);

    await page.getByRole("button", { name: "Kaufen" }).click();

    const stripeFrame = page.frameLocator('[name="embedded-checkout"]');

    await stripeFrame.getByLabel("Vorname").fill("Tester");
    await stripeFrame.getByLabel("Nachname").fill("Tester");

    await stripeFrame
      .getByRole("button", { name: "Mit Karte zahlen" })
      .dispatchEvent("click"); // <- .click() doesn't work because the button is not visible

    await stripeFrame
      .getByPlaceholder("1234 1234 1234")
      .fill("4242424242424242");
    await stripeFrame.getByPlaceholder("MM / JJ").fill("1227");
    await stripeFrame.getByPlaceholder("CVC").fill("123");

    await stripeFrame.getByPlaceholder("Vollständiger Name").fill("Test Test");

    if (key !== "MONTHLY") {
      await stripeFrame.getByPlaceholder("Adresszeile 1").fill("Teststr. 42");
      await stripeFrame.getByPlaceholder("Postleitzahl").fill("4242");
      await stripeFrame.getByPlaceholder("Ort").fill("Testort");
    }

    await stripeFrame.getByRole("checkbox", { name: "Ich stimme" }).check();
    await stripeFrame.getByRole("button", { name: "abonnieren" }).click();

    await expect(
      page.getByRole("heading", { name: "Vielen Dank" })
    ).toBeVisible({
      timeout: 20_000,
    });
  });
});

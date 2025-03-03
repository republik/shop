import { test, expect } from "@playwright/test";
import { getEmailCode } from "./lib/get-email-code.mts";

import { nanoid } from "nanoid";
import { GIFTS } from "./lib/products.mts";

GIFTS.forEach(({ offerId }) => {
  test(`Buy a ${offerId} gift`, async ({ page }) => {
    const testId = nanoid(5);

    const testEmail = process.env.TEST_EMAIL_PATTERN?.replace(
      /\{suffix\}/,
      testId
    );

    if (!testEmail) {
      throw new Error("Forget to set TEST_EMAIL_PATTERN");
    }

    await page.goto(
      `/angebot/${offerId}?utm_source=test&utm_content=${testId}`
    );

    await page.getByRole("button", { name: "Kaufen" }).click();

    const stripeFrame = page.frameLocator('[name="embedded-checkout"]');
    // Payment info
    await stripeFrame
      .getByRole("button", { name: "Mit Karte zahlen" })
      .dispatchEvent("click"); // <- .click() doesn't work because the button is not visible

    await stripeFrame
      .getByPlaceholder("1234 1234 1234")
      .fill("4242424242424242");
    await stripeFrame.getByPlaceholder("MM / JJ").fill("1227");
    await stripeFrame.getByPlaceholder("CVC").fill("123");

    // Shipping address
    await stripeFrame.getByLabel("E-Mail").fill(testEmail);
    await stripeFrame.getByPlaceholder("Vollständiger Name").fill("Test Test");
    await stripeFrame.getByPlaceholder("Adresszeile 1").fill("Teststr. 42");
    await stripeFrame.getByPlaceholder("Postleitzahl").fill("4242");
    await stripeFrame.getByPlaceholder("Ort").fill("Testort");

    await stripeFrame.getByRole("checkbox", { name: "Ich stimme" }).check();
    await stripeFrame.getByTestId("hosted-payment-submit-button").click();

    await expect(
      page.getByRole("heading", { name: "Vielen Dank" })
    ).toBeVisible({
      timeout: 20_000,
    });

    expect(
      await page.getByTestId("success-recipient-email").innerText()
    ).toEqual(testEmail);
  });
});

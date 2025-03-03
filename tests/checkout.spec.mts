import { test, expect } from "@playwright/test";
import { getEmailCode } from "./lib/get-email-code.mts";

import { nanoid } from "nanoid";
import { PRODUCTS } from "./lib/products.mts";

PRODUCTS.forEach(
  ({ id, offerId, promoCode, expectedAmount, requiresAddress }) => {
    test(`Buy a ${id} subscription `, async ({ page }) => {
      const testId = nanoid(5);

      const params = new URLSearchParams();
      params.set("utm_source", "test");
      params.set("utm_content", testId);
      if (promoCode) {
        params.set("promo_code", promoCode);
      }

      await page.goto(`/angebot/${offerId}?${params}`);

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

      await expect(page.getByTestId("price-overview-total")).toContainText(
        expectedAmount
      );

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

      if (requiresAddress) {
        await page.getByLabel("Strasse und Hausnummer").fill("Teststr. 42");
        await page.getByLabel("Postleitzahl").fill("4242");
        await page.getByLabel("Ort").fill("Testort");
        await page.getByLabel("Land").fill("Testland");
      }

      await page.getByRole("button", { name: "Weiter" }).click();

      await expect(
        page.getByRole("heading", {
          name: "Bezahlen",
        })
      ).toBeVisible();

      const stripeFrame = page.frameLocator('[name="embedded-checkout"]');

      await expect(
        stripeFrame.getByTestId("product-summary-total-amount")
      ).toContainText(expectedAmount);

      await stripeFrame
        .getByRole("button", { name: "Mit Karte zahlen" })
        .dispatchEvent("click"); // <- .click() doesn't work because the button is not visible

      await stripeFrame
        .getByPlaceholder("1234 1234 1234")
        .fill("4242424242424242");
      await stripeFrame.getByPlaceholder("MM / JJ").fill("1227");
      await stripeFrame.getByPlaceholder("CVC").fill("123");

      await stripeFrame
        .getByPlaceholder("Vollständiger Name")
        .fill("Test Test");

      await stripeFrame.getByRole("checkbox", { name: "Ich stimme" }).check();
      await stripeFrame.getByRole("button", { name: "abonnieren" }).click();

      await expect(
        page.getByRole("heading", { name: "Vielen Dank" })
      ).toBeVisible({
        timeout: 20_000,
      });
    });
  }
);

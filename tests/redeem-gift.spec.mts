import test, { expect } from "@playwright/test";
import { nanoid } from "nanoid";
import { getEmailGiftVoucher } from "./lib/get-email-gift-voucher.mts";
import { getTestEmailAddress } from "./lib/get-test-email-address.mts";
import { login } from "./lib/login.mts";
import { GIFTS } from "./lib/products.mjs";

GIFTS.forEach(({ id, offerId, expectedAmount, requiresAddress }) => {
  test(`Buy and redeem a ${id}`, async ({ browser }) => {
    const voucher = await test.step("Buy", async () => {
      const testId = nanoid(5);
      const testEmail = getTestEmailAddress(testId);
      const ctx = await browser.newContext();
      const page = await ctx.newPage();

      const params = new URLSearchParams();
      params.set("utm_source", "test");
      params.set("utm_content", testId);
      await page.goto(`/angebot/${offerId}?${params}`);

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
          name: "Bezahlen",
        })
      ).toBeVisible();

      const stripeFrame = page.frameLocator('[name="embedded-checkout"]');

      await expect(
        stripeFrame.getByTestId("product-summary-total-amount")
      ).toContainText(expectedAmount);

      await stripeFrame.getByLabel("E-Mail").fill(testEmail);

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
      await stripeFrame.getByTestId("hosted-payment-submit-button").click();

      await expect(
        page.getByRole("heading", { name: "Vielen Dank" })
      ).toBeVisible({
        timeout: 20_000,
      });

      let voucher: string | undefined;
      await expect
        .poll(
          async () => {
            voucher = await getEmailGiftVoucher(testEmail);
            return voucher;
          },

          { timeout: 20_000 }
        )
        .toBeDefined();

      return voucher;
    });

    await test.step("Redeem", async () => {
      const testId = nanoid(5);
      const testEmail = getTestEmailAddress(testId);
      const ctx = await browser.newContext();
      const page = await ctx.newPage();

      await page.goto(`/geschenk-einloesen`);

      expect(voucher).toBeDefined();
      await page.getByLabel("Code").fill(voucher!);

      await page.getByRole("button", { name: "einlösen" }).click();

      await login(page, testEmail);

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
        page.getByRole("heading", { name: "Herzlichen Glückwunsch" })
      ).toBeVisible({
        timeout: 20_000,
      });
    });
  });
});

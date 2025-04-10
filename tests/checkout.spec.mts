import { expect, test } from "@playwright/test";
import { nanoid } from "nanoid";
import { getTestEmailAddress } from "./lib/get-test-email-address.mts";
import { login } from "./lib/login.mts";
import { PRODUCTS } from "./lib/products.mts";

PRODUCTS.forEach(
  ({
    id,
    offerId,
    promoCode,
    expectedAmount,
    requiresAddress,
    requiresLogin,
    donationOption,
    discountOption,
  }) => {
    test(`Buy a ${id} subscription `, async ({ page }) => {
      const testId = nanoid(5);
      const testEmail = getTestEmailAddress(testId);

      const params = new URLSearchParams();
      params.set("utm_source", "test");
      params.set("utm_content", testId);
      if (promoCode) {
        params.set("promo_code", promoCode);
      }
      await page.goto(`/angebot/${offerId}?${params}`);

      if (requiresLogin) {
        await login(page, testEmail);
      }

      await expect(
        page.getByRole("heading", {
          name: "Preisübersicht",
        })
      ).toBeVisible();

      // Wait until Next.js has hydrated the page and all client side-scripts / server actions are available
      await page.waitForLoadState("load");

      if (donationOption) {
        await page.getByRole("button", { name: "Optionen anzeigen" }).click();

        await page.getByRole("radio", { name: donationOption.name }).click();
        await expect(page.getByLabel(donationOption.name)).toBeChecked();

        // Reset form
        await page.getByRole("button", { name: "Zurücksetzen" }).click();
        await page.getByRole("button", { name: "Optionen anzeigen" }).click();
        await expect(page.getByLabel(donationOption.name)).not.toBeChecked();

        // Select again
        await page.getByRole("radio", { name: donationOption.name }).click();
        await expect(page.getByLabel(donationOption.name)).toBeChecked();

        if (donationOption.amount) {
          await page
            .getByLabel("Betrag", { exact: true }) // This is the input field for the custom amount
            .fill(donationOption.amount);
        }
      }

      if (discountOption) {
        await page.getByLabel("Begründung").fill(discountOption.reason);
        await page.getByRole("radio", { name: discountOption.name }).click();
        await expect(page.getByLabel(discountOption.name)).toBeChecked();
      }

      await expect(page.getByTestId("price-overview-total")).toContainText(
        expectedAmount
      );

      await page.getByRole("button", { name: "Weiter" }).click();

      if (requiresLogin) {
        await expect(
          page.getByRole("heading", {
            name: "Persönliche Angaben",
          })
        ).toBeVisible();

        // Navigate 1 step back and check if the price is still the same, then proceed again
        await page.getByRole("link", { name: "Zurück" }).click();
        await expect(page.getByTestId("price-overview-total")).toContainText(
          expectedAmount
        );
        await page.getByRole("button", { name: "Weiter" }).click();

        // OK, we should be back here
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
      }

      await expect(
        page.getByRole("heading", {
          name: "Bezahlen",
        })
      ).toBeVisible();

      const stripeFrame = page.frameLocator('[name="embedded-checkout"]');

      await expect(
        stripeFrame.getByTestId("product-summary-total-amount")
      ).toContainText(expectedAmount);

      if (!requiresLogin) {
        await stripeFrame.getByLabel("E-Mail").fill(testEmail);
      }

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
    });
  }
);

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
    futureAmount,
    futurePriceDescription,
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
          name: "Überprüfen Sie Ihre Wahl",
        })
      ).toBeVisible();

      // Wait until Next.js has hydrated the page and all client side-scripts / server actions are available
      await page.waitForLoadState("load");

      if (donationOption) {
        await page.getByRole("button", { name: "Optionen anzeigen" }).click();

        if (donationOption.interval) {
          await page
            .getByRole("radio", { name: donationOption.interval })
            .click();
        }

        if ("name" in donationOption) {
          await page.getByRole("button", { name: donationOption.name }).click();

          // Reset form
          await page.getByRole("button", { name: "Ändern" }).click();

          // Select again
          await page.getByRole("button", { name: donationOption.name }).click();
        } else {
          await page
            .getByLabel("Eigener Betrag") // This is the input field for the custom amount
            .fill(donationOption.amount);
          await page.getByRole("button", { name: "Wählen" }).click();
        }
      }

      if (discountOption) {
        await page
          .getByRole("button", { name: "Vergünstigung wählen" })
          .click();

        await page.getByLabel("Begründung").fill(discountOption.reason);
        await page.getByRole("button", { name: discountOption.name }).click();
      }

      await expect(page.getByTestId("price-overview-total")).toContainText(
        expectedAmount
      );

      if (futureAmount) {
        await expect(page.getByTestId("price-future-summary")).toContainText(
          futureAmount
        );
      }

      if (futurePriceDescription) {
        await expect(page.getByTestId("price-future-summary")).toContainText(
          futurePriceDescription
        );
      }

      await page.getByRole("button", { name: "Weiter" }).click();

      if (requiresLogin) {
        await expect(
          page.getByRole("heading", {
            name: "Vervollständigen Sie Ihre Angaben",
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
            name: "Vervollständigen Sie Ihre Angaben",
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

      if (futureAmount) {
        await expect(
          stripeFrame.getByTestId("product-summary-description")
        ).toContainText(futureAmount);
      }

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

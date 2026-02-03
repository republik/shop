import { expect, type Page, test } from "@playwright/test";
import { nanoid } from "nanoid";
import { getTestEmailAddress } from "./lib/get-test-email-address.mts";
import { login } from "./lib/login.mts";
import { PRODUCTS, UPGRADES, type ProductTest } from "./lib/products.mts";

PRODUCTS.forEach((product) => {
  test(`Buy a ${product.id} subscription`, async ({ page }) => {
    await checkout({ testId: nanoid(5), product, page });
  });
});

UPGRADES.forEach(({ id, from, to }) => {
  test(`Buy a ${id} upgrade`, async ({ page }) => {
    test.slow();

    const testId = nanoid(5);

    await test.step(`Buy ${from.id}`, async () => {
      await checkout({ testId, product: from, page });
    });

    await test.step(`Wait for subscription to be active`, async () => {
      await expect(page.getByRole("link", { name: "Zum Magazin" })).toBeVisible(
        {
          timeout: 20_000,
        },
      );
    });

    await test.step(`Buy ${to.id}`, async () => {
      await checkout({ testId, product: to, page, loggedIn: true });
    });
  });
});

async function checkout({
  testId,
  product,
  page,
  loggedIn,
}: {
  testId: string;
  product: ProductTest;
  page: Page;
  loggedIn?: boolean;
}) {
  const {
    offerId,
    promoCode,
    expectedAmount,
    recurringAmount,
    recurringPriceDescription,
    paymentSummaryAmount,
    paymentSummaryDescription,
    requiresAddress,
    requiresLogin,
    donationOption,
    discountOption,
  } = product;

  const testEmail = getTestEmailAddress(testId);

  const params = new URLSearchParams();
  params.set("utm_source", "test");
  params.set("utm_content", testId);
  if (promoCode) {
    params.set("promo_code", promoCode);
  }
  await page.goto(`/angebot/${offerId}?${params}`);

  if (requiresLogin && !loggedIn) {
    await login(page, testEmail);
  }

  await expect(
    page.getByRole("heading", {
      name: "Überprüfen Sie Ihre Wahl",
    }),
  ).toBeVisible();

  // Wait until Next.js has hydrated the page and all client side-scripts / server actions are available
  await page.waitForLoadState("load");

  if (donationOption) {
    await page.getByRole("button", { name: "Optionen anzeigen" }).click();

    if (donationOption.interval) {
      await page.getByRole("radio", { name: donationOption.interval }).click();
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
    await page.getByRole("button", { name: "Vergünstigung wählen" }).click();

    await page.getByLabel("Begründung").fill(discountOption.reason);
    await page.getByRole("button", { name: discountOption.name }).click();
  }

  await expect(page.getByTestId("price-overview-total")).toContainText(
    expectedAmount,
  );

  if (recurringAmount) {
    await expect(page.getByTestId("price-future-summary")).toContainText(
      recurringAmount,
    );
  }

  if (recurringPriceDescription) {
    await expect(page.getByTestId("price-future-summary")).toContainText(
      recurringPriceDescription,
    );
  }

  await page.getByRole("button", { name: "Weiter" }).click();

  if (requiresLogin) {
    await expect(
      page.getByRole("heading", {
        name: "Vervollständigen Sie Ihre Angaben",
      }),
    ).toBeVisible();

    // Navigate 1 step back and check if the price is still the same, then proceed again
    await page.getByRole("link", { name: "Zurück" }).click();
    await expect(page.getByTestId("price-overview-total")).toContainText(
      expectedAmount,
    );
    await page.getByRole("button", { name: "Weiter" }).click();

    // OK, we should be back here
    await expect(
      page.getByRole("heading", {
        name: "Vervollständigen Sie Ihre Angaben",
      }),
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
      level: 1,
      name: "Bezahlen",
    }),
  ).toBeVisible();

  await expect(page.getByTestId("payment-summary-total-amount")).toContainText(
    paymentSummaryAmount ?? expectedAmount,
  );

  if (paymentSummaryDescription) {
    await expect(page.getByTestId("payment-summary-description")).toContainText(
      paymentSummaryDescription,
    );
  }

  const stripeFrame = page.frameLocator(".StripeElement iframe");

  if (!requiresLogin) {
    await stripeFrame.getByLabel("E-Mail").fill(testEmail);
  }

  await stripeFrame.getByRole("button", { name: "Karte" }).click();

  await stripeFrame.getByLabel("Kartennummer").fill("4242424242424242");
  await stripeFrame.getByLabel("Ablaufdatum").fill("1227");
  await stripeFrame.getByLabel("Sicherheitscode").fill("123");

  await page.getByRole("checkbox", { name: "Ich bin mit" }).check();
  await page.getByRole("button", { name: "Bezahlen" }).click();

  await expect(page.getByTestId("checkout-success-action")).toBeVisible({
    timeout: 20_000,
  });
}

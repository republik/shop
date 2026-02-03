import test, { expect } from "@playwright/test";

import { PRODUCTS } from "./lib/products.mts";

const productsWithLandingPage = PRODUCTS.filter((p) => p.landingPagePath);

productsWithLandingPage.forEach(
  ({ id, offerId, landingPagePath, promoCode, expectedAmount }) => {
    const params = new URLSearchParams();
    if (promoCode) {
      params.set("promo_code", promoCode);
    }

    test(`${id} ${offerId} is on landing page and displays the correct price`, async ({
      page,
    }) => {
      await page.goto(`${landingPagePath}?${params}`);

      const offerCard = page.getByTestId(`offer-card-${offerId}`);

      await expect(offerCard).toBeVisible();

      await expect(offerCard.getByTestId("offer-price")).toContainText(
        expectedAmount,
      );
    });

    test(`${id} ${offerId} card on landing page links to checkout`, async ({
      page,
    }) => {
      await page.goto(`${landingPagePath}?${params}`);

      await page.getByTestId(`offer-card-${offerId}`).click();

      await expect(page).toHaveURL((url) => {
        return (
          url.pathname === `/angebot/${offerId}` &&
          url.searchParams.get("promo_code") === params.get("promo_code")
        );
      });
    });

    test(`${id} ${offerId} landing page links to overview`, async ({
      page,
    }) => {
      await page.goto(`${landingPagePath}?${params}`);

      await page.getByRole("link", { name: "Alle Angebote anzeigen" }).click();

      await expect(page).toHaveURL((url) => {
        return (
          url.pathname === `/` &&
          url.searchParams.get("promo_code") === params.get("promo_code")
        );
      });
    });
  },
);

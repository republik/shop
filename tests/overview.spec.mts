import test, { expect } from "@playwright/test";

import { PRODUCTS } from "./lib/products.mts";

PRODUCTS.forEach(({ id, offerId, promoCode, expectedAmount }) => {
  test(`${id} ${offerId} is on overview and displays the correct price`, async ({
    page,
  }) => {
    const params = new URLSearchParams();
    params.set("utm_source", "test");
    if (promoCode) {
      params.set("promo_code", promoCode);
    }
    await page.goto(`/?${params}`);

    const offerCard = page.getByTestId(`offer-card-${offerId}`);

    await expect(offerCard).toBeVisible();

    await expect(offerCard.getByTestId("offer-price")).toContainText(
      expectedAmount,
    );
  });

  test(`${id} ${offerId} card on overview links to checkout`, async ({
    page,
  }) => {
    await page.goto(`/`);

    await page.getByTestId(`offer-card-${offerId}`).click();

    await expect(page).toHaveURL(new RegExp(`/angebot/${offerId}`));
  });
});

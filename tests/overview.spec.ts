import test, { expect } from "@playwright/test";

// Test API response
test("lalala", async ({ page }) => {
  await page.goto("/angebot/YEARLY");

  expect(page).toHaveTitle(/Jahresmitgliedschaft/);

  console.log(process.env.TEST_EMAIL);
});

import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("/angebot/YEARLY");

  await page.getByLabel("E-Mail").fill(process.env.TEST_EMAIL);
  await page.getByRole("button", { name: "Weiter" }).click();

  // Pause for user to enter OTP from email
  await page.getByLabel("Code");

  // await page.pause();

  await expect(
    page.getByRole("heading", {
      name: "Jahresmitgliedschaft",
      exact: true,
    })
  ).toBeVisible();

  // await page.getByRole('cell', { name: '222.00' }).click();
  // await page.getByRole('button', { name: 'Kaufen' }).click();

  // await page.goto('chrome-error://chromewebdata/');await page.goto("http://localhost:3000/angebot/YEARLY");
});

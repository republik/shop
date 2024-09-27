import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  // Recording...
  await page.goto("http://localhost:3000/angebot/YEARLY");
  await page.getByLabel("E-Mail").click();
  await page.getByLabel("E-Mail").fill("jeremy.stucki+rtest");
  await page.getByLabel("E-Mail").press("Alt+@");
  await page.getByLabel("E-Mail").fill("jeremy.stucki+rshoptest");
  await page.getByLabel("E-Mail").press("Alt+@");
  await page.getByLabel("E-Mail").fill("jeremy.stucki+rshoptestlalala");
  await page.getByLabel("E-Mail").press("Tab");
  const page1Promise = page.waitForEvent("popup");
  await page
    .getByRole("list")
    .getByRole("link", { name: "Datenschutzbestimmung" })
    .click();
  const page1 = await page1Promise;
  const page2Promise = page.waitForEvent("popup");
  await page
    .getByRole("list")
    .getByRole("link", { name: "Datenschutzbestimmung" })
    .press("Enter");
  const page2 = await page2Promise;
  await page
    .getByRole("list")
    .getByRole("link", { name: "Datenschutzbestimmung" })
    .press("Shift+Tab");
  await page.getByLabel("E-Mail").press("Enter");
  await page.getByLabel("E-Mail").press("ArrowRight");
  await page.getByLabel("E-Mail").press("Alt+@");

  await page.getByLabel("E-Mail").fill("jeremy.stucki+rshoptest@gmail.com");
  await page.getByLabel("E-Mail").press("Enter");
  await page.getByLabel("E-Mail").press("Enter");
  await page.getByRole("button", { name: "Weiter" }).click();
  await page.getByLabel("E-Mail").click();
  await page.getByLabel("E-Mail").press("ArrowLeft");
  await page.getByLabel("E-Mail").press("ArrowLeft");
  await page.getByLabel("E-Mail").press("ArrowLeft");
  await page.getByLabel("E-Mail").press("ArrowLeft");
  await page.getByLabel("E-Mail").press("ArrowLeft");
  await page.getByLabel("E-Mail").press("ArrowLeft");
  await page.getByLabel("E-Mail").press("ArrowLeft");
  await page.getByLabel("E-Mail").press("ArrowRight");
  await page.getByLabel("E-Mail").press("ArrowRight");
  await page.getByLabel("E-Mail").press("ArrowRight");
  await page.getByLabel("E-Mail").fill("jeremy.stucki+rshoptest2@gmail.com");
  await page.getByLabel("E-Mail").press("Enter");
  await page.getByRole("button", { name: "Weiter" }).click();
  await page.getByLabel("Code").fill("");
  await page.getByLabel("Code").click();
  await page.getByLabel("Code").fill("111111");
});

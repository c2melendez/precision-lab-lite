import { expect, test } from "@playwright/test";

test("suite original módulo 8: conversiones de unidades funcionan desde la UI", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Unidades", exact: true }).click();

  const category = page.locator("#units-category");
  const from = page.locator("#units-from");
  const to = page.locator("#units-to");
  const value = page.locator("#units-value");

  await expect(category).toBeVisible();

  await category.selectOption("length");
  await from.selectOption("km");
  await to.selectOption("m");
  await value.fill("1");
  await expect(page.getByText(/1000\s+Metros \(m\)/)).toBeVisible();

  await category.selectOption("temperature");
  await from.selectOption("c");
  await to.selectOption("f");
  await value.fill("0");
  await expect(page.getByText(/32\s+Fahrenheit \(°F\)/)).toBeVisible();

  await category.selectOption("storage");
  await from.selectOption("kb");
  await to.selectOption("byte");
  await value.fill("1");
  await expect(page.getByText(/1000\s+Bytes \(B\)/)).toBeVisible();
});

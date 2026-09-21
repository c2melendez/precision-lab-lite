import { expect, test } from "@playwright/test";

test("suite original módulo 7: Estadística calcula media y expone submodos", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Estadística", exact: true }).click();

  await expect(page.getByRole("button", { name: "Descriptiva", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Distribución", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Correlación", exact: true })).toBeVisible();

  const input = page.getByPlaceholder("Escribe un valor y presiona Enter");
  for (const value of ["1","2","3","4","5"]) {
    await input.fill(value);
    await input.press("Enter");
  }
  await page.getByRole("button", { name: "x̄", exact: true }).click();

  const resultField = page.locator("math-field[read-only]").last();
  await expect(resultField).toBeVisible({ timeout: 12000 });
  await expect(resultField).toHaveJSProperty("value", "3");
});

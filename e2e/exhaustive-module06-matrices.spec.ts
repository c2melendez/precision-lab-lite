import { expect, test } from "@playwright/test";

test("suite original módulo 6: matrices expone rango, traza y eigen y calcula rango", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Matrices", exact: true }).click();

  await expect(page.getByRole("button", { name: "Eigenvalores", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "tr(A)", exact: true })).toBeVisible();
  const rankButton = page.getByRole("button", { name: "rango(A)", exact: true });
  await expect(rankButton).toBeVisible();
  await rankButton.click();

  const cells = page.locator('input[placeholder="0"]');
  await cells.nth(0).fill("1");
  await cells.nth(1).fill("2");
  await cells.nth(2).fill("2");
  await cells.nth(3).fill("4");
  await page.getByRole("button", { name: "Calcular", exact: true }).click();

  const result = page.getByRole("region", { name: "Resultado", exact: true });
  await expect(result).toContainText("1", { timeout: 12000 });
});

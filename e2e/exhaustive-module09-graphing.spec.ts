import { expect, test } from "@playwright/test";

async function setMathField(page: import("@playwright/test").Page, index: number, value: string) {
  const field = page.locator("math-field").nth(index);
  await field.evaluate((node, v) => {
    const el = node as HTMLElement & { value: string };
    el.value = v as string;
    el.dispatchEvent(new Event("input", { bubbles: true }));
  }, value);
}

test("suite original módulo 9: modos gráficos están activos y 2D renderiza", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Gráficas", exact: true }).click();

  for (const name of ["y = f(x)", "Polar", "Paramétrica", "3D"]) {
    await expect(page.getByRole("button", { name, exact: true })).toBeVisible();
  }

  await setMathField(page, 0, "x^2");
  await page.getByRole("button", { name: "Graficar esta expresión", exact: true }).first().click();
  await expect(page.locator('svg[viewBox="0 0 340 280"] path').first()).toBeVisible({ timeout: 15000 });
});

test("suite original módulo 9: múltiples curvas 2D se renderizan juntas", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Gráficas", exact: true }).click();
  await page.getByRole("button", { name: "+ Agregar expresión", exact: true }).click();
  await setMathField(page, 0, "x");
  await setMathField(page, 1, "x^2");
  const graphButtons = page.getByRole("button", { name: "Graficar esta expresión", exact: true });
  await graphButtons.nth(0).click();
  await graphButtons.nth(1).click();
  await expect(page.locator('svg[viewBox="0 0 340 280"] path')).toHaveCount(2, { timeout: 15000 });
});

test("suite original módulo 9: discontinuidad no se une visualmente a través de la asíntota", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Gráficas", exact: true }).click();
  await setMathField(page, 0, "\\frac{1}{x-2}");
  await page.getByRole("button", { name: "Graficar esta expresión", exact: true }).first().click();

  const curve = page.locator('svg[viewBox="0 0 340 280"] path').first();
  await expect(curve).toBeVisible({ timeout: 15000 });
  const d = await curve.getAttribute("d");
  const moveCount = (d?.match(/M\s/g) ?? []).length;
  expect(moveCount).toBeGreaterThan(1);
});

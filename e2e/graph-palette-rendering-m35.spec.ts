import { expect, test } from "@playwright/test";

async function setMathField(page: import("@playwright/test").Page, index: number, value: string) {
  const field = page.locator("math-field").nth(index);
  await field.evaluate((node, v) => {
    const el = node as HTMLElement & { value: string };
    el.value = v as string;
    el.dispatchEvent(new Event("input", { bubbles: true }));
  }, value);
}

test("M35: la paleta seleccionada recolorea curvas existentes y nuevas", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Gráficas", exact: true }).click();

  await setMathField(page, 0, "x");
  await page.getByRole("button", { name: "Graficar esta expresión", exact: true }).first().click();

  const paths = page.locator('svg[viewBox="0 0 340 280"] path');
  await expect(paths).toHaveCount(1, { timeout: 15000 });
  await expect(paths.nth(0)).toHaveAttribute("stroke", "#2563EB");

  await page.getByRole("button", { name: "Ajustes", exact: true }).click();
  const menu = page.getByRole("menu");
  await expect(menu).toBeVisible();
  await menu.getByRole("button", { name: /Apta para daltonismo/i }).click();

  // Cambiar la preferencia debe afectar de inmediato las curvas ya
  // renderizadas, no solo las que se agreguen después.
  await expect(paths.nth(0)).toHaveAttribute("stroke", "#E69F00");

  await page.getByRole("button", { name: "+ Agregar expresión", exact: true }).click();
  await setMathField(page, 1, "x^2");
  await page.getByRole("button", { name: "Graficar esta expresión", exact: true }).nth(1).click();

  await expect(paths).toHaveCount(2, { timeout: 15000 });
  await expect(paths.nth(0)).toHaveAttribute("stroke", "#E69F00");
  await expect(paths.nth(1)).toHaveAttribute("stroke", "#56B4E9");

  expect(
    await page.evaluate(() => localStorage.getItem("precision-lab-graph-palette")),
  ).toBe("colorblind-safe");
});

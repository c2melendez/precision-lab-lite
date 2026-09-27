import { expect, test } from "@playwright/test";

async function openKeyboard(page: import("@playwright/test").Page) {
  const opener = page.getByRole("button", { name: /abrir teclado|expandir teclado/i }).first();
  await expect(opener).toBeVisible();
  await opener.click();
}

test("suite original módulo 2: teclado de Álgebra expone operaciones requeridas", async ({ page }) => {
  await page.goto("./");
  await openKeyboard(page);
  await page.getByRole("tab", { name: "Álgebra", exact: true }).click();
  const subcategories = page.getByLabel("Subcategorías de Álgebra");

  await subcategories.getByRole("button", { name: "Logaritmos", exact: true }).click();
  for (const name of ["logaritmo base 10", "logaritmo natural", "logaritmo con base"]) {
    await expect(page.getByRole("button", { name, exact: true }).first()).toBeVisible();
  }

  const field = page.locator("math-field").first();
  await field.evaluate((node) => { (node as HTMLElement & { value: string }).value = ""; });
  await page.getByRole("button", { name: "logaritmo base 10", exact: true }).first().click();
  const inserted = await field.evaluate((node) => (node as HTMLElement & { value: string }).value);
  expect(inserted).toContain("\\log");

  await subcategories.getByRole("button", { name: "Exponenciales", exact: true }).click();
  await expect(page.getByRole("button", { name: "e a la n", exact: true }).first()).toBeVisible();

  await subcategories.getByRole("button", { name: "Ecuaciones", exact: true }).click();
  for (const name of ["Resolver ecuación", "Resolver sistema de ecuaciones", "Resolver inecuación", "Simplificar expresión"]) {
    await expect(page.getByRole("button", { name, exact: true }).first()).toBeVisible();
  }
  await page.getByRole("button", { name: "Resolver sistema de ecuaciones", exact: true }).first().click();
  await expect(page.getByRole("button", { name: "Sistema de 5 ecuaciones", exact: true })).toBeVisible();
});

test("suite módulo 2 actualizada: sistema de inecuaciones puede estar activo", async ({ page }) => {
  await page.goto("./");
  await openKeyboard(page);
  await page.getByRole("tab", { name: "Álgebra", exact: true }).click();
  await page.getByLabel("Subcategorías de Álgebra").getByRole("button", { name: "Ecuaciones", exact: true }).click();

  const key = page.getByRole("button", { name: /Sistema de inecuaciones de 2 variables/i }).first();
  await expect(key).toBeVisible();
});

import { expect, test } from "@playwright/test";

async function openKeyboard(page: import("@playwright/test").Page) {
  const opener = page.getByRole("button", { name: /abrir teclado|expandir teclado/i }).first();
  if (await opener.isVisible().catch(() => false)) await opener.click();
}

test("el teclado V5 expone sus controles básicos principales", async ({ page }) => {
  await page.goto("./");
  await openKeyboard(page);

  for (const label of [/calcular/i, /borrar/i]) {
    await expect(page.getByRole("button", { name: label }).first()).toBeVisible();
  }

  await expect(page.getByRole("button", { name: /igual|=/i }).first()).toBeVisible();
});

test("abrir/cerrar teclado no dispara errores de página", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("./");
  await openKeyboard(page);
  const closer = page.getByRole("button", { name: /cerrar teclado|cerrar más funciones/i }).first();
  if (await closer.isVisible().catch(() => false)) await closer.click();
  expect(errors).toEqual([]);
});

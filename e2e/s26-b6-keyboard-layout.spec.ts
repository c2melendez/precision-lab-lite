import { expect, test } from "@playwright/test";

async function openKeyboard(page: import("@playwright/test").Page) {
  await page.goto("./");
  const opener = page.getByRole("button", { name: /abrir teclado|expandir teclado/i }).first();
  await expect(opener).toBeVisible();
  await opener.click();
  const dialog = page.getByRole("dialog", { name: "Teclado matemático" });
  await expect(dialog).toBeVisible();
  return dialog;
}

async function expectThreeColumnContract(
  page: import("@playwright/test").Page,
  dialog: import("@playwright/test").Locator,
) {
  const subcategories = dialog.getByTestId("keyboard-b6-subcategories");
  const core = dialog.getByTestId("keyboard-b6-core");
  const context = dialog.getByTestId("keyboard-b6-context");

  await expect(subcategories).toBeVisible();
  await expect(core).toBeVisible();
  await expect(context).toBeVisible();

  const dialogBox = await dialog.boundingBox();
  const subBox = await subcategories.boundingBox();
  const coreBox = await core.boundingBox();
  const contextBox = await context.boundingBox();
  expect(dialogBox).not.toBeNull();
  expect(subBox).not.toBeNull();
  expect(coreBox).not.toBeNull();
  expect(contextBox).not.toBeNull();

  if (dialogBox && subBox && coreBox && contextBox) {
    expect(coreBox.height).toBeGreaterThan(120);
    expect(coreBox.x).toBeGreaterThanOrEqual(dialogBox.x - 1);
    expect(coreBox.x + coreBox.width).toBeLessThanOrEqual(dialogBox.x + dialogBox.width + 1);

    const viewport = page.viewportSize();
    if (viewport && viewport.width < 768) {
      expect(dialogBox.x).toBeLessThanOrEqual(1);
      expect(dialogBox.width).toBeGreaterThanOrEqual(viewport.width - 2);
    }
    if (viewport && viewport.width >= 1024) {
      for (const box of [subBox, coreBox, contextBox]) {
        expect(box.x).toBeGreaterThanOrEqual(dialogBox.x - 1);
        expect(box.y).toBeGreaterThanOrEqual(dialogBox.y - 1);
        expect(box.x + box.width).toBeLessThanOrEqual(dialogBox.x + dialogBox.width + 1);
        expect(box.y + box.height).toBeLessThanOrEqual(dialogBox.y + dialogBox.height + 1);
      }
      expect(subBox.x + subBox.width).toBeLessThanOrEqual(coreBox.x + 2);
      expect(coreBox.x + coreBox.width).toBeLessThanOrEqual(contextBox.x + 2);
      expect(Math.abs(subBox.y - coreBox.y)).toBeLessThanOrEqual(2);
      expect(Math.abs(coreBox.y - contextBox.y)).toBeLessThanOrEqual(2);
    }
  }
}

test("S26 B6: escritorio usa subcategorías | básico | contexto sin solapamiento", async ({ page }) => {
  const dialog = await openKeyboard(page);

  await dialog.getByRole("tab", { name: "Álgebra", exact: true }).click();
  await dialog.getByLabel("Subcategorías de Álgebra").getByRole("button", { name: "Ecuaciones", exact: true }).click();

  await expect(dialog.getByRole("button", { name: "Resolver ecuación", exact: true })).toBeVisible();
  await expect(dialog.getByRole("button", { name: "7", exact: true })).toBeVisible();
  await expect(dialog.getByRole("button", { name: "calcular", exact: true })).toBeVisible();
  await expectThreeColumnContract(page, dialog);

  await dialog.getByRole("tab", { name: "Cálculo", exact: true }).click();
  await dialog.getByLabel("Subcategorías de Cálculo").getByRole("button", { name: "Límites", exact: true }).click();

  await expect(dialog.getByRole("button", { name: "7", exact: true })).toBeVisible();
  await expect(dialog.getByRole("button", { name: "calcular", exact: true })).toBeVisible();
  await expectThreeColumnContract(page, dialog);
});

test("S26 B6: categorías y subcategorías muestran icono y texto", async ({ page }) => {
  const dialog = await openKeyboard(page);

  const algebra = dialog.getByRole("tab", { name: "Álgebra", exact: true });
  await expect(algebra).toContainText("x²");
  await algebra.click();

  const arithmetic = dialog.getByLabel("Subcategorías de Álgebra").getByRole("button", { name: "Aritmética", exact: true });
  await expect(arithmetic).toContainText("a!");
  await arithmetic.click();

  await expect(dialog.getByRole("button", { name: "mínimo común múltiplo", exact: true })).toBeVisible();
  await expect(dialog.getByRole("button", { name: "máximo común divisor", exact: true })).toBeVisible();
});


test("S26 B6: densidad contextual conserva tamaño legible", async ({ page }) => {
  const dialog = await openKeyboard(page);
  const viewport = page.viewportSize();
  if (!viewport || viewport.width < 1024) return;

  async function assertContextKeys(category: string, subcategory: string) {
    await dialog.getByRole("tab", { name: category, exact: true }).click();
    await dialog.getByLabel(`Subcategorías de ${category}`).getByRole("button", { name: subcategory, exact: true }).click();

    const buttons = dialog.getByTestId("keyboard-b6-context").getByRole("button");
    await expect(buttons.first()).toBeVisible();
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);

    for (let index = 0; index < count; index += 1) {
      const box = await buttons.nth(index).boundingBox();
      expect(box).not.toBeNull();
      if (box) expect(box.width).toBeGreaterThanOrEqual(56);
    }
  }

  await assertContextKeys("Cálculo", "Ecuaciones diferenciales");
  await assertContextKeys("Complejos", "Avanzado");
});

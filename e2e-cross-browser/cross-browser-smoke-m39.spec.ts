import { expect, test } from "@playwright/test";

test("M39: carga y cálculo básico funcionan fuera de Chromium", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("./");
  await expect(page.locator("main")).toBeVisible();

  const entry = page.getByRole("region", { name: "Entrada", exact: true });
  const calculate = entry.getByRole("button", { name: "Calcular", exact: true });

  await page.locator("math-field").first().evaluate((field) => {
    (field as HTMLElement & { value: string }).value = "2+2";
    field.dispatchEvent(new Event("input", { bubbles: true }));
  });

  await expect(calculate).toBeEnabled();
  await calculate.click();
  await expect(page.getByRole("region", { name: "Resultado", exact: true })).toContainText("4");
  expect(pageErrors).toEqual([]);
});

test("M39: teclado matemático abre, navega y cierra fuera de Chromium", async ({ page }) => {
  await page.goto("./");

  const openKeyboard = page.getByRole("button", { name: /Abrir teclado|Expandir teclado/i }).first();
  await expect(openKeyboard).toBeVisible();
  await openKeyboard.click();

  const dialog = page.getByRole("dialog", { name: "Teclado matemático" });
  await expect(dialog).toBeVisible();

  const basicTab = dialog.getByRole("tab", { name: "Básico", exact: true });
  const algebraTab = dialog.getByRole("tab", { name: "Álgebra", exact: true });
  await expect(basicTab).toHaveAttribute("aria-selected", "true");
  await algebraTab.click();
  await expect(algebraTab).toHaveAttribute("aria-selected", "true");

  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
});

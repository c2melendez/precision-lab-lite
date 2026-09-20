import { expect, test } from "@playwright/test";

for (const layout of ["stacked", "floating"]) {
  test(`${layout}: categorías, escritura y cierre`, async ({ page }, testInfo) => {
    await page.addInitScript((value) => localStorage.setItem("precision-lab-layout-mode", value), layout);
    await page.goto("./");
    const open = page.getByRole("button", { name: /Abrir teclado|Expandir teclado/i }).first();
    await open.click();
    const keyboard = layout === "stacked"
      ? page.getByRole("region", { name: "Teclado matemático" })
      : page.getByRole("dialog", { name: /Teclado/ });
    await expect(keyboard).toBeVisible();
    await expect(keyboard.getByRole("tab")).toHaveCount(6);
    for (const name of ["Símbolos", "Álgebra", "Trigonométricas", "Cálculo", "Complejos", "Básico"]) {
      await keyboard.getByRole("tab", { name, exact: true }).click();
      await expect(keyboard.getByRole("tab", { name, exact: true })).toHaveAttribute("aria-selected", "true");
    }
    await keyboard.getByRole("button", { name: "2", exact: true }).click();
    await expect(page.locator("math-field").first()).toHaveJSProperty("value", "2");
    await expect(keyboard).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath(`${layout}-teclado.png`), fullPage: true });
    if (layout === "stacked") await page.getByRole("button", { name: "Cerrar teclado", exact: true }).click();
    else await keyboard.getByRole("button", { name: "Cerrar teclado", exact: true }).click();
    await expect(keyboard).toBeHidden();
    await open.click();
    await expect(keyboard).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(keyboard).toBeHidden();
  });
}

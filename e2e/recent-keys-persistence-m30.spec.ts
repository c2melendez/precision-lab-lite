import { expect, test } from "@playwright/test";

test("S26 B6: el SmartDock de recientes no ocupa espacio en la interfaz", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "precision-lab-recent-keys",
      JSON.stringify({
        basic: {
          operations: [
            { glyph: "sin", insertLatex: "\\sin\\left(#0\\right)", ariaLabel: "seno" },
            { glyph: "cos", insertLatex: "\\cos\\left(#0\\right)", ariaLabel: "coseno" },
          ],
          variables: [
            { glyph: "x", insertLatex: "x", ariaLabel: "variable x" },
          ],
        },
      }),
    );
  });

  await page.goto("./");
  await expect(page.locator("math-field").first()).toBeVisible();

  // El historial interno puede persistir, pero ya no genera una superficie
  // SmartDock visible ni consume altura de la pantalla.
  await expect(page.getByText("Recientes", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Var./const.", { exact: true })).toHaveCount(0);

  const opener = page.getByRole("button", { name: /abrir teclado|expandir teclado|^teclado$/i }).first();
  await expect(opener).toBeVisible();
  await opener.click();

  const dialog = page.getByRole("dialog", { name: "Teclado matemático" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByTestId("keyboard-b6-core")).toBeVisible();
  await expect(dialog.getByText("Recientes", { exact: true })).toHaveCount(0);
  await expect(dialog.getByText("Var./const.", { exact: true })).toHaveCount(0);
});

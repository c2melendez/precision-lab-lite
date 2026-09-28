import { expect, test } from "@playwright/test";

const VIEWPORTS = [
  { id: "desktop-1440", width: 1440, height: 900 },
  { id: "laptop-1280", width: 1280, height: 800 },
  { id: "tablet-768", width: 768, height: 1024 },
  { id: "mobile-390", width: 390, height: 844 },
] as const;

test.describe("S26 B7 — Científica", () => {
  for (const viewport of VIEWPORTS) {
    test(`estado vacío conserva Entrada → Resultado → Gráfica sin overflow (${viewport.id})`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto("./");
      await page.evaluate(() => localStorage.setItem("precision-lab-layout-mode", "fused"));
      await page.reload();

      const scientific = page.locator("nav").getByRole("button", { name: "Científica", exact: true });
      await scientific.click();
      await expect(scientific).toHaveAttribute("aria-current", "page");

      await expect(page.getByRole("region", { name: "Entrada" })).toBeVisible();
      await expect(page.getByText(/Escribe una expresión y presiona Calcular\./i)).toBeVisible();
      await expect(page.getByRole("note", { name: /Gráfica:/i })).toBeVisible();

      const metrics = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
      }));
      expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.viewport + 2);
    });
  }
});


  test("orden visual Entrada → Resultado → Gráfica y shell contenido", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("./");
    await page.evaluate(() => localStorage.setItem("precision-lab-layout-mode", "fused"));
    await page.reload();

    const scientific = page.locator("nav").getByRole("button", { name: "Científica", exact: true });
    await scientific.click();

    const shell = page.getByTestId("scientific-mode-shell");
    const input = page.getByRole("region", { name: "Entrada" });
    const resultText = page.getByText(/Escribe una expresión y presiona Calcular\./i);
    const graph = page.getByRole("note", { name: /Gráfica:/i });

    await expect(shell).toBeVisible();
    await expect(input).toBeVisible();
    await expect(resultText).toBeVisible();
    await expect(graph).toBeVisible();

    const [shellBox, inputBox, resultBox, graphBox] = await Promise.all([
      shell.boundingBox(),
      input.boundingBox(),
      resultText.boundingBox(),
      graph.boundingBox(),
    ]);

    expect(shellBox).not.toBeNull();
    expect(inputBox).not.toBeNull();
    expect(resultBox).not.toBeNull();
    expect(graphBox).not.toBeNull();

    if (shellBox && inputBox && resultBox && graphBox) {
      expect(shellBox.x).toBeGreaterThanOrEqual(-1);
      expect(shellBox.x + shellBox.width).toBeLessThanOrEqual(1441);
      expect(inputBox.y).toBeLessThan(resultBox.y);
      expect(resultBox.y).toBeLessThan(graphBox.y);
    }
  });

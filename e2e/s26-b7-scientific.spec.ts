import { expect, test } from "@playwright/test";

const VIEWPORTS = [
  { id: "desktop-1440", width: 1440, height: 900 },
  { id: "laptop-1280", width: 1280, height: 800 },
  { id: "tablet-768", width: 768, height: 1024 },
  { id: "mobile-390", width: 390, height: 844 },
] as const;

async function setExpression(page: import("@playwright/test").Page, value: string) {
  await page.evaluate(() => customElements.whenDefined("math-field"));
  const field = page.locator("math-field").first();
  await expect(field).toBeVisible();
  await field.evaluate((node, v) => {
    const el = node as HTMLElement & { value: string };
    el.value = v as string;
    el.dispatchEvent(new Event("input", { bubbles: true }));
  }, value);
}

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


test("resultado real conserva Resultado antes de Gráfica", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("./");
  await page.evaluate(() => localStorage.setItem("precision-lab-layout-mode", "fused"));
  await page.reload();

  await page.locator("nav").getByRole("button", { name: "Científica", exact: true }).click();
  await setExpression(page, "2+2");

  const entry = page.getByRole("region", { name: "Entrada", exact: true });
  const calculate = entry.getByRole("button", { name: /calcular|evaluar/i }).first();
  await expect(calculate).toBeEnabled();
  await calculate.click();

  const result = page.getByRole("region", { name: "Resultado", exact: true });
  const graph = page.getByRole("note", { name: /Gráfica:/i });
  await expect(result).toContainText("4");
  await expect(graph).toBeVisible();

  const [resultBox, graphBox] = await Promise.all([result.boundingBox(), graph.boundingBox()]);
  expect(resultBox).not.toBeNull();
  expect(graphBox).not.toBeNull();
  if (resultBox && graphBox) {
    expect(resultBox.y).toBeLessThan(graphBox.y);
  }

  const metrics = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.viewport + 2);
});

test("error controlado conserva la Científica utilizable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./");
  await page.evaluate(() => localStorage.setItem("precision-lab-layout-mode", "fused"));
  await page.reload();

  await page.locator("nav").getByRole("button", { name: "Científica", exact: true }).click();
  await setExpression(page, "(");

  const entry = page.getByRole("region", { name: "Entrada", exact: true });
  const calculate = entry.getByRole("button", { name: /calcular|evaluar/i }).first();
  await expect(calculate).toBeEnabled();
  await calculate.click();

  await expect(page.locator('[role="alert"][aria-live="assertive"]').first()).toBeVisible({ timeout: 15000 });
  await expect(entry).toBeVisible();
  await expect(page.getByRole("note", { name: /Gráfica:/i })).toBeVisible();

  const metrics = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.viewport + 2);
});

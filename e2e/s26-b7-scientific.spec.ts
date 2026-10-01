import { expect, test } from "@playwright/test";

const VIEWPORTS = [
  { id: "desktop-1440", width: 1440, height: 900 },
  { id: "laptop-1280", width: 1280, height: 800 },
  { id: "tablet-768", width: 768, height: 1024 },
  { id: "mobile-390", width: 390, height: 844 },
] as const;

const LAYOUTS = ["fused", "split", "focus", "separated"] as const;

async function openScientific(page: import("@playwright/test").Page, layout = "fused") {
  await page.goto("./");
  await page.evaluate((value) => localStorage.setItem("precision-lab-layout-mode", value), layout);
  await page.reload();
  const scientific = page.locator("nav").getByRole("button", { name: "Científica", exact: true });
  await scientific.click();
  await expect(scientific).toHaveAttribute("aria-current", "page");
}

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

async function expectFourSurfaces(page: import("@playwright/test").Page) {
  await expect(page.getByRole("region", { name: "Entrada", exact: true })).toBeVisible();
  await expect(page.getByRole("region", { name: "Resultado", exact: true })).toBeVisible();
  await expect(page.getByRole("region", { name: "Entradas previas", exact: true })).toBeVisible();
  await expect(page.getByTestId("scientific-graph")).toBeVisible();
}

async function expectNoHorizontalOverflow(page: import("@playwright/test").Page) {
  const metrics = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.viewport + 2);
}

test.describe("S26 B7 — Científica Lite", () => {
  for (const viewport of VIEWPORTS) {
    test(`cuatro superficies sin overflow (${viewport.id})`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await openScientific(page);
      await expectFourSurfaces(page);
      await expectNoHorizontalOverflow(page);
    });
  }

  for (const layout of LAYOUTS) {
    test(`preset ${layout} conserva las cuatro superficies`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await openScientific(page, layout);
      await expectFourSurfaces(page);
      await expectNoHorizontalOverflow(page);
    });
  }

  test("Balanceada coloca Gráfica a la derecha del bloque de cálculo", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openScientific(page, "fused");

    const input = page.getByRole("region", { name: "Entrada", exact: true });
    const graph = page.getByTestId("scientific-graph");
    const previous = page.getByRole("region", { name: "Entradas previas", exact: true });
    const [inputBox, graphBox, previousBox] = await Promise.all([
      input.boundingBox(),
      graph.boundingBox(),
      previous.boundingBox(),
    ]);
    expect(inputBox).not.toBeNull();
    expect(graphBox).not.toBeNull();
    expect(previousBox).not.toBeNull();
    if (inputBox && graphBox && previousBox) {
      expect(graphBox.x).toBeGreaterThan(inputBox.x + inputBox.width - 2);
      expect(graphBox.y).toBeLessThanOrEqual(inputBox.y + 2);
      expect(graphBox.y + graphBox.height).toBeGreaterThanOrEqual(previousBox.y + previousBox.height - 2);
    }
  });

  test("resultado y entrada previa real permanecen utilizables", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openScientific(page);
    await setExpression(page, "2+2");
    const field = page.locator("math-field").first();
    await field.press("Enter");

    await expect(page.getByRole("region", { name: "Resultado", exact: true })).toContainText("4");
    const previous = page.getByRole("region", { name: "Entradas previas", exact: true });
    await expect(previous.getByRole("button", { name: /Reusar entrada/i }).first()).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test("error controlado conserva la Científica utilizable", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openScientific(page);
    await setExpression(page, "(");

    const calculate = page.getByRole("region", { name: "Entrada", exact: true })
      .getByRole("button", { name: /calcular|evaluar/i }).first();
    await expect(calculate).toBeEnabled();
    await calculate.click();

    await expect(page.locator('[role="alert"][aria-live="assertive"]').first()).toBeVisible({ timeout: 15000 });
    await expectFourSurfaces(page);
    await expectNoHorizontalOverflow(page);
  });
});

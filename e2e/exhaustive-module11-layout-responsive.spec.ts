import { expect, test } from "@playwright/test";

const LAYOUTS = ["fused", "separated", "split", "focus", "floating", "stacked"] as const;

async function loadLayout(page: import("@playwright/test").Page, layout: typeof LAYOUTS[number]) {
  await page.addInitScript(({ layout }) => {
    localStorage.setItem("precision-lab-layout-mode", layout);
  }, { layout });
  await page.goto("./");
  await expect(page.locator("math-field").first()).toBeVisible();
}

async function expectNoHorizontalOverflow(page: import("@playwright/test").Page, layout: string) {
  const metrics = await page.evaluate(() => ({
    innerWidth: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    bodyScrollWidth: document.body.scrollWidth,
  }));
  expect(metrics.scrollWidth, `${layout}: document overflow ${JSON.stringify(metrics)}`).toBeLessThanOrEqual(metrics.innerWidth + 2);
  expect(metrics.bodyScrollWidth, `${layout}: body overflow ${JSON.stringify(metrics)}`).toBeLessThanOrEqual(metrics.innerWidth + 2);
}

test("M11: las seis disposiciones cargan, conservan entrada/gráfica y no generan overflow horizontal", async ({ page }) => {
  for (const layout of LAYOUTS) {
    await loadLayout(page, layout);
    await expect(page.locator("math-field").first(), `${layout}: input`).toBeVisible();
    await expect(page.getByRole("note", { name: /Gráfica: escribe una expresión/i }).first(), `${layout}: gráfica`).toBeVisible();
    await expectNoHorizontalOverflow(page, layout);
  }
});

test("M11: teclado permanece colapsado al iniciar en todas las disposiciones", async ({ page }) => {
  for (const layout of LAYOUTS) {
    await loadLayout(page, layout);
    await expect(page.getByRole("region", { name: "Teclado matemático" })).toHaveCount(0);
    await expect(page.getByRole("dialog", { name: "Teclado" })).toHaveCount(0);
  }
});

test("M11: Enfoque usa dock compacto y sigue permitiendo abrir teclado", async ({ page }) => {
  await loadLayout(page, "focus");
  await expect(page.getByRole("button", { name: "Calcular", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Borrar", exact: true })).toBeVisible();
  const expand = page.getByRole("button", { name: /Expandir teclado/i }).first();
  await expect(expand).toBeVisible();
  await expand.click();
  await expect(page.getByRole("region", { name: "Teclado matemático" })).toBeVisible();
});

test("M11: Apilado retira dock fijo y usa teclado inline", async ({ page }) => {
  await loadLayout(page, "stacked");
  await expect(page.getByTestId("keyboard-dock")).toHaveCount(0);
  const toggle = page.getByRole("button", { name: /^Teclado$/ }).first();
  await expect(toggle).toBeVisible();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
});

test("M11: Flotante respeta breakpoint y mantiene ventanas dentro del viewport", async ({ page }) => {
  await loadLayout(page, "floating");
  const viewport = page.viewportSize();
  expect(viewport).not.toBeNull();

  if ((viewport?.width ?? 0) >= 1024) {
    const graph = page.getByRole("dialog", { name: "Gráfica" });
    await expect(graph).toBeVisible();
    await expect(page.getByTestId("keyboard-dock")).toHaveCount(0);
    const openKeyboard = page.getByRole("button", { name: "Abrir teclado", exact: true });
    await expect(openKeyboard).toBeVisible();
    await openKeyboard.click();
    const keyboard = page.getByRole("dialog", { name: "Teclado" });
    await expect(keyboard).toBeVisible();

    for (const [name, locator] of [["gráfica", graph], ["teclado", keyboard]] as const) {
      const box = await locator.boundingBox();
      expect(box, name).not.toBeNull();
      expect(box!.x, name).toBeGreaterThanOrEqual(0);
      expect(box!.y, name).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width, name).toBeLessThanOrEqual((viewport?.width ?? 0) + 1);
      expect(box!.y + box!.height, name).toBeLessThanOrEqual((viewport?.height ?? 0) + 1);
    }
  } else {
    await expect(page.getByRole("dialog", { name: "Gráfica" })).toHaveCount(0);
    await expect(page.getByTestId("keyboard-dock")).toBeVisible();
    await expect(page.getByRole("button", { name: /Expandir teclado/i }).first()).toBeVisible();
  }
});

test("M11: Dividida es dos columnas en desktop y colapsa verticalmente fuera de desktop ancho", async ({ page }) => {
  await loadLayout(page, "split");
  const input = page.locator("math-field").first();
  const graph = page.getByRole("note", { name: /Gráfica: escribe una expresión/i }).first();
  const inputBox = await input.boundingBox();
  const graphBox = await graph.boundingBox();
  expect(inputBox).not.toBeNull();
  expect(graphBox).not.toBeNull();

  const width = page.viewportSize()?.width ?? 0;
  if (width >= 1440) {
    expect(graphBox!.x).toBeGreaterThan(inputBox!.x + 100);
  } else {
    expect(Math.abs(graphBox!.x - inputBox!.x)).toBeLessThan(80);
    expect(graphBox!.y).toBeGreaterThan(inputBox!.y);
  }
});

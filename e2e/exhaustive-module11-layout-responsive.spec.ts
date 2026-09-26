import { expect, test } from "@playwright/test";

const LAYOUTS = ["fused", "stacked", "split"] as const;

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

test("M11: los tres diseños aprobados cargan y no generan overflow horizontal", async ({ page }) => {
  for (const layout of LAYOUTS) {
    await loadLayout(page, layout);
    await expect(page.locator("math-field").first(), `${layout}: input`).toBeVisible();
    await expect(page.getByRole("note", { name: /Gráfica: escribe una expresión/i }).first(), `${layout}: gráfica`).toBeVisible();
    await expectNoHorizontalOverflow(page, layout);
  }
});

test("M11: teclado permanece colapsado al iniciar en los tres diseños", async ({ page }) => {
  for (const layout of LAYOUTS) {
    await loadLayout(page, layout);
    await expect(page.getByRole("dialog", { name: "Teclado matemático" })).toHaveCount(0);
    await expect(page.getByRole("dialog", { name: "Teclado" })).toHaveCount(0);
    await expect(page.getByRole("region", { name: "Teclado matemático" })).toHaveCount(0);
  }
});

test("M11: Compacto abre teclado inline y no usa contenedor fixed", async ({ page }) => {
  await loadLayout(page, "stacked");
  const toggle = page.getByRole("button", { name: /Abrir teclado|Expandir teclado|^Teclado$/i }).first();
  await expect(toggle).toBeVisible();

  const isInsideFixed = await toggle.evaluate((el) => {
    let node: HTMLElement | null = el as HTMLElement;
    while (node) {
      if (getComputedStyle(node).position === "fixed") return true;
      node = node.parentElement;
    }
    return false;
  });
  expect(isInsideFixed).toBe(false);

  await toggle.click();
  const keyboard = page
    .getByRole("region", { name: "Teclado matemático" })
    .or(page.getByRole("dialog", { name: /Teclado/ }))
    .first();
  await expect(keyboard).toBeVisible();
  await expect(keyboard.getByRole("button", { name: "7", exact: true }).first()).toBeVisible();
});

test("M11: Lateral es dos columnas en desktop y colapsa verticalmente fuera de desktop ancho", async ({ page }) => {
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

test("M11: layouts antiguos migran a Default", async ({ page }) => {
  for (const legacy of ["separated", "focus", "floating"] as const) {
    await page.addInitScript(({ legacy }) => {
      localStorage.setItem("precision-lab-layout-mode", legacy);
    }, { legacy });
    await page.goto("./");
    await expect(page.locator("math-field").first()).toBeVisible();
    expect(await page.evaluate(() => localStorage.getItem("precision-lab-layout-mode"))).toBe("fused");
  }
});

import { expect, test } from "@playwright/test";

const LAYOUTS = ["fused", "split", "focus", "separated"] as const;

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

test("M11/B7: los cuatro diseños aprobados cargan y no generan overflow horizontal", async ({ page }) => {
  for (const layout of LAYOUTS) {
    await loadLayout(page, layout);
    await expect(page.getByRole("region", { name: "Entrada", exact: true })).toBeVisible();
    await expect(page.getByRole("region", { name: "Resultado", exact: true })).toBeVisible();
    await expect(page.getByRole("region", { name: "Entradas previas", exact: true })).toBeVisible();
    await expect(page.getByTestId("scientific-graph")).toBeVisible();
    await expectNoHorizontalOverflow(page, layout);
  }
});

test("M11/B7: teclado permanece colapsado al iniciar en los cuatro diseños", async ({ page }) => {
  for (const layout of LAYOUTS) {
    await loadLayout(page, layout);
    await expect(page.getByRole("dialog", { name: "Teclado matemático" })).toHaveCount(0);
    await expect(page.getByRole("dialog", { name: "Teclado" })).toHaveCount(0);
    await expect(page.getByRole("region", { name: "Teclado matemático" })).toHaveCount(0);
  }
});

test("M11/B7: el dock del teclado está anclado al borde inferior y abre sin cubrir el workspace", async ({ page }) => {
  await loadLayout(page, "fused");
  const toggle = page.getByRole("button", { name: /Abrir teclado|Expandir teclado|^Teclado$/i }).first();
  await expect(toggle).toBeVisible();

  const fixedAncestor = await toggle.evaluate((el) => {
    let node: HTMLElement | null = el as HTMLElement;
    while (node) {
      if (getComputedStyle(node).position === "fixed") return true;
      node = node.parentElement;
    }
    return false;
  });
  expect(fixedAncestor).toBe(true);

  await toggle.click();
  const keyboard = page
    .getByRole("region", { name: "Teclado matemático" })
    .or(page.getByRole("dialog", { name: /Teclado/ }))
    .first();
  await expect(keyboard).toBeVisible();
  await expect(keyboard.getByRole("button", { name: "7", exact: true }).first()).toBeVisible();

  const graph = page.getByTestId("scientific-graph");
  const graphBox = await graph.boundingBox();
  const keyboardBox = await keyboard.boundingBox();
  expect(graphBox).not.toBeNull();
  expect(keyboardBox).not.toBeNull();
  if (graphBox && keyboardBox) {
    expect(graphBox.y + graphBox.height).toBeLessThanOrEqual(keyboardBox.y + 2);
  }
});

test("M11/B7: Balanceada usa gráfica a la derecha en desktop y se apila fuera de desktop ancho", async ({ page }) => {
  await loadLayout(page, "fused");
  const input = page.getByRole("region", { name: "Entrada", exact: true });
  const graph = page.getByTestId("scientific-graph");
  const inputBox = await input.boundingBox();
  const graphBox = await graph.boundingBox();
  expect(inputBox).not.toBeNull();
  expect(graphBox).not.toBeNull();

  const width = page.viewportSize()?.width ?? 0;
  if (width >= 1024) {
    expect(graphBox!.x).toBeGreaterThan(inputBox!.x + inputBox!.width - 2);
  } else {
    expect(Math.abs(graphBox!.x - inputBox!.x)).toBeLessThan(80);
    expect(graphBox!.y).toBeGreaterThan(inputBox!.y);
  }
});

test("M11/B7: solo layouts realmente retirados migran a Balanceada", async ({ page }) => {
  for (const legacy of ["stacked", "floating"] as const) {
    await page.addInitScript(({ legacy }) => {
      localStorage.setItem("precision-lab-layout-mode", legacy);
    }, { legacy });
    await page.goto("./");
    await expect(page.locator("math-field").first()).toBeVisible();
    expect(await page.evaluate(() => localStorage.getItem("precision-lab-layout-mode"))).toBe("fused");
  }

  for (const current of ["focus", "separated"] as const) {
    await page.addInitScript(({ current }) => {
      localStorage.setItem("precision-lab-layout-mode", current);
    }, { current });
    await page.goto("./");
    await expect(page.locator("math-field").first()).toBeVisible();
    expect(await page.evaluate(() => localStorage.getItem("precision-lab-layout-mode"))).toBe(current);
  }
});

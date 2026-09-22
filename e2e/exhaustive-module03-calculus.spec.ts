import { expect, test } from "@playwright/test";

async function openCalculus(page: import("@playwright/test").Page) {
  await page.goto("./");
  const opener = page.getByRole("button", { name: /abrir teclado|expandir teclado/i }).first();
  await expect(opener).toBeVisible();
  await opener.click();
  await page.getByRole("tab", { name: "Cálculo", exact: true }).click();
}

async function setExpression(page: import("@playwright/test").Page, value: string) {
  const field = page.locator("math-field").first();
  await field.evaluate((node, v) => {
    const el = node as HTMLElement & { value: string };
    el.value = v as string;
    el.dispatchEvent(new Event("input", { bubbles: true }));
  }, value);
}

async function calculateExpression(page: import("@playwright/test").Page, value: string) {
  await page.addInitScript(() => localStorage.setItem("precision-lab-layout-mode", "fused"));
  await page.goto("./");
  const field = page.locator("math-field").first();
  await field.focus();
  const keyboard = page.getByRole("dialog", { name: "Teclado matemático" });
  await expect(keyboard).toBeVisible();
  await setExpression(page, value);
  await keyboard.getByRole("button", { name: "calcular", exact: true }).click();
}

test("suite original módulo 3: inventario de Cálculo refleja capacidades actuales", async ({ page }) => {
  await openCalculus(page);

  for (const name of [
    "integral indefinida",
    "integral definida",
    "sumatoria",
    "derivada",
    "derivada segunda",
    "límite",
    "límite al infinito",
    "límite lateral (edita + o - en el exponente)",
  ]) {
    await expect(page.getByRole("button", { name, exact: true }).first()).toBeVisible();
  }
  await expect(page.getByRole("button", { name: /derivada de orden n/i }).first()).toBeVisible();

  const product = page.getByRole("button", { name: "productoria", exact: true }).first();
  await expect(product).toBeVisible();
  await product.click();
  await expect(page.getByText(/productoria: todavía no disponible/i)).toHaveCount(0);
});

test("suite original módulo 3: productoria de 1 a 5 se evalúa a 120 desde la UI", async ({ page }) => {
  await calculateExpression(page, "\\prod_{i=1}^{5}i");

  const result = page.getByRole("region", { name: "Resultado", exact: true });
  await expect(result).toContainText("120", { timeout: 12000 });
});

test("suite original módulo 3: sumatoria de 1 a 5 se evalúa a 15 desde la UI", async ({ page }) => {
  await calculateExpression(page, "\\sum_{i=1}^{5}i");

  const result = page.getByRole("region", { name: "Resultado", exact: true });
  await expect(result).toContainText("15", { timeout: 12000 });
});

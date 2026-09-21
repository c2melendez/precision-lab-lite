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

test("suite original módulo 3: inventario de Cálculo refleja capacidades actuales", async ({ page }) => {
  await openCalculus(page);

  for (const name of [
    "integral indefinida",
    "integral definida",
    "sumatoria",
    "derivada",
    "derivada segunda",
    "derivada de orden n (edita el 3 por el orden que quieras)",
    "límite",
    "límite al infinito",
    "límite lateral (edita + o - en el exponente)",
  ]) {
    await expect(page.getByRole("button", { name, exact: true }).first()).toBeVisible();
  }

  const product = page.getByRole("button", { name: "productoria", exact: true }).first();
  await expect(product).toBeVisible();
  const disabled = await product.isDisabled();
  const ariaDisabled = await product.getAttribute("aria-disabled");
  expect(disabled || ariaDisabled === "true").toBe(true);
});

test("suite original módulo 3: sumatoria de 1 a 5 se evalúa a 15 desde la UI", async ({ page }) => {
  await page.goto("./");
  await setExpression(page, "\\sum_{i=1}^{5}i");

  const calculate = page.getByRole("button", { name: /calcular|evaluar/i }).first();
  await expect(calculate).toBeEnabled();
  await calculate.click();

  const result = page.getByRole("region", { name: "Resultado", exact: true });
  await expect(result).toContainText("15");
});

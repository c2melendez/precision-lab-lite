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
    "límite",
    "límite al infinito",
    "límite lateral (edita + o - en el exponente)",
  ]) {
    await expect(page.getByRole("button", { name, exact: true }).first()).toBeVisible();
  }
  await expect(page.getByRole("button", { name: /derivada de orden n/i }).first()).toBeVisible();

  const product = page.getByRole("button", { name: "productoria", exact: true }).first();
  await expect(product).toBeVisible();
  await expect(product).toBeEnabled();
  await product.click();
  await expect(page.getByText(/productoria: todavía no disponible/i)).toHaveCount(0);
});

test("suite original módulo 3: sumatoria de 1 a 5 se evalúa a 15 desde la UI", async ({ page }) => {
  await page.goto("./");
  const field = page.locator("math-field").first();
  await setExpression(page, "\\sum_{i=1}^{5}i");

  const form = field.locator("xpath=ancestor::form[1]");
  if (await form.count()) {
    await form.evaluate((el) => (el as HTMLFormElement).requestSubmit());
  } else {
    await page.getByRole("button", { name: /calcular|evaluar/i }).first().click();
  }

  await expect.poll(async () => {
    const result = page.locator(".a11y-scale-result-3xl").first();
    if (!(await result.count())) return "";
    return String(await result.evaluate((el) => {
      const node = el as HTMLElement & { value?: string };
      return node.value ?? node.textContent ?? "";
    }));
  }, { timeout: 25000 }).toContain("15");
});

import { test, expect } from "@playwright/test";

async function dump(page: import("@playwright/test").Page, label: string) {
  const field = page.locator("math-field").first();
  const value = await field.evaluate((el) => String((el as HTMLElement & { value?: string }).value ?? ""));
  const body = await page.locator("body").innerText();
  const resultCount = await page.locator(".a11y-scale-result-3xl").count();
  console.log("\n=== "+label+" ===");
  console.log("FIELD_VALUE="+JSON.stringify(value));
  console.log("RESULT_COUNT="+resultCount);
  console.log("BODY_TAIL="+JSON.stringify(body.slice(-1400)));
}

async function openFused(page: import("@playwright/test").Page) {
  await page.addInitScript(() => localStorage.setItem("precision-lab-layout-mode", "fused"));
  await page.goto("./");
  const field = page.locator("math-field").first();
  await field.focus();
  const keyboard = page.getByRole("dialog", { name: "Teclado matemático" });
  await expect(keyboard).toBeVisible();
  return { field, keyboard };
}

test("diag M3 sum/product", async ({ page }) => {
  for (const [name, expr] of [["SUM","\\sum_{i=1}^{5}i"],["PROD","\\prod_{i=1}^{5}i"]] as const) {
    const { field, keyboard } = await openFused(page);
    await field.evaluate((node, v) => {
      const el = node as HTMLElement & { value: string };
      el.value = v as string;
      el.dispatchEvent(new Event("input", { bubbles: true }));
    }, expr);
    await page.waitForTimeout(150);
    await dump(page, name+"_BEFORE");
    await keyboard.getByRole("button", { name: "calcular", exact: true }).click();
    await page.waitForTimeout(800);
    await dump(page, name+"_AFTER");
  }
});

test("diag M10 percent/pm", async ({ page }) => {
  {
    const { keyboard } = await openFused(page);
    await keyboard.getByRole("tab", { name: "Básico", exact: true }).click();
    await keyboard.getByRole("button", { name: "borrar todo el campo", exact: true }).click();
    await keyboard.getByRole("button", { name: "5", exact: true }).click();
    await keyboard.getByRole("button", { name: "0", exact: true }).click();
    await keyboard.getByRole("button", { name: "porcentaje", exact: true }).click();
    await page.waitForTimeout(150);
    await dump(page, "PERCENT_BEFORE");
    await keyboard.getByRole("button", { name: "calcular", exact: true }).click();
    await page.waitForTimeout(800);
    await dump(page, "PERCENT_AFTER");
  }
  {
    const { keyboard } = await openFused(page);
    await keyboard.getByRole("tab", { name: "Básico", exact: true }).click();
    await keyboard.getByRole("button", { name: "borrar todo el campo", exact: true }).click();
    await keyboard.getByRole("button", { name: "más/menos", exact: true }).click();
    await keyboard.getByRole("button", { name: "5", exact: true }).click();
    await page.waitForTimeout(150);
    await dump(page, "PM_BEFORE");
    await keyboard.getByRole("button", { name: "calcular", exact: true }).click();
    await page.waitForTimeout(800);
    await dump(page, "PM_AFTER");
  }
});

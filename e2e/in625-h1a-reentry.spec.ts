import { expect, test } from "@playwright/test";

type Page = import("@playwright/test").Page;

const cases = [
  ["EN-RE-01", "\\frac{1}{2}+\\frac{1}{3}"],
  ["EN-RE-02", "2^{10}"],
  ["EN-RE-03", "\\sqrt{8}"],
  ["EN-RE-04", "\\sin^{2}x+\\cos^{2}x"],
  ["EN-RE-05", "\\arcsin\\left(\\frac{1}{2}\\right)"],
  ["EN-RE-06", "\\frac{d}{dx}\\left(x\\ln x-x\\right)"],
  ["EN-RE-07", "e^{x}"],
  ["EN-RE-08", "\\sqrt{-4}"],
] as const;

async function setInput(page: Page, value: string) {
  const field = page.locator("math-field").first();
  await field.waitFor({ state: "visible" });
  await field.evaluate((el, v) => {
    const mf = el as HTMLElement & { setValue?: (value: string) => void; value?: string };
    if (typeof mf.setValue === "function") mf.setValue(String(v));
    else mf.value = String(v);
    el.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText", data: String(v) }));
  }, value);
  await page.waitForTimeout(120);
}

async function readResult(page: Page): Promise<string> {
  const region = page.locator('section[aria-label="Resultado"]').first();
  const alert = region.locator('[role="alert"]').first();
  const status = region.locator('[role="status"]').first();

  const state = await expect.poll(async () => {
    if (await alert.count()) {
      const txt = ((await alert.textContent().catch(() => "")) ?? "").trim();
      if (txt) return { kind: "error" as const, value: txt };
    }

    if (await status.count()) {
      const staticField = status.locator("math-field[read-only]").first();
      if (await staticField.count()) {
        const value = String(await staticField.evaluate((el) => (el as HTMLElement & { value?: string }).value ?? ""));
        if (value.trim() && value.trim() !== "…") return { kind: "result" as const, value };
      }
      const plain = status.locator(".a11y-scale-result-3xl").first();
      if (await plain.count()) {
        const value = ((await plain.innerText().catch(() => "")) ?? "").trim();
        if (value && value !== "…") return { kind: "result" as const, value };
      }
    }

    return { kind: "pending" as const, value: "" };
  }, { timeout: 15000 }).not.toEqual({ kind: "pending", value: "" }).then(async () => {
    if (await alert.count()) {
      const txt = ((await alert.textContent().catch(() => "")) ?? "").trim();
      if (txt) return { kind: "error" as const, value: txt };
    }
    const staticField = status.locator("math-field[read-only]").first();
    if (await staticField.count()) {
      const value = String(await staticField.evaluate((el) => (el as HTMLElement & { value?: string }).value ?? ""));
      if (value.trim() && value.trim() !== "…") return { kind: "result" as const, value };
    }
    const plain = status.locator(".a11y-scale-result-3xl").first();
    const value = await plain.innerText();
    return { kind: "result" as const, value: value.trim() };
  });

  if (state.kind === "error") throw new Error(state.value);
  return state.value;
}

async function calculate(page: Page): Promise<string> {
  await page.evaluate(() => window.mathVirtualKeyboard?.hide());
  const button = page.getByRole("region", { name: "Entrada" }).getByRole("button", { name: "Calcular", exact: true });
  await expect(button).toBeEnabled();
  await button.click();
  return readResult(page);
}

function canonical(text: string) {
  return text
    .replace(/\\left|\\right/g, "")
    .replace(/\\,/g, "")
    .replace(/\\cdot/g, "")
    .replace(/\s+/g, "");
}

test.describe("IN625 H1a reentrada básica Lite", () => {
  for (const [id, input] of cases) {
    test(id + " salida vuelve a entrar como punto fijo", async ({ page }) => {
      await page.goto("./");
      await setInput(page, input);
      const s1 = await calculate(page);
      expect(s1.trim(), id + " S1 vacío").not.toBe("");

      await setInput(page, s1);
      const s2 = await calculate(page);
      expect(canonical(s2), id + " S1=" + s1 + " S2=" + s2).toBe(canonical(s1));
    });
  }
});

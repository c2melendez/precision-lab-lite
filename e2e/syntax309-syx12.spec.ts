import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

const row = readFileSync(new URL("../qa/certification/syntax309_cases.jsonl", import.meta.url), "utf8")
  .trim().split("\n").map(line => JSON.parse(line)).find(entry => entry.id === "SY-X-12");

test("SY-X-12 native non-elementary integral shows a notice, never an invented antiderivative", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.addInitScript(() => localStorage.setItem("precision-lab-layout-mode", "split"));
  await page.goto("./");
  const input = page.locator("math-field[aria-label='Entrada matemática']").first();
  const calculate = page.locator("button:visible").filter({ hasText: /^Calcular$/ }).first();
  const result = page.locator("[data-result-request-id]").first();
  await expect(input).toBeVisible();
  expect(row.entrada).toBe("\\int\\sin\\left(x^{x}\\right)dx");
  expect(row.esperado).toBe("sin forma elemental: aviso claro; no una antiderivada inventada");
  async function enter(value: string) {
    await input.evaluate((element, source) => {
      (element as HTMLElement & { value: string }).value = source;
      element.dispatchEvent(new Event("input", { bubbles: true }));
    }, value);
    await expect.poll(() => input.evaluate(element =>
      (element as HTMLElement & { value: string }).value)).toBe(value);
  }
  await enter(row.entrada);
  await calculate.click();
  // Real Algebrite Worker: a visible notice and no result card of any kind.
  const alert = page.getByRole("alert");
  await expect(alert).toContainText(/could not find a solution|no se pudo/i, { timeout: 20000 });
  await expect(result).toHaveCount(0);
  const notice = (await alert.allInnerTexts()).join(" ");
  const ids: string[] = [];
  for (const [source, expected] of [["2+3", "5"], ["5", "5"]] as const) {
    await enter(source);
    await calculate.click();
    await expect(result).toBeVisible();
    await expect(result).not.toHaveAttribute("data-result-request-id", ids.at(-1) ?? "");
    await expect(result.locator(".a11y-scale-result-3xl").first()).toHaveText(expected);
    const id = await result.getAttribute("data-result-request-id");
    expect(id).toBeTruthy();
    ids.push(id!);
    expect(await result.getAttribute("data-result-reentry-latex")).toBe(expected);
    await expect(page.getByRole("alert")).toHaveCount(0);
  }
  expect(new Set(ids).size).toBe(2);
  expect(errors).toEqual([]);
  await testInfo.attach("SY-X-12-native-worker-evidence", {
    body: JSON.stringify({ source: row.entrada, project: testInfo.project.name, notice, ids, errors }, null, 2),
    contentType: "application/json",
  });
});

import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
const row = readFileSync(new URL("../qa/certification/syntax309_cases.jsonl", import.meta.url), "utf8")
  .trim().split("\n").map((line) => JSON.parse(line)).find((entry) => entry.id === "SY-X-07");

test("SY-X-07 native original indeterminacy, finite control, recovery and reentry", async ({ page }, testInfo) => {
  const errors: string[] = [];
  const evidence: Array<{ source: string; requestId: string; reentry: string }> = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() => localStorage.setItem("precision-lab-layout-mode", "split"));
  await page.goto("./");
  const input = page.locator("math-field[aria-label='Entrada matemática']").first();
  const calculate = page.locator("button:visible").filter({ hasText: /^Calcular$/ }).first();
  const result = page.locator("[data-result-request-id]").first();
  await expect(input).toBeVisible();
  expect(row.entrada).toBe(String.raw`\infty-\infty`);
  expect(row.esperado).toBe("indeterminado: error claro");
  async function enter(source: string) {
    await input.evaluate((element, value) => {
      (element as HTMLElement & { value: string }).value = value;
      element.dispatchEvent(new Event("input", { bubbles: true }));
    }, source);
    await expect.poll(() => input.evaluate((element) =>
      (element as HTMLElement & { value: string }).value)).toBe(source);
  }
  let previous: string | null = null;
  for (const [source, expected] of [["3-3", "0"], ["2+3", "5"]]) {
    await enter(row.entrada);
    await expect(calculate).toBeEnabled();
    await calculate.click();
    await expect(page.getByRole("alert")).toContainText("Forma indeterminada: infinito menos infinito no está definido.");
    // No new successful result may be fabricated for the invalid source.
    await expect(result).toHaveCount(0);
    await enter(source);
    await calculate.click();
    await expect(result).toBeVisible();
    await expect(result).not.toHaveAttribute("data-result-request-id", previous ?? "");
    await expect(result.locator(".a11y-scale-result-3xl").first()).toHaveText(expected);
    const first = await result.getAttribute("data-result-request-id");
    const reentry = await result.getAttribute("data-result-reentry-latex");
    expect(first).toBeTruthy();
    expect(reentry).toBe(expected);
    await enter(reentry!);
    await calculate.click();
    await expect(result).not.toHaveAttribute("data-result-request-id", first!);
    await expect(result.locator(".a11y-scale-result-3xl").first()).toHaveText(expected);
    previous = await result.getAttribute("data-result-request-id");
    expect(previous).toBeTruthy();
    evidence.push({ source, requestId: first!, reentry: reentry! }, { source: reentry!, requestId: previous!, reentry: reentry! });
    await expect(page.getByRole("alert")).toHaveCount(0);
  }
  expect(new Set(evidence.map((item) => item.requestId)).size).toBe(4);
  expect(errors).toEqual([]);
  await testInfo.attach("SY-X-07-native-worker-evidence", {
    body: JSON.stringify({ canonical: row.entrada, project: testInfo.project.name, evidence, errors }, null, 2),
    contentType: "application/json",
  });
});

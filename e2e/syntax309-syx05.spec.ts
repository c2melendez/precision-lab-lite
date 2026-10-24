import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

const row = readFileSync(new URL("../qa/certification/syntax309_cases.jsonl", import.meta.url), "utf8")
  .trim().split("\n").map((line) => JSON.parse(line)).find((entry) => entry.id === "SY-X-05");

test("SY-X-05 real30-level ingestion, controls, output reentry and recovery", async ({ page }, testInfo) => {
  const errors: string[] = [];
  const evidence: Array<{ source: string; requestId: string; reentry: string }> = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() => localStorage.setItem("precision-lab-layout-mode", "split"));
  await page.goto("./");
  const input = page.locator("math-field[aria-label='Entrada matemática']").first();
  const calculate = page.locator("button:visible").filter({ hasText: /^Calcular$/ }).first();
  const result = page.locator("[data-result-request-id]").first();
  await expect(input).toBeVisible();
  expect(row.entrada).toBe(String.raw`\underbrace{(\cdots((1))\cdots)}_{30\text{ niveles}}`);
  expect(row.esperado).toBe("1");
  let previous: string | null = null;
  async function evaluate(source: string, expected: string) {
    await input.evaluate((element, value) => {
      (element as HTMLElement & { value: string }).value = value;
      element.dispatchEvent(new Event("input", { bubbles: true }));
    }, source);
    await expect.poll(() => input.evaluate((element) =>
      (element as HTMLElement & { value: string }).value)).toBe(source);
    await expect(calculate).toBeEnabled();
    await calculate.click();
    await expect(result).toBeVisible();
    await expect(result).not.toHaveAttribute("data-result-request-id", previous ?? "");
    await expect(result.locator(".a11y-scale-result-3xl").first()).toHaveText(expected);
    const requestId = await result.getAttribute("data-result-request-id");
    expect(requestId).toBeTruthy();
    previous = requestId;
    const reentry = await result.getAttribute("data-result-reentry-latex");
    expect(reentry).toBe(expected);
    evidence.push({ source, requestId: requestId!, reentry: reentry! });
    return reentry!;
  }
  for (const [inner, expected] of [["1", "1"], ["7", "7"], ["2+3", "5"]]) {
    const source = "(".repeat(30) + inner + ")".repeat(30);
    expect(source.length).toBe(60 + inner.length);
    expect(source.match(/\(/g)).toHaveLength(30);
    expect(source.match(/\)/g)).toHaveLength(30);
    await evaluate(await evaluate(source, expected), expected);
  }
  await evaluate("2+3", "5");
  expect(new Set(evidence.map((item) => item.requestId)).size).toBe(7);
  await expect(page.locator("[role=alert]")).toHaveCount(0);
  expect(errors).toEqual([]);
  await testInfo.attach("SY-X-05-native-worker-evidence", {
    body: JSON.stringify({ canonical: row.entrada, project: testInfo.project.name, evidence, errors }, null, 2),
    contentType: "application/json",
  });
});

import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
const row = readFileSync(new URL("../qa/certification/syntax309_cases.jsonl", import.meta.url), "utf8")
  .trim().split("\n").map((line) => JSON.parse(line)).find((entry) => entry.id === "SY-X-06");

test("SY-X-06 native10000-character processing, reentry and recovery", async ({ page }, testInfo) => {
  testInfo.setTimeout(90000);
  const errors: string[] = [];
  const evidence: Array<{ sourceLength: number; requestId: string; reentry: string }> = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() => localStorage.setItem("precision-lab-layout-mode", "split"));
  await page.goto("./");
  const input = page.locator("math-field[aria-label='Entrada matemática']").first();
  const calculate = page.locator("button:visible").filter({ hasText: /^Calcular$/ }).first();
  const result = page.locator("[data-result-request-id]").first();
  await expect(input).toBeVisible();
  expect(row.entrada).toBe(String.raw`\text{(entrada de 10 000 caracteres)}`);
  expect(row.esperado).toBe("procesada sin bloquear, o rechazada con aviso de longitud");
  const source = "1+".repeat(4999) + "11";
  expect(source).toHaveLength(10000);
  let previous: string | null = null;
  async function evaluate(value: string, expected: string) {
    await input.evaluate((element, source) => {
      (element as HTMLElement & { value: string }).value = source;
      element.dispatchEvent(new Event("input", { bubbles: true }));
    }, value);
    await expect.poll(() => input.evaluate((element) =>
      (element as HTMLElement & { value: string }).value)).toBe(value);
    await expect(calculate).toBeEnabled();
    await calculate.click();
    await expect(result).toBeVisible();
    await expect(result).not.toHaveAttribute("data-result-request-id", previous ?? "");
    await expect(result.locator(".a11y-scale-result-3xl").first()).toHaveText(expected, { timeout: 15000 });
    const requestId = await result.getAttribute("data-result-request-id");
    expect(requestId).toBeTruthy();
    previous = requestId;
    const reentry = await result.getAttribute("data-result-reentry-latex");
    expect(reentry).toBe(expected);
    evidence.push({ sourceLength: value.length, requestId: requestId!, reentry: reentry! });
    return reentry!;
  }
  await evaluate(await evaluate(source, "5010"), "5010");
  await evaluate(await evaluate("2+3", "5"), "5");
  expect(new Set(evidence.map((item) => item.requestId)).size).toBe(4);
  await expect(page.locator("[role=alert]")).toHaveCount(0);
  expect(errors).toEqual([]);
  await testInfo.attach("SY-X-06-native-worker-evidence", {
    body: JSON.stringify({ canonical: row.entrada, source, project: testInfo.project.name, evidence, errors }, null, 2),
    contentType: "application/json",
  });
});

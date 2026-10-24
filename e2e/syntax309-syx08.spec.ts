import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
const row = readFileSync(new URL("../qa/certification/syntax309_cases.jsonl", import.meta.url), "utf8")
  .trim().split("\n").map(line => JSON.parse(line)).find(row => row.id === "SY-X-08");
test("SY-X-08 native principal complex root, exact reentry and finite recovery", async ({ page }, testInfo) => {
  const errors: string[] = [];
  const evidence: Array<{source:string; requestId:string; reentry:string}> = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.addInitScript(() => localStorage.setItem("precision-lab-layout-mode", "split"));
  await page.goto("./");
  const input = page.locator("math-field[aria-label='Entrada matemática']").first();
  const result = page.locator("[data-result-request-id]").first();
  await expect(input).toBeVisible();
  expect(row.entrada).toBe(String.raw`\sqrt{-1}`);
  expect(row.esperado).toBe("en ℝ: error claro; en ℂ: `i`");
  async function evaluate(source:string, expected:string) {
    const previous = await result.count() ? await result.getAttribute("data-result-request-id") : "";
    await input.evaluate((node, value) => {
      (node as HTMLElement & {value:string}).value = value;
      node.dispatchEvent(new Event("input", {bubbles:true}));
    }, source);
    await expect.poll(() => input.evaluate(node => (node as HTMLElement & {value:string}).value)).toBe(source);
    await page.locator("button:visible").filter({hasText:/^Calcular$/}).first().click();
    await expect(result).toBeVisible();
    await expect(result).not.toHaveAttribute("data-result-request-id", previous ?? "");
    if(expected === "i") {
      const display = result.locator("math-field[read-only]").first();
      await expect(display).toBeVisible();
      await expect.poll(() => display.evaluate(node => (node as HTMLElement & {value:string}).value)).toBe("i");
    } else await expect(result.locator(".a11y-scale-result-3xl").first()).toHaveText(expected);
    const requestId = await result.getAttribute("data-result-request-id");
    const reentry = await result.getAttribute("data-result-reentry-latex");
    expect(requestId).toBeTruthy();
    expect(reentry).toBe(expected);
    evidence.push({source, requestId:requestId!, reentry:reentry!});
    await expect(page.getByRole("alert")).toHaveCount(0);
    return reentry!;
  }
  await evaluate(await evaluate(row.entrada, "i"), "i");
  await evaluate("i^2", "-1");
  await evaluate(await evaluate("2+3", "5"), "5");
  expect(new Set(evidence.map(item => item.requestId)).size).toBe(5);
  expect(errors).toEqual([]);
  await testInfo.attach("SY-X-08-native-worker-evidence", {body:JSON.stringify({domain:"existing principal complex branch", canonical:row, project:testInfo.project.name, evidence, errors}, null, 2),contentType:"application/json"});
});

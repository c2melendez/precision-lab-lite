import { test, expect } from "@playwright/test";
test("SY-Q-14: native MathLive array environment solves official 2x2 system", async ({page}) => {
  await page.addInitScript(() => localStorage.setItem("precision-lab-layout-mode", "split"));
  await page.goto("./");
  const input=page.locator("math-field[aria-label='Entrada matemática']").first();
  await expect(input).toBeVisible();
  await input.evaluate(node => {
    const field=node as HTMLElement & {value:string};
    field.value=String.raw`\left\{\begin{array}{l}x+y=3\\ x-y=1\end{array}\right.`;
    field.dispatchEvent(new Event("input",{bubbles:true}));
  });
  await page.locator("button:visible").filter({hasText:/^Calcular$/}).first().click();
  const result=page.locator("[data-result-request-id]").first();
  await expect(result).toBeVisible();
  await expect.poll(async()=>result.locator("math-field[read-only]").first().evaluate(node=>(node as HTMLElement & {value:string}).value)).toMatch(/x\s*=\s*2.*y\s*=\s*1/);
});

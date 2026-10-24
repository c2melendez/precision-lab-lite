import { test, expect } from "@playwright/test";
for (const [source, pairs] of [
  [String.raw`\begin{cases}x^{2}+y^{2}=25\\ x+y=7\end{cases}`, [[3,4],[4,3]]],
  [String.raw`\begin{cases}y=4\\ x^{2}+y^{2}=25\end{cases}`, [[-3,4],[3,4]]],
] as const) {
  test("SY-Q-16 native MathLive and worker: "+source, async ({page}) => {
    await page.addInitScript(() => localStorage.setItem("precision-lab-layout-mode", "split"));
    await page.goto("./");
    const input = page.locator("math-field[aria-label='Entrada matemática']").first();
    await expect(input).toBeVisible();
    await input.evaluate((node, latex) => {
      (node as HTMLElement & {value:string}).value=latex;
      node.dispatchEvent(new Event("input",{bubbles:true}));
    }, source);
    await page.locator("button:visible").filter({hasText:/^Calcular$/}).first().click();
    const result=page.locator("[data-result-request-id]").first();
    await expect(result).toBeVisible();
    await expect.poll(async()=>{
      const latex=await result.locator("math-field[read-only]").first().evaluate(node=>(node as HTMLElement & {value:string}).value);
      return pairs.every(([x,y])=>new RegExp("x\\s*=\\s*"+x+".*?y\\s*=\\s*"+y).test(latex));
    }).toBe(true);
  });
}

import {test,expect} from "@playwright/test";
for(const source of [String.raw`\operatorname{tgh}1`,String.raw`\operatorname{tgh}\left(1\right)`]){
 test("SY-S-09 native hyperbolic sine "+source,async({page})=>{
  await page.addInitScript(()=>localStorage.setItem("precision-lab-layout-mode","split"));
  await page.goto("./");
  const input=page.locator("math-field[aria-label='Entrada matemática']").first();
  await expect(input).toBeVisible();
  await input.evaluate((node,latex)=>{(node as HTMLElement & {value:string}).value=latex;node.dispatchEvent(new Event("input",{bubbles:true}));},source);
  await page.locator("button:visible").filter({hasText:/^Calcular$/}).first().click();
  const result=page.locator("[data-result-request-id]").first();
  await expect(result).toBeVisible();
  const latex=await result.getAttribute("data-result-reentry-latex");
  expect(latex).toBeTruthy();
  expect(latex).not.toMatch(/NaN|Infinity/);
  const number=Number(latex?.replace(/\\(?:operatorname|mathrm)\{[^}]+\}/g,"").replace(/\\,/g,"").trim());
  expect(Number.isFinite(number),String(latex)).toBe(true);
  expect(Math.abs(number-0.7615941560)).toBeLessThan(5e-10);
 });
}

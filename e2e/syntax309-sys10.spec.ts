import {test,expect} from "@playwright/test";
for(const source of [String.raw`\operatorname{argsenh}1`,String.raw`\operatorname{argsenh}\left(1\right)`]){
 test("SY-S-10 native inverse hyperbolic sine exact form "+source,async({page})=>{
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
  const normalizedLatex = String(latex)
    .replace(/\\left|\\right/g,"")
    .replace(/\s+/g,"");
  expect(normalizedLatex).toBe(String.raw`\ln(1+\sqrt{2})`);
 });
}

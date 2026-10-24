import {test,expect} from "@playwright/test";
for(const source of [String.raw`\operatorname{arcctg}1`,String.raw`\operatorname{arcctg}\left(1\right)`]){
 test("SY-S-07 native inverse cotangent "+source,async({page})=>{
  await page.addInitScript(()=>localStorage.setItem("precision-lab-layout-mode","split"));
  await page.goto("./");
  const input=page.locator("math-field[aria-label='Entrada matemática']").first();
  await expect(input).toBeVisible();
  await input.evaluate((node,latex)=>{(node as HTMLElement & {value:string}).value=latex;node.dispatchEvent(new Event("input",{bubbles:true}));},source);
  await page.locator("button:visible").filter({hasText:/^Calcular$/}).first().click();
  const result=page.locator("[data-result-request-id]").first();
  await expect(result).toBeVisible();
  await expect(result).toHaveAttribute("data-result-reentry-latex",/\\pi/);
  const reentry=await result.getAttribute("data-result-reentry-latex");
  expect(reentry).toContain("4");
 });
}

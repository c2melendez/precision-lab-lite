import {test,expect} from "@playwright/test";
for(const source of [
 String.raw`\operatorname{sen}\frac{\pi}{6}`,
 String.raw`\operatorname{sen}\left(\frac{\pi}{6}\right)`,
]){
 test("SY-S-01 native exact Spanish sine "+source,async({page})=>{
  await page.addInitScript(()=>localStorage.setItem("precision-lab-layout-mode","split"));
  await page.goto("./");
  const input=page.locator("math-field[aria-label='Entrada matemática']").first();
  await expect(input).toBeVisible();
  await input.evaluate((node,latex)=>{
   (node as HTMLElement & {value:string}).value=latex;
   node.dispatchEvent(new Event("input",{bubbles:true}));
  },source);
  await page.locator("button:visible").filter({hasText:/^Calcular$/}).first().click();
  const result=page.locator("[data-result-request-id]").first();
  await expect(result).toBeVisible();
  await expect(result).toHaveAttribute("data-result-reentry-latex",/\\frac\{1\}\{2\}/);
  await result.getByRole("button",{name:"frac",exact:true}).click();
  const field=result.locator("math-field[read-only]").first();
  await expect(field).toBeVisible();
  await expect.poll(()=>field.evaluate(node=>(node as HTMLElement & {value:string}).value))
   .toBe(String.raw`\frac{1}{2}`);
 });
}

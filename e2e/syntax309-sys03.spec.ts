import {test,expect} from "@playwright/test";
for(const source of [
 String.raw`\operatorname{ctg}\frac{\pi}{4}`,
 String.raw`\operatorname{ctg}\left(\frac{\pi}{4}\right)`,
]){
 test("SY-S-03 native exact Spanish cotangent "+source,async({page})=>{
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
  await expect(result).toHaveAttribute("data-result-reentry-latex",/^(?:1|\\frac\{1\}\{1\})$/);
  await expect(result.getByText("1",{exact:true})).toBeVisible();
 });
}

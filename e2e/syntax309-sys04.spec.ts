import {test,expect} from "@playwright/test";
for(const source of [
 String.raw`\operatorname{cosec}\frac{\pi}{6}`,
 String.raw`\operatorname{cosec}\left(\frac{\pi}{6}\right)`,
]){
 test("SY-S-04 native exact Spanish cosecant "+source,async({page})=>{
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
  await expect(result).toHaveAttribute("data-result-reentry-latex",/^(?:2|\\frac\{2\}\{1\})$/);
  await expect(result.getByText("2",{exact:true})).toBeVisible();
 });
}

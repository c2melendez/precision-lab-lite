import {test,expect} from "@playwright/test";
const cases=[
 ["\\langle1,2,3\\rangle\\cdot\\langle4,5,6\\rangle","32"],
 [String.raw`\left\langle1,2,3\right\rangle\cdot\left\langle4,5,6\right\rangle`,"32"],
 [String.raw`\langle1,2,3\rangle\cdot\langle-4,-5,-6\rangle`,"-32"],
];
for(const [source,expected] of cases){
 test("SY-M-11 native dot "+source,async({page})=>{
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
  await expect(result.getByText(expected,{exact:true})).toBeVisible();
  await expect(result).toHaveAttribute("data-result-reentry-latex",expected);
 });
}

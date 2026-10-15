import {test,expect} from "@playwright/test";
const cases=[
 [String.raw`\det\left[\begin{matrix}1&2\\3&4\end{matrix}\right]`,"-2"],
 [String.raw`\det\left[\begin{matrix}3&4\\1&2\end{matrix}\right]`,"2"],
 [String.raw`\det\left[\begin{matrix}1&2\\2&4\end{matrix}\right]`,"0"],
];
for(const [source,expected] of cases){
 test("SY-M-05 native wrapped matrix determinant "+expected,async({page})=>{
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
  const serialized=await input.evaluate(node=>(node as HTMLElement & {value:string}).value);
  await expect(result,JSON.stringify({serialized,body:await page.locator("body").innerText()})).toBeVisible();
  await expect(result.getByText(expected,{exact:true})).toBeVisible();
  await expect(result).toHaveAttribute("data-result-reentry-latex",new RegExp(expected+"$"));
 });
}

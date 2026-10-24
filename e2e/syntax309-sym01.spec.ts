import {test,expect} from "@playwright/test";
const cases=[
 [String.raw`\det\begin{pmatrix}1&2\\3&4\end{pmatrix}`,"-2"],
 [String.raw`\det\begin{pmatrix}3&4\\1&2\end{pmatrix}`,"2"],
 [String.raw`\det\begin{pmatrix}1&2\\2&4\end{pmatrix}`,"0"],
];
for(const [source,expected] of cases){
 test("SY-M-01 native pmatrix determinant "+expected,async({page})=>{
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
  await expect(result.getByText(expected,{exact:true})).toBeVisible();
  await expect(result).toHaveAttribute("data-result-reentry-latex",new RegExp(expected+"$"));
 });
}

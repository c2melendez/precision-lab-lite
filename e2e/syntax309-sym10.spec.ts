import {test,expect} from "@playwright/test";
const cases=[
 ["\\begin{pmatrix}1\\\\2\\\\3\\end{pmatrix}\\cdot\\begin{pmatrix}4\\\\5\\\\6\\end{pmatrix}","32"],
 [String.raw`\begin{pmatrix}1&2&3\end{pmatrix}\cdot\begin{pmatrix}4&5&6\end{pmatrix}`,"32"],
 [String.raw`\begin{pmatrix}1\\2\\3\end{pmatrix}\cdot\begin{pmatrix}-4\\-5\\-6\end{pmatrix}`,"-32"],
];
for(const [source,expected] of cases){
 test("SY-M-10 native dot "+source,async({page})=>{
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

import {test,expect} from "@playwright/test";
import {detectMatrixIntent} from "../src/engine/parsing/matrixIntent";
for(const [source,expected] of [
 [String.raw`2\begin{pmatrix}1&2\\3&4\end{pmatrix}`,[["2","4"],["6","8"]]],
 [String.raw`-\frac{1}{2}\begin{pmatrix}1&-2&3\\4&5&6\end{pmatrix}`,[["-1/2","1","-3/2"],["-2","-5/2","-3"]]],
 [String.raw`0\begin{pmatrix}1&-2&3\\4&5&6\end{pmatrix}`,[["0","0","0"],["0","0","0"]]],
] as const){
 test("SY-M-20 native exact scalar product "+source,async({page})=>{
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
  const field=result.locator("math-field[read-only]").first();
  await expect(field).toBeVisible();
  const read=async()=>await field.evaluate(node=>(node as HTMLElement & {value:string}).value);
  await expect.poll(async()=>detectMatrixIntent(await read())).toEqual({kind:"literal",matrix:expected});
  expect(detectMatrixIntent((await result.getAttribute("data-result-reentry-latex"))!)).toEqual({kind:"literal",matrix:expected});
 });
}

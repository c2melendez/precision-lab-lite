import {test,expect} from "@playwright/test";
import {detectMatrixIntent} from "../src/engine/parsing/matrixIntent";
import {multiplyMatrices,toFractionMatrix} from "../src/engine/matrixOps";
const official=String.raw`\begin{pmatrix}-2&1\\\frac{3}{2}&-\frac{1}{2}\end{pmatrix}`;
const b=[["1","2"],["3","4"]];
const identity=[["1","0"],["0","1"]];
test("SY-R-11 native MathLive Worker matrix result and reentry retain exact inverse",async({page})=>{
 await page.addInitScript(()=>localStorage.setItem("precision-lab-layout-mode","split"));
 await page.goto("./");
 const input=page.locator("math-field[aria-label='Entrada matemática']").first();
 await expect(input).toBeVisible();
 const result=page.locator("[data-result-request-id]").first();
 let source=official; let prior="";
 for(let pass=0;pass<2;pass++){
  await input.evaluate((node,latex)=>{(node as HTMLElement & {value:string}).value=latex;node.dispatchEvent(new Event("input",{bubbles:true}));},source);
  await page.locator("button:visible").filter({hasText:/^Calcular$/}).first().click();
  await expect(result.locator("math-field[read-only]").first()).toBeVisible();
  if(prior)await expect(result).not.toHaveAttribute("data-result-request-id",prior);
  const displayed=await result.locator("math-field[read-only]").first().evaluate(node=>(node as HTMLElement & {value:string}).value);
  const intent=detectMatrixIntent(displayed);
  expect(intent?.kind).toBe("literal");
  if(!intent||intent.kind!=="literal")throw Error("matrix UI result not parseable");
  const product=multiplyMatrices(toFractionMatrix(intent.matrix),toFractionMatrix(b)).result;
  expect(product.map(row=>row.map(v=>v.toFraction()))).toEqual(identity);
  source=(await result.getAttribute("data-result-reentry-latex"))??"";
  expect(source).not.toBe("");
  prior=(await result.getAttribute("data-result-request-id"))??"";
 }
});

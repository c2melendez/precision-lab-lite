import { test, expect } from "@playwright/test";
import {parseExpression} from "../src/engine/parsing";
import {evaluate} from "../src/engine/algebriteClient";
test("SY-R-10 native rational reentry retains equivalence and pole", async ({ page }) => {
 await page.addInitScript(() => localStorage.setItem("precision-lab-layout-mode", "split"));
 await page.goto("./");
 const input=page.locator("math-field[aria-label='Entrada matemática']").first();
 await expect(input).toBeVisible();
 const result=page.locator("[data-result-request-id]").first();
 let source=String.raw`\left(\frac{x+1}{x-1}\right)^{2}`;
 let previous="";
 for(let pass=0;pass<2;pass++) {
  await input.evaluate((node,latex)=>{(node as HTMLElement & {value:string}).value=latex;},source);
  await input.dispatchEvent("input",{bubbles:true});
  await page.locator("button:visible").filter({hasText:/^Calcular$/}).first().click();
  await expect(result).toBeVisible();
  if(previous) await expect(result).not.toHaveAttribute("data-result-request-id",previous);
  const display=result.locator("math-field[read-only]").first();
  await expect(display).toBeVisible();
  await expect.poll(async()=>{
   const latex=await display.evaluate(node=>(node as HTMLElement & {value:string}).value);
   if(!latex) return "empty";
   return evaluate("simplify(("+parseExpression(latex).algebrite+")-((x+1)^2/(x-1)^2))").trim();
  }).toBe("0");
  await expect(result.getByText("Restricciones del dominio",{exact:true})).toBeVisible();
  await expect.poll(async()=>{
   const fields=await result.locator("math-field[read-only]").all();
   for(const field of fields.slice(1)) {
    const value=await field.evaluate(node=>(node as HTMLElement & {value:string}).value);
    const parts=value.split(/\\ne(?:q)?\s*/);
    if(parts.length!==2) continue;
    const lhs=parseExpression(parts[0]).algebrite;
    const rhs=parseExpression(parts[1]).algebrite;
    if(rhs==="0" && /x/.test(lhs) && evaluate("subst(1,x,("+lhs+"))").trim()==="0" &&
      evaluate("subst(2,x,("+lhs+"))").trim()!=="0") return true;
   }
   return false;
  }).toBe(true);
  source=(await result.getAttribute("data-result-reentry-latex"))??"";
  expect(source).not.toBe("");
  previous=(await result.getAttribute("data-result-request-id"))??"";
  console.log("SY-R-10 native",{pass,source,request:previous});
 }
});

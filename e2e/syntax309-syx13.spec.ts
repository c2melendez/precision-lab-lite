import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
const row=readFileSync(new URL("../qa/certification/syntax309_cases.jsonl",import.meta.url),"utf8")
  .trim().split("\n").map(line=>JSON.parse(line)).find(row=>row.id==="SY-X-13");

test("SY-X-13 original nested derivative, exact visible output reentry and recovery",async({page},testInfo)=>{
  const errors:string[]=[];
  const evidence:Array<{source:string;serialized:string;requestId:string;output:string;reentry:string}>=[];
  page.on("pageerror",error=>errors.push(error.message));
  await page.addInitScript(()=>localStorage.setItem("precision-lab-layout-mode","split"));
  await page.goto("./");
  const input=page.locator("math-field[aria-label='Entrada matemática']").first();
  const result=page.locator("[data-result-request-id]").first();
  await expect(input).toBeVisible();
  expect(row.entrada).toBe(String.raw`\frac{d}{dx}x^{x^{x}}`);
  expect(row.esperado).toBe(String.raw`x^{x^{x}}\left(x^{x}(\ln x+1)\ln x+x^{x-1}\right)`);
  const oracle=parseExpression(row.esperado).algebrite;
  let prior="";
  async function calculate(source:string,symbolic:boolean){
    await input.evaluate((node,value)=>{
      (node as HTMLElement & {value:string}).value=value;
      node.dispatchEvent(new Event("input",{bubbles:true}));
    },source);
    const serialized=await input.evaluate(node=>(node as HTMLElement & {value:string}).value);
    expect(serialized).not.toBe("");
    // MathLive may normalize redundant braces/spaces; compare mathematical content.
    expect(evaluate(`simplify((${parseExpression(serialized).algebrite})-(${parseExpression(source).algebrite}))`)).toBe("0");
    await page.locator("button:visible").filter({hasText:/^Calcular$/}).first().click();
    await expect(result).toBeVisible();
    await expect(result).not.toHaveAttribute("data-result-request-id",prior);
    let output:string;
    if(symbolic){
      const display=result.locator("math-field[read-only]").first();
      await expect(display).toBeVisible();
      output=await display.evaluate(node=>(node as HTMLElement & {value:string}).value);
      expect(evaluate(`simplify((${parseExpression(output).algebrite})-(${oracle}))`)).toBe("0");
      const numeric=compileNumeric(parseExpression(output).algebrite,"x");
      for(const x of [1.25,1.5,2]){
        const expected=x**(x**x)*(x**x*(Math.log(x)+1)*Math.log(x)+x**(x-1));
        expect(numeric(x)).toBeCloseTo(expected,7);
      }
    }else{
      await expect(result.locator(".a11y-scale-result-3xl").first()).toHaveText("5");
      output="5";
    }
    const requestId=(await result.getAttribute("data-result-request-id"))!;
    const reentry=(await result.getAttribute("data-result-reentry-latex"))!;
    expect(requestId).toBeTruthy();expect(reentry).toBeTruthy();
    evidence.push({source,serialized,requestId,output,reentry});prior=requestId;
    await expect(page.getByRole("alert")).toHaveCount(0);
    return reentry;
  }
  await calculate(await calculate(row.entrada,true),true);
  await calculate(await calculate("2+3",false),false);
  expect(new Set(evidence.map(item=>item.requestId)).size).toBe(4);
  expect(errors).toEqual([]);
  await testInfo.attach("SY-X-13-native-worker-evidence",{body:JSON.stringify({row,domain:"x>0; no complex branch claim",project:testInfo.project.name,evidence,errors},null,2),contentType:"application/json"});
});

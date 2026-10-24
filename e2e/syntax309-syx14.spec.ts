import {readFileSync} from "node:fs";
import {expect,test} from "@playwright/test";
import {parseExpression} from "../src/engine/parsing";
import {evaluate} from "../src/engine/algebriteClient";
const row=readFileSync(new URL("../qa/certification/syntax309_cases.jsonl",import.meta.url),"utf8").trim().split("\n").map(line=>JSON.parse(line)).find(r=>r.id==="SY-X-14");
function nested(depth:number,inner="x"){for(let i=0;i<depth;i++)inner=String.raw`\frac{1}{${inner}}`;return inner;}

test("SY-X-14 actual50 reciprocals preserve parity and original domain, rejectzero and recover",async({page},testInfo)=>{
  test.setTimeout(60000);
  const errors:string[]=[];
  const evidence:unknown[]=[];
  const ids:string[]=[];
  page.on("pageerror",e=>errors.push(e.message));
  await page.addInitScript(()=>localStorage.setItem("precision-lab-layout-mode","split"));
  await page.goto("./");
  const input=page.locator("math-field[aria-label='Entrada matemática']").first();
  const result=page.locator("[data-result-request-id]").first();
  const calculate=page.locator("button:visible").filter({hasText:/^Calcular$/}).first();
  await expect(input).toBeVisible();
  expect(row.entrada).toBe(String.raw`\underbrace{\frac{1}{\frac{1}{\cdots\frac{1}{x}}}}_{50\text{ niveles}}`);
  async function enter(source:string,depth?:number){
    await input.evaluate((node,value)=>{(node as HTMLElement & {value:string}).value=value;node.dispatchEvent(new Event("input",{bubbles:true}));},source);
    const serialized=await input.evaluate(node=>(node as HTMLElement & {value:string}).value);
    if(depth!==undefined)expect(parseExpression(serialized).algebrite.match(/\//g)).toHaveLength(depth);
    else expect(serialized).toBe(source);
    return serialized;
  }
  async function symbolic(source:string,expected:string,depth?:number){
    const serialized=await enter(source,depth);
    await calculate.click();
    await expect(result).toBeVisible();
    await expect(result).not.toHaveAttribute("data-result-request-id",ids.at(-1)??"");
    const display=result.locator("math-field[read-only]").first();
    await expect(display).toBeVisible();
    const output=await display.evaluate(node=>(node as HTMLElement & {value:string}).value);
    expect(evaluate(`simplify((${parseExpression(output).algebrite})-(${expected}))`)).toBe("0");
    let restrictions:string[]=[];
    if(depth!==undefined){
      const domain=result.getByText("Restricciones del dominio",{exact:true}).locator("..");
      await expect(domain).toBeVisible();
      restrictions=await domain.locator("math-field[read-only]").evaluateAll(nodes=>nodes.map(node=>(node as HTMLElement & {value:string}).value));
      expect(restrictions.some(s=>/^x\\(?:ne|neq)0$/.test(s.replace(/\s/g,"")))).toBe(true);
    }
    const requestId=(await result.getAttribute("data-result-request-id"))!;
    const reentry=(await result.getAttribute("data-result-reentry-latex"))!;
    expect(requestId).toBeTruthy();expect(reentry).toBeTruthy();ids.push(requestId);
    evidence.push({source,serialized,output,requestId,reentry,restrictions});
    return reentry;
  }
  const reentry=await symbolic(nested(50),"x",50);
  // Pasting x alone is a new expression; original restrictions are verified above.
  await symbolic(reentry,"x");
  await symbolic(nested(49),"1/x",49);
  await enter(nested(50,"0"),50);await calculate.click();
  await expect(page.getByRole("alert")).toContainText(/cero|zero|divisi/i);
  await expect(result).toHaveCount(0);
  for(const source of ["2+3","5"]){
    await enter(source);await calculate.click();await expect(result).toBeVisible();
    await expect(result).not.toHaveAttribute("data-result-request-id",ids.at(-1)??"");
    await expect(result.locator(".a11y-scale-result-3xl").first()).toHaveText("5");
    ids.push((await result.getAttribute("data-result-request-id"))!);
    expect(await result.getAttribute("data-result-reentry-latex")).toBe("5");
    await expect(page.getByRole("alert")).toHaveCount(0);
  }
  expect(new Set(ids).size).toBe(5);expect(errors).toEqual([]);
  await testInfo.attach("SY-X-14-native-worker-evidence",{body:JSON.stringify({row,project:testInfo.project.name,evidence,ids,errors,domainScope:"x!=0 on original result; pasting x without metadata starts a new expression"},null,2),contentType:"application/json"});
});

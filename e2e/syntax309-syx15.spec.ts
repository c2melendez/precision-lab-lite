import {readFileSync} from "node:fs";
import {expect,test} from "@playwright/test";
import {installScriptProbe,verifyInsertionControl} from "./scriptInertProbe";
const row=readFileSync(new URL("../qa/certification/syntax309_cases.jsonl",import.meta.url),"utf8").trim().split("\n").map(line=>JSON.parse(line)).find(row=>row.id==="SY-X-15");
test("SY-X-15 probe positive control detects inert script insertion in closed shadow DOM",async({page},testInfo)=>{
  const evidence=await verifyInsertionControl(page,"./");
  await testInfo.attach("SY-X-15-probe-control",{body:JSON.stringify(evidence),contentType:"application/json"});
});
test("SY-X-15 original script text never executes or becomes HTML, then Worker recovery",async({page},testInfo)=>{
  const probe=await installScriptProbe(page);
  await page.addInitScript(()=>localStorage.setItem("precision-lab-layout-mode","split"));
  await page.goto("./");
  const input=page.locator("math-field[aria-label='Entrada matemática']").first();
  const result=page.locator("[data-result-request-id]").first();
  const calculate=page.locator("button:visible").filter({hasText:/^Calcular$/}).first();
  await expect(input).toBeVisible();
  expect(row.entrada).toBe(String.raw`\text{<script>alert(1)</script>}`);
  expect(row.esperado).toBe("tratado como texto o error; **nunca** se ejecuta ni se inserta como HTML");
  async function enter(source:string){
    await input.evaluate((node,value)=>{(node as HTMLElement & {value:string}).value=value;node.dispatchEvent(new Event("input",{bubbles:true}));},source);
    return input.evaluate(node=>(node as HTMLElement & {value:string}).value);
  }
  const serialized=await enter(row.entrada);
  expect(serialized).toContain("<script>alert(1)</script>");
  const ingestion=await probe.assertInert();
  await calculate.click();
  let outcome="";
  await expect.poll(async()=>{
    const alerts=await page.getByRole("alert").allInnerTexts();
    if(alerts.some(text=>text.trim()))return outcome="clear-error";
    if(await result.count()){
      const display=result.locator("math-field[read-only]").first();
      if(await display.count()){
        const value=await display.evaluate(node=>(node as HTMLElement & {value:string}).value);
        if(value.includes("<script>alert(1)</script>"))return outcome="inert-text";
      }
    }
    return "pending";
  }).not.toBe("pending");
  const notice=(await page.getByRole("alert").allInnerTexts()).join(" ");
  if(outcome==="clear-error")await expect(result).toHaveCount(0);
  const rejected=await probe.assertInert();
  const ids:string[]=[];
  for(const source of ["2+3","5"]){
    expect(await enter(source)).toBe(source);await calculate.click();
    await expect(result).toBeVisible();
    await expect(result).not.toHaveAttribute("data-result-request-id",ids.at(-1)??"");
    await expect(result.locator(".a11y-scale-result-3xl").first()).toHaveText("5");
    expect(await result.getAttribute("data-result-reentry-latex")).toBe("5");
    ids.push((await result.getAttribute("data-result-request-id"))!);
    await expect(page.getByRole("alert")).toHaveCount(0);
  }
  expect(new Set(ids).size).toBe(2);
  const recovered=await probe.assertInert();
  await testInfo.attach("SY-X-15-native-inert-text-evidence",{body:JSON.stringify({row,serialized,outcome,notice,project:testInfo.project.name,ingestion,rejected,recovered,ids},null,2),contentType:"application/json"});
});

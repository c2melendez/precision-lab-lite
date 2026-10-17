import {readFileSync} from "node:fs";
import {expect,test} from "@playwright/test";
import {installFileProbe} from "./fileAccessProbe";
const row=readFileSync(new URL("../qa/certification/syntax309_cases.jsonl",import.meta.url),"utf8").trim().split("\n").map(line=>JSON.parse(line)).find(row=>row.id==="SY-X-18");
test("SY-X-18 original Python-like command is rejected, then Worker recovery",async({page},testInfo)=>{
  const probe=await installFileProbe(page);
  await page.addInitScript(()=>localStorage.setItem("precision-lab-layout-mode","split"));
  await page.goto("./");
  const input=page.locator("math-field[aria-label='Entrada matemática']").first();
  const result=page.locator("[data-result-request-id]").first();
  const calculate=page.locator("button:visible").filter({hasText:/^Calcular$/}).first();
  await expect(input).toBeVisible();
  expect(row.entrada).toBe(String.raw`__import__('os').system('ls')`);
  expect(row.esperado).toBe("error de sintaxis sin ejecutar nada (relevante para el backend de Plus)");
  async function enter(source:string){
    await input.evaluate((node,value)=>{(node as HTMLElement & {value:string}).value=value;node.dispatchEvent(new Event("input",{bubbles:true}));},source);
    return input.evaluate(node=>(node as HTMLElement & {value:string}).value);
  }
  const serialized=await enter(row.entrada);
  // Subscript/prime formatting may change, but every payload letter must survive in order.
  expect(serialized.replace(/\\[A-Za-z]+/g,"").replace(/[^A-Za-z]/g,"")).toBe("importossystemls");
  const ingestion=probe.assertNoAccess();
  await calculate.click();
  const alert=page.getByRole("alert");await expect(alert).toBeVisible();
  await expect(alert).toContainText(/desconocido|no reconocido|no permitido|no soportado|inválid|error/i);
  await expect(result).toHaveCount(0);
  const notice=(await alert.allInnerTexts()).join(" ");
  const rejected=probe.assertNoAccess();
  const ids:string[]=[];
  for(const source of ["2+3","5"]){
    expect(await enter(source)).toBe(source);await calculate.click();await expect(result).toBeVisible();
    await expect(result).not.toHaveAttribute("data-result-request-id",ids.at(-1)??"");
    await expect(result.locator(".a11y-scale-result-3xl").first()).toHaveText("5");
    expect(await result.getAttribute("data-result-reentry-latex")).toBe("5");
    ids.push((await result.getAttribute("data-result-request-id"))!);
    await expect(page.getByRole("alert")).toHaveCount(0);
  }
  expect(new Set(ids).size).toBe(2);const recovered=probe.assertNoAccess();
  await testInfo.attach("SY-X-18-native-python-command-evidence",{body:JSON.stringify({row,serialized,project:testInfo.project.name,notice,ingestion,rejected,recovered,ids},null,2),contentType:"application/json"});
});

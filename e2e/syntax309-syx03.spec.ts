import {test,expect,type Page} from "@playwright/test";
async function open(page:Page){
 await page.addInitScript(()=>localStorage.setItem("precision-lab-layout-mode","split"));
 await page.goto("./");
 const input=page.locator("math-field[aria-label='Entrada matemática']").first();
 await expect(input).toBeVisible();
 return {input,calculate:page.locator("button:visible").filter({hasText:/^Calcular$/}).first(),result:page.locator("[data-result-request-id]").first()};
}
function hasContent(latex:string){return Boolean(latex.replace(/\\(?:[,;!: ]|qquad\b|quad\b)/g,"").trim());}
test("SY-X-03 native literal backslash syntax is rejected when retained by MathLive",async({page})=>{
 const errors:string[]=[];page.on("pageerror",error=>errors.push(error.message));
 const {input,calculate}=await open(page);
 await input.evaluate((node,source)=>{(node as HTMLElement & {value:string}).value=source;node.dispatchEvent(new Event("input",{bubbles:true}));},"\\".repeat(2));
 const serialized=await input.evaluate(node=>(node as HTMLElement & {value:string}).value);
 console.log("SY-X-03 INGESTION",JSON.stringify({serialized,enabled:await calculate.isEnabled()}));
 test.skip(!hasContent(serialized),"CAPABILITY: MathLive removes the literal row separator before evaluation; native rejection is not certified.");
 await expect(calculate).toBeEnabled();
 await calculate.click();
 const alert=page.locator("[role=alert]").first();
 await expect(alert).toContainText("PARSE_ERROR");
 await expect(alert).toContainText(/sintaxis|carácter|comando|interpretar|barra/i);
 await expect(alert).not.toContainText("Escriba una expresión antes de calcular.");
 await expect(page.locator("[data-result-request-id]")).toHaveCount(0);
 expect(errors).toEqual([]);
});
test("SY-X-03 native ingestion or rejection recovers twice to 5",async({page})=>{
 const errors:string[]=[];page.on("pageerror",error=>errors.push(error.message));
 const {input,calculate,result}=await open(page);
 let prior="";
 for(let pass=0;pass<2;pass++){
  await input.evaluate((node,source)=>{(node as HTMLElement & {value:string}).value=source;node.dispatchEvent(new Event("input",{bubbles:true}));},"\\".repeat(2));
  const serialized=await input.evaluate(node=>(node as HTMLElement & {value:string}).value);
  console.log("SY-X-03 RECOVERY INGESTION",JSON.stringify({serialized,enabled:await calculate.isEnabled()}));
  if(await calculate.isEnabled()){
   await calculate.click();
   await expect(page.locator("[role=alert]").first()).toContainText("PARSE_ERROR");
   await expect(page.locator("[data-result-request-id]")).toHaveCount(0);
  }
  await input.evaluate(node=>{(node as HTMLElement & {value:string}).value="2+3";node.dispatchEvent(new Event("input",{bubbles:true}));});
  await calculate.click();
  await expect(result).toBeVisible();
  if(prior)await expect(result).not.toHaveAttribute("data-result-request-id",prior);
  await expect(result.locator(".a11y-scale-result-3xl").first()).toHaveText("5");
  await expect(page.locator("[role=alert]")).toHaveCount(0);
  prior=(await result.getAttribute("data-result-request-id"))??"";
  expect(prior).not.toBe("");
 }
 expect(errors).toEqual([]);
});

import {test,expect} from "@playwright/test";
for(const [source,operator] of [["x≥1",">="],["x>1",">"],["1≤x",">="]]){
 test("SY-Q-23 native Unicode boundary: "+source,async({page})=>{
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
  const read=async()=> (await result.locator("math-field[read-only]").first()
   .evaluate(node=>(node as HTMLElement & {value:string}).value))
   .replace(/\\text\{([^{}]*)\}/g,"$1").replace(/\s/g,"");
  await expect.poll(read).toBe("x"+operator+"1");
  const relation=/^x(>=|>)1$/.exec(await read())!;
  expect(relation).not.toBeNull();
  const contains=(x:number)=>relation[1]===">="?x>=1:x>1;
  expect([0,1,2,1000000].map(contains)).toEqual([false,operator===">=",true,true]);

 });
}

import {test,expect} from "@playwright/test";
for(const [source,operator] of [["x\\leq2","<="],["x<2","<"],["2\\geq x","<="]]){
 test("SY-Q-21 native closed/strict boundary: "+source,async({page})=>{
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
  await expect.poll(read).toBe("x"+operator+"2");
  const relation=/^x(<=|<)2$/.exec(await read())!;
  expect(relation).not.toBeNull();
  const contains=(x:number)=>relation[1]==="<="?x<=2:x<2;
  expect([-1000000,1,2,3].map(contains)).toEqual([true,true,operator==="<=",false]);
 });
}

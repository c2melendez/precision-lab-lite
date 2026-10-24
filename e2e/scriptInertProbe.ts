import {expect,type Page} from "@playwright/test";

// Observation only: preserve real script/HTML insertion and alert behavior.
export async function installScriptProbe(page:Page){
  const dialogs:Array<{type:string;message:string}>=[];
  const errors:string[]=[];
  page.on("dialog",async dialog=>{
    dialogs.push({type:dialog.type(),message:dialog.message()});
    await dialog.dismiss(); // recorded execution still fails; never replace alert()
  });
  page.on("pageerror",error=>errors.push(error.message));
  await page.addInitScript(()=>{
    const insertions:Array<{tag:string;text:string}>=[];
    const roots=new Set<Document|ShadowRoot>();
    const seen=new WeakSet<Element>();
    const isPayload=(element:Element)=>element.localName.toLowerCase()==="script" &&
      /^\s*alert\s*\(\s*1\s*\)\s*;?\s*$/.test(element.textContent??"");
    function inspect(node:Node){
      if(node instanceof Element && isPayload(node) && !seen.has(node)){
        seen.add(node);insertions.push({tag:node.localName,text:node.textContent??""});
      }
      if(node instanceof Element || node instanceof Document || node instanceof DocumentFragment){
        for(const script of node.querySelectorAll("script"))if(isPayload(script)&&!seen.has(script)){
          seen.add(script);insertions.push({tag:script.localName,text:script.textContent??""});
        }
      }
    }
    const observer=new MutationObserver(records=>{
      for(const record of records){
        for(const node of record.addedNodes)inspect(node);
        if(record.type==="characterData"&&record.target.parentElement)inspect(record.target.parentElement);
      }
    });
    function watch(root:Document|ShadowRoot){
      if(roots.has(root))return;roots.add(root);inspect(root);
      observer.observe(root,{childList:true,subtree:true,characterData:true});
    }
    const original=Element.prototype.attachShadow;
    Element.prototype.attachShadow=function(init:ShadowRootInit){
      const root=original.call(this,init);watch(root);return root;
    };
    watch(document);
    (window as Window & {__syntax15Probe:()=>{insertions:typeof insertions;observedRoots:number}}).__syntax15Probe=()=>{
      for(const root of roots)inspect(root);
      return {insertions:[...insertions],observedRoots:roots.size};
    };
  });
  async function snapshot(){
    const dom=await page.evaluate(()=>(window as Window & {__syntax15Probe:()=>{insertions:Array<{tag:string;text:string}>;observedRoots:number}}).__syntax15Probe());
    return {...dom,dialogs:[...dialogs],errors:[...errors]};
  }
  return {snapshot,async assertInert(){
    const dom=await snapshot();
    expect(dom.observedRoots).toBeGreaterThan(1); // document + real MathLive shadow roots
    expect(dom.insertions).toEqual([]);expect(dialogs).toEqual([]);expect(errors).toEqual([]);
    return {...dom,dialogs,errors};
  }};
}

// Positive control: a script element in a closed shadow root must be detected,
// even when application/json prevents execution. This is harness evidence only.
export async function verifyInsertionControl(page:Page,url:string){
  const probe=await installScriptProbe(page);
  await page.goto(url);
  await page.evaluate(()=>{
    const host=document.createElement("div");
    const root=host.attachShadow({mode:"closed"});
    document.body.append(host);
    const script=document.createElement("script");
    script.type="application/json";
    script.textContent="alert(1)";
    root.append(script);
  });
  await expect.poll(async()=>(await probe.snapshot()).insertions.length).toBe(1);
  const evidence=await probe.snapshot();
  expect(evidence.insertions).toEqual([{tag:"script",text:"alert(1)"}]);
  expect(evidence.dialogs).toEqual([]);
  expect(evidence.errors).toEqual([]);
  return evidence;
}


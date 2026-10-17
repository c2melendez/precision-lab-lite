import {expect,type Page} from "@playwright/test";

export const FILE_PROBE_SENTINEL="/__syntax16_file_probe_sentinel__";
export async function installFileProbe(page:Page){
  const attempts:Array<{url:string;blocked:boolean}>=[];
  const dialogs:Array<{type:string;message:string}>=[];
  const errors:string[]=[];
  const downloads:string[]=[];
  const choosers:string[]=[];
  page.on("dialog",async d=>{dialogs.push({type:d.type(),message:d.message()});await d.dismiss();});
  page.on("pageerror",e=>errors.push(e.message));
  page.on("download",d=>downloads.push(d.suggestedFilename()));
  page.on("filechooser",()=>choosers.push("filechooser"));
  await page.route("**/*",async route=>{
    let decoded=route.request().url();
    for(let i=0;i<3;i++){try{const next=decodeURIComponent(decoded);if(next===decoded)break;decoded=next;}catch{break;}}
    if(decoded.includes("/etc/passwd")||decoded.includes(FILE_PROBE_SENTINEL)){
      attempts.push({url:route.request().url(),blocked:true});
      await route.abort("blockedbyclient"); // prevents any target fetch; a product attempt still fails
    }else await route.continue();
  });
  const snapshot=()=>({attempts:[...attempts],dialogs:[...dialogs],errors:[...errors],downloads:[...downloads],choosers:[...choosers]});
  return {snapshot,assertNoAccess(){
    const evidence=snapshot();
    expect(evidence.attempts).toEqual([]);expect(evidence.dialogs).toEqual([]);
    expect(evidence.errors).toEqual([]);expect(evidence.downloads).toEqual([]);expect(evidence.choosers).toEqual([]);
    return evidence;
  }};
}

// Synthetic path cannot name a host file, even if the detector were broken.
export async function verifyFileProbeControl(page:Page,url:string){
  const probe=await installFileProbe(page);await page.goto(url);
  await page.evaluate(async path=>{await fetch(path).catch(()=>null);},FILE_PROBE_SENTINEL);
  await expect.poll(()=>probe.snapshot().attempts.length).toBe(1);
  const evidence=probe.snapshot();
  expect(evidence.attempts[0].url).toContain(FILE_PROBE_SENTINEL);
  expect(evidence.attempts[0].blocked).toBe(true);
  expect(evidence.dialogs).toEqual([]);expect(evidence.errors).toEqual([]);
  expect(evidence.downloads).toEqual([]);expect(evidence.choosers).toEqual([]);
  return evidence;
}


"""MV153 and TR324 frozen-source checks and per-ID observations, never PASS."""
import argparse
import gzip
import hashlib
import json
import re
import xml.etree.ElementTree as ET
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
COUNTS = dict(A=25,B=22,C=19,D=17,E=12,F=17,G=22,H=12,J=7)
ID_RE = re.compile(r"(?<![A-Za-z0-9])MV[-_]([A-HJ])[-_](\d{2})(?![A-Za-z0-9])", re.I)

def sha(data):
    return hashlib.sha256(data).hexdigest()

def sources(root):
    base = root / "qa/certification/legacy_sources"
    manifest = json.loads((base/"MANIFEST.json").read_text(encoding="utf-8"))
    expected = {"IN625","IN309","AS114","AS229","TR324","LER","MV153","EDCX","GR519"}
    if len(manifest)!=9 or {r["key"] for r in manifest}!=expected:
        raise ValueError("unexpected source inventory")
    result = {}
    for item in manifest:
        name = item["canonical_gz"]
        if Path(name).name!=name:
            raise ValueError("invalid source path")
        raw = gzip.decompress((base/name).read_bytes())
        if sha(raw)!=item["sha256_raw"] or len(raw)!=item["bytes_raw"]:
            raise ValueError("source mismatch: "+name)
        result[item["key"]] = {"file":name,"sha256":sha(raw),"bytes":len(raw)}
    return result

def fixture(root):
    data = (root/"qa/certification/matrices_ejecutables.jsonl").read_bytes()
    rows = [json.loads(line) for line in data.decode("utf-8-sig").splitlines() if line.strip()]
    expected = {f"MV-{s}-{i:02d}" for s,n in COUNTS.items() for i in range(1,n+1)}
    if len(rows)!=153 or {r["id"] for r in rows}!=expected:
        raise ValueError("missing or duplicate MV153 IDs")
    for r in rows:
        if r["seccion"]!=r["id"].split("-")[1] or not r["entrada"] or not r["esperado"]:
            raise ValueError("invalid row: "+r["id"])
    return rows, sha(data)

TR_ID = re.compile(r"(?<![A-Za-z0-9])(?:TRIG[-_])?((?:EV|EC|IN|LM|DV|IT|ID|CL|GR)[-_](?:(?:HI|D|I|H)[-_]?)?\d{2})(?![A-Za-z0-9])", re.I)
TR_ROW = re.compile(r"^\s*\|\s*`?([A-Z]{2}(?:-[A-Z]{1,3})?-\d{2})`?\s*\|")

def trig_fixture(root):
    path = root / "qa/certification/legacy_sources/ejercicios_trigonometria.md.gz"
    raw = gzip.decompress(path.read_bytes())
    rows = []
    for line in raw.decode("utf-8-sig").splitlines():
        match = TR_ROW.match(line)
        if match:
            case = match.group(1)
            rows.append({"id":case,"operacion":case.rsplit("-",1)[0],
                         "source_row":line})
    if len(rows)!=324 or len({r["id"] for r in rows})!=324:
        raise ValueError(f"TR324 source inventory mismatch: {len(rows)} rows, {len({r['id'] for r in rows})} unique")
    return rows,sha(raw)

def trig_matches(name, ids):
    # Normalize only explicit IDs. Never expand ranges or infer from filenames.
    result=set()
    for m in TR_ID.finditer(name):
        token=m.group(1).upper().replace("_","-")
        token=re.sub(r"([A-Z])(\d{2})$",r"\1-\2",token)
        if token in ids:
            result.add(token)
    return result

def product_is_vitest(case):
    return case.get("classname", "").endswith(".audit.test.ts")

def observations(xml, ids, matrix='MV153'):
    mapped = {i:[] for i in ids}
    unmapped = []
    for case in ET.parse(xml).iter("testcase"):
        name = case.get("name","")
        leaf = name.rsplit(" > ",1)[-1] if product_is_vitest(case) else name
        matches = trig_matches(leaf, mapped) if matrix == "TR324" else {f"MV-{m[0].upper()}-{m[1]}" for m in ID_RE.findall(leaf)}
        # Presence-only checks are not execution of the mathematical case.
        if matrix == "TR324" and re.search(r"matrix contains|source row|source integrity|source.*present", leaf, re.I):
            matches = set()
        status = ("FAIL_OBSERVED" if case.find("failure") is not None or case.find("error") is not None
                  else "SKIPPED_OBSERVED" if case.find("skipped") is not None
                  else "TEST_OK_OBSERVED")
        item = {"name":name,"classname":case.get("classname",""),"status":status,"seconds":case.get("time","")}
        if len(matches)==1 and next(iter(matches)) in mapped:
            mapped[next(iter(matches))].append(item)
        else:
            unmapped.append(item)
    return mapped, unmapped

def row_state(items):
    states = {i["status"] for i in items}
    if "FAIL_OBSERVED" in states:
        return "FAIL_OBSERVED"
    if "SKIPPED_OBSERVED" in states:
        return "REVIEW_SKIPPED"
    if states=={"TEST_OK_OBSERVED"}:
        return "REVIEW_TEST_OK"
    return "REVIEW_NO_MAPPED_TEST"

def report(root, xml, product, commit, run, attempt, exit_code, matrix='MV153'):
    verified = sources(root)
    rows,digest = trig_fixture(root) if matrix == "TR324" else fixture(root)
    mapped,unmapped = observations(xml,[r["id"] for r in rows],matrix)
    records = []
    for r in rows:
        items = mapped[r["id"]]
        records.append({"matrix":matrix,"id":r["id"],"family":r["operacion"],
                        "source_sha256":verified[matrix]["sha256"],
                        "fixture_row_sha256":sha(json.dumps(r,sort_keys=True,ensure_ascii=False).encode()),
                        "observation":row_state(items),"certification":"REVIEW","tests":items})
    return {"schema":"certification-observation-v2","product":product,"matrix":matrix,"sha":commit,
            "run":run,"attempt":attempt,"test_exit_code":exit_code,"fixture_sha256":digest,
            "junit_sha256":sha(Path(xml).read_bytes()),"sources":verified,
            "counts":dict(Counter(r["observation"] for r in records)),
            "certification_pass_count":0,"rows":records,"unmapped_tests":unmapped,
            "limitations":["JUnit observations only; independent acceptance and channels not established",
                           "Missing ID mapping or skipped tests remain REVIEW"]}

def main():
    p=argparse.ArgumentParser()
    p.add_argument("--matrix",choices=["MV153","TR324"],default="MV153")
    p.add_argument("--product",choices=["lite","plus"],required=True)
    p.add_argument("--xml",type=Path,required=True)
    p.add_argument("--output",type=Path,required=True)
    p.add_argument("--sha",required=True)
    p.add_argument("--run",required=True)
    p.add_argument("--attempt",required=True)
    p.add_argument("--exit-code",type=int,required=True)
    a=p.parse_args()
    result=report(ROOT,a.xml,a.product,a.sha,a.run,a.attempt,a.exit_code,a.matrix)
    a.output.write_text(json.dumps(result,indent=2,ensure_ascii=False)+"\n",encoding="utf-8")
    print(json.dumps(result["counts"],sort_keys=True))
    return int(bool(a.exit_code or result["counts"].get("FAIL_OBSERVED")))

if __name__=="__main__":
    raise SystemExit(main())

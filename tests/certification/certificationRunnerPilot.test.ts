import fs from "node:fs";
import path from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { derivative, evaluate } from "../../src/engine/algebriteClient";

type AdapterCase = {
  id: string;
  capability_ref: string;
  operation: "simplify" | "expand" | "factor" | "derivative";
  canonical: { input: string; expected: string };
  adapters: { lite: { expression: string; expected: string; variable?: string; order?: number } };
};

type ResultRow = {
  id: string;
  status: "PASS" | "FAIL" | "ERROR";
  operation: string;
  expected: string;
  actual?: string;
  error?: string;
};

const fixturePath = path.resolve(process.cwd(), "qa/certification/certification_cases_v1.json");
const fixture = JSON.parse(fs.readFileSync(fixturePath, "utf8")) as { suite_id: string; cases: AdapterCase[] };
const rows: ResultRow[] = [];

function equivalent(actual: string, expected: string): boolean {
  const diff = evaluate(`simplify((${actual})-(${expected}))`).replace(/\\s+/g, "");
  return diff === "0";
}

afterAll(() => {
  const summary = {
    total: rows.length,
    pass: rows.filter((r) => r.status === "PASS").length,
    fail: rows.filter((r) => r.status === "FAIL").length,
    error: rows.filter((r) => r.status === "ERROR").length,
  };
  const report = {
    schema_version: "1.0",
    suite_id: fixture.suite_id,
    engine: "lite",
    layer: "L0",
    git_sha: process.env.GITHUB_SHA ?? null,
    summary,
    results: rows,
  };
  fs.mkdirSync(path.resolve(process.cwd(), "artifacts"), { recursive: true });
  fs.writeFileSync(
    path.resolve(process.cwd(), "artifacts/certification-results-lite.json"),
    JSON.stringify(report, null, 2),
  );
});

describe("Certification runner pilot v1 — canonical oracle_verified algebra cases", () => {
  for (const c of fixture.cases) {
    it(`[${c.id}] ${c.operation}`, () => {
      try {
        const a = c.adapters.lite;
        const actual = c.operation === "derivative"
          ? derivative(a.expression, a.variable ?? "x", a.order ?? 1)
          : evaluate(`${c.operation}(${a.expression})`);
        const ok = equivalent(actual, a.expected);
        rows.push({ id: c.id, status: ok ? "PASS" : "FAIL", operation: c.operation, expected: a.expected, actual });
        expect(ok, `${c.id}: actual=${actual} expected=${a.expected}`).toBe(true);
      } catch (error) {
        rows.push({ id: c.id, status: "ERROR", operation: c.operation, expected: c.adapters.lite.expected, error: String(error) });
        throw error;
      }
    });
  }
});

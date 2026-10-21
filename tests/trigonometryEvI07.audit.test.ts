import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/ejercicios_trigonometria.md.gz");

function rowOf(id: string): string {
  const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
  return text.split("\n").find((line) => new RegExp(`\\|\\s*${id}\\s*\\|`).test(line)) ?? "";
}

function run(input: string): string {
  return evaluate(parseExpression(input, "RAD").algebrite).replace(/\s+/g, "");
}

function approx(input: string): number {
  return Number(
    evaluate(`float(${parseExpression(input, "RAD").algebrite})`)
      .trim()
      .replace(/\.\.\.$/, ""),
  );
}

describe("Trigonometry EV-I-07 arccot(-1) principal range", () => {
  it("official row documents 3pi/4", () => {
    const row = rowOf("EV-I-07");
    expect(row).not.toBe("");
    expect(row).toContain("\\operatorname{arccot}(-1)");
    expect(row).toContain("\\frac{3\\pi}{4}");
  });

  it("evaluates arccot(-1) to 3pi/4 with the principal range (0, pi)", () => {
    expect(run("arccot(-1)")).toBe("3/4*pi");
    expect(run("\\operatorname{arccot}(-1)")).toBe("3/4*pi");
    expect(run("\\cot^{-1}\\left(-1\\right)")).toBe("3/4*pi");
    expect(approx("arccot(-1)")).toBeCloseTo((3 * Math.PI) / 4, 6);
  });

  it("keeps the rest of the branch consistent", () => {
    expect(run("arccot(0)")).toBe("1/2*pi");
    expect(run("arccot(1)")).toBe("1/4*pi");
    expect(approx("arccot(1)")).toBeCloseTo(Math.PI / 4, 6);
  });
});

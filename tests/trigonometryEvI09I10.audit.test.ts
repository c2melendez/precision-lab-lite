import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";
import { ErrorCode } from "../src/types";
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

/** Equivalencia simbólica exacta entre dos formas (no comparación textual). */
function equivalent(left: string, right: string): boolean {
  return evaluate(`(${left})-(${right})`).replace(/\s+/g, "") === "0";
}

function domainError(input: string): { code?: string } {
  try {
    run(input);
  } catch (error) {
    return error as { code?: string };
  }
  throw new Error(`expected a DOMAIN_ERROR for ${input}`);
}

describe("Trigonometry EV-I-09 arcsin(sin 2) principal range", () => {
  it("official row documents pi-2 approx 1.141592654", () => {
    const row = rowOf("EV-I-09");
    expect(row).not.toBe("");
    expect(row).toContain("\\arcsin(\\sin 2)");
    expect(row).toContain("\\pi-2");
    expect(row).toContain("1.141592654");
  });

  it("evaluates the official LaTeX row to pi-2 (not 2)", () => {
    const result = run("\\arcsin(\\sin 2)");
    expect(result).not.toBe("2");
    expect(equivalent(result, "pi-2")).toBe(true);
    // Canal ASCII: misma interpretación matemática.
    expect(equivalent(run("arcsin(sin(2))"), "pi-2")).toBe(true);
  });

  it("matches the documented 9-decimal reference", () => {
    expect(approx("\\arcsin(\\sin 2)")).toBeCloseTo(1.141592654, 6);
  });

  it("keeps the principal branch inside the domain unchanged", () => {
    expect(equivalent(run("\\arcsin(\\sin(\\frac{\\pi}{6}))"), "pi/6")).toBe(true);
    expect(equivalent(run("\\arcsin(\\sin(0))"), "0")).toBe(true);
    expect(equivalent(run("\\arcsin(\\sin(\\frac{\\pi}{2}))"), "pi/2")).toBe(true);
  });

  it("applies the same principal-range rule to arccos(cos t) and arctan(tan t)", () => {
    expect(equivalent(run("\\arccos(\\cos(2))"), "2")).toBe(true);
    expect(equivalent(run("\\arccos(\\cos(4))"), "2*pi-4")).toBe(true);
    expect(equivalent(run("\\arctan(\\tan(2))"), "2-pi")).toBe(true);
  });
});

describe("Trigonometry EV-I-10 sin(arccos 3/5)", () => {
  it("official row documents 4/5", () => {
    const row = rowOf("EV-I-10");
    expect(row).not.toBe("");
    expect(row).toContain("\\arccos\\frac{3}{5}");
    expect(row).toContain("\\frac{4}{5}");
  });

  it("evaluates the official LaTeX row to 4/5", () => {
    expect(run("\\sin\\left(\\arccos\\frac{3}{5}\\right)")).toBe("4/5");
    expect(run("sin(arccos(3/5))")).toBe("4/5");
    expect(approx("\\sin\\left(\\arccos\\frac{3}{5}\\right)")).toBeCloseTo(0.8, 6);
  });

  it("covers the companion Pythagorean compositions exactly", () => {
    expect(run("cos(arcsin(3/5))")).toBe("4/5");
    expect(run("sin(arccos(-3/5))")).toBe("4/5");
    expect(run("tan(arcsin(3/5))")).toBe("3/4");
    expect(run("sin(arccos(1))")).toBe("0");
    expect(run("sin(arccos(0))")).toBe("1");
  });

  it("keeps the out-of-domain contract as a clear DOMAIN_ERROR", () => {
    expect(domainError("\\arcsin(2)").code).toBe(ErrorCode.DOMAIN_ERROR);
    expect(domainError("arcsin(2)").code).toBe(ErrorCode.DOMAIN_ERROR);
    expect(domainError("\\arccos(-2)").code).toBe(ErrorCode.DOMAIN_ERROR);
  });
});

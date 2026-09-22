import { describe, expect, it } from "vitest";
import {
  analyzeGraph,
  analyzeGraphParametric,
  analyzeGraphPolar,
  analyzeGraphSurface3D,
} from "../src/engine/stepEngine/graphing";

describe("Suite exhaustiva original — Módulo 9: Graficación", () => {
  it("2D x^2 detecta raíz y vértice cerca de 0", () => {
    const r = analyzeGraph("x^2", "x", [-2, 2]);
    expect(r.samples.length).toBeGreaterThan(1900);
    expect(r.xIntercepts.some(x => Math.abs(x) < 1e-2)).toBe(true);
    expect(r.vertex).not.toBeNull();
    expect(Math.abs(r.vertex!.x)).toBeLessThan(1e-2);
    expect(Math.abs(r.vertex!.y)).toBeLessThan(1e-2);
  });

  it("2D 1/(x-2) detecta hueco y no inventa raíz", () => {
    const r = analyzeGraph("1/(x-2)", "x", [0, 4]);
    expect(r.samples.length).toBeLessThan(2001);
    expect(r.domainDescription).toMatch(/discontinuidades|restricciones/i);
    expect(r.xIntercepts).toHaveLength(0);
    expect(r.samples.some(p => Math.abs(p.x - 2) < 1e-12)).toBe(false);
  });

  it("paramétrica cos(t),sin(t) forma círculo unitario", () => {
    const r = analyzeGraphParametric("cos(t)", "sin(t)", "t", [0, 2 * Math.PI]);
    expect(r.samples.length).toBe(2001);
    expect(r.samples[0].x).toBeCloseTo(1, 8);
    expect(r.samples[0].y).toBeCloseTo(0, 8);
    expect(r.samples.at(-1)!.x).toBeCloseTo(1, 6);
    expect(r.samples.at(-1)!.y).toBeCloseTo(0, 6);
  });

  it("polar r=1 forma círculo unitario", () => {
    const r = analyzeGraphPolar("1", "theta", [0, 2 * Math.PI]);
    expect(r.samples.length).toBe(2001);
    expect(r.samples[0].x).toBeCloseTo(1, 8);
    expect(r.samples[0].y).toBeCloseTo(0, 8);
  });

  it("3D z=x+y produce grilla 30x30 y extremos correctos", () => {
    const r = analyzeGraphSurface3D("x+y", "x", "y", [-1,1], [-1,1]);
    expect(r.xValues).toHaveLength(30);
    expect(r.yValues).toHaveLength(30);
    expect(r.zGrid).toHaveLength(30);
    expect(r.zGrid[0]).toHaveLength(30);
    expect(r.zGrid[0][0]).toBeCloseTo(-2, 8);
    expect(r.zGrid.at(-1)!.at(-1)).toBeCloseTo(2, 8);
  });

  it("rangos degenerados se rechazan explícitamente", () => {
    expect(() => analyzeGraph("x", "x", [1,1])).toThrow();
    expect(() => analyzeGraphPolar("1", "theta", [1,1])).toThrow();
    expect(() => analyzeGraphParametric("t", "t", "t", [1,1])).toThrow();
    expect(() => analyzeGraphSurface3D("x+y", "x", "y", [1,1], [-1,1])).toThrow();
  });
});

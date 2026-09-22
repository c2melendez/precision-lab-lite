import { describe, expect, it } from "vitest";
import { clampToViewport } from "../src/store/useFloatingLayoutStore";

describe("Suite exhaustiva original — Módulo 11: layout responsive Lite", () => {
  it("recorta coordenadas y tamaños fuera de viewport", () => {
    const r = clampToViewport({ x: -500, y: -400, width: 2000, height: 1400 }, 1440, 900);
    expect(r).toEqual({ x: 8, y: 8, width: 1424, height: 884 });
  });

  it("mantiene mínimos y deja la ventana completamente visible", () => {
    const r = clampToViewport({ x: 900, y: 700, width: 100, height: 80 }, 1024, 768);
    expect(r.width).toBeGreaterThanOrEqual(220);
    expect(r.height).toBeGreaterThanOrEqual(160);
    expect(r.x).toBeGreaterThanOrEqual(8);
    expect(r.y).toBeGreaterThanOrEqual(8);
    expect(r.x + r.width).toBeLessThanOrEqual(1016);
    expect(r.y + r.height).toBeLessThanOrEqual(760);
  });
});

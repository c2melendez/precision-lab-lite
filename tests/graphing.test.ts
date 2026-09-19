import { describe, it, expect } from "vitest";
import { analyzeGraph, analyzeGraphPolar, analyzeGraphParametric, analyzeGraphSurface3D } from "../src/engine/stepEngine/graphing";

// NO EJECUTADO en el entorno de generación. Correr con `npm run test`.
// Estos casos usan una parábola simple porque su comportamiento es
// completamente conocido de antemano — sirve como prueba de referencia
// clara para el análisis numérico.

describe("analyzeGraph", () => {
  it("detecta el vértice de x^2-4 en (0,-4)", () => {
    const analysis = analyzeGraph("x^2-4", "x", [-10, 10]);
    expect(analysis.vertex).not.toBeNull();
    expect(analysis.vertex!.x).toBeCloseTo(0, 1);
    expect(analysis.vertex!.y).toBeCloseTo(-4, 1);
  });

  it("detecta las dos intercepciones en x de x^2-4 (x=-2 y x=2)", () => {
    const analysis = analyzeGraph("x^2-4", "x", [-10, 10]);
    const rounded = analysis.xIntercepts.map((x) => Math.round(x));
    expect(rounded).toContain(-2);
    expect(rounded).toContain(2);
  });

  it("detecta la intercepción en y de x^2-4 (y=-4)", () => {
    const analysis = analyzeGraph("x^2-4", "x", [-10, 10]);
    expect(analysis.yIntercept).toBeCloseTo(-4, 1);
  });

  it("detecta un mínimo global en x=0 para x^2-4", () => {
    const analysis = analyzeGraph("x^2-4", "x", [-10, 10]);
    expect(analysis.globalMin?.x).toBeCloseTo(0, 1);
  });

  it("no detecta vértice para una función no cuadrática (sin(x))", () => {
    const analysis = analyzeGraph("sin(x)", "x", [-10, 10]);
    expect(analysis.vertex).toBeNull();
  });

  it("rechaza una ventana con \"desde\" igual a \"hasta\" (bug detectado en revisión: antes producía división entre cero en el dibujo)", () => {
    expect(() => analyzeGraph("x^2", "x", [5, 5])).toThrow();
  });

  it("no lanza excepción con una ventana muy angosta (caso límite, no igual)", () => {
    expect(() => analyzeGraph("x^2", "x", [-0.001, 0.001])).not.toThrow();
  });

  it("1/(x-2) NO reporta una raíz falsa en la asíntota x=2 (bug real de la suite de regresión v1.1: el filtrado de puntos no finitos descartaba el hueco en vez de marcarlo, así que un cambio de signo cruzando la asíntota se contaba como raíz)", () => {
    const analysis = analyzeGraph("1/(x-2)", "x", [0, 4]);
    expect(analysis.xIntercepts).toEqual([]);
  });

  it("tan(x) NO reporta raíces falsas en sus asíntotas (±π/2, ±3π/2) — solo las raíces reales en -π, 0, π (bug real: cerca del polo tan(x) da un número FINITO pero gigantesco, sin pasar por Infinity, así que el chequeo de hueco no alcanza — hace falta además un umbral de magnitud)", () => {
    const analysis = analyzeGraph("tan(x)", "x", [-5, 5]);
    expect(analysis.xIntercepts.length).toBe(3);
    for (const root of analysis.xIntercepts) {
      expect(Math.abs(root) < 0.1 || Math.abs(Math.abs(root) - Math.PI) < 0.1).toBe(true);
    }
  });

  it("1/x tampoco reporta una raíz falsa en x=0", () => {
    const analysis = analyzeGraph("1/x", "x", [-3, 3]);
    expect(analysis.xIntercepts).toEqual([]);
  });

  it("sqrt(x) SÍ detecta la raíz real en el borde del dominio, x=0 (regresión introducida por el fix de arriba: el bucle nunca revisaba el primer punto muestreado, solo lo usaba como 'p', nunca como 'q')", () => {
    const analysis = analyzeGraph("sqrt(x)", "x", [-5, 5]);
    expect(analysis.xIntercepts).toEqual([0]);
  });
});

// Módulo I0 (spec_graficacion_matrices_estadistica_unidades.md, Fase I):
// gráfica polar r=f(θ) en Lite. Mismo caso de referencia que el spec
// (sección 10): r=1 es el círculo unitario. Verificado en ambos motores
// (ver también backend/tests/test_graphing.py::test_polar_unit_circle_r_equals_1
// en precision-lab, mismo caso, para comparar equivalencia matemática).
describe("analyzeGraphPolar", () => {
  it("r=1 traza el círculo unitario completo (todos los puntos a distancia 1 del origen)", () => {
    const analysis = analyzeGraphPolar("1", "theta", [0, 2 * Math.PI]);
    expect(analysis.samples.length).toBeGreaterThan(0);
    for (const p of analysis.samples) {
      expect(Math.hypot(p.x, p.y)).toBeCloseTo(1, 6);
    }
  });

  it("r=theta (espiral de Arquímedes) crece con θ — el radio del último punto es mayor que el del primero", () => {
    const analysis = analyzeGraphPolar("theta", "theta", [0, 4 * Math.PI]);
    const first = analysis.samples[0];
    const last = analysis.samples[analysis.samples.length - 1];
    expect(Math.hypot(last.x, last.y)).toBeGreaterThan(Math.hypot(first.x, first.y));
  });

  it("rechaza un rango de θ con \"desde\" igual a \"hasta\" (mismo criterio que analyzeGraph con la ventana x)", () => {
    expect(() => analyzeGraphPolar("1", "theta", [0, 0])).toThrow();
  });

  it("no rompe analyzeGraph (regresión): x^2-4 sigue detectando su vértice conocido tras agregar analyzeGraphPolar", () => {
    const analysis = analyzeGraph("x^2-4", "x", [-10, 10]);
    expect(analysis.vertex).not.toBeNull();
    expect(analysis.vertex!.x).toBeCloseTo(0, 1);
  });
});

// Módulo J1 (spec_graficacion_matrices_estadistica_unidades.md, sección
// 3.2, confirmado en J0): paramétrico 2D en Lite. Mismo caso de
// referencia que en I0/main: x=cos(t), y=sin(t) es el círculo unitario
// (equivalencia matemática con
// backend/tests/test_phase2.py::test_graph_parametric... en main, mismo
// caso).
describe("analyzeGraphParametric", () => {
  it("x=cos(t), y=sin(t) traza el círculo unitario completo", () => {
    const analysis = analyzeGraphParametric("cos(t)", "sin(t)", "t", [0, 2 * Math.PI]);
    expect(analysis.samples.length).toBeGreaterThan(0);
    for (const p of analysis.samples) {
      expect(Math.hypot(p.x, p.y)).toBeCloseTo(1, 6);
    }
  });

  it("rechaza x(t) e y(t) con parámetros distintos", () => {
    // Este caso lo valida GraphingMode.tsx antes de llamar al motor (no
    // analyzeGraphParametric en sí, que confía en que ambas expresiones
    // ya comparten variable) — se prueba aquí que, si de todos modos
    // llegara una y(t) que usa una variable distinta, el motor no
    // produce resultados silenciosamente incorrectos: la variable
    // ausente en compileNumeric lanza su propio error.
    expect(() => analyzeGraphParametric("cos(t)", "sin(u)", "t", [0, 2 * Math.PI])).toThrow();
  });

  it("rechaza un rango de t con \"desde\" igual a \"hasta\"", () => {
    expect(() => analyzeGraphParametric("cos(t)", "sin(t)", "t", [1, 1])).toThrow();
  });

  it("no rompe analyzeGraphPolar ni analyzeGraph (regresión cruzada tras J1)", () => {
    const polar = analyzeGraphPolar("1", "theta", [0, 2 * Math.PI]);
    for (const p of polar.samples) expect(Math.hypot(p.x, p.y)).toBeCloseTo(1, 6);

    const cartesian = analyzeGraph("x^2-4", "x", [-10, 10]);
    expect(cartesian.vertex).not.toBeNull();
  });
});

// Módulo J2 (spec_graficacion_matrices_estadistica_unidades.md, sección
// 3.2, Opción B confirmada en J0): superficie 3D z=f(x,y) en Lite. Caso
// de referencia: z=x+y es un plano — cada punto de la grilla debe
// cumplir z===x+y exactamente (sin error de discretización más allá de
// coma flotante), la misma relación que main verifica en
// backend/tests/test_graphing.py para /graph/3d con el mismo input
// (equivalencia matemática, no textual).
describe("analyzeGraphSurface3D", () => {
  it("z=x+y: cada punto de la grilla cumple z=x+y (plano, caso conocido)", () => {
    const surface = analyzeGraphSurface3D("x+y", "x", "y", [-3, 3], [-3, 3]);
    expect(surface.xValues.length).toBeGreaterThan(0);
    expect(surface.yValues.length).toBeGreaterThan(0);
    for (let j = 0; j < surface.yValues.length; j++) {
      for (let i = 0; i < surface.xValues.length; i++) {
        const z = surface.zGrid[j][i];
        expect(z).not.toBeNull();
        expect(z as number).toBeCloseTo(surface.xValues[i] + surface.yValues[j], 6);
      }
    }
  });

  it("z=x^2+y^2 (paraboloide): el centro de la grilla (x=0,y=0) da z≈0, el valor mínimo posible", () => {
    const surface = analyzeGraphSurface3D("x^2+y^2", "x", "y", [-2, 2], [-2, 2]);
    const zValues = surface.zGrid.flat().filter((z): z is number => z !== null);
    const minZ = Math.min(...zValues);
    expect(minZ).toBeGreaterThanOrEqual(0);
    expect(minZ).toBeLessThan(0.1); // cerca de (0,0), donde x^2+y^2≈0
  });

  it("rechaza un rango con \"desde\" igual a \"hasta\" en x o en y", () => {
    expect(() => analyzeGraphSurface3D("x+y", "x", "y", [1, 1], [-2, 2])).toThrow();
    expect(() => analyzeGraphSurface3D("x+y", "x", "y", [-2, 2], [1, 1])).toThrow();
  });

  it("no rompe analyzeGraphParametric, analyzeGraphPolar ni analyzeGraph (regresión cruzada tras J2)", () => {
    const parametric = analyzeGraphParametric("cos(t)", "sin(t)", "t", [0, 2 * Math.PI]);
    for (const p of parametric.samples) expect(Math.hypot(p.x, p.y)).toBeCloseTo(1, 6);

    const polar = analyzeGraphPolar("1", "theta", [0, 2 * Math.PI]);
    for (const p of polar.samples) expect(Math.hypot(p.x, p.y)).toBeCloseTo(1, 6);

    const cartesian = analyzeGraph("x^2-4", "x", [-10, 10]);
    expect(cartesian.vertex).not.toBeNull();
  });
});

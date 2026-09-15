// stepEngine/linearInequalitySystem.ts — Módulo C (spec_motor_matematico_
// pendiente.md §4). Desarrollo nuevo, diseño confirmado explícitamente por
// el usuario antes de escribir este archivo (Paso 1 de la plantilla):
//
// 1. Alcance: EXACTAMENTE 2 variables. La spec habla de "región poligonal"
//    — eso solo tiene forma geométrica limpia en 2D. 3+ variables (un
//    politopo en N dimensiones) se rechaza explícitamente, no se intenta.
//    El caso de 1 variable ya estaba DETERMINADO en la spec (intersección
//    de intervalos) — vive en engine/inequality.ts, sin tocar acá.
// 2. Representación de la región: VÉRTICES del polígono factible (opción
//    "b" de las 3 que la spec dejaba abiertas) — no solo validación de un
//    punto, no representación simbólica+graficación.
// 3. Steps en dos niveles: un paso por inecuación (forma normalizada) +
//    un paso final con los vértices (o "sin solución"/"no acotada").
// 4. Cambio contractual (spec §6, declarado explícitamente): nuevo tipo
//    InequalitySystemSolution — el resultado NO es un valor escalar.
//
// Arquitectura: mismo patrón que linearSystem.ts (extractRow con
// derivative()/evaluate() de Algebrite para sacar coeficientes + validar
// linealidad) envolviendo un núcleo numérico puro (solveInequalitySystemNumeric)
// que no depende de Algebrite en absoluto — se puede probar con números
// de JS directamente. Alcance estrictamente lineal: cualquier término no
// lineal se rechaza con mensaje explícito, igual que ya hace
// extractRow() en linearSystem.ts para el caso de ecuaciones.

import { evaluate, derivative, ErrorCode } from "../algebriteClient";
import type { AppError, Step } from "../../types";
import type { InequalityOperator } from "../parsing/inequalitySplit";

function appError(message: string): AppError {
  return { code: ErrorCode.UNSUPPORTED_OPERATION, message };
}

export interface Point {
  x: number;
  y: number;
}

export type InequalitySystemSolutionKind = "bounded" | "unbounded" | "empty";

export interface InequalitySystemSolution {
  kind: InequalitySystemSolutionKind;
  /** Vértices del polígono factible, en orden (sentido antihorario
   * alrededor del centroide) — listo para dibujar como polígono cerrado
   * si `kind === "bounded"`. Presente también si `kind === "unbounded"`
   * cuando la región tiene al menos un vértice finito (ej. un cuadrante:
   * x≥0, y≥0 tiene el vértice (0,0) pero es no acotada). Ausente si
   * `kind === "empty"`. */
  vertices?: Point[];
  steps: Step[];
}

interface LinearConstraint2D {
  a: number;
  b: number;
  c: number; // a*x + b*y {operator} c
  operator: InequalityOperator;
  label: string; // para el paso individual, ej. "x + y \\le 4"
}

const EPS = 1e-9;

/** LIMITACIÓN DOCUMENTADA (se mantiene igual tras la corrección de
 * empty/unbounded de arriba): no se distingue frontera abierta/cerrada
 * en el resultado — los operadores estrictos (< o >) se tratan igual que
 * ≤/≥ para el recorte de semiplanos, con tolerancia numérica. La FORMA de
 * la región es correcta; la inclusión/exclusión exacta de sus bordes no
 * se modela todavía. */

function dedupePoints(points: Point[]): Point[] {
  const unique: Point[] = [];
  for (const p of points) {
    if (!unique.some((q) => Math.abs(q.x - p.x) < 1e-6 && Math.abs(q.y - p.y) < 1e-6)) {
      unique.push(p);
    }
  }
  return unique;
}

// CORRECCIÓN POST-AUDITORÍA (hallazgo real, no en el cierre original del
// Módulo C): el diseño original de computeVertices/isBounded (intersección
// de cada par de rectas frontera + prueba del cono de fuga) no distinguía
// "región vacía" de "región no acotada" cuando ningún par de rectas se
// cruza — por ejemplo "x>=5, x<=1" (vacío, ninguna x cumple ambas) y
// "x>=0, x<=1" (franja no acotada, sí factible) daban el MISMO resultado
// ("unbounded", sin vértices), porque isBounded() solo evalúa el cono de
// recesión (versión homogénea, sin el término independiente) y nunca
// comprueba si el sistema original tiene algún punto factible real. Se
// reemplaza por recorte de semiplanos (Sutherland-Hodgman) contra una
// caja grande: más robusto, da la factibilidad real en un solo paso.
// Mismo fix, mismo motivo, aplicado en paralelo en el backend
// (linear_inequality_system.py) — ver tests/linearInequalitySystem.test.ts
// para los casos que expusieron el bug original y ahora lo cubren.

const BIG = 1e7;
const BIG_TOL = 1e5; // cualquier coordenada a esta distancia (o más) del
// borde de la caja se considera "en el infinito" (artefacto del recorte,
// no un vértice real).

function clipByHalfplane(polygon: Point[], a: number, b: number, rhs: number): Point[] {
  if (polygon.length === 0) return [];
  const output: Point[] = [];
  const n = polygon.length;
  for (let i = 0; i < n; i++) {
    const curr = polygon[i];
    const prev = polygon[(i - 1 + n) % n];
    const currInside = a * curr.x + b * curr.y <= rhs + EPS;
    const prevInside = a * prev.x + b * prev.y <= rhs + EPS;
    if (currInside !== prevInside) {
      const dx = curr.x - prev.x;
      const dy = curr.y - prev.y;
      const denom = a * dx + b * dy;
      if (Math.abs(denom) > 1e-12) {
        const t = (rhs - (a * prev.x + b * prev.y)) / denom;
        output.push({ x: prev.x + t * dx, y: prev.y + t * dy });
      }
    }
    if (currInside) output.push(curr);
  }
  return output;
}

/** Región factible real (no solo el cono de recesión) vía recorte
 * sucesivo de semiplanos contra una caja grande — ver nota de
 * corrección arriba. */
function feasibleRegion(constraints: LinearConstraint2D[]): Point[] {
  let polygon: Point[] = [
    { x: -BIG, y: -BIG },
    { x: BIG, y: -BIG },
    { x: BIG, y: BIG },
    { x: -BIG, y: BIG },
  ];
  for (const c of constraints) {
    const isLE = c.operator === "<=" || c.operator === "<";
    const a = isLE ? c.a : -c.a;
    const b = isLE ? c.b : -c.b;
    const rhs = isLE ? c.c : -c.c;
    polygon = clipByHalfplane(polygon, a, b, rhs);
    if (polygon.length === 0) break;
  }
  return polygon;
}

function orderByAngle(vertices: Point[]): Point[] {
  if (vertices.length <= 2) return vertices;
  const cx = vertices.reduce((s, p) => s + p.x, 0) / vertices.length;
  const cy = vertices.reduce((s, p) => s + p.y, 0) / vertices.length;
  return [...vertices].sort((p, q) => Math.atan2(p.y - cy, p.x - cx) - Math.atan2(q.y - cy, q.x - cx));
}

function fmt(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
}

/** Núcleo numérico puro — sin dependencia de Algebrite, testable
 * directamente con números de JS. Esta es la lógica NUEVA de este
 * módulo; la extracción de coeficientes de abajo reutiliza un patrón ya
 * existente (extractRow de linearSystem.ts). */
export function solveInequalitySystemNumeric(constraints: LinearConstraint2D[]): InequalitySystemSolution {
  const steps: Step[] = constraints.map((c, i) => ({
    id: `constraint-${i}`,
    latex: c.label,
    explanation: `Inecuación ${i + 1} de ${constraints.length}, forma normalizada.`,
  }));

  const polygon = feasibleRegion(constraints);

  if (polygon.length === 0) {
    steps.push({
      id: "empty",
      latex: "\\text{Sin solución factible}",
      explanation: "Ningún punto del plano cumple todas las inecuaciones al mismo tiempo.",
    });
    return { kind: "empty", steps };
  }

  const isFinitePoint = (p: Point) => Math.abs(p.x) < BIG - BIG_TOL && Math.abs(p.y) < BIG - BIG_TOL;
  const touchesBox = polygon.some((p) => !isFinitePoint(p));
  const finiteVertices = dedupePoints(polygon.filter(isFinitePoint));

  if (touchesBox) {
    if (finiteVertices.length === 0) {
      steps.push({
        id: "unbounded-no-vertices",
        latex: "\\text{Región no acotada, sin vértices}",
        explanation: "La región factible se extiende indefinidamente y no tiene ningún vértice finito (ej. un único semiplano, o dos semiplanos formando una franja).",
      });
      return { kind: "unbounded", vertices: [], steps };
    }
    const ordered = orderByAngle(finiteVertices);
    const verticesLatex = ordered.map((p) => `(${fmt(p.x)}, ${fmt(p.y)})`).join(",\\ ");
    steps.push({
      id: "vertices-unbounded",
      latex: verticesLatex,
      explanation: `Región no acotada, con ${ordered.length} vértice(s) finito(s) — se extiende indefinidamente más allá de ellos.`,
    });
    return { kind: "unbounded", vertices: ordered, steps };
  }

  const ordered = orderByAngle(dedupePoints(polygon));
  const verticesLatex = ordered.map((p) => `(${fmt(p.x)}, ${fmt(p.y)})`).join(",\\ ");
  steps.push({
    id: "vertices",
    latex: verticesLatex,
    explanation: `Vértices del polígono factible (${ordered.length}), en orden alrededor del centroide.`,
  });
  return { kind: "bounded", vertices: ordered, steps };
}

/** Extrae {a, b, c} de una inecuación combinada ("a*x+b*y {op} c") a
 * partir de la expresión algebrite de un solo lado ("expr {op} 0",
 * mismo formato que produce el parser para ecuaciones/inecuaciones) —
 * mismo truco de extractRow() en linearSystem.ts: el coeficiente de cada
 * variable es la derivada parcial (constante si el sistema es lineal de
 * verdad), la constante es expr evaluada en (0,0). */
function extractConstraint(
  diffAlgebrite: string,
  operator: InequalityOperator,
  variables: [string, string],
): LinearConstraint2D {
  const coeffs: number[] = [];
  for (const v of variables) {
    const coeffExpr = derivative(diffAlgebrite, v, 1);
    for (const other of variables) {
      if (other !== v && new RegExp(`\\b${other}\\b`).test(coeffExpr)) {
        throw appError(
          `El sistema de inecuaciones no es lineal (el término con "${v}" y "${other}" está multiplicado entre sí). Este solver solo resuelve sistemas lineales.`,
        );
      }
    }
    const coeffValue = Number(evaluate(`float(${coeffExpr})`));
    if (!Number.isFinite(coeffValue)) {
      throw appError(`No se pudo evaluar el coeficiente de "${v}" en "${diffAlgebrite}".`);
    }
    coeffs.push(coeffValue);
  }

  let substituted = diffAlgebrite;
  for (const v of variables) substituted = `subst(0,${v},${substituted})`;
  const constantRaw = Number(evaluate(`float(${substituted})`));
  if (!Number.isFinite(constantRaw)) {
    throw appError(`No se pudo evaluar el término independiente de "${diffAlgebrite}".`);
  }

  // diff {op} 0  =>  a*x + b*y {op} -constante
  const [a, b] = coeffs;
  return {
    a,
    b,
    c: -constantRaw,
    operator,
    label: `${fmt(a)}${variables[0]} + ${fmt(b)}${variables[1]} ${operatorLatex(operator)} ${fmt(-constantRaw)}`,
  };
}

function operatorLatex(op: InequalityOperator): string {
  switch (op) {
    case "<=":
      return "\\le";
    case ">=":
      return "\\ge";
    case "<":
      return "<";
    case ">":
      return ">";
  }
}

/**
 * Punto de entrada del sistema de inecuaciones lineales — envuelve al
 * núcleo numérico puro con la extracción de coeficientes vía Algebrite.
 * Rechaza explícitamente cualquier sistema que no tenga EXACTAMENTE 2
 * variables (alcance confirmado con el usuario, Paso 1 de este módulo) y
 * cualquier término no lineal (vía extractConstraint, mismo criterio que
 * linearSystem.ts para ecuaciones).
 */
export function solveLinearInequalitySystem(
  inequalities: { diffAlgebrite: string; operator: InequalityOperator }[],
  variables: string[],
): InequalitySystemSolution {
  if (variables.length !== 2) {
    throw appError(
      `Esta versión del sistema de inecuaciones solo resuelve sistemas de 2 variables (se detectaron ${variables.length}: ${variables.join(", ") || "ninguna"}). Un sistema de 1 variable se resuelve como intersección de intervalos (ver el solver de una variable); 3 o más variables no está soportado todavía.`,
    );
  }
  const vars: [string, string] = [variables[0], variables[1]];
  const constraints = inequalities.map(({ diffAlgebrite, operator }) =>
    extractConstraint(diffAlgebrite, operator, vars),
  );
  return solveInequalitySystemNumeric(constraints);
}

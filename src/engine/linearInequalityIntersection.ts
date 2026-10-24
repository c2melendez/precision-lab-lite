import Fraction from "fraction.js";
import { ErrorCode, type AppError } from "../types";
import { fractionToLatex } from "./fractions";
import type { InequalityOperator } from "./parsing/inequalitySplit";

export type LinearConstraint = { diffAlgebrite: string; operator: InequalityOperator };
type Affine = { a: Fraction; b: Fraction };
type Bound = { value: Fraction; closed: boolean };
const unsupported = (): AppError => ({
  code: ErrorCode.UNSUPPORTED_OPERATION,
  message: "La intersección de una variable requiere inecuaciones afines con coeficientes racionales.",
});

// Small exact parser: no CAS sampling, decimal rounding, functions, powers,
// variable denominators or multiplication of two variable expressions.
function affine(source: string, variable: string): Affine {
  const tokens = source.match(/\d+(?:\.\d+)?|[A-Za-z]+|[()+*/.-]/g) ?? [];
  if (source.length > 500 || tokens.length > 250 ||
      tokens.join("") !== source.replace(/\s/g, "")) throw unsupported();
  let pos = 0;
  const constant = (v: string): Affine => ({ a: new Fraction(0), b: new Fraction(v) });
  function atom(depth: number): Affine {
    if (depth > 32) throw unsupported();
    const token = tokens[pos++];
    if (token === "+" || token === "-") {
      const v = atom(depth + 1);
      return token === "-" ? {a:v.a.neg(), b:v.b.neg()} : v;
    }
    if (token === "(") {
      const value = sum(depth + 1);
      if (tokens[pos++] !== ")") throw unsupported();
      return value;
    }
    if (token === variable) return {a: new Fraction(1), b: new Fraction(0)};
    if (/^\d+(?:\.\d+)?$/.test(token ?? "")) return constant(token);
    throw unsupported();
  }
  function product(depth: number): Affine {
    let value = atom(depth);
    while (tokens[pos] === "*" || tokens[pos] === "/") {
      const op = tokens[pos++], rhs = atom(depth);
      if (op === "/") {
        if (!rhs.a.equals(0) || rhs.b.equals(0)) throw unsupported();
        value = {a:value.a.div(rhs.b), b:value.b.div(rhs.b)};
      } else {
        if (!value.a.equals(0) && !rhs.a.equals(0)) throw unsupported();
        value = {a:value.a.mul(rhs.b).add(value.b.mul(rhs.a)), b:value.b.mul(rhs.b)};
      }
    }
    return value;
  }
  function sum(depth: number): Affine {
    let value = product(depth);
    while (tokens[pos] === "+" || tokens[pos] === "-") {
      const op = tokens[pos++], rhs = product(depth);
      value = op === "+" ? {a:value.a.add(rhs.a), b:value.b.add(rhs.b)}
        : {a:value.a.sub(rhs.a), b:value.b.sub(rhs.b)};
    }
    return value;
  }
  const result = sum(0);
  if (pos !== tokens.length) throw unsupported();
  return result;
}

export function intersectLinearInequalities(constraints: LinearConstraint[], variable: string): string {
  if (!/^[A-Za-z]$/.test(variable) || /[eEiI]/.test(variable) ||
      constraints.length < 1 || constraints.length > 10) throw unsupported();
  let lower: Bound | undefined, upper: Bound | undefined, empty = false;
  for (const constraint of constraints) {
    if (!["<", ">", "<=", ">="].includes(constraint.operator)) throw unsupported();
    const {a,b} = affine(constraint.diffAlgebrite, variable);
    const closed = constraint.operator.includes("=");
    if (a.equals(0)) {
      const sign = b.compare(0);
      const holds = constraint.operator === "<" ? sign < 0 : constraint.operator === ">" ? sign > 0
        : constraint.operator === "<=" ? sign <= 0 : sign >= 0;
      empty ||= !holds;
      continue;
    }
    const bound = {value:b.neg().div(a), closed};
    const isLower = (constraint.operator.startsWith(">")) === (a.compare(0) > 0);
    const previous = isLower ? lower : upper;
    const cmp = previous ? bound.value.compare(previous.value) : 0;
    if (!previous || (isLower ? cmp > 0 : cmp < 0)) {
      if (isLower) lower = bound; else upper = bound;
    } else if (cmp === 0) {
      previous.closed &&= closed;
    }
  }
  if (empty) return "\\varnothing";
  if (lower && upper) {
    const cmp = lower.value.compare(upper.value);
    if (cmp > 0 || (cmp === 0 && (!lower.closed || !upper.closed))) return "\\varnothing";
    if (cmp === 0) return variable + "\\in\\{" + fractionToLatex(lower.value) + "\\}";
  }
  return variable + "\\in" + (lower?.closed ? "[" : "(")
    + (lower ? fractionToLatex(lower.value) : "-\\infty") + ",\\ "
    + (upper ? fractionToLatex(upper.value) : "\\infty") + (upper?.closed ? "]" : ")");
}

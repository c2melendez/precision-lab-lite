import Fraction from "fraction.js";
import {
  addMatrices,
  determinant,
  invertMatrix,
  multiplyMatrices,
  powerMatrix,
  rank,
  ref,
  rref,
  subtractMatrices,
  trace,
  transposeMatrix,
  type Matrix,
} from "./matrixOps";
import { ErrorCode, type AppError } from "../types";

export type MatrixExpressionValue =
  | { kind: "matrix"; value: Matrix }
  | { kind: "scalar"; value: Fraction };

type MatrixEnv = Record<string, Matrix>;

type Token =
  | { kind: "name"; value: string }
  | { kind: "number"; value: number }
  | { kind: "symbol"; value: "+" | "-" | "*" | "^" | "(" | ")" }
  | { kind: "eof" };

const FUNCTIONS = new Set(["det", "inv", "tr", "rank", "ref", "rref", "transpose"]);
const MATRIX_NAMES = new Set(["A", "B", "C", "D", "E", "F"]);
const MAX_EXPRESSION_LENGTH = 200;
const MAX_TOKENS = 100;
const MAX_DEPTH = 20;
const MAX_EXPONENT = 10;

function parseError(message: string): never {
  throw { code: ErrorCode.PARSE_ERROR, message } as AppError;
}

function unsupported(message: string): never {
  throw { code: ErrorCode.UNSUPPORTED_OPERATION, message } as AppError;
}

function tokenize(input: string): Token[] {
  if (input.length > MAX_EXPRESSION_LENGTH) {
    parseError(`Expresión matricial demasiado larga (máximo ${MAX_EXPRESSION_LENGTH} caracteres).`);
  }

  const tokens: Token[] = [];
  let i = 0;
  while (i < input.length) {
    const ch = input[i];
    if (/\s/.test(ch)) {
      i++;
      continue;
    }
    if ("+-*^()".includes(ch)) {
      tokens.push({ kind: "symbol", value: ch as "+" | "-" | "*" | "^" | "(" | ")" });
      i++;
      continue;
    }
    if (/\d/.test(ch)) {
      let j = i + 1;
      while (j < input.length && /\d/.test(input[j])) j++;
      const value = Number(input.slice(i, j));
      if (!Number.isSafeInteger(value)) parseError("Número entero fuera de rango.");
      tokens.push({ kind: "number", value });
      i = j;
      continue;
    }
    if (/[A-Za-z]/.test(ch)) {
      let j = i + 1;
      while (j < input.length && /[A-Za-z]/.test(input[j])) j++;
      tokens.push({ kind: "name", value: input.slice(i, j) });
      i = j;
      continue;
    }
    parseError(`Símbolo no permitido en expresión matricial: "${ch}".`);
  }

  if (tokens.length > MAX_TOKENS) {
    parseError(`Demasiados tokens en la expresión matricial (máximo ${MAX_TOKENS}).`);
  }
  tokens.push({ kind: "eof" });
  return tokens;
}

function scaleMatrix(matrix: Matrix, scalar: Fraction): Matrix {
  return matrix.map((row) => row.map((value) => value.mul(scalar)));
}

function cloneMatrix(matrix: Matrix): Matrix {
  return matrix.map((row) => row.map((value) => new Fraction(value)));
}

function addValues(a: MatrixExpressionValue, b: MatrixExpressionValue): MatrixExpressionValue {
  if (a.kind === "matrix" && b.kind === "matrix") {
    return { kind: "matrix", value: addMatrices(a.value, b.value).result };
  }
  if (a.kind === "scalar" && b.kind === "scalar") {
    return { kind: "scalar", value: a.value.add(b.value) };
  }
  unsupported("La suma requiere dos matrices compatibles o dos escalares.");
}

function subtractValues(a: MatrixExpressionValue, b: MatrixExpressionValue): MatrixExpressionValue {
  if (a.kind === "matrix" && b.kind === "matrix") {
    return { kind: "matrix", value: subtractMatrices(a.value, b.value).result };
  }
  if (a.kind === "scalar" && b.kind === "scalar") {
    return { kind: "scalar", value: a.value.sub(b.value) };
  }
  unsupported("La resta requiere dos matrices compatibles o dos escalares.");
}

function multiplyValues(a: MatrixExpressionValue, b: MatrixExpressionValue): MatrixExpressionValue {
  if (a.kind === "matrix" && b.kind === "matrix") {
    return { kind: "matrix", value: multiplyMatrices(a.value, b.value).result };
  }
  if (a.kind === "scalar" && b.kind === "scalar") {
    return { kind: "scalar", value: a.value.mul(b.value) };
  }
  if (a.kind === "scalar" && b.kind === "matrix") {
    return { kind: "matrix", value: scaleMatrix(b.value, a.value) };
  }
  if (a.kind === "matrix" && b.kind === "scalar") {
    return { kind: "matrix", value: scaleMatrix(a.value, b.value) };
  }
  unsupported("Producto matricial o escalar no soportado.");
}

class Parser {
  private index = 0;
  private depth = 0;

  constructor(
    private readonly tokens: Token[],
    private readonly env: MatrixEnv,
  ) {}

  parse(): MatrixExpressionValue {
    const value = this.parseAdditive();
    if (this.peek().kind !== "eof") parseError("Texto adicional después de la expresión matricial.");
    return value;
  }

  private peek(): Token {
    return this.tokens[this.index];
  }

  private consume(): Token {
    return this.tokens[this.index++];
  }

  private matchSymbol(symbol: string): boolean {
    const token = this.peek();
    if (token.kind === "symbol" && token.value === symbol) {
      this.index++;
      return true;
    }
    return false;
  }

  private expectSymbol(symbol: "(" | ")"): void {
    if (!this.matchSymbol(symbol)) parseError(`Se esperaba "${symbol}".`);
  }

  private enterDepth(): void {
    this.depth++;
    if (this.depth > MAX_DEPTH) parseError(`Expresión matricial demasiado anidada (máximo ${MAX_DEPTH}).`);
  }

  private leaveDepth(): void {
    this.depth--;
  }

  private parseAdditive(): MatrixExpressionValue {
    let left = this.parseMultiplicative();
    while (true) {
      if (this.matchSymbol("+")) left = addValues(left, this.parseMultiplicative());
      else if (this.matchSymbol("-")) left = subtractValues(left, this.parseMultiplicative());
      else break;
    }
    return left;
  }

  private parseMultiplicative(): MatrixExpressionValue {
    let left = this.parsePower();
    while (this.matchSymbol("*")) {
      left = multiplyValues(left, this.parsePower());
    }
    return left;
  }

  private parsePower(): MatrixExpressionValue {
    const base = this.parsePrimary();
    if (!this.matchSymbol("^")) return base;

    const token = this.consume();
    if (token.kind !== "number") parseError("El exponente matricial debe ser un entero entre 0 y 10.");
    if (token.value < 0 || token.value > MAX_EXPONENT) {
      unsupported(`Exponente fuera de rango: solo se admite 0–${MAX_EXPONENT}.`);
    }
    if (base.kind !== "matrix") unsupported("La potencia de esta gramática solo se aplica a matrices.");
    return { kind: "matrix", value: powerMatrix(base.value, token.value).result };
  }

  private parsePrimary(): MatrixExpressionValue {
    const token = this.peek();

    if (token.kind === "symbol" && token.value === "(") {
      this.consume();
      this.enterDepth();
      const value = this.parseAdditive();
      this.expectSymbol(")");
      this.leaveDepth();
      return value;
    }

    if (token.kind !== "name") {
      parseError("Se esperaba una matriz A–F, una función o un paréntesis.");
    }
    this.consume();

    if (MATRIX_NAMES.has(token.value)) {
      const matrix = this.env[token.value];
      if (!matrix) parseError(`La matriz ${token.value} no está disponible.`);
      return { kind: "matrix", value: cloneMatrix(matrix) };
    }

    if (!FUNCTIONS.has(token.value)) {
      parseError(`Función matricial no permitida: "${token.value}".`);
    }

    this.expectSymbol("(");
    this.enterDepth();
    const argument = this.parseAdditive();
    this.expectSymbol(")");
    this.leaveDepth();

    if (argument.kind !== "matrix") {
      unsupported(`${token.value}(...) requiere una matriz como argumento.`);
    }

    switch (token.value) {
      case "det":
        return { kind: "scalar", value: determinant(argument.value).value };
      case "inv":
        return { kind: "matrix", value: invertMatrix(argument.value).result };
      case "tr":
        return { kind: "scalar", value: trace(argument.value).value };
      case "rank":
        return { kind: "scalar", value: new Fraction(rank(argument.value).value) };
      case "ref":
        return { kind: "matrix", value: ref(argument.value).result };
      case "rref":
        return { kind: "matrix", value: rref(argument.value).result };
      case "transpose":
        return { kind: "matrix", value: transposeMatrix(argument.value).result };
      default:
        unsupported(`Función no soportada: ${token.value}.`);
    }
  }
}

export function evaluateMatrixExpression(
  expression: string,
  matrices: MatrixEnv,
): MatrixExpressionValue {
  const trimmed = expression.trim();
  if (!trimmed) parseError("Escribe una expresión matricial.");
  return new Parser(tokenize(trimmed), matrices).parse();
}

export function matrixExpressionValueToLatex(value: MatrixExpressionValue): string {
  if (value.kind === "scalar") return value.value.toFraction(true);
  const rows = value.value
    .map((row) => row.map((cell) => cell.toFraction(true)).join(" & "))
    .join(" \\\\ ");
  return `\\begin{bmatrix} ${rows} \\end{bmatrix}`;
}

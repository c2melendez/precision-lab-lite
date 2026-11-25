/**
 * Minimal, fail-closed numeric evaluator for the LaTeX subset the calculus
 * engine emits. It exists so tests can compare a symbolic claim with numbers
 * computed independently of the engine, instead of comparing LaTeX strings.
 *
 * Anything it does not understand throws; it never guesses.
 */

function balancedGroup(source: string, start: number): [string, number] {
  let depth = 0;
  for (let i = start; i < source.length; i += 1) {
    if (source[i] === "{") depth += 1;
    else if (source[i] === "}") {
      depth -= 1;
      if (depth === 0) return [source.slice(start + 1, i), i + 1];
    }
  }
  throw new Error(`Unbalanced braces in ${source}`);
}

function expandCommands(source: string): string {
  let out = "";
  let i = 0;
  while (i < source.length) {
    if (source.startsWith("\\frac", i)) {
      const [num, afterNum] = balancedGroup(source, i + 5);
      const [den, afterDen] = balancedGroup(source, afterNum);
      out += `((${expandCommands(num)})/(${expandCommands(den)}))`;
      i = afterDen;
    } else if (source.startsWith("\\sqrt", i)) {
      const [arg, afterArg] = balancedGroup(source, i + 5);
      out += `sqrt(${expandCommands(arg)})`;
      i = afterArg;
    } else {
      out += source[i];
      i += 1;
    }
  }
  return out;
}

function expandPowers(source: string): string {
  let out = "";
  let i = 0;
  while (i < source.length) {
    if (source[i] === "^") {
      if (source[i + 1] === "{") {
        const [group, after] = balancedGroup(source, i + 1);
        out += `**(${expandPowers(group)})`;
        i = after;
      } else {
        out += `**${source[i + 1]}`;
        i += 2;
      }
    } else {
      out += source[i];
      i += 1;
    }
  }
  return out;
}

const FUNCTIONS: Record<string, string> = {
  arcsin: "Math.asin",
  arccos: "Math.acos",
  arctan: "Math.atan",
  asin: "Math.asin",
  acos: "Math.acos",
  atan: "Math.atan",
  sinh: "Math.sinh",
  cosh: "Math.cosh",
  tanh: "Math.tanh",
  sin: "Math.sin",
  cos: "Math.cos",
  tan: "Math.tan",
  log: "Math.log",
  ln: "Math.log",
  exp: "Math.exp",
  sqrt: "Math.sqrt",
  abs: "Math.abs",
};

function insertImplicitProducts(source: string): string {
  const names = Object.keys(FUNCTIONS).join("|");
  const pattern = new RegExp(`([)0-9x])(?=(?:${names}|x|\\())`, "g");
  return source.replace(pattern, (match) => `${match}*`);
}

/**
 * Evaluates `latex` at `value`. Throws when the expression uses anything this
 * evaluator does not model (unknown symbol, unsupported command, ...).
 */
export function evalLatexAt(latex: string, value: number): number {
  const plain = latex
    .replace(/\s+/g, "")
    .replace(/\\left|\\right/g, "")
    .replace(/\\lvert|\\rvert/g, "")
    .replace(/\+C$/, "");

  let expression = expandCommands(plain);
  for (const name of Object.keys(FUNCTIONS)) {
    expression = expression.split(`\\${name}`).join(name);
  }
  expression = expandPowers(expression);
  expression = insertImplicitProducts(expression);

  const identifiers = expression.match(/[A-Za-z]+/g) ?? [];
  for (const identifier of identifiers) {
    if (identifier === "x") continue;
    if (Object.prototype.hasOwnProperty.call(FUNCTIONS, identifier)) continue;
    throw new Error(`Unsupported LaTeX for numeric evaluation (${identifier}): ${latex}`);
  }

  for (const [name, jsName] of Object.entries(FUNCTIONS)) {
    expression = expression.split(`${name}(`).join(`${jsName}(`);
  }

  // eslint-disable-next-line no-new-func
  const fn = new Function("x", `return (${expression});`) as (x: number) => number;
  return fn(value);
}

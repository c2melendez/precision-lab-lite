import { it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";

function safe(fn: () => string): string {
  try {
    return fn();
  } catch (e) {
    return "ERR " + String(e);
  }
}

it("diagnostic arctan sum forms", () => {
  const parsed = parseExpression("arctan(x)+arctan(2*x)=pi/4", "RAD");
  const left = parsed.leftAlgebrite;
  const right = parsed.rightAlgebrite;
  const info = {
    left,
    right,
    leftJson: JSON.stringify(left),
    rightJson: JSON.stringify(right),
    numPi4: safe(() => evaluate("float(pi/4)")),
    subst: safe(() => evaluate("float(subst(3/10,x,(" + left + ")-(" + right + ")))")),
    substLeft: safe(() => evaluate("float(subst(3/10,x," + left + "))")),
    diffSimplify: safe(() => evaluate("simplify((" + left + ")-(" + right + "))")),
  };
  throw new Error("DIAG " + JSON.stringify(info));
});

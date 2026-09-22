import { describe, expect, it } from "vitest";

import { buildSegmentedPath } from "../src/components/GraphViewer";
import { parseExpression } from "../src/engine/parsing";

describe("regresiones Track D", () => {
  it("M3/M10: Productoria del teclado se conserva como llamada de 4 argumentos", () => {
    expect(parseExpression("\\prod_{i=1}^{5}i").algebrite).toBe("product((i),i,1,5)");
  });

  it("M9: una discontinuidad abre un subpath nuevo en vez de unir ramas", () => {
    const d = buildSegmentedPath(
      [
        { x: -0.002, y: -500 },
        { x: -0.001, y: -1000 },
        { x: 0.001, y: 1000 },
        { x: 0.002, y: 500 },
      ],
      [-1, 1],
    );
    expect((d.match(/\bM\b/g) ?? []).length).toBeGreaterThanOrEqual(2);
  });
});

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { GraphViewer } from "../src/components/GraphViewer";
import type { GraphAnalysis } from "../src/engine/stepEngine/graphing";

const analysis: GraphAnalysis = {
  domainDescription: "x != 1",
  rangeDescription: "aproximado",
  xIntercepts: [],
  yIntercept: 1,
  localMaxima: [],
  localMinima: [],
  globalMax: null,
  globalMin: null,
  inflectionPoints: [],
  vertex: null,
  removableHoles: [{ x: 1, y: 2 }],
  samples: [
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 2, y: 3 },
    { x: 3, y: 4 },
  ],
};

describe("GraphViewer removable holes", () => {
  it("dibuja un círculo abierto para cada discontinuidad removible", () => {
    render(
      <GraphViewer
        curves={[{ id: "curve-1", color: "#123456", analysis }]}
        selectedId="curve-1"
        view={[-1, 3]}
      />,
    );

    const hole = screen.getByTestId("graph-hole-curve-1-0");
    expect(hole).toHaveAttribute("fill", "none");
    expect(hole).toHaveAttribute("stroke", "#123456");
  });
});

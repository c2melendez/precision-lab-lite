import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ResultPanel } from "./ResultPanel";
import type { MathResult } from "../types";

const result: MathResult = {
  success: true,
  resultLatex: "0.532761",
  decimalApprox: "0.532761",
  steps: [],
  hasDetailedSteps: false,
  confidence: "SYMBOLIC",
  requestId: "s26-dms",
};

describe("S26.3 ResultPanel — DMS contextual", () => {
  it("habilita DMS únicamente con simbología angular válida", () => {
    const { rerender } = render(<ResultPanel result={result} inputLatex="30.525°" />);
    expect(screen.getByRole("button", { name: "dms" })).toBeInTheDocument();

    rerender(<ResultPanel result={result} inputLatex="30.525" />);
    expect(screen.queryByRole("button", { name: "dms" })).not.toBeInTheDocument();
  });

  it("convierte 30.525° a 30° 31′ 30.0″", () => {
    const { container } = render(<ResultPanel result={result} inputLatex="30.525°" />);
    fireEvent.click(screen.getByRole("button", { name: "dms" }));
    const text = container.textContent?.replace(/\s+/g, "") ?? "";
    expect(text).toContain("30");
    expect(text).toContain("31");
    expect(text).toContain("30.0");
  });
});

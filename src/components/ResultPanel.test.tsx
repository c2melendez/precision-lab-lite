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

  describe("S26.3 — trig inversa en DEG", () => {
    const angleResult: MathResult = {
      ...result,
      resultLatex: "30",
      decimalApprox: "30",
    };

    it("asin(0.5) en GRAD muestra grados y habilita DMS", () => {
      const { container } = render(
        <ResultPanel result={angleResult} inputLatex="asin(0.5)" angleMode="GRAD" />,
      );
      expect(container.textContent).toContain("30°");
      expect(screen.getByRole("button", { name: "dms" })).toBeInTheDocument();

      fireEvent.click(screen.getByRole("button", { name: "dms" }));
      const text = container.textContent?.replace(/\s+/g, "") ?? "";
      expect(text).toContain("30");
      expect(text).toContain("0.0");
    });

    it("asin(0.5) en RAD no se etiqueta como grados ni habilita DMS", () => {
      const { container } = render(
        <ResultPanel result={{ ...angleResult, resultLatex: "\\frac{\\pi}{6}", decimalApprox: "0.523599" }} inputLatex="asin(0.5)" angleMode="RAD" />,
      );
      expect(screen.queryByRole("button", { name: "dms" })).not.toBeInTheDocument();
      expect(container.textContent).not.toContain("°");
    });
  });
});

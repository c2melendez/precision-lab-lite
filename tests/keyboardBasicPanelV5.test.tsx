import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { KeyboardBasicPanel } from "../src/components/KeyboardBasicPanel";

function makeField() {
  return {
    focus: vi.fn(),
    insert: vi.fn(),
  };
}

describe("flujo funcional del panel Básico V5", () => {
  it("inserta igual sin ejecutar y calcula solo mediante Enter", () => {
    const field = makeField();
    const onEnter = vi.fn();

    render(
      <KeyboardBasicPanel
        field={field as never}
        onBackspace={vi.fn()}
        onClear={vi.fn()}
        onEnter={onEnter}
        lastAnswerLatex={null}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "igual" }));
    expect(field.insert).toHaveBeenCalledWith("=");
    expect(onEnter).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "calcular" }));
    expect(onEnter).toHaveBeenCalledTimes(1);
  });

  it("ANS reutiliza el último resultado cuando existe", () => {
    const field = makeField();

    render(
      <KeyboardBasicPanel
        field={field as never}
        onBackspace={vi.fn()}
        onClear={vi.fn()}
        onEnter={vi.fn()}
        lastAnswerLatex="\\frac{3}{2}"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "insertar el último resultado" }));
    expect(field.focus).toHaveBeenCalled();
    expect(field.insert).toHaveBeenCalledWith("\\frac{3}{2}");
  });
});

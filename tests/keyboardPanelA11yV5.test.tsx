import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { KeyboardPanel } from "../src/components/KeyboardPanel";

describe("accesibilidad del panel de teclado V5", () => {
  it("entra al cierre, se identifica con ARIA y devuelve el foco al abrir", () => {
    const opener = document.createElement("button");
    opener.type = "button";
    opener.textContent = "Abrir teclado";
    document.body.appendChild(opener);
    opener.focus();

    const onClose = vi.fn();
    const view = render(
      <KeyboardPanel isOpen onClose={onClose}>
        <button type="button">7</button>
      </KeyboardPanel>,
    );

    const dialog = screen.getByRole("dialog", { name: "Teclado" });
    expect(dialog).toHaveAttribute("id", "math-keyboard-panel");
    expect(screen.getByRole("button", { name: "Cerrar teclado" })).toHaveFocus();

    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);

    view.rerender(<KeyboardPanel isOpen={false} onClose={onClose} />);
    expect(opener).toHaveFocus();
    opener.remove();
  });
});

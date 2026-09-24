import { useEffect, useMemo, useRef } from "react";
import { KeyboardBasicPanel } from "./KeyboardBasicPanel";
import { MathKeyboard, type MathField } from "./MathKeyboard";
import { useKeyboardPanelStore } from "../store/useKeyboardPanelStore";

type NativeTarget = HTMLInputElement | HTMLTextAreaElement;

function normalizeSnippet(value: string): string {
  return value
    .replace(/#\d/g, "")
    .replace(/\\left|\\right/g, "")
    .replace(/\\cdot/g, "×")
    .replace(/\\pi/g, "π")
    .replace(/\\le/g, "≤")
    .replace(/\\ge/g, "≥")
    .replace(/\\infty/g, "∞");
}

function setNativeValue(target: NativeTarget, value: string): void {
  const proto = target instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(proto, "value")?.set;
  setter?.call(target, value);
  target.dispatchEvent(new Event("input", { bubbles: true }));
  target.dispatchEvent(new Event("change", { bubbles: true }));
}

function replaceSelection(target: NativeTarget, snippet: string): void {
  const normalized = normalizeSnippet(snippet);
  const current = target.value ?? "";
  let start = current.length;
  let end = current.length;
  try {
    start = target.selectionStart ?? current.length;
    end = target.selectionEnd ?? start;
  } catch {
    // input[type=number] no expone selectionStart.
  }
  const next = current.slice(0, start) + normalized + current.slice(end);
  setNativeValue(target, next);
  requestAnimationFrame(() => {
    target.focus();
    try {
      const caret = start + normalized.length;
      target.setSelectionRange(caret, caret);
    } catch {
      // input[type=number]
    }
  });
}

function deleteBackward(target: NativeTarget): void {
  const current = target.value ?? "";
  let start = current.length;
  let end = current.length;
  try {
    start = target.selectionStart ?? current.length;
    end = target.selectionEnd ?? start;
  } catch {
    // input[type=number]
  }
  if (start !== end) {
    setNativeValue(target, current.slice(0, start) + current.slice(end));
  } else if (start > 0) {
    setNativeValue(target, current.slice(0, start - 1) + current.slice(start));
  }
  requestAnimationFrame(() => target.focus());
}

export function GlobalKeyboardFallback({ mode }: { mode: string }) {
  const targetRef = useRef<NativeTarget | null>(null);
  const content = useKeyboardPanelStore((s) => s.content);
  const basicContent = useKeyboardPanelStore((s) => s.basicContent);
  const setContent = useKeyboardPanelStore((s) => s.setContent);
  const setBasicContent = useKeyboardPanelStore((s) => s.setBasicContent);
  const setCompactActions = useKeyboardPanelStore((s) => s.setCompactActions);

  useEffect(() => {
    function rememberTarget(event: FocusEvent) {
      const target = event.target;
      if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) return;
      if (!target.closest("#main-content")) return;
      targetRef.current = target;
    }
    document.addEventListener("focusin", rememberTarget);
    return () => document.removeEventListener("focusin", rememberTarget);
  }, []);

  const field = useMemo<MathField>(() => ({
    focus: () => targetRef.current?.focus(),
    insert: (snippet: string) => {
      const target = targetRef.current;
      if (target) replaceSelection(target, snippet);
    },
  }), []);

  const clear = () => {
    const target = targetRef.current;
    if (!target) return;
    setNativeValue(target, "");
    target.focus();
  };
  const backspace = () => {
    const target = targetRef.current;
    if (target) deleteBackward(target);
  };
  const enter = () => {
    const target = targetRef.current;
    if (!target) return;
    target.focus();
    target.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", code: "Enter", bubbles: true }));
    target.dispatchEvent(new KeyboardEvent("keyup", { key: "Enter", code: "Enter", bubbles: true }));
  };

  useEffect(() => {
    // Los modos propietarios (Científica y cualquier otro que registre
    // contenido especializado) siempre tienen prioridad.
    if (content !== null || basicContent !== null) return;

    const basic = (
      <KeyboardBasicPanel
        field={field}
        onBackspace={backspace}
        onClear={clear}
        onEnter={enter}
        lastAnswerLatex={null}
      />
    );
    setBasicContent(basic);
    setContent(
      <MathKeyboard
        field={field}
        onBackspace={backspace}
        onEnter={enter}
        onClearField={clear}
        hideCoreGrid
        registerInsertHandler={false}
      />,
    );
    setCompactActions({ onEnter: enter, onBackspace: backspace });
  }, [mode, content, basicContent, field, setBasicContent, setContent, setCompactActions]);

  return null;
}

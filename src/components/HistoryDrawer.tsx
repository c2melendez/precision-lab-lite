import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function HistoryDrawer({ isOpen, onClose, children }: HistoryDrawerProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    previousFocusRef.current = document.activeElement as HTMLElement | null;

    requestAnimationFrame(() => {
      dialogRef.current
        ?.querySelector<HTMLElement>("[data-history-close]")
        ?.focus();
    });

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      requestAnimationFrame(() => previousFocusRef.current?.focus());
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[85] flex items-center justify-center bg-slate-950/35 p-3 backdrop-blur-[1px] sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        id="history-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="history-title"
        className="flex h-[min(720px,calc(100vh-1.5rem))] w-[min(760px,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-2xl border border-paper-line bg-paper-soft text-ink shadow-2xl sm:h-[min(680px,calc(100vh-3rem))] sm:w-[min(760px,calc(100vw-3rem))]"
      >
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-paper-line bg-paper px-4 sm:px-5">
          <div>
            <h2 id="history-title" className="text-base font-semibold">Historial</h2>
            <p className="text-[11px] text-muted">Cálculos recientes guardados en este dispositivo.</p>
          </div>
          <button
            type="button"
            data-history-close
            onClick={onClose}
            aria-label="Cerrar historial"
            className="grid h-9 w-9 place-items-center rounded-lg border border-paper-line bg-paper-soft text-lg font-semibold text-muted hover:text-ink"
          >
            ×
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}

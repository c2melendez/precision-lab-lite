import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/**
 * KeyboardPanel.tsx — Módulo 0 (hoja-de-ruta-visual.md §0.3 / spec §2, §8).
 *
 * Contenedor puro del panel expandido — no sabe qué teclado renderiza
 * (recibe `children`), no reordena ni reclasifica ninguna tecla (eso es
 * Módulos 1-4). Cambia de forma según breakpoint:
 * - `dt` (≥1440px): panel inferior amplio, alineado con el área de trabajo.
 * - laptop (lg, 1024-1439px): bottom sheet parcial (~45%).
 * - tablet (md, 768-1023px): bottom sheet (~55%).
 * - móvil (<768px): bottom sheet (~66%) con drag handle.
 *
 * El drag handle es solo visual/afordance en este módulo (barra
 * agarradera) — el gesto de arrastre en sí no se implementa todavía; el
 * cierre se hace con el botón "Cerrar" o volviendo a tocar el dock,
 * accesible en cualquier breakpoint (restricción dura: el dock nunca
 * puede quedar inalcanzable).
 */

interface KeyboardPanelProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  dockHeight?: number;
}

export function KeyboardPanel({ isOpen, onClose, children, dockHeight = 0 }: KeyboardPanelProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  // Gestión de foco + Escape: al abrir, el foco entra en el diálogo;
  // al cerrar/desmontar, vuelve al elemento que lo abrió.
  useEffect(() => {
    if (!isOpen) return;
    openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      openerRef.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      id="math-keyboard-panel"
      role="dialog"
      aria-label="Teclado matemático"
      aria-modal="false"
      style={{ "--keyboard-panel-bottom": `${dockHeight + 12}px` } as CSSProperties}
      className={[
        // Base (móvil, <768px): bottom sheet ~66vh, ancho completo.
        "fixed inset-x-0 bottom-0 z-40 flex flex-col rounded-t-2xl border-t border-chrome-soft bg-chrome shadow-2xl",
        "h-[66vh]",
        // Tablet (md, 768-1023px): ~55%.
        "md:h-[55vh]",
        // Laptop (lg, 1024-1439px): ~45%.
        "lg:h-[45vh]",
        // Desktop: panel inferior amplio con los márgenes del área de trabajo.
        // La barra cambia de altura cuando aparecen teclas recientes.
        // Mantener el panel sobre su borde real, no sobre el antiguo grid fijo.
        "dt:inset-x-8 dt:bottom-[var(--keyboard-panel-bottom)] dt:mx-auto dt:h-auto dt:max-h-[45vh] dt:max-w-[1376px] dt:rounded-2xl dt:border",
      ].join(" ")}
    >
      {/* Drag handle — solo afordance visual en este módulo, oculto en dt
          (ahí el panel inferior se abre con el botón dedicado). */}
      <div className="flex justify-center pt-2 dt:hidden">
        <div className="h-1.5 w-10 rounded-full bg-bone/30" />
      </div>

      <div className="flex items-center justify-between px-4 pb-2 pt-1">
        <span className="text-sm font-medium text-bone/80">Teclado</span>
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Cerrar teclado"
          className="rounded p-1 text-bone/70 hover:bg-chrome-soft hover:text-bone"
        >
          ✕
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-2">{children}</div>
    </div>
  );
}

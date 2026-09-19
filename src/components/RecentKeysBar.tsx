import { KeyGlyph } from "./KeyGlyph";
import type { KeyDef } from "./MathKeyboard";
import { useActiveModeStore } from "../store/useActiveModeStore";
import { useKeyboardPanelStore } from "../store/useKeyboardPanelStore";
import { useRecentKeysStore } from "../store/useRecentKeysStore";
import { triggerKeyFeedback } from "../utils/keyFeedback";

/**
 * RecentKeysBar.tsx — Fase X, Módulo X0. Paridad exacta con
 * precision-lab (main) — ver ese archivo para el comentario completo de
 * diseño (ubicación/persistencia/alcance confirmados por Carlos).
 */

function RecentKeyButton({ k }: { k: KeyDef }) {
  const insertHandler = useKeyboardPanelStore((s) => s.insertHandler);

  return (
    <button
      type="button"
      onClick={() => {
        triggerKeyFeedback();
        insertHandler?.(k);
      }}
      aria-label={k.ariaLabel}
      title={k.description ?? k.ariaLabel}
      className="flex h-8 min-w-[2rem] items-center justify-center rounded-md bg-chrome-soft px-2 text-sm text-bone hover:bg-chrome-soft/70"
    >
      <KeyGlyph glyph={k.glyph} />
    </button>
  );
}

function RecentKeysRow({ label, keys }: { label: string; keys: KeyDef[] }) {
  if (keys.length === 0) return null;
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto">
      <span className="shrink-0 text-[10px] uppercase tracking-wide text-bone/40">{label}</span>
      {keys.map((k, i) => (
        <RecentKeyButton key={`${k.insertLatex}-${i}`} k={k} />
      ))}
    </div>
  );
}

export function RecentKeysBar() {
  const activeMode = useActiveModeStore((s) => s.activeMode);
  const recents = useRecentKeysStore((s) => s.getRecents(activeMode));

  if (recents.operations.length === 0 && recents.variables.length === 0) return null;

  return (
    <div className="mb-1.5 flex flex-col gap-1">
      <RecentKeysRow label="Recientes" keys={recents.operations} />
      <RecentKeysRow label="Var./const." keys={recents.variables} />
    </div>
  );
}

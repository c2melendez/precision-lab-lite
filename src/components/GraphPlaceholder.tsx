/**
 * src/components/GraphPlaceholder.tsx — Fase P (Rediseño visual), Módulo P1.
 *
 * Cuadrante visual reservado para la gráfica. Instrucción explícita del
 * usuario (Track C, sesión de rediseño visual): las 6 disposiciones
 * (Fusionada, Separada, Pantalla dividida, Enfoque, Flotante, Apilado)
 * deben considerar 4 cuadrantes — entrada de datos, resultado, teclado
 * colapsado y gráfica.
 *
 * Decisión de producto (post-integración de Track B): la graficación NO
 * es automática — Carlos confirmó explícitamente "algo que el usuario
 * pida explícitamente (un botón 'Graficar' en el resultado)", no
 * graficar cualquier resultado de un solo variable en silencio. Este
 * componente sigue siendo solo el cuadrante visual (no decide qué
 * graficar, no llama al worker él mismo) — recibe `canGraph`/`onGraph`
 * de quien sí sabe (BasicScientificMode.tsx) y solo se encarga de
 * mostrar el botón o el estado vacío. Paridad con precision-lab (main).
 *
 * Alcance V1, deliberado: solo Científica (BasicScientificMode.tsx)
 * tiene el botón conectado hoy.
 */

interface GraphPlaceholderProps {
  /** true cuando hay una expresión no vacía que tiene sentido intentar
   * graficar. GraphingMode.tsx (vía parseExpression/freeVariables) es
   * quien valida de verdad si es graficable — este flag solo evita
   * mostrar el botón con el campo vacío. */
  canGraph?: boolean;
  /** Manda la expresión al puente (usePendingGraphStore) y cambia a
   * modo Graficación; si no es graficable, el error se muestra ahí por
   * el canal normal, nunca en silencio. */
  onGraph?: () => void;
}

export function GraphPlaceholder({ canGraph = false, onGraph }: GraphPlaceholderProps) {
  if (canGraph && onGraph) {
    return (
      <div className="flex min-h-[110px] flex-1 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-paper-line bg-paper-soft/60 px-4 py-6 text-center">
        <span className="text-xs font-medium text-muted">Gráfica</span>
        <button
          type="button"
          onClick={onGraph}
          className="rounded-md bg-marker px-4 py-1.5 text-sm font-semibold text-chrome hover:bg-marker/90"
        >
          Graficar
        </button>
      </div>
    );
  }

  return (
    <div
      role="note"
      aria-label="Gráfica: escribe una expresión y presiona Graficar"
      className="flex min-h-[110px] flex-1 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-paper-line bg-paper-soft/60 px-4 py-6 text-center"
    >
      <span className="text-xs font-medium text-muted">Gráfica</span>
      <span className="text-[11px] text-muted">Escribe una expresión y presiona Graficar.</span>
    </div>
  );
}

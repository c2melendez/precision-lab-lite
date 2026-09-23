import { useCallback, useEffect, useRef } from "react";

/**
 * S20 — lifecycle único para el worker matemático de Lite.
 *
 * Cada modo crea el worker de forma perezosa y lo termina al desmontarse.
 * Cambiar de modo actúa como interrupción segura de un cálculo pesado y
 * libera el heap asociado. Al volver al modo, getWorker() crea una instancia
 * limpia, por lo que el siguiente cálculo no reutiliza un worker terminado.
 */
export function useComputeWorker() {
  const workerRef = useRef<Worker | null>(null);

  const getWorker = useCallback(() => {
    if (!workerRef.current) {
      workerRef.current = new Worker(
        new URL("../workers/compute.worker.ts", import.meta.url),
        { type: "module" },
      );
    }
    return workerRef.current;
  }, []);

  const cancelWorker = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
  }, []);

  useEffect(() => cancelWorker, [cancelWorker]);

  return { getWorker, cancelWorker };
}

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({
  workerRef: { current: null as Worker | null },
  cleanup: null as null | (() => void),
}));

vi.mock("react", () => ({
  useRef: () => state.workerRef,
  useCallback: (fn: Function) => fn,
  useEffect: (effect: () => void | (() => void)) => {
    state.cleanup = effect() ?? null;
  },
}));

import { useComputeWorker } from "../src/hooks/useComputeWorker";

describe("SG28 — ciclo de vida del worker Lite", () => {
  const originalWorker = globalThis.Worker;
  const instances: { terminate: ReturnType<typeof vi.fn> }[] = [];

  beforeEach(() => {
    instances.length = 0;
    state.workerRef.current = null;
    state.cleanup = null;
    class FakeWorker {
      terminate = vi.fn();
      constructor(_url: URL, _options: WorkerOptions) {
        instances.push(this);
      }
    }
    vi.stubGlobal("Worker", FakeWorker);
  });

  afterEach(() => {
    state.cleanup?.();
    state.cleanup = null;
    vi.unstubAllGlobals();
    if (originalWorker) vi.stubGlobal("Worker", originalWorker);
  });

  it("cancela el worker anterior y crea uno nuevo para el siguiente cálculo", () => {
    const { getWorker, cancelWorker } = useComputeWorker();
    const first = getWorker();
    expect(getWorker()).toBe(first);
    expect(instances).toHaveLength(1);

    cancelWorker();
    expect(instances[0].terminate).toHaveBeenCalledTimes(1);

    const second = getWorker();
    expect(second).not.toBe(first);
    expect(instances).toHaveLength(2);
    cancelWorker();
    cancelWorker();
    expect(instances[1].terminate).toHaveBeenCalledTimes(1);
  });

  it("termina el worker al desmontar el modo y permite nueva instancia", () => {
    const { getWorker } = useComputeWorker();
    const first = getWorker();
    expect(state.cleanup).toBeTypeOf("function");
    state.cleanup?.();
    expect(instances[0].terminate).toHaveBeenCalledTimes(1);
    expect(getWorker()).not.toBe(first);
    expect(instances).toHaveLength(2);
  });
});

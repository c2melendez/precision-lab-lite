import { beforeEach, describe, expect, it, vi } from "vitest";

class MemoryStorage {
  private data = new Map<string, string>();

  getItem(key: string) {
    return this.data.has(key) ? this.data.get(key)! : null;
  }

  setItem(key: string, value: string) {
    this.data.set(key, String(value));
  }

  removeItem(key: string) {
    this.data.delete(key);
  }

  clear() {
    this.data.clear();
  }
}

describe("M29 floating layout persistence", () => {
  const storage = new MemoryStorage();

  beforeEach(() => {
    storage.clear();
    vi.stubGlobal("localStorage", storage);
    vi.resetModules();
  });

  it("clamps oversized/offscreen rectangles into the viewport", async () => {
    const { clampToViewport } = await import("../src/store/useFloatingLayoutStore");

    expect(
      clampToViewport(
        { x: 5000, y: -100, width: 1600, height: 1200 },
        1024,
        768,
      ),
    ).toEqual({
      x: 8,
      y: 8,
      width: 1008,
      height: 752,
    });
  });

  it("loads persisted window geometry", async () => {
    storage.setItem(
      "precision-lab-floating-layout",
      JSON.stringify({
        keyboardWindow: { x: 50, y: 60, width: 280, height: 210 },
        graphWindow: { x: 400, y: 140, width: 360, height: 300 },
      }),
    );

    const { useFloatingLayoutStore } = await import("../src/store/useFloatingLayoutStore");
    const state = useFloatingLayoutStore.getState();

    expect(state.keyboardWindow).toEqual({ x: 50, y: 60, width: 280, height: 210 });
    expect(state.graphWindow).toEqual({ x: 400, y: 140, width: 360, height: 300 });
  });

  it("persists changes and clamps both windows", async () => {
    const { useFloatingLayoutStore } = await import("../src/store/useFloatingLayoutStore");
    const store = useFloatingLayoutStore.getState();

    store.setWindow("keyboard", { x: 900, y: 700, width: 400, height: 300 });
    useFloatingLayoutStore.getState().setWindow("graph", { x: -20, y: 900, width: 500, height: 500 });
    useFloatingLayoutStore.getState().clampAllToViewport(1024, 768);

    const state = useFloatingLayoutStore.getState();
    const persisted = JSON.parse(storage.getItem("precision-lab-floating-layout")!);

    expect(state.keyboardWindow.x + state.keyboardWindow.width).toBeLessThanOrEqual(1016);
    expect(state.keyboardWindow.y + state.keyboardWindow.height).toBeLessThanOrEqual(760);
    expect(state.graphWindow.x).toBeGreaterThanOrEqual(8);
    expect(state.graphWindow.y + state.graphWindow.height).toBeLessThanOrEqual(760);
    expect(persisted).toEqual({
      keyboardWindow: state.keyboardWindow,
      graphWindow: state.graphWindow,
    });
  });

  it("falls back safely when persisted JSON is corrupt", async () => {
    storage.setItem("precision-lab-floating-layout", "{broken-json");

    const { useFloatingLayoutStore } = await import("../src/store/useFloatingLayoutStore");
    const state = useFloatingLayoutStore.getState();

    expect(state.keyboardWindow).toEqual({ x: 24, y: 320, width: 300, height: 220 });
    expect(state.graphWindow).toEqual({ x: 360, y: 120, width: 340, height: 260 });
  });
});

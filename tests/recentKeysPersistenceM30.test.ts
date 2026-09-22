import { beforeEach, describe, expect, it, vi } from "vitest";

class MemoryStorage {
  private data = new Map<string, string>();

  getItem(key: string) {
    return this.data.has(key) ? this.data.get(key)! : null;
  }

  setItem(key: string, value: string) {
    this.data.set(key, String(value));
  }

  clear() {
    this.data.clear();
  }
}

const key = (insertLatex: string, ariaLabel = insertLatex) => ({
  glyph: ariaLabel,
  insertLatex,
  ariaLabel,
});

describe("M30 recent keys persistence", () => {
  const storage = new MemoryStorage();

  beforeEach(() => {
    storage.clear();
    vi.stubGlobal("localStorage", storage);
    vi.resetModules();
  });

  it("rehydrates valid recent keys from localStorage", async () => {
    storage.setItem(
      "precision-lab-recent-keys",
      JSON.stringify({
        basic: {
          operations: [key("\\sin(#0)", "seno")],
          variables: [key("x", "variable x")],
        },
      }),
    );

    const { useRecentKeysStore } = await import("../src/store/useRecentKeysStore");
    const recents = useRecentKeysStore.getState().getRecents("basic");

    expect(recents.operations.map((k) => k.ariaLabel)).toEqual(["seno"]);
    expect(recents.variables.map((k) => k.ariaLabel)).toEqual(["variable x"]);
  });

  it("writes reordered recents back to localStorage", async () => {
    const { useRecentKeysStore } = await import("../src/store/useRecentKeysStore");

    useRecentKeysStore.getState().recordKey("basic", key("\\sin(#0)", "seno"), "operation");
    useRecentKeysStore.getState().recordKey("basic", key("\\cos(#0)", "coseno"), "operation");
    useRecentKeysStore.getState().recordKey("basic", key("\\sin(#0)", "seno"), "operation");

    const persisted = JSON.parse(storage.getItem("precision-lab-recent-keys")!);
    expect(persisted.basic.operations.map((k: { ariaLabel: string }) => k.ariaLabel)).toEqual([
      "seno",
      "coseno",
    ]);
  });

  it("ignores corrupt JSON instead of breaking startup", async () => {
    storage.setItem("precision-lab-recent-keys", "{broken-json");

    const { useRecentKeysStore } = await import("../src/store/useRecentKeysStore");

    expect(useRecentKeysStore.getState().getRecents("basic")).toEqual({
      operations: [],
      variables: [],
    });
  });

  it("discards malformed mode entries while preserving valid ones", async () => {
    storage.setItem(
      "precision-lab-recent-keys",
      JSON.stringify({
        basic: {
          operations: [key("\\sin(#0)", "seno")],
          variables: [],
        },
        matrices: {
          operations: [{ insertLatex: "det", glyph: "det" }],
          variables: "not-an-array",
        },
      }),
    );

    const { useRecentKeysStore } = await import("../src/store/useRecentKeysStore");

    expect(useRecentKeysStore.getState().getRecents("basic").operations).toHaveLength(1);
    expect(useRecentKeysStore.getState().getRecents("matrices")).toEqual({
      operations: [],
      variables: [],
    });
  });
});

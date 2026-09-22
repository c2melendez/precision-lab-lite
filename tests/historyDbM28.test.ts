import { beforeEach, describe, expect, it, vi } from "vitest";

type Entry = {
  id: string;
  mode: string;
  input: string;
  resultSummary: string;
  timestamp: number;
};

const state = vi.hoisted(() => {
  const rows = new Map<string, Entry>();
  const openDB = vi.fn();

  const db = {
    async put(_store: string, entry: Entry) {
      rows.set(entry.id, { ...entry });
    },
    async getAllFromIndex(_store: string, _index: string) {
      return [...rows.values()].sort(
        (a, b) => a.timestamp - b.timestamp || a.id.localeCompare(b.id),
      );
    },
    transaction() {
      const pending: Promise<void>[] = [];
      return {
        store: {
          delete(id: string) {
            const op = Promise.resolve().then(() => {
              rows.delete(id);
            });
            pending.push(op);
            return op;
          },
        },
        get done() {
          return Promise.all(pending).then(() => undefined);
        },
      };
    },
    async clear() {
      rows.clear();
    },
  };

  return { rows, openDB, db };
});

vi.mock("idb", () => ({
  openDB: state.openDB,
}));

describe("M28 historyDb persistence contract", () => {
  beforeEach(() => {
    state.rows.clear();
    state.openDB.mockReset();
    state.openDB.mockResolvedValue(state.db);
    vi.resetModules();
    vi.restoreAllMocks();
  });

  it("stores entries and returns newest first", async () => {
    let now = 1_000;
    vi.spyOn(Date, "now").mockImplementation(() => now);

    const { addHistoryEntry, getAllHistoryEntries } = await import("../src/store/historyDb");

    await addHistoryEntry({ mode: "Científica", input: "1+1", resultSummary: "2" });
    now = 2_000;
    await addHistoryEntry({ mode: "Matrices", input: "det(A)", resultSummary: "1" });

    const entries = await getAllHistoryEntries();

    expect(entries).toHaveLength(2);
    expect(entries.map((entry) => entry.input)).toEqual(["det(A)", "1+1"]);
    expect(entries.map((entry) => entry.timestamp)).toEqual([2_000, 1_000]);
    expect(state.openDB).toHaveBeenCalledTimes(1);
  });

  it("clears all persisted history", async () => {
    const { addHistoryEntry, clearHistory, getAllHistoryEntries } = await import("../src/store/historyDb");

    await addHistoryEntry({ mode: "Científica", input: "2+2", resultSummary: "4" });
    expect(await getAllHistoryEntries()).toHaveLength(1);

    await clearHistory();

    expect(await getAllHistoryEntries()).toEqual([]);
  });

  it("prunes the oldest entry and caps storage at 200 records", async () => {
    let now = 10_000;
    vi.spyOn(Date, "now").mockImplementation(() => now++);

    const { addHistoryEntry, getAllHistoryEntries } = await import("../src/store/historyDb");

    for (let index = 0; index < 201; index += 1) {
      await addHistoryEntry({
        mode: "Científica",
        input: `expr-${index}`,
        resultSummary: String(index),
      });
    }

    const entries = await getAllHistoryEntries();

    expect(entries).toHaveLength(200);
    expect(entries[0]?.input).toBe("expr-200");
    expect(entries.at(-1)?.input).toBe("expr-1");
    expect(entries.some((entry) => entry.input === "expr-0")).toBe(false);
  });

  it("keeps separate records when writes happen in the same millisecond", async () => {
    vi.spyOn(Date, "now").mockReturnValue(42_000);

    const { addHistoryEntry, getAllHistoryEntries } = await import("../src/store/historyDb");

    await addHistoryEntry({ mode: "Científica", input: "A", resultSummary: "1" });
    await addHistoryEntry({ mode: "Científica", input: "B", resultSummary: "2" });

    const entries = await getAllHistoryEntries();

    expect(entries).toHaveLength(2);
    expect(new Set(entries.map((entry) => entry.id)).size).toBe(2);
    expect(entries.every((entry) => entry.timestamp === 42_000)).toBe(true);
  });
});

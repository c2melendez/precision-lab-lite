import { create } from "zustand";
import type { HistoryEntry } from "./historyDb";

interface PendingHistoryReuseState {
  pending: HistoryEntry | null;
  setPending: (entry: HistoryEntry) => void;
  takePending: () => HistoryEntry | null;
}

export const usePendingHistoryReuseStore = create<PendingHistoryReuseState>((set, get) => ({
  pending: null,
  setPending: (pending) => set({ pending }),
  takePending: () => {
    const current = get().pending;
    set({ pending: null });
    return current;
  },
}));

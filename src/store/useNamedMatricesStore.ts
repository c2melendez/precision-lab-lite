import { create } from "zustand";
import { makeEmptyMatrix } from "../components/MatrixGridInput";

export const MATRIX_NAMES = ["A", "B", "C", "D", "E", "F"] as const;
export type MatrixName = (typeof MATRIX_NAMES)[number];

export interface NamedMatrixEntry {
  rows: number;
  cols: number;
  values: string[][];
}

interface NamedMatricesState {
  matrices: Record<MatrixName, NamedMatrixEntry>;
  primary: MatrixName;
  secondary: MatrixName;
  setPrimary: (name: MatrixName) => void;
  setSecondary: (name: MatrixName) => void;
  setDimensions: (name: MatrixName, rows: number, cols: number) => void;
  setValues: (name: MatrixName, values: string[][]) => void;
  resetMatrix: (name: MatrixName) => void;
  resetAll: () => void;
}

const STORAGE_KEY = "precision-lab-named-matrices-v1";
const MIN_SIZE = 1;
const MAX_SIZE = 6;

function defaultEntry(): NamedMatrixEntry {
  return { rows: 2, cols: 2, values: makeEmptyMatrix(2, 2) };
}

function defaultMatrices(): Record<MatrixName, NamedMatrixEntry> {
  return Object.fromEntries(
    MATRIX_NAMES.map((name) => [name, defaultEntry()]),
  ) as Record<MatrixName, NamedMatrixEntry>;
}

function clampSize(value: unknown): number {
  const n = typeof value === "number" && Number.isFinite(value) ? Math.trunc(value) : 2;
  return Math.min(MAX_SIZE, Math.max(MIN_SIZE, n));
}

function normalizeEntry(value: unknown): NamedMatrixEntry {
  if (typeof value !== "object" || value === null) return defaultEntry();
  const raw = value as Partial<NamedMatrixEntry>;
  const rows = clampSize(raw.rows);
  const cols = clampSize(raw.cols);
  const source = Array.isArray(raw.values) ? raw.values : [];
  const values = Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => {
      const cell = source[r]?.[c];
      return typeof cell === "string" ? cell : "";
    }),
  );
  return { rows, cols, values };
}

function readInitial(): Pick<NamedMatricesState, "matrices" | "primary" | "secondary"> {
  const fallback = { matrices: defaultMatrices(), primary: "A" as MatrixName, secondary: "B" as MatrixName };
  if (typeof localStorage === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as {
      matrices?: Partial<Record<MatrixName, unknown>>;
      primary?: unknown;
      secondary?: unknown;
    };
    const matrices = defaultMatrices();
    for (const name of MATRIX_NAMES) {
      matrices[name] = normalizeEntry(parsed.matrices?.[name]);
    }
    const primary = MATRIX_NAMES.includes(parsed.primary as MatrixName)
      ? (parsed.primary as MatrixName)
      : "A";
    const secondary = MATRIX_NAMES.includes(parsed.secondary as MatrixName)
      ? (parsed.secondary as MatrixName)
      : "B";
    return { matrices, primary, secondary };
  } catch {
    return fallback;
  }
}

function persist(state: Pick<NamedMatricesState, "matrices" | "primary" | "secondary">): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Sin almacenamiento disponible, el modo sigue funcionando durante la sesión.
  }
}

export const useNamedMatricesStore = create<NamedMatricesState>((set, get) => ({
  ...readInitial(),

  setPrimary: (primary) => {
    const next = { matrices: get().matrices, primary, secondary: get().secondary };
    persist(next);
    set({ primary });
  },

  setSecondary: (secondary) => {
    const next = { matrices: get().matrices, primary: get().primary, secondary };
    persist(next);
    set({ secondary });
  },

  setDimensions: (name, rowsRaw, colsRaw) => {
    const rows = clampSize(rowsRaw);
    const cols = clampSize(colsRaw);
    const current = get().matrices[name];
    const values = Array.from({ length: rows }, (_, r) =>
      Array.from({ length: cols }, (_, c) => current.values[r]?.[c] ?? ""),
    );
    const matrices = {
      ...get().matrices,
      [name]: { rows, cols, values },
    };
    persist({ matrices, primary: get().primary, secondary: get().secondary });
    set({ matrices });
  },

  setValues: (name, values) => {
    const current = get().matrices[name];
    const normalized = Array.from({ length: current.rows }, (_, r) =>
      Array.from({ length: current.cols }, (_, c) =>
        typeof values[r]?.[c] === "string" ? values[r][c] : "",
      ),
    );
    const matrices = {
      ...get().matrices,
      [name]: { ...current, values: normalized },
    };
    persist({ matrices, primary: get().primary, secondary: get().secondary });
    set({ matrices });
  },

  resetMatrix: (name) => {
    const matrices = { ...get().matrices, [name]: defaultEntry() };
    persist({ matrices, primary: get().primary, secondary: get().secondary });
    set({ matrices });
  },

  resetAll: () => {
    const matrices = defaultMatrices();
    const primary: MatrixName = "A";
    const secondary: MatrixName = "B";
    persist({ matrices, primary, secondary });
    set({ matrices, primary, secondary });
  },
}));

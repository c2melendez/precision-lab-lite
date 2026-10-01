import { useCallback, useEffect, useState } from "react";
import { useComputeWorker } from "../../hooks/useComputeWorker";
import { MatrixGridInput } from "../../components/MatrixGridInput";
import { ResultPanel } from "../../components/ResultPanel";
import { StepList } from "../../components/StepList";
import { makeRequestId, type MathResult } from "../../types";
import { addHistoryEntry } from "../../store/historyDb";
import {
  MATRIX_NAMES,
  type MatrixName,
  useNamedMatricesStore,
} from "../../store/useNamedMatricesStore";
import { usePendingHistoryReuseStore } from "../../store/usePendingHistoryReuseStore";

// Modo Matrices — M25 añade un banco persistente de matrices A–F.
// Las operaciones y el worker siguen recibiendo arrays ordinarios: la
// persistencia/selección vive en UI/store y no altera el motor matemático.

type Op = "add" | "subtract" | "multiply" | "kron" | "transpose" | "determinant" | "inverse" | "power" | "ref" | "rref" | "dot" | "cross" | "norm" | "eigen" | "trace" | "rank";

const OP_LABELS: Record<Op, string> = {
  add: "A + B",
  subtract: "A − B",
  multiply: "A × B",
  kron: "A ⊗ B",
  transpose: "Aᵀ",
  determinant: "det(A)",
  inverse: "A⁻¹",
  power: "Aⁿ",
  ref: "ref(A)",
  rref: "rref(A)",
  dot: "A · B",
  cross: "A ⨯ B",
  norm: "‖A‖",
  eigen: "Eigenvalores y eigenvectores",
  trace: "tr(A)",
  rank: "rango(A)",
};

const NEEDS_B: Op[] = ["add", "subtract", "multiply", "kron", "dot", "cross"];
const MIN_SIZE = 1;
const MAX_SIZE = 6;

function operationLabel(op: Op, primary: MatrixName, secondary: MatrixName): string {
  switch (op) {
    case "add": return `${primary} + ${secondary}`;
    case "subtract": return `${primary} − ${secondary}`;
    case "multiply": return `${primary} × ${secondary}`;
    case "kron": return `${primary} ⊗ ${secondary}`;
    case "transpose": return `${primary}ᵀ`;
    case "determinant": return `det(${primary})`;
    case "inverse": return `${primary}⁻¹`;
    case "power": return `${primary}ⁿ`;
    case "ref": return `ref(${primary})`;
    case "rref": return `rref(${primary})`;
    case "dot": return `${primary} · ${secondary}`;
    case "cross": return `${primary} ⨯ ${secondary}`;
    case "norm": return `‖${primary}‖`;
    case "eigen": return "Eigenvalores y eigenvectores";
    case "trace": return `tr(${primary})`;
    case "rank": return `rango(${primary})`;
  }
}

function Stepper({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted">
      <span>{label}</span>
      <button
        type="button"
        onClick={() => onChange(Math.max(MIN_SIZE, value - 1))}
        aria-label={`Reducir ${label}`}
        className="h-6 w-6 rounded-full bg-paper-line/60 text-ink hover:bg-paper-line"
      >
        −
      </button>
      <span className="w-4 text-center font-mono text-ink">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(MAX_SIZE, value + 1))}
        aria-label={`Aumentar ${label}`}
        className="h-6 w-6 rounded-full bg-paper-line/60 text-ink hover:bg-paper-line"
      >
        +
      </button>
    </div>
  );
}

function MatrixSelector({
  label,
  value,
  onChange,
}: {
  label: string;
  value: MatrixName;
  onChange: (name: MatrixName) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-muted">
      <span>{label}</span>
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value as MatrixName)}
        className="rounded-md border border-paper-line bg-paper px-2 py-1 font-semibold text-ink"
      >
        {MATRIX_NAMES.map((name) => (
          <option key={name} value={name}>
            Matriz {name}
          </option>
        ))}
      </select>
    </label>
  );
}

export function MatrixMode() {
  const [op, setOp] = useState<Op>("add");
  const [exponent, setExponent] = useState(2);
  const [matrixExpression, setMatrixExpression] = useState("A+B");
  const [copyTarget, setCopyTarget] = useState<MatrixName>("C");
  const [result, setResult] = useState<MathResult | null>(null);

  const matrices = useNamedMatricesStore((state) => state.matrices);
  const primary = useNamedMatricesStore((state) => state.primary);
  const secondary = useNamedMatricesStore((state) => state.secondary);
  const setPrimary = useNamedMatricesStore((state) => state.setPrimary);
  const setSecondary = useNamedMatricesStore((state) => state.setSecondary);
  const setDimensions = useNamedMatricesStore((state) => state.setDimensions);
  const setValues = useNamedMatricesStore((state) => state.setValues);
  const resetMatrix = useNamedMatricesStore((state) => state.resetMatrix);
  const copyMatrix = useNamedMatricesStore((state) => state.copyMatrix);
  const pendingHistoryReuse = usePendingHistoryReuseStore((s) => s.pending);
  const takePendingHistoryReuse = usePendingHistoryReuseStore((s) => s.takePending);

  useEffect(() => {
    const entry = takePendingHistoryReuse();
    if (!entry) return;
    try {
      const parsed = JSON.parse(entry.input) as Record<string, unknown>;
      const matrixEntries = Object.entries(parsed).filter(([, value]) => Array.isArray(value));
      for (const [name, value] of matrixEntries) {
        if (!MATRIX_NAMES.includes(name as MatrixName)) continue;
        const rows = value as unknown[][];
        const cols = Array.isArray(rows[0]) ? rows[0].length : 0;
        if (!rows.length || !cols) continue;
        setDimensions(name as MatrixName, rows.length, cols);
        setValues(name as MatrixName, rows.map((row) => row.map((cell) => String(cell))));
      }
    } catch {
      setMatrixExpression(entry.input);
    }

    const label = entry.mode.toLowerCase();
    if (label.includes("det(")) setOp("determinant");
    else if (label.includes("×") || label.includes("multiply")) setOp("multiply");
    else if (label.includes("−") || label.includes("subtract")) setOp("subtract");
    else if (label.includes("⊗") || label.includes("kron")) setOp("kron");
    else if (label.includes("⁻¹") || label.includes("inverse")) setOp("inverse");
    else if (label.includes("rref")) setOp("rref");
    else if (label.includes("ref(")) setOp("ref");
    else if (label.includes("tr(")) setOp("trace");
    else if (label.includes("rango") || label.includes("rank")) setOp("rank");
    else if (label.includes("eigen")) setOp("eigen");
    else if (label.includes("·") || label.includes("dot")) setOp("dot");
    else if (label.includes("⨯") || label.includes("cross")) setOp("cross");
    else if (label.includes("‖") || label.includes("norm")) setOp("norm");
    else if (label.includes("ᵀ") || label.includes("transpose")) setOp("transpose");
    else if (label.includes("+")) setOp("add");
    setResult(null);
  }, [pendingHistoryReuse, setDimensions, setValues, takePendingHistoryReuse]);

  const matrixA = matrices[primary];
  const matrixB = matrices[secondary];

  const { getWorker } = useComputeWorker();

  const handleCompute = useCallback(() => {
    const requestId = makeRequestId();
    const worker = getWorker();
    const label = operationLabel(op, primary, secondary);

    worker.onmessage = (e: MessageEvent<MathResult>) => {
      setResult(e.data);
      if (e.data.success) {
        const input = NEEDS_B.includes(op)
          ? JSON.stringify({ [primary]: matrixA.values, [secondary]: matrixB.values })
          : JSON.stringify({ [primary]: matrixA.values });
        addHistoryEntry({
          module: "Matrices",
          mode: `Matrices (${label})`,
          input,
          resultSummary: e.data.resultLatex ?? "",
        });
      }
    };

    if (NEEDS_B.includes(op)) {
      worker.postMessage({
        type: "matrixOp",
        requestId,
        op,
        a: matrixA.values,
        b: matrixB.values,
      });
    } else if (op === "power") {
      worker.postMessage({
        type: "matrixOp",
        requestId,
        op,
        a: matrixA.values,
        exponent,
      });
    } else {
      worker.postMessage({
        type: "matrixOp",
        requestId,
        op,
        a: matrixA.values,
      });
    }
  }, [op, primary, secondary, matrixA, matrixB, exponent, getWorker]);

  const handleExpressionCompute = useCallback(() => {
    const expression = matrixExpression.trim();
    if (!expression) return;

    const requestId = makeRequestId();
    const worker = getWorker();
    worker.onmessage = (e: MessageEvent<MathResult>) => {
      setResult(e.data);
      if (e.data.success) {
        addHistoryEntry({
          module: "Matrices",
          mode: "Matrices (expresión A–F)",
          input: expression,
          resultSummary: e.data.resultLatex ?? "",
        });
      }
    };

    worker.postMessage({
      type: "matrixExpression",
      requestId,
      expression,
      matrices: Object.fromEntries(
        MATRIX_NAMES.map((name) => [name, matrices[name].values]),
      ),
    });
  }, [matrixExpression, matrices, getWorker]);

  const choosePrimary = (name: MatrixName) => {
    setPrimary(name);
    if (copyTarget === name) {
      setCopyTarget(MATRIX_NAMES.find((candidate) => candidate !== name) ?? "A");
    }
    setResult(null);
  };
  const chooseSecondary = (name: MatrixName) => {
    setSecondary(name);
    setResult(null);
  };

  return (
    <div className="mx-auto grid w-full max-w-[1376px] gap-4 p-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:items-start">
      <section aria-label="Entrada de matrices" className="flex min-w-0 flex-col gap-4 rounded-xl border border-paper-line bg-paper-soft p-4 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-paper-line pb-3">
          <div>
            <h2 className="text-base font-semibold text-ink">Matrices</h2>
            <p className="mt-0.5 text-xs text-muted">Banco A–F, operaciones y expresión matricial</p>
          </div>
          <span className="rounded-full border border-paper-line bg-paper px-2.5 py-1 text-[11px] text-muted">
            Hasta 6×6
          </span>
        </div>
        <div className="flex flex-wrap gap-2 text-sm" aria-label="Operaciones matriciales">
          {(Object.keys(OP_LABELS) as Op[]).map((o) => {
            const eigenDisabled =
              o === "eigen" &&
              !(matrixA.rows === matrixA.cols && matrixA.rows >= 2 && matrixA.rows <= 6);
            return (
              <button
                key={o}
                type="button"
                onClick={() => {
                  if (!eigenDisabled) {
                    setOp(o);
                    setResult(null);
                  }
                }}
                disabled={eigenDisabled}
                title={eigenDisabled ? "Eigenvalores y eigenvectores requieren una matriz cuadrada de 2×2 a 6×6." : undefined}
                className={`rounded-full px-3 py-1 ${o === op ? "bg-marker text-chrome" : "bg-paper-soft text-muted"} ${eigenDisabled ? "cursor-not-allowed opacity-40" : ""}`}
              >
                {operationLabel(o, primary, secondary)}
              </button>
            );
          })}
        </div>

        <div className="rounded-xl border border-paper-line bg-paper-soft p-3">
          <label htmlFor="matrix-expression" className="mb-1 block text-sm font-medium text-ink">
            Expresión matricial A–F
          </label>
          <div className="flex min-w-0 flex-col gap-2 sm:flex-row">
            <input
              id="matrix-expression"
              value={matrixExpression}
              onChange={(event) => setMatrixExpression(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleExpressionCompute();
                }
              }}
              placeholder="Ej. (A+B)*C, det(A)+tr(B), inv(D)"
              spellCheck={false}
              autoComplete="off"
              className="min-w-0 flex-1 rounded-md border border-paper-line bg-paper px-3 py-2 font-mono text-sm text-ink"
            />
            <button
              type="button"
              onClick={handleExpressionCompute}
              disabled={matrixExpression.trim() === ""}
              className="w-full shrink-0 rounded-md bg-graph px-3 py-2 text-sm font-semibold text-paper hover:bg-graph/90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              Evaluar expresión
            </button>
          </div>
          <p className="mt-1.5 text-xs text-muted">
            Admite +, −, *, ^0…10, paréntesis y det/inv/tr/rank/ref/rref/transpose. Usa matrices A–F guardadas.
          </p>
        </div>

        <div
          className="flex flex-wrap items-center justify-center gap-3 rounded-xl border border-paper-line bg-paper-soft px-3 py-2"
          aria-label="Selección de matrices nombradas"
        >
          <MatrixSelector label="Matriz principal" value={primary} onChange={choosePrimary} />
          {NEEDS_B.includes(op) && (
            <MatrixSelector label="Matriz secundaria" value={secondary} onChange={chooseSecondary} />
          )}
          <MatrixSelector label="Duplicar principal en" value={copyTarget} onChange={setCopyTarget} />
          <button
            type="button"
            disabled={copyTarget === primary}
            onClick={() => {
              copyMatrix(primary, copyTarget);
              setResult(null);
            }}
            className="rounded-md border border-paper-line px-2 py-1 text-xs font-medium text-ink hover:bg-paper-line/40 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Duplicar {primary} en {copyTarget}
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Stepper
            label={`Filas ${primary}`}
            value={matrixA.rows}
            onChange={(rows) => setDimensions(primary, rows, matrixA.cols)}
          />
          <Stepper
            label={`Col ${primary}`}
            value={matrixA.cols}
            onChange={(cols) => setDimensions(primary, matrixA.rows, cols)}
          />
          <button
            type="button"
            onClick={() => {
              resetMatrix(primary);
              setResult(null);
            }}
            className="rounded-md border border-paper-line px-2 py-1 text-xs text-muted hover:bg-paper-line/40"
          >
            Limpiar {primary}
          </button>
        </div>
        <MatrixGridInput
          rows={matrixA.rows}
          cols={matrixA.cols}
          values={matrixA.values}
          onChange={(values) => setValues(primary, values)}
          label={`Matriz ${primary}`}
        />

        {NEEDS_B.includes(op) && (
          <>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Stepper
                label={`Filas ${secondary}`}
                value={matrixB.rows}
                onChange={(rows) => setDimensions(secondary, rows, matrixB.cols)}
              />
              <Stepper
                label={`Col ${secondary}`}
                value={matrixB.cols}
                onChange={(cols) => setDimensions(secondary, matrixB.rows, cols)}
              />
              <button
                type="button"
                onClick={() => {
                  resetMatrix(secondary);
                  setResult(null);
                }}
                className="rounded-md border border-paper-line px-2 py-1 text-xs text-muted hover:bg-paper-line/40"
              >
                Limpiar {secondary}
              </button>
            </div>
            <MatrixGridInput
              rows={matrixB.rows}
              cols={matrixB.cols}
              values={matrixB.values}
              onChange={(values) => setValues(secondary, values)}
              label={`Matriz ${secondary}`}
            />
          </>
        )}

        {op === "power" && (
          <label className="flex items-center justify-center gap-2 text-sm text-muted">
            Exponente n:
            <input
              type="number"
              min={0}
              value={exponent}
              onChange={(e) => setExponent(parseInt(e.target.value, 10) || 0)}
              className="w-16 rounded bg-paper-soft px-2 py-1 text-center text-ink"
            />
          </label>
        )}

        <button
          type="button"
          onClick={handleCompute}
          className="w-full rounded-lg bg-graph py-2.5 text-base font-semibold text-paper hover:bg-graph/90"
        >
          Calcular
        </button>
      </section>

      <section aria-label="Resultado y pasos de matrices" className="flex min-w-0 max-w-full flex-col gap-3 overflow-hidden rounded-xl border border-paper-line bg-paper p-4 shadow-sm">
        <div className="border-b border-paper-line pb-3">
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Resultado</h3>
          <p className="mt-0.5 text-[11px] text-muted">Resultado, formato y procedimiento</p>
        </div>
        <ResultPanel result={result} />
        {result?.steps && result.steps.length > 0 && <StepList steps={result.steps} />}
      </section>
    </div>
  );
}

export { OP_LABELS as MATRIX_OPERATION_LABELS, operationLabel as matrixOperationLabel };
export type { Op as MatrixOperation };

import { useCallback, useRef, useState } from "react";
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
  const [result, setResult] = useState<MathResult | null>(null);
  const workerRef = useRef<Worker | null>(null);

  const matrices = useNamedMatricesStore((state) => state.matrices);
  const primary = useNamedMatricesStore((state) => state.primary);
  const secondary = useNamedMatricesStore((state) => state.secondary);
  const setPrimary = useNamedMatricesStore((state) => state.setPrimary);
  const setSecondary = useNamedMatricesStore((state) => state.setSecondary);
  const setDimensions = useNamedMatricesStore((state) => state.setDimensions);
  const setValues = useNamedMatricesStore((state) => state.setValues);
  const resetMatrix = useNamedMatricesStore((state) => state.resetMatrix);

  const matrixA = matrices[primary];
  const matrixB = matrices[secondary];

  const getWorker = useCallback(() => {
    if (!workerRef.current) {
      workerRef.current = new Worker(
        new URL("../../workers/compute.worker.ts", import.meta.url),
        { type: "module" },
      );
    }
    return workerRef.current;
  }, []);

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
    setResult(null);
  };
  const chooseSecondary = (name: MatrixName) => {
    setSecondary(name);
    setResult(null);
  };

  return (
    <div className="mx-auto flex max-w-md flex-col gap-3 p-4 lg:max-w-4xl lg:grid lg:grid-cols-[1.4fr_1fr] lg:items-start lg:gap-6 dt:gap-10">
      <div className="flex flex-col gap-3 lg:col-start-1">
        <div className="flex flex-wrap justify-center gap-2 text-sm">
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
          <div className="flex gap-2">
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
              className="shrink-0 rounded-md bg-graph px-3 py-2 text-sm font-semibold text-paper hover:bg-graph/90 disabled:cursor-not-allowed disabled:opacity-50"
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
          className="rounded-lg bg-graph py-2 text-lg font-semibold text-paper hover:bg-graph/90"
        >
          Calcular
        </button>
      </div>

      <div className="flex flex-col gap-3 lg:col-start-2">
        <div className="rounded-xl bg-paper-soft px-4 py-3 shadow-inner shadow-black/10">
          <ResultPanel result={result} />
        </div>
        {result?.steps && result.steps.length > 0 && <StepList steps={result.steps} />}
      </div>
    </div>
  );
}

export { OP_LABELS as MATRIX_OPERATION_LABELS, operationLabel as matrixOperationLabel };
export type { Op as MatrixOperation };

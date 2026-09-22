import { useCallback, useEffect, useRef, useState } from "react";
import { MathKeyboard, isVariableOrConstantKey, type KeyDef } from "../../components/MathKeyboard";
import { KeyboardBasicPanel } from "../../components/KeyboardBasicPanel";
import { Screen } from "../../components/Screen";
import { type SessionHistoryEntry } from "../../components/HistoryLog";
import { makeRequestId, ErrorCode, type MathResult } from "../../types";
import { parseExpression } from "../../engine/parsing";
import { splitSystemLatex } from "../../engine/parsing/systemSplit";
import { detectODE } from "../../engine/parsing/odeDetect";
import { detectComplexAnalysisIntent } from "../../engine/parsing/complexAnalysisIntent";
import { addHistoryEntry } from "../../store/historyDb";
import { useKeyboardPanelStore } from "../../store/useKeyboardPanelStore";
import { useRecentKeysStore } from "../../store/useRecentKeysStore";
import { useLayoutModeStore } from "../../store/useLayoutModeStore";
import { useArgandBridgeStore } from "../../store/useArgandBridgeStore";
import { usePendingGraphStore } from "../../store/usePendingGraphStore";

// Modo 1 de la spec v10 §5. Orquesta NaturalInput + MathKeyboard +
// ResultPanel, delegando todo el cómputo al Web Worker (nunca al hilo
// principal — regla dura de §3/§12).
//
// Fase A (spec UX estilo ClassCalc): el teclado ahora inserta con
// field.insert() (cursor-aware, plantillas #0) en vez de concatenar texto
// al final — se guarda una referencia real al <math-field>. El popover
// DEG/RAD sale del teclado y vive en el header de este modo.
//
// Fase 1 (fusión de modos, plan de 3 fases): handleCalculate ahora es un
// router — antes SIEMPRE mandaba {type:"evaluate"} al worker sin mirar si
// la expresión era una ecuación (bug real: "2x+3=7" se "resolvía" como
// simplificar la resta 2x-4, nunca despejaba x=2). Ahora:
//   1. Si el campo tiene un entorno \begin{cases}, se trata como sistema
//      (mismo pipeline que LinearSystemsMode.tsx, con N campos).
//   2. Si no, se parsea una vez con parseExpression(); si es ecuación
//      (parsed.isEquation) con exactamente 1 variable libre, se resuelve
//      con solveAlgebra (mismo pipeline que AlgebraMode.tsx).
//   3. Si no es ecuación, se evalúa como antes.
// AlgebraMode.tsx y LinearSystemsMode.tsx no se eliminaron — siguen
// existiendo como pestañas aparte para quien prefiera esa UI dedicada
// (ej. sistemas con más de 4 ecuaciones, o elegir la variable a despejar
// cuando hay más de una). Este router es el atajo dentro de la pantalla
// unificada para el caso común.

type MathFieldRef = { insert: (s: string) => void; focus: () => void; value: string } | null;

export function BasicScientificMode() {
  const [latex, setLatex] = useState("");
  const [result, setResult] = useState<MathResult | null>(null);
  const [angleMode, setAngleMode] = useState<"RAD" | "GRAD">("RAD");
  const workerRef = useRef<Worker | null>(null);
  const [mathField, setMathField] = useState<MathFieldRef>(null);
  const [sessionHistory, setSessionHistory] = useState<SessionHistoryEntry[]>([]);
  const setPendingArgandPoint = useArgandBridgeStore((s) => s.setPendingArgandPoint);

  const getWorker = useCallback(() => {
    if (!workerRef.current) {
      workerRef.current = new Worker(
        new URL("../../workers/compute.worker.ts", import.meta.url),
        { type: "module" },
      );
    }
    return workerRef.current;
  }, []);

  const fail = useCallback((code: ErrorCode, message: string, requestId: string) => {
    setResult({
      success: false,
      errorCode: code,
      errorMessage: message,
      resultLatex: null,
      steps: [],
      hasDetailedSteps: false,
      confidence: "SYMBOLIC",
      requestId,
    });
  }, []);

  const onSuccess = useCallback((mode: string, inputDisplay: string, data: MathResult) => {
    setResult(data);
    if (data.success) {
      addHistoryEntry({ mode, input: inputDisplay, resultSummary: data.resultLatex ?? "" });
      setSessionHistory((prev) => [...prev, { id: data.requestId, input: inputDisplay, result: data }]);
    }
  }, []);

  // Rama 1: sistema (entorno \begin{cases} detectado). Mismo pipeline que
  // LinearSystemsMode.tsx, ver comentario ahí para el detalle de por qué
  // se exige #variables === #ecuaciones.
  //
  // Corrección post-auditoría (Módulo C, spec_motor_matematico_pendiente.md
  // §4): antes esta función SIEMPRE rechazaba un renglón que no fuera
  // ecuación ("debe ser una ecuación con ="), así que el motor de sistemas
  // de inecuaciones (solveLinearInequalitySystem, ya construido y probado
  // de forma aislada) nunca se alcanzaba desde ningún flujo real. Ahora se
  // parsean todos los renglones primero y se decide la rama según su tipo:
  // todos ecuación -> sistema de ecuaciones (sin cambios); todos inecuación
  // -> sistema de inecuaciones (nuevo); mezcla -> error explícito.
  const runSystem = useCallback(
    (rows: string[]) => {
      const requestId = makeRequestId();
      const parsedRows: ReturnType<typeof parseExpression>[] = [];

      for (const row of rows) {
        try {
          parsedRows.push(parseExpression(row, angleMode));
        } catch (err) {
          const appErr = err as { code?: ErrorCode; message?: string };
          fail(appErr.code ?? ErrorCode.PARSE_ERROR, appErr.message ?? "Ecuación inválida.", requestId);
          return;
        }
      }

      const allEquations = parsedRows.every((p) => p.isEquation);
      const allInequalities = parsedRows.every((p) => p.isInequality);

      if (allInequalities) {
        // Alcance confirmado en linearInequalitySystem.ts: exactamente 2
        // variables — el propio motor rechaza cualquier otro conteo con
        // un mensaje explícito, no hace falta duplicar esa validación acá.
        const allVariables = new Set<string>();
        parsedRows.forEach((p) => p.freeVariables.forEach((v) => allVariables.add(v)));
        const variables = [...allVariables].sort();
        const inequalities = parsedRows.map((p) => ({
          diffAlgebrite: p.algebrite,
          operator: p.inequalityOperator!,
        }));

        const worker = getWorker();
        worker.onmessage = (e: MessageEvent<MathResult>) =>
          onSuccess("Científica (sistema de inecuaciones)", rows.join("; "), e.data);
        worker.postMessage({ type: "linearInequalitySystem", requestId, inequalities, variables });
        return;
      }

      if (!allEquations) {
        fail(
          ErrorCode.PARSE_ERROR,
          `Cada renglón del sistema debe ser, todos, ecuaciones (con "=") o, todos, inecuaciones (con <, >, ≤, ≥) — no se puede mezclar ambos tipos en el mismo sistema.`,
          requestId,
        );
        return;
      }

      const allVariables = new Set<string>();
      const equationsAlgebrite: string[] = [];
      for (const parsed of parsedRows) {
        parsed.freeVariables.forEach((v) => allVariables.add(v));
        equationsAlgebrite.push(parsed.algebrite);
      }

      const variables = [...allVariables].sort();
      if (variables.length !== rows.length) {
        fail(
          ErrorCode.PARSE_ERROR,
          `Se detectaron ${variables.length} variable(s) distintas (${variables.join(", ") || "ninguna"}) pero hay ${rows.length} ecuaciones. Para una solución determinada, el número de variables debe igualar al de ecuaciones.`,
          requestId,
        );
        return;
      }

      const worker = getWorker();
      worker.onmessage = (e: MessageEvent<MathResult>) =>
        onSuccess("Científica (sistema)", rows.join("; "), e.data);
      worker.postMessage({ type: "linearSystem", requestId, equationsAlgebrite, variables });
    },
    [angleMode, getWorker, fail, onSuccess],
  );

  const handleCalculate = useCallback(() => {
    // El botón Calcular debe evaluar exactamente lo que el usuario ve en
    // MathLive. field.insert()/setValue() pueden actualizar el custom
    // element antes de que React haya propagado el último onChange; leer
    // el valor vivo elimina esa ventana de estado obsoleto.
    const currentLatex = mathField?.value ?? latex;
    const systemRows = splitSystemLatex(currentLatex);
    if (systemRows) {
      runSystem(systemRows);
      return;
    }

    try {
      const complexIntent = detectComplexAnalysisIntent(currentLatex);
      if (complexIntent !== null) {
        const requestId = makeRequestId();
        const parsedExpression = parseExpression(complexIntent.expressionLatex, angleMode);
        if (parsedExpression.isEquation || parsedExpression.isInequality) {
          fail(ErrorCode.PARSE_ERROR, "Res/Sing requiere una expresión, no una ecuación o desigualdad.", requestId);
          return;
        }

        const worker = getWorker();
        worker.onmessage = (e: MessageEvent<MathResult>) =>
          onSuccess(
            complexIntent.kind === "residue" ? "Científica (residuo)" : "Científica (singularidades)",
            currentLatex,
            e.data,
          );

        if (complexIntent.kind === "residue") {
          const parsedPoint = parseExpression(complexIntent.pointLatex, angleMode);
          if (parsedPoint.isEquation || parsedPoint.isInequality || parsedPoint.freeVariables.length > 0) {
            fail(ErrorCode.PARSE_ERROR, "El punto del residuo debe ser un valor concreto de z.", requestId);
            return;
          }
          worker.postMessage({
            type: "complexResidue",
            requestId,
            expressionAlgebrite: parsedExpression.algebrite,
            pointAlgebrite: parsedPoint.algebrite,
          });
        } else {
          worker.postMessage({
            type: "complexSingularities",
            requestId,
            expressionAlgebrite: parsedExpression.algebrite,
          });
        }
        return;
      }
    } catch (err) {
      const requestId = makeRequestId();
      const appErr = err as { code?: ErrorCode; message?: string };
      fail(appErr.code ?? ErrorCode.PARSE_ERROR, appErr.message ?? "Entrada Res/Sing inválida.", requestId);
      return;
    }

    // Fase E (spec_edo_complejos_tooltips.md §2.2, Módulo E2): hallazgo
    // real de auditoría -- parseExpression() de abajo trataría "y'=2x"
    // como una ecuación de álgebra común (splitEquation corta en el
    // primer "=" sin saber que hay una derivada) y fallaría en
    // tokenize() (la prima no es un token reconocido ahí), mucho antes
    // de llegar a ningún motor EDO. Por eso se detecta ANTES, con el
    // mismo criterio que splitSystemLatex arriba.
    const odeExpression = detectODE(currentLatex);
    if (odeExpression !== null) {
      const requestId = makeRequestId();
      const worker = getWorker();
      worker.onmessage = (e: MessageEvent<MathResult>) => onSuccess("Científica (EDO)", currentLatex, e.data);
      worker.postMessage({ type: "ode", requestId, expression: odeExpression });
      return;
    }

    const requestId = makeRequestId();
    let parsed;
    try {
      parsed = parseExpression(currentLatex, angleMode);
    } catch (err) {
      const appErr = err as { code?: ErrorCode; message?: string };
      fail(appErr.code ?? ErrorCode.PARSE_ERROR, appErr.message ?? "Expresión inválida.", requestId);
      return;
    }

    const worker = getWorker();

    // Rama 2: ecuación de una variable (spec §6 — igual criterio que
    // AlgebraMode.tsx: 0 o >1 variables libres se rechaza en vez de
    // adivinar cuál despejar).
    if (parsed.isEquation) {
      if (parsed.freeVariables.length !== 1) {
        fail(
          ErrorCode.PARSE_ERROR,
          parsed.freeVariables.length === 0
            ? "No se detectó ninguna variable para despejar."
            : `Hay más de una variable (${parsed.freeVariables.join(", ")}); usa la pestaña Álgebra para elegir cuál despejar.`,
          requestId,
        );
        return;
      }
      worker.onmessage = (e: MessageEvent<MathResult>) => onSuccess("Científica (ecuación)", currentLatex, e.data);
      worker.postMessage({
        type: "solveAlgebra",
        requestId,
        leftAlgebrite: parsed.leftAlgebrite,
        rightAlgebrite: parsed.rightAlgebrite,
        variable: parsed.freeVariables[0],
      });
      return;
    }

    // Fix (decisión de Carlos, cierre de la suite de paridad de teclado):
    // desigualdad de una variable — mismo criterio de "una sola variable"
    // que la rama de ecuación de arriba.
    if (parsed.isInequality) {
      if (parsed.freeVariables.length !== 1) {
        fail(
          ErrorCode.PARSE_ERROR,
          parsed.freeVariables.length === 0
            ? "No se detectó ninguna variable en la desigualdad."
            : `Hay más de una variable (${parsed.freeVariables.join(", ")}) — el solver básico de desigualdades solo admite una.`,
          requestId,
        );
        return;
      }
      worker.onmessage = (e: MessageEvent<MathResult>) => onSuccess("Científica (desigualdad)", currentLatex, e.data);
      worker.postMessage({
        type: "solveInequality",
        requestId,
        diffAlgebrite: parsed.algebrite,
        operator: parsed.inequalityOperator,
        variable: parsed.freeVariables[0],
      });
      return;
    }

    // Rama 3: expresión simple (comportamiento original, sin cambios).
    worker.onmessage = (e: MessageEvent<MathResult>) => onSuccess("Científica", currentLatex, e.data);
    worker.postMessage({ type: "evaluate", requestId, expressionAlgebrite: parsed.algebrite });
  }, [latex, mathField, angleMode, getWorker, fail, onSuccess, runSystem]);

  // El dock del teclado vive en un store compartido y puede conservar un
  // ReactNode creado por el render inmediatamente anterior. Mantener una
  // función estable que delega al handleCalculate MÁS RECIENTE elimina el
  // race entre field.insert()/onChange y el click inmediato en Calcular.
  const calculateRef = useRef(handleCalculate);
  calculateRef.current = handleCalculate;
  const handleKeyboardEnter = useCallback(() => calculateRef.current(), []);

  // Íconos de resolución (spec §3.4). "f(x)=0": si aún no hay "=" en el
  // campo, lo inserta (mismo comportamiento previo); si ya hay una
  // ecuación, ahora SÍ la resuelve de verdad (antes caía silenciosamente
  // en evaluate — ver comentario de handleCalculate arriba).
  const handleSolveEquation = useCallback(() => {
    if (!latex.includes("=")) {
      mathField?.insert("=0");
      return;
    }
    handleCalculate();
  }, [latex, handleCalculate, mathField]);

  // Fase 1: antes este ícono no hacía nada (onSolveSystem nunca se pasaba
  // a MathKeyboard). Ahora, si el campo todavía no tiene un sistema,
  // inserta la plantilla \begin{cases}; si ya la tiene con 2+ renglones,
  // resuelve — mismo patrón que handleSolveEquation con "=0".
  //
  // Pendiente #2 (revisión post-Módulo D, pedido por el usuario): recibe
  // la cantidad de ecuaciones elegida en el selector 2-5 de MathKeyboard.
  // Solo se usa para armar la plantilla nueva — si el campo YA tiene un
  // sistema escrito, se ignora y se resuelve el existente (el usuario
  // pudo haber tocado cualquier número del selector sin querer cambiar
  // nada, no debería alterar lo que ya escribió).
  const handleSolveSystem = useCallback(
    (rows: number = 2) => {
      if (!splitSystemLatex(latex)) {
        const n = Math.min(5, Math.max(2, Math.round(rows)));
        const placeholders = Array.from({ length: n }, (_, i) => `#${i}`).join("\\\\");
        mathField?.insert(`\\begin{cases}${placeholders}\\end{cases}`);
        return;
      }
      handleCalculate();
    },
    [latex, handleCalculate, mathField],
  );

  const handleSimplify = useCallback(() => handleCalculate(), [handleCalculate]);

  // Fase F (spec_edo_complejos_tooltips.md §3.4, Módulo F3): "Graficar"
  // -- evalúa el campo a un número complejo concreto (mensaje de worker
  // dedicado "argandPoint", ver compute.worker.ts) y llena el puente de
  // navegación (useArgandBridgeStore.ts) que App.tsx/GraphingMode.tsx
  // consumen para cambiar de pestaña y mostrar el punto.
  const handleGraphComplex = useCallback(() => {
    const requestId = makeRequestId();
    let parsed;
    try {
      parsed = parseExpression(latex, angleMode);
    } catch (err) {
      const appErr = err as { code?: ErrorCode; message?: string };
      fail(appErr.code ?? ErrorCode.PARSE_ERROR, appErr.message ?? "Expresión inválida.", requestId);
      return;
    }
    const worker = getWorker();
    worker.onmessage = (e: MessageEvent<MathResult>) => {
      if (e.data.success && e.data.graphAnalysis) {
        const { re, im } = e.data.graphAnalysis as { re: number; im: number };
        setPendingArgandPoint({ re, im, expressionText: latex });
        onSuccess("Científica (Argand)", latex, e.data);
      } else {
        onSuccess("Científica (Argand)", latex, e.data);
      }
    };
    worker.postMessage({ type: "argandPoint", requestId, expressionAlgebrite: parsed.algebrite });
  }, [latex, angleMode, getWorker, fail, onSuccess, setPendingArgandPoint]);

  // GraphPlaceholder.tsx, botón "Graficar" del cuadrante de gráfica
  // (decisión de producto confirmada por Carlos: explícito, no
  // automático). A diferencia de handleGraphComplex (que evalúa a un
  // número concreto), esto no computa nada aquí -- solo llena
  // usePendingGraphStore con el LaTeX tal cual; GraphingMode.tsx es
  // quien parsea, valida (una sola variable libre) y grafica de
  // verdad, reusando exactamente su propio camino normal de graficar.
  const setPendingGraphExpression = usePendingGraphStore((s) => s.setPendingExpression);
  const handleGraphExpression = useCallback(() => {
    if (!latex.trim()) return;
    setPendingGraphExpression(latex);
  }, [latex, setPendingGraphExpression]);

  // M30: el Smart Dock de teclas recientes debe funcionar incluso cuando
  // MathKeyboard está cerrado/no montado. El modo científico mantiene un
  // handler estable durante toda su vida y MathKeyboard no lo reemplaza.
  const setInsertHandler = useKeyboardPanelStore((s) => s.setInsertHandler);
  const clearInsertHandler = useKeyboardPanelStore((s) => s.clearInsertHandler);
  const recordRecentKey = useRecentKeysStore((s) => s.recordKey);
  const handleRecentKeyInsert = useCallback(
    (k: KeyDef) => {
      if (!k.insertLatex) return;
      mathField?.focus();
      mathField?.insert(k.insertLatex);
      recordRecentKey("basic", k, isVariableOrConstantKey(k) ? "variable" : "operation");
    },
    [mathField, recordRecentKey],
  );

  useEffect(() => {
    setInsertHandler(handleRecentKeyInsert);
  }, [handleRecentKeyInsert, setInsertHandler]);

  useEffect(() => {
    return () => clearInsertHandler();
  }, [clearInsertHandler]);

  const setKeyboardContent = useKeyboardPanelStore((s) => s.setContent);
  const clearKeyboardContent = useKeyboardPanelStore((s) => s.clearContent);
  const setBasicKeyboardContent = useKeyboardPanelStore((s) => s.setBasicContent);
  const clearBasicKeyboardContent = useKeyboardPanelStore((s) => s.clearBasicContent);
  const setCompactActions = useKeyboardPanelStore((s) => s.setCompactActions);
  const clearCompactActions = useKeyboardPanelStore((s) => s.clearCompactActions);
  const layoutMode = useLayoutModeStore((s) => s.layoutMode);

  // Bug real detectado al revisar esta integración: si el mismo efecto
  // hace setContent() Y devuelve clearContent() como cleanup, cada vez
  // que cambia una dependencia (ej. `latex` en cada tecleo, porque
  // handleCalculate depende de latex) React ejecuta el cleanup ANTES de
  // volver a correr el efecto — eso pone isOpen:false de puertas para
  // afuera y el panel se cerraría solo mientras el usuario escribe.
  // Se separan en dos efectos: uno sincroniza el contenido en cada
  // cambio (nunca toca isOpen), el otro limpia SOLO al desmontar el modo
  // (deps [], nunca se re-dispara por un cambio de latex/mathField).
  //
  // Módulo 1: MathKeyboard ya no recibe onBackspace/onEnter (⌫/⏎ se
  // mudaron al panel básico) — cambio contractual, ver cierre. El panel
  // básico (KeyboardBasicPanel) se registra aparte, en basicContent.
  useEffect(() => {
    setKeyboardContent(
      <MathKeyboard
        field={mathField}
        onClearField={() => setLatex("")}
        onSolveEquation={handleSolveEquation}
        onSolveSystem={handleSolveSystem}
        onSimplify={handleSimplify}
        onGraphComplex={handleGraphComplex}
        hideCoreGrid
        registerInsertHandler={false}
      />,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mathField, handleCalculate, handleSolveEquation, handleSolveSystem, handleSimplify, handleGraphComplex]);

  useEffect(() => {
    return () => clearKeyboardContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Módulo 1: mismo patrón de dos efectos (sincroniza sin tocar isOpen +
  // cleanup aparte al desmontar) para el panel básico.
  useEffect(() => {
    setBasicKeyboardContent(
      <KeyboardBasicPanel
        field={mathField}
        onBackspace={() => setLatex((prev) => prev.slice(0, -1))}
        onClear={() => setLatex("")}
        onEnter={handleKeyboardEnter}
        lastAnswerLatex={result?.resultLatex ?? null}
      />,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mathField, handleKeyboardEnter, result]);

  useEffect(() => {
    return () => clearBasicKeyboardContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Corrección post-Módulo 7: fila compacta del dock en móvil necesita
  // los mismos callbacks que KeyboardBasicPanel, expuestos aparte
  // (KeyboardDock no tiene acceso a las props internas de basicContent
  // ya armado). Mismo patrón de dos efectos.
  useEffect(() => {
    setCompactActions({
      onEnter: handleKeyboardEnter,
      onBackspace: () => setLatex((prev) => prev.slice(0, -1)),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleKeyboardEnter]);

  useEffect(() => {
    return () => clearCompactActions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto flex max-w-md flex-col gap-3 p-4 md:max-w-lg lg:max-w-3xl dt:max-w-[1440px] dt:px-8">
      <Screen
        latex={latex}
        onChangeLatex={setLatex}
        placeholder="Escribe una expresión, ecuación o sistema…"
        fieldRef={setMathField}
        result={result}
        sessionHistory={sessionHistory}
        angleMode={angleMode}
        onToggleAngleMode={() => setAngleMode((m) => (m === "RAD" ? "GRAD" : "RAD"))}
        onClearField={() => setLatex("")}
        layoutMode={layoutMode}
        onGraphExpression={handleGraphExpression}
        onCalculate={handleCalculate}
      />
    </div>
  );
}

// Contrato de datos central — spec v10 §4. Todo modo produce/consume MathResult.

export enum ErrorCode {
  PARSE_ERROR = "PARSE_ERROR",
  UNSUPPORTED_OPERATION = "UNSUPPORTED_OPERATION",
  COMPLEXITY_LIMIT = "COMPLEXITY_LIMIT",
  DIMENSION_MISMATCH = "DIMENSION_MISMATCH",
  DOMAIN_ERROR = "DOMAIN_ERROR",
  TIMEOUT = "TIMEOUT",
  NUMERIC_FALLBACK_FAILED = "NUMERIC_FALLBACK_FAILED",
}

export interface AppError {
  code: ErrorCode;
  message: string;
}

export type ResultConfidence = "SYMBOLIC" | "NUMERIC_FALLBACK" | "PARTIAL";

export interface Step {
  id: string;
  latex: string;
  explanation: string;
  /** Opcional — nombre corto del paso, ej. "Derivar cada factor". */
  title?: string;
  /** Opcional — regla aplicada, ej. "Regla del producto". */
  rule?: string;
  /** Opcional — expresión antes de aplicar la regla. Si no está presente,
   * la tarjeta muestra solo `latex` como resultado del paso. */
  latexBefore?: string;
}

export interface FractionResult {
  improperLatex: string;
  mixedLatex: string | null;
  decimal: string;
}

export interface DomainCondition {
  /** Expresión normalizada que origina la restricción, antes de cualquier
   * simplificación (ej. x-1 en (x^2-1)/(x-1)). */
  expressionAlgebrite: string;
  operator: "!=" | ">" | ">=" | "<" | "<=";
  comparisonAlgebrite: string;
  text: string;
  latex: string;
  variable?: string;
  kind: "denominator" | "log" | "even_root" | "domain";
}

export interface MathResult {
  success: boolean;
  errorCode?: ErrorCode;
  errorMessage?: string;
  resultLatex: string | null;
  /** Contrato S26 de resultados contextuales: representación de la
   * entrada ya interpretada/normalizada por el parser. Nunca debe
   * confundirse con el texto crudo escrito por el usuario. */
  interpretedLatex?: string;
  /** Etiqueta de la vista calculada frente a "Original" (por ejemplo,
   * "Solución"). Las transformaciones adicionales se añadirán sobre este
   * mismo contrato sin cambiar la semántica de interpretedLatex. */
  resultViewLabel?: string;
  /** Restricciones heredadas de la estructura matemática ORIGINAL. Se
   * conservan aunque la forma resultante ya no las muestre visualmente. */
  domainConditions?: DomainCondition[];
  fraction?: FractionResult;
  /** Fase E: aproximación decimal (float) cuando el resultado es simbólico
   * y por eso no tiene `fraction` — ej. sin(pi/4). Solo la llena
   * handleEvaluate() en compute.worker.ts por ahora. */
  decimalApprox?: string;
  steps: Step[];
  hasDetailedSteps: boolean;
  confidence: ResultConfidence;
  requestId: string;
  /** Presente solo en resultados del Modo Graficación — datos para GraphViewer. Tipado como unknown aquí para evitar un import circular con stepEngine/graphing.ts; se castea en GraphingMode.tsx. */
  graphAnalysis?: unknown;
  /** Módulo J2: presente solo en resultados de superficie 3D (kind="3d") — GraphSurface3D, no GraphAnalysis (forma de dato distinta, ver graphing.ts). Mismo criterio de `unknown` que graphAnalysis. */
  graphSurface3D?: unknown;
}

export function makeRequestId(): string {
  // uuid v4 simplificado, suficiente para historial local (no expone nada
  // sensible ni requiere librería adicional)
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

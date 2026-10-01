import type { ResultFormatId } from "./ResultFormatSelector";

export interface ResultFormatCapabilities {
  hasExact: boolean;
  hasDecimal: boolean;
  hasFraction: boolean;
  hasDms: boolean;
}

export function getAvailableResultFormats({
  hasExact,
  hasDecimal,
  hasFraction,
  hasDms,
}: ResultFormatCapabilities): ResultFormatId[] {
  // Una salida angular expresada en grados tiene solo dos representaciones
  // de producto: grados decimales (DD) y grados-minutos-segundos (DMS).
  // No se mezcla con Exacto/Decimal/Fracción/Científica porque esas
  // etiquetas describen formatos numéricos genéricos, no unidades angulares.
  if (hasDms) return ["dd", "dms"];

  const formats: ResultFormatId[] = [];
  if (hasExact) formats.push("exact");
  if (hasDecimal) formats.push("dec");
  if (hasFraction) formats.push("frac");
  if (hasDecimal) formats.push("scn");
  return formats.length > 0 ? formats : ["exact"];
}

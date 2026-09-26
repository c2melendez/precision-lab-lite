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
  const formats: ResultFormatId[] = [];
  if (hasExact) formats.push("exact");
  if (hasDecimal) formats.push("dec");
  if (hasFraction) formats.push("frac");
  if (hasDecimal) formats.push("scn");
  if (hasDms) formats.push("dms");
  return formats.length > 0 ? formats : ["exact"];
}

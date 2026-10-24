/** One explicit, ephemeral numeric binding; not a general prose parser. */
export function readInlineSubstitution(source: string): { body: string; variable: string; value: string } | null {
  const normalized = source
    .replace(/\\(?:text|mathrm)\s*\{con\}/g, " con ")
    .replace(/\\(?:,|;|!| )/g, " ");
  const markers = normalized.match(/\s+con\s+/g) ?? [];
  if (markers.length === 0) return null;
  const match = normalized.match(/^\s*(.+?)\s+con\s+([A-Za-z])\s*=\s*(.+?)\s*$/s);
  if (markers.length !== 1 || !match) throw new Error("Usa una sola sustitución: expresión con x=valor numérico.");
  const [, body, variable, value] = match;
  if (["e", "i", "E", "I"].includes(variable)) throw new Error("No se puede sustituir una constante reservada.");
  return { body, variable, value };
}

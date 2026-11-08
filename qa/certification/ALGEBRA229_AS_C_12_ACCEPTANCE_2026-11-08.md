# ALGEBRA229 AS-C-12 — Aceptación bilateral (2026-11-08)

- Estado: PASS bilateral. Baseline `ALGEBRA229-AS-C-12 PASS`.
- Fila congelada: `simplificar` `\frac{x^{2}-y^{2}}{(x-y)^{2}}` → `\frac{x + y}{x - y}`.
- SHA técnico final (precision-lab-lite): `8ad889e`.
- Evidencia: CI 42477254793, Cumulative 42477254895, H1d 42477254896, Scientific UI 42477254947, Runner 42477254878. Todos SUCCESS; guards `skip=false`, sin REUSE.
- Puntos excluidos: x=y → `DOMAIN_ERROR`.
- Nota: Fix acotado en `simplifyExpression`: `expandedSingleFraction` acepta `simplify(expand(...))` solo si es una única fracción (la barra es el único operador de nivel superior, denominador sin suma) y es estrictamente más corta. Un primer intento (`7d16198`) rompió AS-C-02 y AS-C-03; se corrigió en `8ad889e`.

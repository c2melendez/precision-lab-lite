# Current Certification State

Actualizado: 2026-10-07
Repositorio: c2melendez/precision-lab-lite
Rama activa: `qa/syntax-audit-in625-a1`

## Baseline
- Oracle Audit: 74/74 shards.
- 2,132/2,132 casos planificados.
- 4,026 casos canónicos.
- 3,451/3,451 legacy representados.
- promoted legacy oracle: 2,823/3,448 verificados; 625 restantes forman IN625.
- canonical oracle: 3,399/4,026.
- blocking verified: 1,357.
- Product Certification Wave 2: PASS en Lite y Plus, 22/22.

## IN625
Bloques cerrados y verdes en ambos motores:
A1, A2, A3, A4, B1, B2, B3, B4, C1, C2, C3, C4, D1, D2, D3, E1a, E1b, E1c, E1d, E2a, E2b, E2c, E3a, E3b, E3c, E3d1, E3d2, E3d3, F1, F2a, F2b, F3a, F3b, F3c, G1a y G1b automatizable.

G1 manual/capability:
- TC17
- TC23

## G2 — estado activo
La suite real de invariancia L/T/teclado ya cubre los 15 casos, excepto EN-CH-11 que requiere modo decimal coma real y se mantiene manual/config-dependent.

Última corrida posterior a normalización semántica:
- Lite: Playwright `37576464043`, job `112646359761` — FAILURE.
- Plus: Playwright `37576470858`, job `112646382000` — FAILURE.

Después de la última normalización, los rojos quedaron reducidos en ambos motores a:
- EN-CH-06: texto `sin^2(x)` vs teclas `sin^2x`.
- EN-CH-07: texto `sin^-1x` vs teclas `sin^(-1(x))`.
- EN-CH-12: `abs(x-1)` vs `|x-1|`.

Estos tres resultados ya pasan el regex semántico individual; el rojo actual proviene de la comparación final demasiado literal `expect(ct).toBe(ck)`. No hay evidencia todavía de fallo matemático del producto.

## Últimos commits G2
- Lite: `db171346082a5801efe358fb5bdc67a6965d27f2`
- Plus: `7a7b324625fcfebe830f3e7a2ce30fcb692e6144`

## Siguiente paso exacto
1. NO cambiar motor/producto.
2. Ajustar la comparación final de G2 para canonicalizar equivalencias:
   - `sin^2(x)` ↔ `sin^2x`
   - `sin^-1x` ↔ representación equivalente de exponente -1 seguida de x
   - `abs(x-1)` ↔ `|x-1|`
3. Volver a correr Playwright en Lite y Plus.
4. Si G2 queda verde, cerrar G2 y avanzar a G3 (34 casos inválidos).
5. Mantener EN-CH-11 como manual/config-dependent salvo evidencia real de locale/decimal comma.

## Archivos de trabajo
- Lite: `e2e/exhaustive-module10-keyboard.spec.ts`
- Plus: `frontend/e2e/exhaustive-module10-keyboard.spec.ts`

## Advertencia
No interpretar los rojos actuales de G2 como fallo del producto sin demostrar divergencia matemática. La evidencia actual apunta a equivalencia representacional entre canales.

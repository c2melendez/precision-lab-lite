# Current Certification State

Actualizado: 2026-10-07
Alcance coordinado: Lite + Plus
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
A1, A2, A3, A4, B1, B2, B3, B4, C1, C2, C3, C4, D1, D2, D3, E1a, E1b, E1c, E1d, E2a, E2b, E2c, E3a, E3b, E3c, E3d1, E3d2, E3d3, F1, F2a, F2b, F3a, F3b, F3c, G1a, G1b automatizable y G2.

G1 manual/capability:
- TC17
- TC23

G2 manual/config-dependent:
- EN-CH-11: decimal coma real / locale.

## G2 — CERRADO
Se normalizaron únicamente equivalencias de representación del harness, sin cambiar producto:
- EN-CH-06: `sin^2(x)` ↔ `sin^2x`
- EN-CH-07: `sin^-1(x)` / `sin^(-1(x))` ↔ `sin^-1x`
- EN-CH-12: `abs(x-1)` ↔ `|x-1|`

Evidencia:
- Lite Playwright `37580506336` — SUCCESS.
- Plus Playwright `37580510564` — SUCCESS.
- Lite HEAD documental posterior: Playwright `37581518369` — SUCCESS.

## G3 — ACTIVO
Objetivo: validar 34 casos EN-ER-01…EN-ER-34 de entradas inválidas y mensajes de error.

Matriz diagnóstica G3 incorporada en ambos motores:
- Lite commit: `705d8272fe666f42b990f89df9f18e3e2257b1e0`
- Plus commit: `8432fa03a3262b24d10cc4df06b524cdfc6a56fc`

Corridas Playwright G3 disparadas:
- Lite: `37583041099`
- Plus: `37583044889`

Estado al registrar: pendientes de conclusión. Verificar GitHub Actions real antes de diagnosticar.

## Siguiente paso exacto
1. Localizar/confirmar los 34 casos G3 en la matriz/spec vigente.
2. Implementar o completar la cobertura G3 en Lite y Plus manteniendo paridad.
3. Ejecutar Playwright en ambos motores.
4. Clasificar cualquier rojo como producto / harness / oráculo / capability antes de modificar producto.
5. Registrar commits, runs, decisiones y siguiente paso en CURRENT_STATE y EXECUTION_LOG de ambos repositorios.

## Continuidad repo-native
El bootstrap oficial es `qa/certification/CONTINUATION_PROMPT.md`. No se necesita ZIP de handoff mientras GitHub y estos archivos estén accesibles.

# Lite — implementación de la remediación npm audit (r287)

**Fecha:** 2026-10-24 UTC
**Repositorio/rama:** `c2melendez/precision-lab-lite` / `qa/syntax-audit-in625-a1`
**SHA técnico:** `1cf29a7192c803afc461e10fb4912f9bc88cec4e`
**Decisión:** hard gate `npm audit` **CLEARED** en este SHA. El gate no se rebajó ni se añadió una excepción: el audit quedó en 0 vulnerabilidades.

## Cambios aplicados

| Paquete | Antes | Después | Advisory |
|---|---:|---:|---|
| `vitest` | 5.0.1 | 5.0.3 | GHSA-qxg6-89mg-rqv8, GHSA-xp26-3454-mjgp |
| `@vitest/mocker` | 5.0.1 | 5.0.3 | misma familia, actualizado en coordinación |
| `fast-uri` | 3.1.8 | 3.1.9 | GHSA-w74x-v6f9-j3xg y los cuatro advisories previos |
| `serialize-javascript` | 7.1.0 | 7.1.4 | GHSA-m5mm-p8h7-m29v |
| `katex` | 0.16.47 | 0.18.2 | GHSA-238p-pmpm-9mq7 |
| `postcss-selector-parser` | 6.1.4 | 7.1.7 (override) | GHSA-rj75-hqrm-r3gf |

`package-lock.json` se regeneró con npm (lockfile v3) y se validó con `npm ci`.

## Por qué el override del parser es una remediación y no un atajo

Tailwind 3.4.19 y `postcss-nested` 6.2.0 declaran rangos `^6.1.x`, pero el fix publicado es 7.1.6+. En vez de migrar Tailwind a la 4 o dejar el gate rojo, se demostró compatibilidad para este proyecto:

- Build con el lock anterior: `dist/assets/index-BcOzQwa2.css`, 59,816 bytes, SHA-256 `E9D13FB752B976D46FF6CE78F2D81FCDF4D71A93ACF20B1EB67BD14F38B43436`.
- Build con `postcss-selector-parser` 7.1.7: **mismo nombre, mismo tamaño y mismo SHA-256**. El CSS generado es byte a byte idéntico.
- `npm run typecheck`: sin errores.
- Suite completa: 360 archivos, **2,232 passed**, 8 expected fail, 34 TODO.
- `npm run build`: correcto.

El override queda registrado como deuda: revisar cuando Tailwind publique una versión 3.x compatible o al planificar la migración a Tailwind 4.

## Evidencia en GitHub (SHA `1cf29a7192`)

| Gate | Run | Resultado |
|---|---|---|
| CI (audit hard gate, typecheck, unitarias, build) | [40138503619](https://github.com/c2melendez/precision-lab-lite/actions/runs/40138503619) | **SUCCESS**; log: `found 0 vulnerabilities`, `360 passed`, `2232 passed`, build 5.71 s |
| Cumulative | [40137719189](https://github.com/c2melendez/precision-lab-lite/actions/runs/40137719189) | SUCCESS |
| H1d | [40137719188](https://github.com/c2melendez/precision-lab-lite/actions/runs/40137719188) | SUCCESS |
| Scientific UI E2E | [40137719203](https://github.com/c2melendez/precision-lab-lite/actions/runs/40137719203) | SUCCESS |
| Certification dependency and security gates | [40137719274](https://github.com/c2melendez/precision-lab-lite/actions/runs/40137719274) | SUCCESS |
| Playwright E2E | [40138909348](https://github.com/c2melendez/precision-lab-lite/actions/runs/40138909348) | **FAILURE** (ver abajo) |

### Por qué CI y Playwright se despacharon a mano

PR #48 está `OPEN`/`DRAFT` con `mergeable: false` (`mergeable_state: dirty`): GitHub no genera el merge ref actualizado y los workflows de `pull_request` no se disparan en los pushes nuevos. Los workflows de push de esta rama sí corrieron (cumulative, H1d, scientific, dependency gates). Para no declarar verde un gate no ejecutado, se usó `workflow_dispatch` sobre la rama: CI `40138503619` y Playwright `40138909348`. No se modificó ningún workflow ni filtro.

## Playwright: fallo no atribuible a la remediación

`40138909348`: 979 passed, 4 failed, todos en `e2e/in625-h1c-reentry.spec.ts`.

- `EN-RE-21` (ANS reutiliza último resultado): falla en desktop, tablet y mobile.
- `EN-RE-20` (ASCII plano reingresa): timeout de 30 s en desktop esperando `math-field[read-only]` dentro de `section[aria-label="Resultado"]`.

Comparación con el SHA previo `a8d726f0` (run [40078650376](https://github.com/c2melendez/precision-lab-lite/actions/runs/40078650376), antes de la remediación): 980 passed, 2 failed, ambos `EN-RE-21`; `EN-RE-20` pasó en 2.2 s. Es decir, `EN-RE-21` ya estaba rojo antes de tocar dependencias y `EN-RE-20` es un timeout de localizador. Los paquetes modificados son de build/test (`vitest`, parser de PostCSS) o no se usan en runtime (`katex`), por lo que no hay mecanismo demostrado para un cambio de renderizado.

No se tocaron specs, oráculos ni gates para hacer pasar este run. El fallo queda como trabajo de diagnóstico independiente.

## Estado de certificación

- Audit hard gate: **CLEARED** en `1cf29a7192`.
- CI de Lite: **SUCCESS** en `1cf29a7192`.
- Playwright: **FAILURE** por H1c (`EN-RE-21` preexistente y `EN-RE-20` timeout).
- Bloqueos sin cambios: `SECURITY-S25` BLOCKED, `ALGEBRA229-AS-B-29` ON_HOLD, `H2-SG28-DIST-01..08` BLOCKED, `EDCX-B5` BLOCKED, `SY-X-04-PLUS-HTTP` BLOCKED.
- PR #48 permanece OPEN/DRAFT y sin merge; certificación global **OPEN**.

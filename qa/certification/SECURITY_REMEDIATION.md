# S25 — remediación acotada, 16 de octubre de 2026

Fuentes verificadas: rama `qa/syntax-audit-in625-a1`, Lite `98c4686bcd5b031a627494ae875a427faf611999`, Plus `9c310f4d4b57f26d266f1f0f4d2272f4a824b37c`. No hay AGENTS.md en los árboles. No se publicaron commits ni Actions.

## Cambio aplicado

Se actualizaron exclusivamente los locks, mediante `npm update source-map-js --package-lock-only --ignore-scripts`: `source-map-js` 1.2.1 → 1.2.2. Es una actualización patch compatible con los rangos existentes y corrige GHSA-68fv-2mgg-jv7q. npm obtuvo versión, URL e integridad del registro; no se fabricaron locks. Ninguna modificación de producto ni package.json.

| Evidencia local | Lite | Plus frontend |
|---|---|---|
| npm audit antes | 6 high /2 moderate /1 low | 6 high /2 moderate |
| npm audit después | 5 high /2 moderate /1 low | 5 high /2 moderate |
| npm ci --ignore-scripts | PASS | PASS |
| npm run typecheck | PASS | PASS |
| npm run build | PASS | PASS |
| Regresión focalizada H2 | 18 PASS | No repetida; no cambio de producto |
| Referrer policy de dist | PASS | No aplica a este cambio |

Node local v24.19.0 /npm11.9.0. Los gates usan Node22: la validación CI final sigue pendiente y debe integrarse en un único lote. No se acredita cierre S25 con pruebas locales. Los builds mantienen advertencias preexistentes de tamaño de bundle.

## Bloqueo que permanece

`braces` GHSA-vfj7-8cjw-p6xm afecta <=3.0.3. Al consultar el registro, latest=3.0.3: no hay parche publicado. Arrastra las alertas high de `chokidar`, `fast-glob`, `micromatch`, `tailwindcss`. npm propone Tailwind4.3.3, cambio mayor que exige migración de CSS/configuración y verificación visual; no es una actualización patch compatible. Los dos S25 deben seguir BLOCKED, sin supresión de advisory ni relajación del umbral high/critical.

`postcss-selector-parser` GHSA-rj75-hqrm-r3gf está corregido en7.1.6; ambos locks contienen6.1.4 consumido por Tailwind3/postcss-nested6.2.0, cuyos rangos exigen6.x. Resolver esta deuda moderate requiere decisión de migración o compatibilidad verificada; no se impuso un override de versión mayor.

Lite conserva además KaTeX GHSA-238p-pmpm-9mq7, low, corregido >=0.18.2; su0.16.x actual no admite esa actualización dentro del rango. Plus ya usa0.18.4.

## Próxima acción y prevención de loops

Para braces: actualizar solamente cuando se publique una versión corregida compatible, o abrir un objetivo explícito de migración Tailwind4 con criterios visuales/funcionales. No repetir el mismo S25 esperando que desaparezca un advisory sin cambiar lock ni recibir actualización del registro. Cambio de sesión/LLM no invalida la evidencia. El bloqueo requiere nueva versión corregida o decisión de migración, no más runners.

Luego ejecutar una sola vez el gate S25 sobre el SHA técnico consolidado (y gates generales correspondientes a ese lote), registrar run ID y estado. La parte backend de S25 no se volvió a ejecutar: este lote no modifica Python ni sus dependencias; su estado debe determinarse con la evidencia del gate backend existente o una ejecución necesaria del lote.

Archivos de evidencia locales: `lite-audit-before.json`, `lite-audit-after.json`, `plus-audit-before.json`, `plus-audit-after.json`, `lite-security-focused.log`, `lite-security.patch`, `plus-security.patch`. Builds: `/tmp/security-lite-build.log`, `/tmp/security-plus-build.log`.

## Ratificación CI del lote
Lite38983494649 yPlus38983505232 confirman bloqueo frontend tras source-map-js1.2.2:5highcadauno. BackendsecurityPlusPASS. Los acumulativos y builds actuales aprobaron; S25 no se declara cerrado. La validación frontend de mutación tuvo una corrección de oráculo específica; initialrun38983949570 PASS no es mutation score.

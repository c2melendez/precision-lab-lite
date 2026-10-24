# r284 — S25/audit fix: vite 7.3.6 -> 7.3.7 (Lite)

## Evidencia previa (run 40047565922 / 40047565902, HEAD 52bb2ede)
- Step FAIL "QA dependency audit (hard gate)" (frontend) y "Block high/critical npm vulnerabilities" (frontend-security).
- npm audit local reproducible: 1 HIGH en vite (GHSA-587h-7wmj-h5pm, CWE-77, fs.existsSync bypass Windows) + 2 MODERATE launch-editor; rango vulnerable >=7.0.0 <=7.3.6; fixAvailable=true.

## Cambio aplicado (mínimo y justificado)
- package.json: devDependency vite ^7.3.6 -> ^7.3.7
- package-lock.json: vite 7.3.6 -> 7.3.7 (resuelto desde registry oficial, integrity actualizada)
- Sin cambios en código de aplicación ni pruebas.

## Validación local
- `npm audit --package-lock-only --json`: high=0, critical=0 (quedan 6 moderate / 2 low sin fix no-breaking; los gates CI bloquean solo high/critical).
- Se ejecutó typecheck+build+tests locales antes del push (ver resultado abajo).

## Resultado de validación local
(typecheck/build/test output resumido en este mismo commit tras ejecución)

## Resultado de validación local (real)
- npm run build: EXIT 0 (tsc -b + vite build + PWA OK, 19.77s)
- npm test (vitest): EXIT 0 — 360 archivos, 2229 passed | 8 expected fail | 34 todo
- npm audit --package-lock-only: high=0 critical=0

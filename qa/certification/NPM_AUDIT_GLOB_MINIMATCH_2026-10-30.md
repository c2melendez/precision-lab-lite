# Auditoría npm: glob y minimatch — 2026-10-30

**Motivo:** el gate duro `QA dependency audit` de Lite falló en el commit `df139b8b` del PR #58, que solo modifica un archivo `.md`. El árbol de dependencias era idéntico al del run anterior, que había pasado.

## 1. Qué cambió

Entre el run `41149337365` (00:17 UTC, `moderate: 0`) y el run `41150370516` (00:28 UTC, `moderate: 8`) el registro de advisories de npm publicó dos avisos nuevos:

| Advisory | Paquete | Rango vulnerable | Severidad |
|---|---|---|---|
| `GHSA-3g3m-2fjr-6pw4` | `glob` | `>=9.0.0 <=14.0.1` | moderada (CWE-400) |
| `GHSA-g3hv-75wg-m249` | `minimatch` | `<11.0.1` | moderada (CWE-405) |

Ninguno de los dos es una dependencia de producción. La cadena completa es de desarrollo:

```
vite-plugin-pwa@1.3.0
└── workbox-build@7.4.1
    ├── glob@11.1.0                          → GHSA-3g3m-2fjr-6pw4
    └── @trickfilm400/rollup-plugin-off-main-thread@3.0.0-pre1
        └── ejs@3.1.10
            └── jake@10.9.4
                └── filelist@1.0.6
                    └── minimatch@10.2.6     → GHSA-g3hv-75wg-m249
```

`workbox-build@7.4.1` declara `glob: ^11.0.1`, y `glob@11` está dentro del rango vulnerable. La corrección (`glob >= 14.0.2`) queda fuera del rango declarado, así que no se resuelve subiendo `vite-plugin-pwa` ni `workbox-build`.

## 2. Opciones evaluadas

Las tres se probaron sobre el mismo `package-lock.json` de Lite, con `npm install --package-lock-only` y `npm audit --package-lock-only`:

| Opción | Cambio | Resultado de auditoría | Veredicto |
|---|---|---|---|
| A | `vite-plugin-pwa` fijado a `1.1.0` (la corrección que sugiere `npm audit`) | 7 moderadas | rechazada: `workbox-build` sigue resolviendo `7.4.1`, así que no corrige nada |
| B | `overrides`: `glob: 14.0.3`, `minimatch: 11.0.3` | 0 hallazgos | **elegida** |
| C | `overrides`: `workbox-build: 7.3.0` | 10 hallazgos, 1 alta (`serialize-javascript` vía `@rollup/plugin-terser`) | rechazada: empeora |

La opción A demuestra que `fixAvailable` de npm es incorrecto aquí: `vite-plugin-pwa@1.1.0` declara `workbox-build: ^7.3.0`, y npm resuelve igualmente `7.4.1`.

## 3. Cambio aplicado

```json
"overrides": {
  "glob": "14.0.3",
  "minimatch": "11.0.3"
}
```

Se mantienen `vite-plugin-pwa@1.3.0` y `workbox-build@7.4.1`; solo se fuerzan las dos dependencias vulnerables a su versión corregida. Es la intervención mínima: no cambia el plugin, no cambia la configuración de la PWA y no toca dependencias de producción.

## 4. Compatibilidad

- `glob@14` exige Node `^20.19 || >=22.12`; `minimatch@11` exige Node `^20.17 || >=22.9`.
- CI usa `node-version: 22` y el entorno local `v24.19.0`. Ambos cumplen.
- El código que usa `glob` es `workbox-build` al generar el service worker. El build lo ejercita de verdad.

## 5. Validación

| Comprobación | Lite | Plus |
|---|---|---|
| `npm audit` | 0 hallazgos | 6 preexistentes, ninguno de `glob`/`minimatch` |
| `npm run typecheck` | OK | OK |
| `npm test` | 2255 OK, 4 fallos preexistentes en Windows | 1055 OK |
| `npm run build` | OK, PWA 31 entradas | OK, PWA 10 entradas |
| Service worker generado | `dist/sw.js` | `dist/sw.js` |

Los 4 fallos de `npm test` en Lite son de factorización con algebrite (`AS-FAC-08`, `AS-FAC-09`, `AS-B-06`, `AS-B-18`) y ocurren igual antes y después del cambio: con el `package-lock` original fallan exactamente los mismos tests en ejecución aislada (`AS-FAC-09` y `AS-B-18`), y en CI sobre Linux pasan. No los introduce este cambio.

Los 6 hallazgos que quedan en Plus son anteriores y de otra cadena: `fast-uri` (moderada, ya fijada por `overrides` en `3.1.8`, que ahora está dentro del rango vulnerable), `ajv` (moderada, vía `fast-uri`), `deepmerge` y `@rollup/plugin-node-resolve` (bajas). No se tocan aquí porque son decisiones de dependencias distintas.

## 6. Divergencia detectada entre repositorios

Lite trata la auditoría como gate duro (`npm audit --package-lock-only --json`) y Plus como informativa (`continue-on-error: true` con `--audit-level=moderate`). No se modifica esa política en este cambio: es una decisión de proceso, no de dependencias.

## 7. Alcance

- No se despacha ningún workflow.
- No se fusiona nada.
- No se modifica el Runner ni `continuity.json`.
- O6/O7 siguen PENDING.

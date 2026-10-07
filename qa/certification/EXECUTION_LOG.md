# Certification Execution Log

Registro acumulativo. No reemplaza `CURRENT_STATE.md`; conserva decisiones y evidencia histórica.

## 2026-10-07 — Migración de continuidad repo-native cerrada
- Se confirmó `qa/certification/` como fuente canónica en Lite y Plus.
- Se formalizó `CONTINUATION_PROMPT.md` como único bootstrap estable para nuevas sesiones.
- Se estableció que chat, ZIPs y handoffs históricos no son autoridad operativa cuando el estado canónico está disponible.
- Se reforzó la obligación de sincronizar `CURRENT_STATE.md` y este log en ambos repositorios tras cada avance sustantivo.

## 2026-10-07 — G2 cerrado bilateralmente
- EN-CH-06, EN-CH-07 y EN-CH-12 se resolvieron como equivalencias de representación/canonicalización del harness, sin cambio de producto.
- Lite Playwright `37580506336` — SUCCESS.
- Plus Playwright `37580510564` — SUCCESS.
- Lite corrida documental posterior `37581518369` — SUCCESS.
- G2 queda cerrado.
- EN-CH-11 permanece manual/config-dependent por decimal coma real / locale.
- Siguiente bloque activo: G3, 34 casos de entradas inválidas y mensajes de error.


## 2026-10-07 — G3 diagnóstico inicial
- Lite `37583041099`: fallo real de G3; 30 IDs en rojo. Se separó error semántico claro de mensajes CAS genéricos y aceptación silenciosa.
- Plus `37583044889`: 102 fallos por harness (`hideMathLiveKeyboard` inexistente), no producto.
- Se verificó contra la matriz original que G3 exige feedback semánticamente claro.
- Lite: validación estructural previa al CAS en `5eac718b9b8d33d9da9a06a688aca0204bd1fb13`.
- Lite: división por cero -> DOMAIN_ERROR claro en `0b7cd3a20fa4d147af321ffd7748ce3c899aeb48`.
- Plus: helper G3 restaurado en `4f146ec8572554febddbe7f21f800733c70e4381`.
- Reruns: Lite `37586956770`; Plus `37586831275`.


## 2026-10-07 — G3 harness sincronizado
- Se comprobó que `setValue()` no garantiza el evento `input` usado por React.
- El helper G3 ahora dispara un `InputEvent("input")` después de `setValue()`.
- El helper espera explícitamente feedback final (alert/status) antes de clasificar éxito/error.
- Las corridas `37586956770` (Lite) y `37586831275` (Plus) se consideran diagnósticos de harness no aptos para clasificar producto.
- Nueva evidencia a revisar: Lite `37589106994`; Plus `37589114822`.


## 2026-10-07 — G3 residual reducido
- Lite: los 28 timeouts estructurales se clasificaron como harness/visibilidad; `BasicScientificMode` sí ejecuta `setResult()` al capturar el parse error.
- Lite helper G3 ahora detecta alert/status por presencia y contenido DOM, no por `isVisible()`.
- Plus: EN-ER-03/04 se clasifican como canonicalización válida de MathLive (fracción incompleta -> grupo vacío).
- Plus: EN-ER-13 era producto real; función desnuda alcanzaba SymPy y podía provocar `TypeError: 'property' object is not iterable`.
- Plus ahora rechaza funciones desnudas antes de SymPy.
- Reruns a revisar: Lite `37678678320`; Plus `37678685459`.

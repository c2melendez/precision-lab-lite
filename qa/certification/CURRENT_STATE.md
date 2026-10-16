# Current Certification State

## 2026-10-16 — Regresión cruzada diagnosticada; verificación final SY-S-13..18
- Plus SHA 7361816bd4a35890e81cfdd3ae445d1fe0e57702: cumulative 38868729743 y H1d 38868729643 SUCCESS. Backend job 116867515400: 1369 passed, 1 XFAIL, tests sys15/sys16/sys17/sys18 nombrados PASS; frontend job 116867515337: 928 passed, 28 TODO, cuatro conversores nuevos PASS. Mantener límite: conversor y HTTP separados; no UI nativo integral Plus.
- Lite UI 38868504449 FAILURE en seis comprobaciones SY-S-13/14. Causa harness confirmada en ResultPanel.tsx: vista dec usa span para números; el test esperaba math-field readonly inexistente. Se selecciona botón sqrt para vista exacta antes de leer math-field. Oráculos 0 y 1 sin cambios; misma corrección aplicada a SY-S-15..18.
- Lite cumulative 38868916158 FAIL: CAS dejó log(100)/log(10) simbólico. Intento 1a775c65 redujo potencias de diez dentro del parser, pero cumulative 38869090703 FAIL por regresión de eco estructural EN-FP-20 y EN-AL-26; además log(8,2) seguía sin reducción numérica. No se debilitaron tests previos.
- Corrección final Lite 02aa00c95fe4684901358247b1079e98c1b2cae6: conserva rewriteCommonLog original y mueve reducción demostrable de cocientes log(entero)/log(base entera) al adaptador algebriteClient.ts. Divisiones BigInt prueban potencia exacta, sin redondeo. Normalización de unary log plano base10 permanece en entrada; ln y log con base explícita se preservan, incluidos anidados.
- Gates Lite del SHA final: cumulative 38869279897, build 38869279924, H1d 38869279899 y científica UI 38869279824 IN_PROGRESS al registrar. No certificar SY-S-13..18 bilateralmente hasta esos resultados y logs específicos.
- Siguiente paso exacto: verificar esos cuatro runs y test syntax309SyS16.audit.test.ts junto a EN-FP-20/EN-AL-26; verificar seis specs sys13..sys18 en desktop/tablet/mobile, luego continuar SY-S-19/20 con símbolo de grados. SY-S-12 conserva PASS acotado ya registrado. H2/SG28 OPEN, DIST multinodo BLOCKED; sin merge o producción.

## Evidencia anterior verificada
- Rama canónica verificada desde main en ambos repositorios: qa/syntax-audit-in625-a1.
- SY-S-12 Plus SHA ce98df838481761121f3be2fed4809de8a9eea62: acumulativo 38862908867 SUCCESS (backend job 116849064501: test_sys12_raiz16_exact_and_reentry PASSED, 1363 passed / 1 xfailed), H1d 38862908877 SUCCESS y SG28 prototipo 38862908900 SUCCESS (69 passed). XFAIL no se cuenta como PASS.
- SY-S-12 Lite SHA 1eb99cb4d5565a8e4ccadd65f029caf6cd942536: acumulativo 38862179442, build 38862179710, H1d 38862179470, SG28 UI 38862179456 y científica 38862179483 SUCCESS. Job 116846733961 acredita test SY-S-12 exacto 4 en desktop/tablet/mobile, 309 passed en total.
- Alcance: PASS caso SY-S-12 en HTTP Plus y UI nativa Lite; no certifica alias general raiz ni UI integral Plus.

- Fixtures bilaterales idénticos: 309 filas; N1=104/N2=183/N3=22. Historial completo en EXECUTION_LOG.md.

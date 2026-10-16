# Current Certification State

## 2026-10-16 — SY-S-13/14 HTTP y motor PASS; SY-S-15..18 y corrección log en CI
- SY-S-13/14 Lite SHA 1a4694a4a96415ebdb889929f6531a42b040554e: cumulative 38868505125 SUCCESS, 1492 passed / 30 TODO; tests nuevos nombrados ambos PASS; build 38868504575 y H1d 38868504569 SUCCESS. UI 38868504449 pendiente de conclusión al observar.
- Plus SHA 94d2ff779172b3fbde9b3b6cb1ac391553fca7ba cumulative 38868507204 y H1d 38868507203 SUCCESS: backend 1365 passed / 1 XFAIL, tests sys13/sys14 exactos y reentrada PASS; frontend 924 passed / 28 TODO. Pendiente E2E UI nativo integral Plus; conversor y HTTP son capas separadas.
- Incorporados fixtures originales SY-S-15 ln(e)=1, SY-S-16 log(100)=2, SY-S-17 abs(-3)=3, SY-S-18 sqrt(16)=4 en pruebas permanentes de ambos repositorios. Lite SHA 6b85abda2fc3d46eb0588ba6e0116ee21f77955f: cumulative 38868725006 FAIL, build 38868725191 SUCCESS; falló solamente nuevo SY-S-16 porque CAS devolvió log(100), no 2. SY-S-15/17/18 unitarios PASS en ese gate fallido, sin certificación acumulativa.
- Causa Lite: preprocessLatex distingue macro visual log base10 pero conserva log(...) plano natural; contrato oficial SY-S-16 prescribe base10. Corrección general de entrada unary log(...) hacia log10(...) antes del lowering CAS, respetando ln(...) y log(arg,base), sin cambiar el oráculo ni el CAS interno. Regresiones adicionales log(10), log(1000), ln(e), log(8,2) y suma log(100)+ln(e).
- Corrección Lite SHA 082ece78c405a7b1af9a3c32c2864fa1dabc7dd5, gates push cumulative 38868916158, build 38868916010, H1d 38868916108, UI 38868916023 IN_PROGRESS. Plus SHA 7361816bd4a35890e81cfdd3ae445d1fe0e57702 cumulative 38868729743 y H1d 38868729643 IN_PROGRESS.
- Integridad de fixtures actual comprobada por lectura directa: contenidos bilaterales idénticos, 309 filas, niveles N1=104/N2=183/N3=22. Commits documentales cbd39063 / a1e7c46 no generaron runs nuevos en listado de rama.
- Siguiente paso: validar gates del último SHA y tests nombrados; corregir cualquier regresión matemática/de presentación sin rebajar resultados. Cerrar solo los casos probados y comenzar SY-S-19 sin(30°)=1/2 y SY-S-20 sen(30°)=1/2 tras resolver SY-S-16. H2/SG28 OPEN y DIST BLOCKED; sin producción ni merge.

## Último caso cerrado: SY-S-12
- Rama canónica verificada desde main en ambos repositorios: qa/syntax-audit-in625-a1.
- SY-S-12 Plus SHA ce98df838481761121f3be2fed4809de8a9eea62: acumulativo 38862908867 SUCCESS (backend job 116849064501: test_sys12_raiz16_exact_and_reentry PASSED, 1363 passed / 1 xfailed), H1d 38862908877 SUCCESS y SG28 prototipo 38862908900 SUCCESS (69 passed). XFAIL no se cuenta como PASS.
- SY-S-12 Lite SHA 1eb99cb4d5565a8e4ccadd65f029caf6cd942536: acumulativo 38862179442, build 38862179710, H1d 38862179470, SG28 UI 38862179456 y científica 38862179483 SUCCESS. Job 116846733961 acredita test SY-S-12 exacto 4 en desktop/tablet/mobile, 309 passed en total.
- Alcance: PASS caso SY-S-12 en HTTP Plus y UI nativa Lite; no certifica alias general raiz ni UI integral Plus.


## Continuidad
- Rama canónica qa/syntax-audit-in625-a1; documentación histórica en EXECUTION_LOG.md. Los resultados finales de GitHub prevalecen sobre estados IN_PROGRESS.
- No certificar globalmente Syntax309/IN625 ni contar TODO/XFAIL como PASS.

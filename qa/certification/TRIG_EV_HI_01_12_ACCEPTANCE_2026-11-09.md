# Aceptación: Trigonometría EV-HI-01..12 (inversas hiperbólicas)

- Estado: **PASS_SCOPED** (corregido desde PASS bilateral; alcance abajo).
- Fuente congelada: `qa/certification/legacy_sources/ejercicios_trigonometria.md.gz`, blob `3a41b0c2e0d79f2eef48e4684dc1324689d0a0fb` (sin cambios en los cuatro commits de la operación). Filas EV-HI-01..12 en la matriz.
- Commit técnico test-first: `14aba1f49c03a86f57951a7fd5306446ca667acd` (cumulative 42552094186 y CI 42552094194 FAILURE).
- Commit técnico final: `35e49984b1631415c3121a787bacfaf383c1df52`.
- Corridas en el SHA final: Cumulative 42555320522 SUCCESS; CI 42555320524 SUCCESS; H1d 42555320578 SUCCESS; Scientific UI 42555320552 SUCCESS; Runner 42555320521 SUCCESS. Detalle: focal EV-HI 10/10 (tests/trigonometryEvHi01to12.audit.test.ts) en Cumulative y en el job frontend de CI; suite 391 files, 2,384 passed, 8 expected fail, 34 todo.
- Otras corridas del SHA: H1d 42555320578 SUCCESS; Scientific UI 42555320552 SUCCESS; Runner 42555320521 SUCCESS.
- Cambios de producto: algebriteClient.ts (resolución numérica de asinh/acosh/atanh puras con dominio real), inverseHyperbolicExact.ts (sinh(asinh(u))=u para u numérico), parsing/normalize.ts (alias arcsch/arsech/arcoth).
- Ajuste de literales (solo Lite): en `14aba1f49c03a86f57951a7fd5306446ca667acd` los casos EV-HI-07..09 esperaban decimales aproximados. En `35e49984b1631415c3121a787bacfaf383c1df52` se alinearon con la forma exacta de la matriz congelada (`\ln\left(1+\sqrt{2}\right)`, `\ln\left(2+\sqrt{3}\right)`, `\frac{1}{2}\ln 3`). Los valores numéricos esperados no cambiaron.
- Resultado: EV-HI-01..03 exactos en 0; EV-HI-04..09 numéricos dentro de 1e-6; EV-HI-10 `sinh(arsinh(3))` = 3 exacto; EV-HI-11 `artanh(1)` y EV-HI-12 `arcosh(1/2)` con `DOMAIN_ERROR` y mensaje claro.
- Sin relajación de oráculos. Global OPEN; S25, SG28, H2 y DIST siguen abiertos.

## Alcance y límites (PASS_SCOPED)

- Verificado: las 12 filas EV-HI con las entradas ASCII de los tests de cada motor, con los oráculos numéricos y exactos ya registrados.
- No certificado todavía: los literales LaTeX de entrada de EV-HI en cada motor. Plus prueba entradas ASCII; Lite usa literales LaTeX solo como forma esperada de salida.
- No certificado todavía: la forma exacta de cada resultado frente a la matriz. Lite compara valores numéricos dentro de 1e-6 en EV-HI-04..09, no la forma simbólica exacta.
- Plus prueba `acsch`, `asech` y `acoth`; los alias `arcsch`, `arsech` y `arcoth` de la matriz no tienen test propio en Plus.
- Para volver a PASS: certificar en ambos motores las entradas LaTeX y las formas exactas de EV-HI-01..12, con evidencia CI en el SHA final.

- Verificación Lite: el alcance se limita a las entradas probadas en `tests/trigonometryEvHi01to12.audit.test.ts`.

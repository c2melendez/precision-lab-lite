## 2026-10-21 UTC — EV-I-07 cierre r228 y arranque de EV-L (logarítmicas)

**EV-I-07 — `arccot(-1) = 3π/4`: PASS_SCOPED_BILATERAL.** La matriz congelada exige el rango principal `(0, π)`; los motores usaban la rama `arctan(1/x)` / `acot` de SymPy (`-π/4`).

- Cambio de producto: `arccot(a) = π/2 − arctan(a)` en el parser de Lite (incluye la ruta `\cot^{-1}`) y reescritura de `acot` en `evaluate_service` de Plus (solo cuando la expresión contiene `acot`).
- Lite `76e89a9b3546ad73b4be61fea4cd48de5905195f`: cumulative [39648569475](https://github.com/c2melendez/precision-lab-lite/actions/runs/39648569475) — SUCCESS, 2028 passed, 8 expected fail, 34 TODO; h1d [39648569239](https://github.com/c2melendez/precision-lab-lite/actions/runs/39648569239) y scientific-ui [39648569417](https://github.com/c2melendez/precision-lab-lite/actions/runs/39648569417) — SUCCESS.
- Plus `f8bdd40a2bbd6016f412019a246e4dbce23835f1`: cumulative [39648580772](https://github.com/c2melendez/precision-lab-plus/actions/runs/39648580772) — SUCCESS, 1801 passed; h1d [39648579685](https://github.com/c2melendez/precision-lab-plus/actions/runs/39648579685) — SUCCESS.
- Resultado: `arccot(-1)=3π/4`, `arccot(0)=π/2`, `arccot(1)=π/4` en ambos motores; oráculos de parser y alias actualizados.

**Defectos EV-I aún abiertos (solo Lite; Plus ya los resuelve):**

- **EV-I-09** `arcsin(sin 2)`: Lite devuelve `2` (Algebrite simplifica sin respetar la rama principal); correcto `π−2 ≈ 1.141592654`. Plus devuelve `-2 + pi`.
- **EV-I-10** `sin(arccos(3/5))`: Lite deja la expresión sin evaluar; correcto `4/5`. Plus devuelve `4/5`.

**EV-L (logarítmicas) — primeros hallazgos de sondeo (sin cambios de producto todavía):**

- LaTeX correcto: `\log_{2}(8)` → `3`; `\log_{10}(0.001)` → `-log(1000)/log(10)` (sin simplificar a `-3`); `\log_{4}(8)` → `log(8)/log(4)` (sin simplificar a `3/2`); `\log_{8}(2)` → `log(2)/log(8)` (sin simplificar a `1/3`); `\ln(0)` → `DOMAIN_ERROR`; `\ln(-1)` → `i*pi`.
- `\ln(10^{50})` → `log(1000…0)` sin aplicar `n·ln 10` (esperado `50 ln 10 ≈ 115.129254650`).
- `\log_{1}(5)` → error de división entre cero (esperado error claro de base inválida).
- `\log_{2}(3)\cdot\log_{3}(4)` → **error de parseo** (`Carácter no reconocido: "_"`); la segunda base no se normaliza tras `\cdot`.
- La forma ASCII `log_2(8)` se parsea como producto de variables (`log*S*U*B*T*W*O*(8)`): no es el canal contractual (la matriz usa LaTeX), pero es un riesgo de entrada.
- Plus resuelve exactamente `log(8)/log(2)`, `log(8)/log(4)`, `log(2)/log(8)`, `log(1000)/log(10)` y `ln(10^50)=50*ln(10)`.

---

## 2026-10-21 UTC — EV-H cierre r227: PASS_SCOPED (canal numérico)

**EV-H-01..12 — PASS_SCOPED.** Gates SUCCESS sobre el SHA técnico `54f81f21806fbe02ebf4c40ed237ed244a667de4`:

- cumulative: [39596870367](https://github.com/c2melendez/precision-lab-lite/actions/runs/39596870367) — SUCCESS; 2025 passed, 8 expected fail, 34 TODO; EV-H 9/9.
- h1d: [39596869965](https://github.com/c2melendez/precision-lab-lite/actions/runs/39596869965) — SUCCESS; scientific-ui: [39596870180](https://github.com/c2melendez/precision-lab-lite/actions/runs/39596870180) — SUCCESS.
- Alcance: EV-H-01..03 exactos (`0`,`1`,`0`); EV-H-04..09 verificados por valor numérico (Lite imprime `0.75`, `1.25`, `0.6`, `1.333333...`, `0.8`, `1.666667...`); EV-H-10/11 a 9 decimales; EV-H-12 identidad exacta `1`.
- Limitación registrada: la forma racional exacta (`3/4`, `5/4`, `3/5`, `4/3`, `4/5`, `5/3`) no aparece en `result_text` en ninguno de los dos motores (Plus deja la forma simbólica y expone `result_approx`).
- EV-I grupo A quedó cerrado bilateralmente (scientific-ui de Lite confirmado SUCCESS).
- Certificación global continúa OPEN por bloqueos independientes.
- Siguiente objetivo: EV-I-07 (rango principal de `arccot`) y los defectos Lite EV-I-09/I-10; después continuar con las matrices siguientes del protocolo (Log/Exp/Radicales).

---

## 2026-10-21 UTC — EV-I grupo A cierre r226; EV-H en ejecución

**EV-I-01..06, EV-I-08 y EV-I-11 — PASS_SCOPED_BILATERAL.** Cobertura publicada en `11d0192582c337e38ec3718940f5f620644e44f0`. Resultados:

- cumulative: [39596378248](https://github.com/c2melendez/precision-lab-lite/actions/runs/39596378248) — SUCCESS; 2016 passed, 8 expected fail, 34 TODO.
- h1d: [39596378313](https://github.com/c2melendez/precision-lab-lite/actions/runs/39596378313) — SUCCESS.
- scientific-ui: [39596378121](https://github.com/c2melendez/precision-lab-lite/actions/runs/39596378121) — SUCCESS (confirmado; el listado de la API mostró `in_progress` rezagado durante varios minutos).
- Plus: cumulative [39596384431](https://github.com/c2melendez/precision-lab-plus/actions/runs/39596384431) — SUCCESS, 1794 passed, 6 xfailed; h1d [39596384432](https://github.com/c2melendez/precision-lab-plus/actions/runs/39596384432) — SUCCESS.

**EV-H-01..12 (hiperbólicas) test-first publicado** — Lite `54f81f21806fbe02ebf4c40ed237ed244a667de4` / Plus `e7107279a0309e9c31114b3b725b51103cffbef7`; gates en ejecución.

- Alcance previsto: EV-H-01..03 exactos (`0`,`1`,`0`); EV-H-04..09 certificables por canal numérico (ningún motor simplifica `sinh(ln 2)` a `3/4`: Lite muestra `0.75`/`0.6`/`1.333333...`, Plus deja la forma simbólica y expone `result_approx`); EV-H-10/11 aproximaciones a 9 decimales; EV-H-12 identidad exacta `1`.
- Limitación a registrar: la forma racional exacta de EV-H-04..09 no se muestra en `result_text` en ninguno de los dos motores.

---

## 2026-10-21 UTC — AUD-SING cierre r225 y EV-I grupo A en ejecución

**AUD-SING-01/02 — PASS_SCOPED (correcciones reales de producto).** Gates SUCCESS sobre el SHA técnico `7d83a9ac14c73dc70fb52d8902e01dc9313d1924`:

- cumulative: [39595606769](https://github.com/c2melendez/precision-lab-lite/actions/runs/39595606769) — SUCCESS; 2008 passed, 8 expected fail, 34 TODO; typecheck/build SUCCESS.
- h1d: [39595606725](https://github.com/c2melendez/precision-lab-lite/actions/runs/39595606725) — SUCCESS; scientific-ui: [39595606686](https://github.com/c2melendez/precision-lab-lite/actions/runs/39595606686) — SUCCESS.
- `arccot(0) = π/2` (ya no error de división entre cero); `arcsinh/arccosh/arctanh/arccoth/arccsch/arcsech` se resuelven como funciones (antes `arcsinh(1)` = `arcsin*h*1` = **0**); en GRAD `sec/csc/cot` convierten ángulo (`sec(90)`→`DOMAIN_ERROR`, `cot(45)`→1, `csc(30)`→2); `arcsin(2)`/`arccos(2)`→`DOMAIN_ERROR`.
- Plus alineado: gates SUCCESS en `587aecc1f978e03bb976212f3c32fc632b76d0b0` — cumulative [39595617829](https://github.com/c2melendez/precision-lab-plus/actions/runs/39595617829) (1791 passed, 6 xfailed), h1d [39595617779](https://github.com/c2melendez/precision-lab-plus/actions/runs/39595617779), native syntax [39595617887](https://github.com/c2melendez/precision-lab-plus/actions/runs/39595617887), SG28 prototype [39595617826](https://github.com/c2melendez/precision-lab-plus/actions/runs/39595617826).

**EV-I grupo A en ejecución** — Lite `11d0192582c337e38ec3718940f5f620644e44f0` / Plus `43738a0fd6387e99a71bdf0124e15fb5c698c877`: EV-I-01..06 (`arcsin(1/2)`, `arccos(-1/2)`, `arctan(1)`, `arctan(√3)`, `arccsc(2)`, `arcsec(2)`), EV-I-08 (`arccot(0)=π/2`) y EV-I-11 (`cos(arctan 2)=√5/5`), con fila congelada verificada.

**Pendientes EV-I con defecto demostrado (no certificados):**
- **EV-I-07** `arccot(-1)`: la matriz exige `3π/4`; ambos motores devuelven `-π/4` (rama `arctan(1/x)` / convención SymPy). Requiere decisión de contrato y corrección bilateral a rango principal (0, π).
- **EV-I-09** `arcsin(sin 2)`: el motor devuelve `2` (simplificación que ignora la rama principal; el valor correcto es `π-2 ≈ 1.141592654`). Defecto de producto pendiente.
- **EV-I-10** `sin(arccos(3/5))`: el motor deja la expresión sin evaluar (`4/5` esperado). Capacidad pendiente.

---

## 2026-10-21 UTC — EV-D-12 cierre r224 y auditoría de singularidades evitables (AUD-SING)

**EV-D-12 — `tan(π/2)` indefinida (error claro): PASS_SCOPED.** Fila congelada verificada; los tres gates Lite terminaron SUCCESS con `head_sha` exacto.

- cumulative: [39593868026](https://github.com/c2melendez/precision-lab-lite/actions/runs/39593868026) — SUCCESS; EV-D-12 7/7; 1999 passed, 8 expected fail, 34 TODO; SHA `7cc7bf8a458d37c182adbfd898a1626e665aba76`.
- h1d: [39593867990](https://github.com/c2melendez/precision-lab-lite/actions/runs/39593867990) — SUCCESS; scientific-ui: [39593867986](https://github.com/c2melendez/precision-lab-lite/actions/runs/39593867986) — SUCCESS.
- Corrección de producto: `tan(π/2+kπ)` devolvía la forma sin evaluar `tan(1/2*pi)`; ahora se detecta el polo con el coseno exacto del motor y se emite `DOMAIN_ERROR` ("Tangente no definida"), solo para el resultado que es exactamente `tan(...)`. `log(0)`/`ln(0)` también emiten `DOMAIN_ERROR` (paridad con Plus).
- Plus ya cumplía (`DOMAIN_ERROR` en `tan(pi/2)` y `log(0)`): [39593883422](https://github.com/c2melendez/precision-lab-plus/actions/runs/39593883422) — SUCCESS, 1783 passed, 6 xfailed, cobertura 88.05%; h1d [39593883403](https://github.com/c2melendez/precision-lab-plus/actions/runs/39593883403) — SUCCESS.

**Auditoría de decisiones previas que creaban singularidades/valores silenciosos (AUD-SING), en ejecución sobre Lite `7d83a9ac` / Plus `587aecc1`:**

- **AUD-SING-01 — `arccot(0)`:** era un error de división entre cero por la reescritura `arctan(1/0)`, pese a que `arccot(0)=π/2`. Corregido en el parser (caso exacto 0 → `pi/2`), conservando `arctan(1/x)` para `x≠0` (rama compatible con Plus).
- **AUD-SING-02 — alias hiperbólicos:** `arcsinh/arccosh/arctanh/arccoth` no estaban en el mapa de alias y se partían como producto implícito (`arcsinh(1)` → `arcsin*h*1` → **0**). Añadidos al mapa y a los dos pasadas de reescritura; `arccoth → acoth`, `arccsch → acsch`, `arcsech → asech` en forma canónica.
- **AUD-SING-02 — modo grados:** `sec/csc/cot` no convertían ángulo en GRAD porque solo `sin/cos/tan` estaban en la lista de conversión; `sec(90)` daba `-2.2318`, `cot(45)` `0.6174`, `csc(30)` `-1.0121`. Ahora las tres convierten y coinciden con Plus (`DOMAIN_ERROR`/`1`/`2`).
- **EV-I-12 (adelanto):** `arcsin(2)`/`arccos(2)` devolvían la llamada sin evaluar; ahora `DOMAIN_ERROR` claro en ambos motores (Plus corregido en `evaluate_service.py`).
- Gates de este lote en ejecución; no se declara PASS hasta revisar conclusión y logs.

---

## 2026-10-21 UTC — EV-D-11 cierre r223: PASS_SCOPED_EQUIVALENT

**EV-D-11 — `sin²(π/8) + cos²(π/8) = 1`: PASS_SCOPED_EQUIVALENT.** Fila congelada verificada; los tres gates Lite terminaron SUCCESS con `head_sha` exacto.

- cumulative: [39583453889](https://github.com/c2melendez/precision-lab-lite/actions/runs/39583453889) — SUCCESS; EV-D-11 3/3; 339 archivos, 1992 passed, 8 expected fail, 34 TODO; typecheck/build SUCCESS.
- h1d: [39583453775](https://github.com/c2melendez/precision-lab-lite/actions/runs/39583453775) — SUCCESS; mismo SHA `52f50ea44558343c88c2a926e438d61d0f03486d`.
- scientific-ui: [39583453805](https://github.com/c2melendez/precision-lab-lite/actions/runs/39583453805) — SUCCESS; mismo SHA.
- Alcance: `evaluate()` conserva la identidad en forma exacta `cos(1/8*pi)^2+sin(1/8*pi)^2`; el oráculo certifica equivalencia exacta (`simplify(...) = 1`, diferencia `= 0`) y valor numérico `≈ 1`, conforme a la regla G2 de no exigir igualdad textual cuando existen representaciones equivalentes. Limitación registrada: la identidad pitagórica no se colapsa automáticamente a `1` en el canal primario.
- Plus sí devuelve `1` literal (`2f37ee2f10f8bac361eff592bbe3e0a5a3b654e9`).
- Certificación global continúa OPEN por bloqueos independientes.
- Siguiente objetivo: TRIG-EV-D-12-TEST-FIRST (`tan(π/2)` indefinida: contrato de error claro). Verificar antes la fila fuente y el contrato de error vigente.

---

## 2026-10-21 UTC — EV-D-10 cierre r222: PASS_SCOPED_BILATERAL (con corrección de producto)

**EV-D-10 — `cot(π/2) = 0`: PASS_SCOPED_BILATERAL.** Fila congelada verificada. El caso destapó un defecto real de producto en Lite y se corrigió la capa correcta (parser), no el oráculo.

- Diagnóstico: `cot(a)` se reescribía como `1/tan(a)`; en `a = π/2` eso deja una singularidad evitable y el motor devolvía `1/(tan(1/2*pi))` en vez de `0`.
- Corrección: `cot(a)` se reescribe como `cos(a)/sin(a)` en `src/engine/parsing/index.ts`; `cos(π/2)/sin(π/2) = 0/1 = 0` y `cot(0)` sigue indefinida.
- Primer gate acumulativo del SHA de la corrección `b5bd0fa3b06da410d10b9a0fe2503756d7f6570a` falló [39563431468](https://github.com/c2melendez/precision-lab-lite/actions/runs/39563431468) solo en el oráculo `EN-AL-11` de alias C3, que exigía `cot(` o `1/tan(`. Se amplió la expectativa a la codificación canónica `cos(...)/sin(...)` (commit de tests `4c92b797189cb41ffe70de93332938ba67d389b5`); producto sin cambios adicionales.
- Evidencia final (SHA `4c92b797189cb41ffe70de93332938ba67d389b5`):
  - cumulative: [39564052659](https://github.com/c2melendez/precision-lab-lite/actions/runs/39564052659) — SUCCESS; EV-D-10 3/3; 338 archivos, 1989 passed, 8 expected fail, 34 TODO; typecheck/build SUCCESS.
  - h1d: [39564052660](https://github.com/c2melendez/precision-lab-lite/actions/runs/39564052660) — SUCCESS; mismo SHA.
  - scientific-ui: [39564052665](https://github.com/c2melendez/precision-lab-lite/actions/runs/39564052665) — SUCCESS; mismo SHA.
- Plus no requirió cambio de producto (SymPy ya devuelve `0`); su evidencia es `b635db5fa6e00fab92a144d421398ff5d5df0763`.
- Siguiente objetivo en ejecución: TRIG-EV-D-11-TEST-FIRST (identidad pitagórica `sin²(π/8)+cos²(π/8)=1`), tests publicados en el SHA técnico `52f50ea44558343c88c2a926e438d61d0f03486d`.
- Certificación global continúa OPEN por bloqueos independientes.

---

## 2026-10-21 UTC — EV-D-09 cierre r221 y EV-D-10 con defecto de producto corregido

**EV-D-09 — `cos(2) ≈ -0.416146837`: PASS_SCOPED_BILATERAL.** Fila congelada verificada; los tres gates Lite terminaron SUCCESS con `head_sha` exacto.

- cumulative: [39562383033](https://github.com/c2melendez/precision-lab-lite/actions/runs/39562383033) — SUCCESS; SHA técnico `7e6d29ae4c391805154ebae8029436792ee010fb` exacto.
- h1d: [39562383038](https://github.com/c2melendez/precision-lab-lite/actions/runs/39562383038) — SUCCESS; mismo SHA.
- scientific-ui: [39562383018](https://github.com/c2melendez/precision-lab-lite/actions/runs/39562383018) — SUCCESS; mismo SHA.
- Prueba EV-D-09: 4/4; suite Vitest 337 archivos, 1986 passed, 8 expected fail, 34 TODO; typecheck y production build SUCCESS.

**EV-D-10 — `cot(π/2) = 0`: defecto de producto confirmado y corregido (gate en ejecución).** La prueba test-first reprodujo el fallo: el motor devolvía `1/(tan(1/2*pi))` en vez de `0` porque `cot(a)` se reescribía como `1/tan(a)`, con singularidad evitable en los ceros de `tan`.

- Corrección de producto en `src/engine/parsing/index.ts`: `cot(a)` se reescribe como `cos(a)/sin(a)` (misma identidad, resuelve `cos(π/2)/sin(π/2) = 0/1 = 0` y mantiene `cot(0)` indefinida). Se actualizó la expectativa del contrato de parser en `tests/parsing.test.ts`.
- Evidencia local previa al cambio: `expected '1/(tan(1/2*pi))' to be '0'` en las dos pruebas de `tests/trigonometryEvD10.audit.test.ts`; tras el cambio, 129 pruebas relacionadas (EV-D-06, EV-D-10, parsing, trigonometría exhaustiva, paridad de teclado) pasan.
- SHA con la corrección: Lite `b5bd0fa3b06da410d10b9a0fe2503756d7f6570a`; Plus `b635db5fa6e00fab92a144d421398ff5d5df0763` (Plus no requirió cambio de producto: SymPy ya devuelve `0`).
- Gates EV-D-10 en ejecución; no se declara PASS hasta revisar conclusión y logs.
- Certificación global continúa OPEN por bloqueos independientes.

---

## 2026-10-21 UTC — EV-D-08 cierre r220: PASS_SCOPED_BILATERAL

**EV-D-08 — `sin(1) ≈ 0.841470985`: PASS_SCOPED_BILATERAL.** Se verificó la fila congelada `| EV-D-08 | \`\sin(1)\` | \`\approx 0.841470985\` |` y se documentó la convención de oráculo para filas `\approx` en `EXECUTION_PROTOCOL.md`. No se modificó código de producto.

- cumulative: [39561366616](https://github.com/c2melendez/precision-lab-lite/actions/runs/39561366616) — SUCCESS; SHA técnico `d605a23bac884d99b5eee38a5a1f4197c4172c57` exacto.
- h1d: [39561366691](https://github.com/c2melendez/precision-lab-lite/actions/runs/39561366691) — SUCCESS; mismo SHA.
- scientific-ui: [39561366624](https://github.com/c2melendez/precision-lab-lite/actions/runs/39561366624) — SUCCESS; mismo SHA.
- Prueba EV-D-08: 4/4 en `tests/trigonometryEvD08.audit.test.ts`; suite Vitest 336 archivos, 1982 passed, 8 expected fail, 34 TODO; typecheck y production build SUCCESS.
- El motor conserva la forma exacta `sin(1)`; el oráculo comprueba que `0.841470985` es el redondeo correcto a 9 decimales y que el canal `float` (6 decimales) coincide con tolerancia 1e-6. Una salida solo decimal no certifica.
- Certificación global continúa OPEN por bloqueos independientes; este cierre solo certifica EV-D-08.
- Siguiente objetivo en ejecución: TRIG-EV-D-09-TEST-FIRST (`cos(2) ≈ -0.416146837`), tests publicados en el SHA técnico `7e6d29ae4c391805154ebae8029436792ee010fb`.

---

## 2026-10-21 UTC — EV-D-07 cierre r219: PASS_SCOPED_BILATERAL

**EV-D-07 — `sin(5π/4) = -√2/2`: PASS_SCOPED_BILATERAL.** Se verificó la fila congelada `| EV-D-07 | \`\sin\left(\frac{5\pi}{4}\right)\` | \`-\frac{\sqrt{2}}{2}\` |`. Los tres gates requeridos terminaron SUCCESS con `head_sha` exacto; no se modificó código de producto.

- cumulative: [39560031960](https://github.com/c2melendez/precision-lab-lite/actions/runs/39560031960) — SUCCESS; SHA técnico `1275c24933b2ca77a31bba6e1d2c01274e97795e` exacto.
- h1d: [39560031969](https://github.com/c2melendez/precision-lab-lite/actions/runs/39560031969) — SUCCESS; mismo SHA.
- scientific-ui: [39560031973](https://github.com/c2melendez/precision-lab-lite/actions/runs/39560031973) — SUCCESS; mismo SHA.
- Prueba EV-D-07: 3/3 en `tests/trigonometryEvD07.audit.test.ts`; suite Vitest 335 archivos, 1978 passed, 8 expected fail, 34 TODO; typecheck y production build SUCCESS.
- El motor devuelve la forma exacta `-1/2*2^(1/2)` (equivalente a `-√2/2`); el oráculo exige equivalencia algebraica y valor numérico y rechaza una salida decimal.
- Certificación global continúa OPEN por bloqueos independientes; este cierre solo certifica EV-D-07.
- Siguiente objetivo: TRIG-EV-D-08-TEST-FIRST (`sin(1) ≈ 0.841470985`). Antes de escribir pruebas, definir el oráculo contractual para filas con `\approx` (tolerancia y dígitos documentados) en ambos motores.

---

## 2026-10-21 UTC — EV-D-06 cierre r218: PASS_SCOPED_BILATERAL

**EV-D-06 — `cot(pi/4)=1`: PASS_SCOPED_BILATERAL.** Se verificó la fila de la matriz trigonométrica congelada. Todos los gates requeridos terminaron SUCCESS y sus `head_sha` coinciden con el SHA técnico indicado. No se modificó código de producto.

- cumulative: [39557479991](https://github.com/c2melendez/precision-lab-lite/actions/runs/39557479991) — SUCCESS; SHA técnico `00892789a8cd5c6e12ba43cb47fce4d97f7b1bc8` exacto.
- h1d: [39557479974](https://github.com/c2melendez/precision-lab-lite/actions/runs/39557479974) — SUCCESS; SHA técnico `00892789a8cd5c6e12ba43cb47fce4d97f7b1bc8` exacto.
- scientific-ui: [39557480008](https://github.com/c2melendez/precision-lab-lite/actions/runs/39557480008) — SUCCESS; SHA técnico `00892789a8cd5c6e12ba43cb47fce4d97f7b1bc8` exacto.

- Prueba específica EV-D-06: 3/3; suite Vitest 1975 passed, 8 expected fail, 34 TODO; typecheck y production build SUCCESS. Scientific UI: 456/456 passed.
- Diagnóstico del primer intento Lite: la aserción no admitía el resultado `1` entre backticks como aparece en la matriz. Se corrigió únicamente el test. Producto sin cambios.
- Certificación global continúa OPEN por bloqueos independientes registrados; este cierre solo certifica EV-D-06.
- Siguiente objetivo pendiente de ejecución: TRIG-EV-D-07-TEST-FIRST. Antes de escribir pruebas, confirmar la fila EV-D-07 en la fuente congelada; no asumir expresión ni resultado.

---

## 2026-10-21 UTC — EV-D-06 actualización r217: Plus acumulativo PASS

- **Plus cumulative PASS** [39557484508](https://github.com/c2melendez/precision-lab-plus/actions/runs/39557484508), SHA técnico `6369a617e59f2f23fe73ac4e464683de310a688a`: backend 1766 passed, 6 xfailed, cobertura 88.05%; `test_ev_d06_source_row_present_and_frozen` y `test_ev_d06_cot_pi_over_4_http_ascii` PASSED. Frontend typecheck, regresión y production build SUCCESS.
- **Plus H1d PASS** [39557484518](https://github.com/c2melendez/precision-lab-plus/actions/runs/39557484518), mismo SHA.
- **Lite cumulative PASS** [39557479991](https://github.com/c2melendez/precision-lab-lite/actions/runs/39557479991): EV-D-06 3/3, 1975 passed, 8 expected fail, 34 TODO; typecheck/build SUCCESS. **Lite H1d PASS** [39557479974](https://github.com/c2melendez/precision-lab-lite/actions/runs/39557479974).
- Único gate pendiente para el cierre del objetivo: **Lite Scientific UI** [39557480008](https://github.com/c2melendez/precision-lab-lite/actions/runs/39557480008), todavía ejecutando Native desktop/tablet/mobile scientific result verification. EV-D-06 permanece IN_PROGRESS hasta que este gate termine; no se declara PASS bilateral todavía.
- Producto sin cambios. Certificación global OPEN.

---

## 2026-10-21 UTC — EV-D-06 checkpoint r216: gates parciales verificados

- **Lite cumulative PASS** [39557479991](https://github.com/c2melendez/precision-lab-lite/actions/runs/39557479991), SHA técnico `00892789a8cd5c6e12ba43cb47fce4d97f7b1bc8`: suite EV-D-06 3/3; 334/334 archivos Vitest, 1975 passed, 8 expected fail, 34 TODO; typecheck y production build SUCCESS.
- **Lite H1d PASS** [39557479974](https://github.com/c2melendez/precision-lab-lite/actions/runs/39557479974), mismo SHA. **Lite Scientific UI** [39557480008](https://github.com/c2melendez/precision-lab-lite/actions/runs/39557480008) continúa en el paso Native desktop/tablet/mobile scientific result verification.
- **Plus H1d PASS** [39557484518](https://github.com/c2melendez/precision-lab-plus/actions/runs/39557484518), SHA técnico `6369a617e59f2f23fe73ac4e464683de310a688a). **Plus cumulative** [39557484508](https://github.com/c2melendez/precision-lab-plus/actions/runs/39557484508): frontend SUCCESS; backend regression sigue IN_PROGRESS.
- La fila fuente está confirmada como `| EV-D-06 | `\\cot\\left(\\frac{\\pi}{4}\\right)` | `1` |`. Fallo inicial de Lite fue solo el regex que no aceptaba backticks; corregido. No se cambió producto.
- EV-D-06 permanece **IN_PROGRESS** hasta que terminen Lite Scientific UI y Plus cumulative y se revisen logs y SHA. Certificación global OPEN.

---

## 2026-10-21 UTC — EV-D-06 test-first checkpoint; gates pending

**Fuente congelada verificada:** la fila EV-D-06 es `cot(pi/4)=1`, representada como `\\cot\\left(\\frac{\\pi}{4}\\right)` con el resultado en backticks. Se agregó cobertura test-first en ambos motores; no se modificó código de producto.

- **Lite**: commit de pruebas corregido `00892789a8cd5c6e12ba43cb47fce4d97f7b1bc8`. La corrida acumulativa inicial [39557278838](https://github.com/c2melendez/precision-lab-lite/actions/runs/39557278838) falló únicamente porque la aserción del resultado no aceptaba los backticks del formato fuente. El log confirma que las pruebas ASCII y LaTeX sí pasaron; total previo a la corrección: 1974 passed, 1 failed (solo formato de la prueba), 8 expected fail, 34 TODO. Corregido para aceptar `1` y `1` con formato literal de matriz.
- **Plus**: test `backend/tests/test_trigonometry_ev_d06.py`; commit corregido `6369a617e59f2f23fe73ac4e464683de310a688a`, con el mismo ajuste para que la aserción fuente acepte el resultado documentado con backticks. No se ha observado ni autorizado cambio de producto.
- Gates del SHA final están en ejecución: Lite cumulative [39557479991](https://github.com/c2melendez/precision-lab-lite/actions/runs/39557479991), H1d [39557479974](https://github.com/c2melendez/precision-lab-lite/actions/runs/39557479974), Scientific UI [39557480008](https://github.com/c2melendez/precision-lab-lite/actions/runs/39557480008); Plus cumulative [39557484508](https://github.com/c2melendez/precision-lab-plus/actions/runs/39557484508), H1d [39557484518](https://github.com/c2melendez/precision-lab-plus/actions/runs/39557484518). Validar conclusión y SHA exacto antes de marcar PASS.
- **Estado EV-D-06: IN_PROGRESS.** Próxima acción: revisar todos los gates finales y logs, resolver solo fallos demostrados, luego cerrar bilateralmente. Certificación global continúa OPEN por bloqueos previos.

---

## 2026-10-21 UTC — r214: EV-D-05 PASS_SCOPED_BILATERAL; EV-D-06 preparado

**EV-D-05 — `sec(pi/3)=2`: PASS_SCOPED_BILATERAL.** La fila fuente de la matriz congelada y el resultado esperado fueron verificados en las pruebas de ambos motores. No se modificó código de producto.

- **Lite**, test commit `24871267ec1ee9f64bbd2d34fd449b41ee74f99c`: cumulative [39555164790](https://github.com/c2melendez/precision-lab-lite/actions/runs/39555164790), H1d [39555164686](https://github.com/c2melendez/precision-lab-lite/actions/runs/39555164686), Scientific UI [39555164730](https://github.com/c2melendez/precision-lab-lite/actions/runs/39555164730): todos SUCCESS con SHA exacto. El log acumulativo confirma el archivo `tests/trigonometryEvD05.audit.test.ts` con 3/3 pruebas aprobadas; 1972 passed, 8 expected fail y 34 TODO en el total de Vitest.
- **Plus**, test corregido commit `8885a3b47dc6509c52a08312bbc87d5f1651c6da`: cumulative [39556359520](https://github.com/c2melendez/precision-lab-plus/actions/runs/39556359520) y H1d [39556359572](https://github.com/c2melendez/precision-lab-plus/actions/runs/39556359572): ambos SUCCESS con SHA exacto. Backend: 1764 passed, 6 xfailed, cobertura 88.07%; tanto `test_ev_d05_source_row_present_and_frozen` como `test_ev_d05_sec_pi_over_3_http_ascii` PASSED. Frontend typecheck, regresión y build SUCCESS.
- Diagnóstico del intento inicial Plus `7be68dcfbcd9ed64b4f4ae98399276d01ede0034`: import incorrecto `backend.main`, corregido en el test sin alterar el producto. El primer cumulative [39555174858](https://github.com/c2melendez/precision-lab-plus/actions/runs/39555174858) fue FAIL de harness/colección, no fallo matemático; la nueva evidencia válida es la de `8885a3b`.
- Estado global de certificación permanece OPEN por bloqueos independientes registrados (SG28/DIST, S25, SY-P-23, SY-X-04 Plus HTTP y Algebra229-AS-B-29).

**Siguiente objetivo único: `TRIG-EV-D-06-TEST-FIRST` — READY.** Primero leer/verificar la fila EV-D-06 de la matriz congelada; después añadir pruebas test-first bilaterales según los canales contractuales (Lite parser ASCII+LaTeX; Plus HTTP ASCII), activar gates por push y no cambiar producto salvo que la prueba y la fuente demuestren un defecto. No asumir el resultado ni la expresión de EV-D-06 antes de leer la fila oficial.

---

## 2026-10-21 UTC — EV-D-05 actualización r213: H1d Plus PASS, acumulativo pendiente

- Plus H1d [39556359572](https://github.com/c2melendez/precision-lab-plus/actions/runs/39556359572) terminó SUCCESS sobre el SHA técnico `8885a3b47dc6509c52a08312bbc87d5f1651c6da`; se revisaron los pasos, incluido `Run IN625 H1d reentry`, ejecutado y aprobado.
- Plus cumulative [39556359520](https://github.com/c2melendez/precision-lab-plus/actions/runs/39556359520) continúa IN_PROGRESS en su job backend `Backend regression`; frontend finalizó SUCCESS (typecheck, unit/parity y production build). No declarar EV-D-05 cerrado hasta concluir backend, revisar logs y verificar que los tests nuevos pasaron.
- El cierre documental bilateral r212 ya está publicado; esta entrada refresca la evidencia dinámica sin provocar un nuevo gate técnico.

---

## 2026-10-21 UTC — EV-D-05 diagnóstico y gates pendientes

- Lite: commit de pruebas `24871267ec1ee9f64bbd2d34fd449b41ee74f99c`; cumulative [39555164790](https://github.com/c2melendez/precision-lab-lite/actions/runs/39555164790), H1d [39555164686](https://github.com/c2melendez/precision-lab-lite/actions/runs/39555164686) y Scientific UI [39555164730](https://github.com/c2melendez/precision-lab-lite/actions/runs/39555164730) terminaron SUCCESS sobre el SHA esperado.
- Plus: commit inicial `7be68dcfbcd9ed64b4f4ae98399276d01ede0034`; cumulative [39555174858](https://github.com/c2melendez/precision-lab-plus/actions/runs/39555174858) falló durante colección por `ModuleNotFoundError: No module named 'backend'` en el test nuevo. Esto es un fallo del harness/test import, no evidencia de fallo matemático. H1d [39555174838](https://github.com/c2melendez/precision-lab-plus/actions/runs/39555174838) SUCCESS.
- Corrección exclusiva del test en commit `8885a3b47dc6509c52a08312bbc87d5f1651c6da`: import `app.main`, aserción sobre `MathResponse.success/result_text` y comprobación de fila fuente congelada. Producto sin cambios.
- Validación de la corrección: Plus cumulative [39556359520](https://github.com/c2melendez/precision-lab-plus/actions/runs/39556359520) y H1d [39556359572](https://github.com/c2melendez/precision-lab-plus/actions/runs/39556359572), activadas por push con SHA exacto; ambas estaban IN_PROGRESS al redactar este registro.
- Estado: EV-D-05 sigue IN_PROGRESS. No declarar PASS hasta revisar conclusión, jobs/logs y fila fuente. Certificación global OPEN.

---

## 2026-10-21 UTC — r211: cierre EV-D-04 y arranque test-first EV-D-05

**EV-D-04 PASS_SCOPED bilateral** — `csc(pi/6)=2`. Cinco gates SUCCESS y SHA exactos:
- Lite cumulative [39554410679](https://github.com/c2melendez/precision-lab-lite/actions/runs/39554410679), H1d [39554410715](https://github.com/c2melendez/precision-lab-lite/actions/runs/39554410715), Scientific UI [39554410696](https://github.com/c2melendez/precision-lab-lite/actions/runs/39554410696), todos `head_sha=0467aa89c470abf6607d1b67e9c40191642d8df4`.
- Plus cumulative [39552906521](https://github.com/c2melendez/precision-lab-plus/actions/runs/39552906521) y H1d [39552906515](https://github.com/c2melendez/precision-lab-plus/actions/runs/39552906515), ambos `head_sha=f6756dc37bdf193a01de05a4bb9208b65cf47867`.
- No se modificó código de producto; el test Lite usa el parser oficial antes de evaluar.

**EV-D-05 test-first iniciado** — hipótesis a validar: `sec(pi/3)=2`. Añadidas pruebas en Lite `tests/trigonometryEvD05.audit.test.ts` (commit `24871267ec1ee9f64bbd2d34fd449b41ee74f99c`) y Plus `backend/tests/test_trigonometry_ev_d05.py` (commit `7be68dcfbcd9ed64b4f4ae98399276d01ede0034`). Las pruebas verifican también que la fila EV-D-05 y su resultado estén en la matriz congelada. No se cambió producto.

Corridas EV-D-05 actualmente en curso:
- Lite cumulative [39555164790](https://github.com/c2melendez/precision-lab-lite/actions/runs/39555164790), H1d [39555164686](https://github.com/c2melendez/precision-lab-lite/actions/runs/39555164686), Scientific UI [39555164730](https://github.com/c2melendez/precision-lab-lite/actions/runs/39555164730), SHA esperado `24871267ec1ee9f64bbd2d34fd449b41ee74f99c`.
- Plus cumulative [39555174858](https://github.com/c2melendez/precision-lab-plus/actions/runs/39555174858) y H1d [39555174838](https://github.com/c2melendez/precision-lab-plus/actions/runs/39555174838), SHA esperado `7be68dcfbcd9ed64b4f4ae98399276d01ede0034`.

EV-D-05 permanece `IN_PROGRESS`; no declarar PASS hasta verificar fila fuente, resultados y SHA exactos de los cinco gates. Certificación global: `OPEN`.

---

## 2026-10-21 UTC — r210: EV-D-04 diagnóstico y test corregido; cierre pendiente

La corrida acumulativa inicial de Lite [39552903560](https://github.com/c2melendez/precision-lab-lite/actions/runs/39552903560) falló solo en el nuevo test: este llamaba a `evaluate("csc(pi/6)")` directamente, evitando el pipeline oficial del parser. La salida observada fue `csc(1/6*pi)`, no `2`. El parser ya contiene la reescritura de `csc` a `1/sin`; el test debe pasar por `parseExpression` antes de `evaluate`.

Se corrigió únicamente el test Lite en commit `0467aa89c470abf6607d1b67e9c40191642d8df4`; **no se modificó código de producto**. El test Plus ya había pasado en las corridas [39552906521](https://github.com/c2melendez/precision-lab-plus/actions/runs/39552906521) y [39552906515](https://github.com/c2melendez/precision-lab-plus/actions/runs/39552906515), ambas con `head_sha=f6756dc37bdf193a01de05a4bb9208b65cf47867`.

Nuevas corridas de Lite para el SHA corregido `0467aa89c470abf6607d1b67e9c40191642d8df4`:
- cumulative [39554410679](https://github.com/c2melendez/precision-lab-lite/actions/runs/39554410679) — `in_progress`.
- h1d [39554410715](https://github.com/c2melendez/precision-lab-lite/actions/runs/39554410715) — `in_progress`.
- scientific-ui [39554410696](https://github.com/c2melendez/precision-lab-lite/actions/runs/39554410696) — `in_progress`.

No declarar EV-D-04 PASS hasta que terminen las tres corridas y se compruebe `head_sha`. Global certification: `OPEN`.

---

# Registro de ejecución — índice vigente

## 2026-10-21 UTC — r209: EV-D-04 test-first iniciado; gates en ejecución

Objetivo `TRIG-EV-D-04-TEST-FIRST`: `csc(pi/6)=2`. Se añadieron únicamente pruebas de aceptación, antes de modificar producto:
- Lite: `tests/trigonometryEvD04.audit.test.ts`, commit `9623bfa02b50f4fde154fc2fdd96f894151e65e3`.
- Plus: `backend/tests/test_trigonometry_ev_d04.py`, commit `9623bfa02b50f4fde154fc2fdd96f894151e65e3`.

Estado de las corridas al registrar este checkpoint:
- cumulative: [39552903560](https://github.com/c2melendez/precision-lab-lite/actions/runs/39552903560) — `in_progress`; esperado `head_sha=9623bfa02b50f4fde154fc2fdd96f894151e65e3`.
- h1d: [39552903434](https://github.com/c2melendez/precision-lab-lite/actions/runs/39552903434) — `in_progress`; esperado `head_sha=9623bfa02b50f4fde154fc2fdd96f894151e65e3`.
- scientific-ui: [39552903511](https://github.com/c2melendez/precision-lab-lite/actions/runs/39552903511) — `in_progress`; esperado `head_sha=9623bfa02b50f4fde154fc2fdd96f894151e65e3`.

No se afirma PASS/FAIL todavía: las corridas siguen activas y el resultado de test-first está pendiente. No se cambió código de producto. Próxima acción: esperar conclusión de todos los gates, inspeccionar los resultados específicos de EV-D-04, corregir solo si las pruebas lo exigen y publicar el cierre final con SHA exactos. Global `OPEN`.

---



## 2026-10-21 UTC — Cierre documental r208: gates D20 de r207 verificados

Los seis gates D20 del commit documental r207 terminaron `completed/success`; se verificó la igualdad exacta entre el SHA de cada run y el SHA documental del repositorio:
- Lite `cumulative`: [39551266478](https://github.com/c2melendez/precision-lab-lite/actions/runs/39551266478) — SUCCESS; `head_sha=5b7a642dbfdb56cc932101116ca8f28afe4da871` exacto.
- Lite `h1d`: [39551268683](https://github.com/c2melendez/precision-lab-lite/actions/runs/39551268683) — SUCCESS; `head_sha=5b7a642dbfdb56cc932101116ca8f28afe4da871` exacto.
- Lite `scientific-ui`: [39551270883](https://github.com/c2melendez/precision-lab-lite/actions/runs/39551270883) — SUCCESS; `head_sha=5b7a642dbfdb56cc932101116ca8f28afe4da871` exacto.

La expresión de EV-D-04 se normalizó en documentación a `\csc(\frac{\pi}{6}) → 2`, corrigiendo el exceso de barras y las llaves duplicadas. Esto es una corrección documental únicamente; EV-D-04 permanece `READY`, no iniciado. Global `OPEN`.

---

## 2026-10-21 UTC — Gates D20 de r206 registrados (continuity r207)

Gates documentales de r206 (`workflow_dispatch` sobre `de987a4`, `head_sha` exacto, todos SUCCESS):
- Lite `de987a4`: cumulative [39549979912](https://github.com/c2melendez/precision-lab-lite/actions/runs/39549979912), h1d [39549982104](https://github.com/c2melendez/precision-lab-lite/actions/runs/39549982104), scientific-ui [39549984347](https://github.com/c2melendez/precision-lab-lite/actions/runs/39549984347).

Gates documentales de r207 (commit de este cierre): se disparan con `workflow_dispatch` sobre el SHA documental (D20); sus resultados se registran en r208.

Siguiente sin cambios: EV-D-04 `\\csc(\\frac{{\\pi}}{{6}}) → 2`, `READY`; no iniciado. Global OPEN.

---

## 2026-10-21 UTC — Trigonometría EV-D-03 PASS_SCOPED bilateral (continuity r206)

**EV-D-03** — `\tan(\frac{\pi}{4}) → 1` (fila oficial de `ejercicios_trigonometria.md.gz`).

Evidencia (test-first, sin cambio de producto):
- **Lite** `f07afe1` (`tests/trigonometryEvD03.audit.test.ts`): cumulative [39549185561](https://github.com/c2melendez/precision-lab-lite/actions/runs/39549185561), h1d [39549185671](https://github.com/c2melendez/precision-lab-lite/actions/runs/39549185671), scientific-ui [39549185567](https://github.com/c2melendez/precision-lab-lite/actions/runs/39549185567); SUCCESS. Canales: ASCII `tan(pi/4)` y LaTeX oficial vía `parseExpression` + Algebrite.
- **Plus** `fce235b` (`backend/tests/test_trigonometry_ev_d03.py`, HTTP ASCII `tan(pi/4)`): cumulative [39549187134](https://github.com/c2melendez/precision-lab-plus/actions/runs/39549187134), h1d [39549187120](https://github.com/c2melendez/precision-lab-plus/actions/runs/39549187120); SUCCESS.

Alcance: evaluación exacta de tan(π/4)=1. Plus solo en ASCII, igual que EV-D-01 y EV-D-02. No cierra el módulo trig completo. Global OPEN.

Gates documentales de r205 (D20, sobre `60865c8`): todos SUCCESS con `head_sha` exacto. Cumulative [39548181168](https://github.com/c2melendez/precision-lab-lite/actions/runs/39548181168), h1d [39548183229](https://github.com/c2melendez/precision-lab-lite/actions/runs/39548183229), scientific-ui [39548185228](https://github.com/c2melendez/precision-lab-lite/actions/runs/39548185228).

Gates documentales de r206 (commit de este cierre): se disparan con `workflow_dispatch` sobre el SHA documental (D20); sus resultados se registran en r207.

Siguiente: EV-D-04 `\csc(\frac{\pi}{6}) → 2`, `READY`; se ejecuta al recibir la siguiente instrucción. Global OPEN.

---

## 2026-10-21 UTC — Trigonometría EV-D-02 PASS_SCOPED bilateral (continuity r205)

**EV-D-02** — `\\cos(\\pi/3) → 1/2` (fila oficial de `ejercicios_trigonometria.md.gz`).

Evidencia (test-first, sin cambio de producto):
- **Lite** `0601287` (`tests/trigonometryEvD02.audit.test.ts`): cumulative [39547288506](https://github.com/c2melendez/precision-lab-lite/actions/runs/39547288506), h1d [39547288469](https://github.com/c2melendez/precision-lab-lite/actions/runs/39547288469), scientific-ui [39547288515](https://github.com/c2melendez/precision-lab-lite/actions/runs/39547288515); SUCCESS.
- **Plus** `c15349a` (`backend/tests/test_trigonometry_ev_d02.py`, HTTP ASCII `cos(pi/3)`): cumulative [39547294497](https://github.com/c2melendez/precision-lab-plus/actions/runs/39547294497), h1d [39547294494](https://github.com/c2melendez/precision-lab-plus/actions/runs/39547294494); SUCCESS.

Alcance: evaluación exacta de cos(π/3)=1/2. Plus solo en ASCII, igual que EV-D-01. No cierra el módulo trig completo. Global OPEN.

Excepción de proceso D20 (r204): los commits documentales de EV-D-01 (Lite `052cfa3`, `ed44453`, `cd73fb1`; Plus `9348420`, `a8e44ee`, `35cd5b1`) no tienen runs de gates. `workflow_dispatch` solo corre sobre el head de la rama, así que ya no pueden gatearse a posteriori. Queda registrado como excepción; el commit documental de r205 sí se gatea.

Gates documentales de r205 (commit de este cierre): se disparan con `workflow_dispatch` sobre el SHA documental (D20); sus resultados se registran en r206.

Siguiente: EV-D-03 `\\tan(\\frac{\\pi}{4}) → 1`, `READY`; se ejecuta al recibir la siguiente instrucción. Global OPEN.

## 2026-10-21 UTC — EV-D-01 PASS_SCOPED bilateral (continuity r204)

**Trigonometría EV-D-01** — sin(pi/6)=1/2.

- Lite `13bdc7c` (solo tests): cumulative [39545169322](https://github.com/c2melendez/precision-lab-lite/actions/runs/39545169322), h1d [39545169419](https://github.com/c2melendez/precision-lab-lite/actions/runs/39545169419), scientific-ui [39545169496](https://github.com/c2melendez/precision-lab-lite/actions/runs/39545169496) SUCCESS.
- Plus `4e625d1` (HTTP ASCII; LaTeX raw fuera de alcance): cumulative [39545579931](https://github.com/c2melendez/precision-lab-plus/actions/runs/39545579931), h1d [39545579919](https://github.com/c2melendez/precision-lab-plus/actions/runs/39545579919) SUCCESS.

Sin cambio de producto. Global OPEN. Siguiente: EV-D-02.

---

## 2026-10-21 UTC — AS-B-28 PASS_SCOPED bilateral (continuity r203)

**ALGEBRA229-AS-B-28** — factorizar el entero 4294967297 → `641*6700417` (fila N3). Sintaxis D25.

- Lite `2f869fa`: cumulative [39541626385](https://github.com/c2melendez/precision-lab-lite/actions/runs/39541626385), h1d [39541626256](https://github.com/c2melendez/precision-lab-lite/actions/runs/39541626256), scientific-ui [39541626315](https://github.com/c2melendez/precision-lab-lite/actions/runs/39541626315) SUCCESS (sin producto).
- Plus `ae70b7c`: cumulative [39542004229](https://github.com/c2melendez/precision-lab-plus/actions/runs/39542004229), h1d [39542004282](https://github.com/c2melendez/precision-lab-plus/actions/runs/39542004282), Native Syntax [39542004162](https://github.com/c2melendez/precision-lab-plus/actions/runs/39542004162) SUCCESS (regla acotada).

D20 r202: Lite `038703f` y Plus `a2a4968` SUCCESS.

Global OPEN. AS-B-29 ON_HOLD.

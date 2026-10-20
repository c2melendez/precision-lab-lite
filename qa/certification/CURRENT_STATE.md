> Decisiones de alcance, de producto y de proceso: ver `qa/certification/ALGEBRA229_DECISIONS.md`.

## 2026-10-20 UTC — Verificación de gates del cierre r192 (continuity r193)

El commit `3ffcca9` no disparó runs de gates: sus cambios son solo `.md` y `qa/certification/continuity.json`, rutas excluidas de los workflows cumulative y h1d. Desde `3a6c8ac` solo cambiaron documentos bajo `qa/certification/`, así que el código es idéntico al de `3a6c8ac`.

| SHA | Código | Gates (SUCCESS) |
|-----|--------|------------------|
| `3a6c8ac` | sí | cumulative [39496986843](https://github.com/c2melendez/precision-lab-lite/actions/runs/39496986843), h1d [39496986689](https://github.com/c2melendez/precision-lab-lite/actions/runs/39496986689), scientific-ui [39496986778](https://github.com/c2melendez/precision-lab-lite/actions/runs/39496986778) |
| `88b3249` (docs) | no | cumulative [39499113815](https://github.com/c2melendez/precision-lab-lite/actions/runs/39499113815), h1d [39499113808](https://github.com/c2melendez/precision-lab-lite/actions/runs/39499113808). Disparados por `CONTINUITY_NEXT_ACTION.json`, que no está excluido. |

Estado: AS-B-22 en `ON_HOLD`. Plus sin cambios. Global OPEN.

---

## 2026-10-20 UTC — Correcciones documentales y cierre (continuity r192)

Commit solo documental `88b32498845c249f853ee117dd541c081cfa8c8c` sobre `b31fa61`, sin código ni AS-B-22. Corrige: AS-B-21 marcado como histórico resuelto por D16–D18 en `ALGEBRA229_DECISIONS.md`; `continuity.json` con `next_action` en `ON_HOLD` y `completed_scoped` que incluye D19; `CONTINUITY_NEXT_ACTION.json` marcado como histórico (revisión 160).

| Repo | Technical SHA | Gates (SUCCESS sobre el SHA exacto) |
|------|---------------|--------------------------------------|
| Lite | `88b32498845c249f853ee117dd541c081cfa8c8c` (docs) | cumulative [39499113815](https://github.com/c2melendez/precision-lab-lite/actions/runs/39499113815), h1d [39499113808](https://github.com/c2melendez/precision-lab-lite/actions/runs/39499113808). scientific-ui no se disparó en este SHA. |

Estado: AS-B-22 en `ON_HOLD`, a la espera de instrucción. Plus sin cambios. Global OPEN.

---

## 2026-10-20 UTC — Excepciones del CAS en diferencia de cuadrados (D19, continuity r191)

`verifyFactorResult` en `src/engine/polynomialFactorZ.ts`: una excepción o respuesta no concluyente del CAS en el paso factorizado ya no omite la verificación independiente del candidato de dos cuadráticos. El candidato se devuelve solo si el CAS confirma equivalencia; si no, se conserva el resultado original. Pruebas previas en `b1c40b6de7e7ae1476883bc9e65606826ec1c5f1`, con dos casos de brecha conocida (`it.fails`) que ahora son pruebas normales.

| Repo | Technical SHA | Gates (SUCCESS sobre el SHA exacto) |
|------|---------------|--------------------------------------|
| Lite | `3a6c8ac53bbfea656ff74e248a52e828d93c8b88` | cumulative [39496986843](https://github.com/c2melendez/precision-lab-lite/actions/runs/39496986843), h1d [39496986689](https://github.com/c2melendez/precision-lab-lite/actions/runs/39496986689), scientific-ui [39496986778](https://github.com/c2melendez/precision-lab-lite/actions/runs/39496986778) |

Evidencia: `tests/differenceOfSquaresCasFallback.test.ts` (11 pruebas) junto con `tests/differenceOfSquaresRule.test.ts` y `tests/polynomialFactorZ.test.ts`: 27 pruebas en verde en local. Plus sin cambios; Plus no tiene regla propia de diferencia de cuadrados (SymPy). Global OPEN.

---

## 2026-10-20 UTC — Forma canónica diferencia de cuadrados (D18, continuity r190)

Lite `e2c0e584d18ce37b5f309933fc72e09ec5a0a78e` (código y pruebas) y `620cd4985c682188c6524a575fa66cf39a9ce0cc` (regresiones). `differenceOfSquaresFactored` en `src/engine/polynomialFactorZ.ts` factoriza P−Q y P+Q con Kronecker, agrupa potencias y verifica con CAS. AS-B-21 produce `(x-1)^2*(x+1)^2`.

| Repo | Technical SHA | Gates (SUCCESS) |
|------|---------------|-----------------|
| Lite | `e2c0e584d18ce37b5f309933fc72e09ec5a0a78e` | cumulative [39490173826](https://github.com/c2melendez/precision-lab-lite/actions/runs/39490173826), h1d [39490174255](https://github.com/c2melendez/precision-lab-lite/actions/runs/39490174255), scientific-ui [39490174122](https://github.com/c2melendez/precision-lab-lite/actions/runs/39490174122) |
| Lite | `620cd4985c682188c6524a575fa66cf39a9ce0cc` | cumulative [39491056857](https://github.com/c2melendez/precision-lab-lite/actions/runs/39491056857), h1d [39491056842](https://github.com/c2melendez/precision-lab-lite/actions/runs/39491056842), scientific-ui [39491056775](https://github.com/c2melendez/precision-lab-lite/actions/runs/39491056775) |

Evidencia: `tests/differenceOfSquaresRule.test.ts` (forma canónica, pieza irreducible, multivariable y regresiones x^2+1 y x^2-2). Plus sin cambios. Global OPEN.

---

## 2026-10-20 UTC — Salvaguarda diferencia de cuadrados (D17, continuity r189)

Regla acotada `differenceOfSquaresCandidate` en `src/engine/polynomialFactorZ.ts` (Lite `bda4c99055530b972716f1de719fb0fd273046cf`), solo para `(P)^2 - K·v^2` con K cuadrado perfecto. Se acepta solo si el CAS confirma equivalencia y Algebrite devuelve un resultado sin paréntesis.

| Repo | Technical SHA | Gates (SUCCESS) |
|------|---------------|-----------------|
| Lite | `d7cf042dfb3652bf44e9d4fa17270e2920618dcd` | cumulative [39481757500](https://github.com/c2melendez/precision-lab-lite/actions/runs/39481757500), h1d [39481757734](https://github.com/c2melendez/precision-lab-lite/actions/runs/39481757734), scientific-ui [39481757683](https://github.com/c2melendez/precision-lab-lite/actions/runs/39481757683) |

Regresiones: `x^2+1` y `x^2-2` no coinciden con la regla y siguen con un solo factor. Evidencia: `tests/differenceOfSquaresRule.test.ts`. Plus sin cambios. Global OPEN.

---

## 2026-10-20 UTC — AS-B-21 PASS sin cambio de producto (continuity r188)

**ALGEBRA229-AS-B-21** — factorizar `\left(x^{2}+1\right)^{2}-4x^{2}` → `\left(x - 1\right)^{2} \left(x + 1\right)^{2}` (fila N3 en la matriz congelada Section B, diferencia de cuadrados).

| Repo | Technical SHA | Gates (SUCCESS sobre el SHA exacto) |
|------|---------------|--------------------------------------|
| Lite | `4636c9924e7afe71f16ad275701cff33ebd7ce7c` | cumulative [39479961317](https://github.com/c2melendez/precision-lab-lite/actions/runs/39479961317), h1d [39479961560](https://github.com/c2melendez/precision-lab-lite/actions/runs/39479961560), scientific-ui [39479961091](https://github.com/c2melendez/precision-lab-lite/actions/runs/39479961091) |

Test-first sin cambios de producto: Algebrite devuelve una factorización equivalente a `(x-1)^2*(x+1)^2` y la prueba pasó en `npm test` dentro del gate cumulative. Evidencia: `tests/algebra229AsB21.audit.test.ts`. La regla acotada de diferencia de cuadrados (opción C de D16) no se implementó porque no era necesaria; requiere nueva decisión del usuario. El respaldo B no se activó. Global OPEN.

---

## 2026-10-20 UTC — AS-B-20 PASS_SCOPED bilateral (continuity r187)

**ALGEBRA229-AS-B-20** — factorizar `x^{4}+x^{2}y^{2}+y^{4}` → `\left(x^{2} - x y + y^{2}\right) \left(x^{2} + x y + y^{2}\right)` (fila fuente N3 en la matriz congelada Section B).

| Repo | Technical SHA | Gates (SUCCESS sobre el SHA exacto, evento push) |
|------|---------------|--------------------------------------------------|
| Lite | `a0b5718ca271e6ee79817368c3ac360d7848c708` | cumulative [39477553098](https://github.com/c2melendez/precision-lab-lite/actions/runs/39477553098), h1d [39477553321](https://github.com/c2melendez/precision-lab-lite/actions/runs/39477553321), scientific-ui [39477553104](https://github.com/c2melendez/precision-lab-lite/actions/runs/39477553104) |

Cambio de producto en Lite (`24e89b6`): regla acotada `quarticBiquadraticCandidate` en `src/engine/polynomialFactorZ.ts`. Reconoce solo `a^4 + a^2 b^2 + b^4` (tres términos, dos variables distintas de una letra, coeficientes 1) y se acepta solo si Algebrite devuelve el resultado sin paréntesis y el CAS confirma `(candidato)-(original) = 0`. **No es un factorizador multivariable general.** Evidencia: `tests/algebra229AsB20.audit.test.ts` (fila fuente N3, equivalencia, forma con paréntesis y regresión con `x^4+x^2*y^2+y^5`). Historia: la prueba roja de `a9cb5a9` se retiró en `33d68a5` y se restauró en `a0b5718`. Decisión D15 en `ALGEBRA229_DECISIONS.md`.

Plus (sin cambios de producto): SymPy en `/api/v1/factor` ya devolvía la factorización. Evidencia: `backend/tests/test_algebra229_as_b20.py`. Gates sobre `f8ec173`: cumulative [39475284739](https://github.com/c2melendez/precision-lab-plus/actions/runs/39475284739), h1d [39475284787](https://github.com/c2melendez/precision-lab-plus/actions/runs/39475284787) SUCCESS. Global OPEN.

**Siguiente único:** `ALGEBRA229-AS-B-21-TEST-FIRST` — `\left(x^{2}+1\right)^{2}-4x^{2}` → `\left(x - 1\right)^{2} \left(x + 1\right)^{2}` (fila N3).

---

## 2026-10-20 UTC — AS-B-20 BLOQUEADO en Lite, pendiente de decisión (continuity r186)

**ALGEBRA229-AS-B-20** — factorizar `x^{4}+x^{2}y^{2}+y^{4}` → `\left(x^{2} - x y + y^{2}\right) \left(x^{2} + x y + y^{2}\right)` (fila fuente N3, factorización multivariable).

| Repo | SHA | Resultado |
|------|-----|-----------|
| Plus | `f8ec1733c356f48fce1f6f2a1719d8ab559d229c` | Test-first `backend/tests/test_algebra229_as_b20.py` pasa sin cambios de producto. Gates cumulative [39475284739](https://github.com/c2melendez/precision-lab-plus/actions/runs/39475284739), h1d [39475284787](https://github.com/c2melendez/precision-lab-plus/actions/runs/39475284787) SUCCESS. |
| Lite | `a9cb5a99246deeaba5fa428d5845ab2a52e1dae8` | Test-first `tests/algebra229AsB20.audit.test.ts` FALLA en cumulative [39475280948](https://github.com/c2melendez/precision-lab-lite/actions/runs/39475280948): Algebrite devuelve `x^4+y^4+x^2*y^2` sin factorizar. La equivalencia pasa; la forma no. |

Lite: la prueba roja se retiró del branch con un commit de revert para mantener el gate verde; queda en el historial de `a9cb5a9`. Caso no cerrado. Global OPEN.

**Decisión pendiente (P1, D8):** ¿regla acotada para la forma `a^4+a^2b^2+b^4` verificada por CAS, como en AS-B-16, o un camino multivariable más general? Las decisiones vigentes no autorizan un factorizador multivariable general.

**Siguiente único:** esperar decisión para `ALGEBRA229-AS-B-20` (no avanzar a B-21 hasta cerrarlo).

---

## 2026-10-20 UTC — AS-B-19 PASS_SCOPED bilateral (continuity r185)

**ALGEBRA229-AS-B-19** — factorizar `x^{2}y-xy^{2}` → `x y \left(x - y\right)` (fila fuente N2 en la matriz congelada Section B, factor común multivariable).

| Repo | Technical SHA | Gates (SUCCESS sobre el SHA exacto, evento push) |
|------|---------------|--------------------------------------------------|
| Lite | `bf11ee2af55879c10dbbb173420196cb2c47747b` | cumulative [39471800824](https://github.com/c2melendez/precision-lab-lite/actions/runs/39471800824), h1d [39471800800](https://github.com/c2melendez/precision-lab-lite/actions/runs/39471800800), scientific-ui [39471800799](https://github.com/c2melendez/precision-lab-lite/actions/runs/39471800799) |

Test-first sin cambios de producto: el motor de Lite ya devolvía una factorización equivalente al original, con la forma `x*y*(x-y)`. Evidencia: `tests/algebra229AsB19.audit.test.ts` (fila fuente N2, diferencia exacta cero y forma con paréntesis). Global OPEN.

**Siguiente único:** `ALGEBRA229-AS-B-20-TEST-FIRST` — `x^{4}+x^{2}y^{2}+y^{4}` → `\left(x^{2} - x y + y^{2}\right) \left(x^{2} + x y + y^{2}\right)` (fila N3, primera fila multivariable con dos factores cuadráticos).

---

## 2026-10-20 UTC — AS-B-18 PASS_SCOPED bilateral (continuity r184)

**ALGEBRA229-AS-B-18** — factorizar `x^{8}-1` → `\left(x - 1\right) \left(x + 1\right) \left(x^{2} + 1\right) \left(x^{4} + 1\right)` (fila fuente N2 en la matriz congelada Section B).

| Repo | Technical SHA | Gates (SUCCESS sobre el SHA exacto, evento push) |
|------|---------------|--------------------------------------------------|
| Lite | `ea5a76d18143c4f5a5a889ca279726a37c4d4896` | cumulative [39462375918](https://github.com/c2melendez/precision-lab-lite/actions/runs/39462375918), h1d [39462375646](https://github.com/c2melendez/precision-lab-lite/actions/runs/39462375646), scientific-ui [39462375444](https://github.com/c2melendez/precision-lab-lite/actions/runs/39462375444) |

Test-first sin cambios de producto: el motor ya devolvía una factorización equivalente con cuatro factores en ambos repos. Evidencia: `tests/algebra229AsB18.audit.test.ts` (fila fuente N2, diferencia exacta cero y producto de cuatro factores). Global OPEN.

**Siguiente único:** `ALGEBRA229-AS-B-19-TEST-FIRST` — `x^{2}y-xy^{2}` → `x y \left(x - y\right)` (fila N2 de la matriz congelada, factor común multivariable).

---

## 2026-10-20 UTC — AS-B-17 PASS_SCOPED bilateral (continuity r183)

**ALGEBRA229-AS-B-17** — factorizar `a^{3}+b^{3}` → `\left(a + b\right) \left(a^{2} - a b + b^{2}\right)` (fila fuente N2 en la matriz congelada Section B).

| Repo | Technical SHA | Gates (SUCCESS sobre el SHA exacto, evento push) |
|------|---------------|--------------------------------------------------|
| Lite | `672360f94527e3981091eb64a212a8b4428ae2be` | cumulative [39461130911](https://github.com/c2melendez/precision-lab-lite/actions/runs/39461130911), h1d [39461130713](https://github.com/c2melendez/precision-lab-lite/actions/runs/39461130713), scientific-ui [39461131049](https://github.com/c2melendez/precision-lab-lite/actions/runs/39461131049) |

Test-first sin cambios de producto: la regla de cubos de Lite (r182) ya cubría la suma de cubos, y SymPy la factorizaba en Plus. Evidencia: `tests/algebra229AsB17.audit.test.ts` (fila fuente N2, diferencia exacta cero y forma `(a+b)*(a^2-a*b+b^2)`). Global OPEN.

**Decisión de alcance (2026-10-20):** AS-B-24 (`x²-2` sobre ℝ) y AS-B-25 (`x²+1` sobre ℂ) quedan incluidas en la matriz de factorización. El cuerpo se indica con el sufijo explícito «sobre ℝ» o «sobre ℂ» en la entrada. Su implementación sigue el orden de la matriz, después de B-18 a B-23.

**Siguiente único:** `ALGEBRA229-AS-B-18-TEST-FIRST` — `x^{8}-1` → `\left(x - 1\right) \left(x + 1\right) \left(x^{2} + 1\right) \left(x^{4} + 1\right)`.

---

## 2026-10-20 UTC — AS-B-16 PASS_SCOPED bilateral (continuity r182)

**ALGEBRA229-AS-B-16** — factorizar `a^{3}-b^{3}` → `\left(a - b\right) \left(a^{2} + a b + b^{2}\right)` (fila fuente N2 en la matriz congelada Section B).

| Repo | Technical SHA | Gates (SUCCESS sobre el SHA exacto, evento push) |
|------|---------------|--------------------------------------------------|
| Lite | `4c822947f8cab04b420772cef72d4f6deada32e8` | cumulative [39459168172](https://github.com/c2melendez/precision-lab-lite/actions/runs/39459168172), h1d [39459168011](https://github.com/c2melendez/precision-lab-lite/actions/runs/39459168011), scientific-ui [39459168124](https://github.com/c2melendez/precision-lab-lite/actions/runs/39459168124) |

Test-first `252d337` falló el gate cumulativo: Algebrite devolvía `a^{3}-b^{3}` sin factorizar, así que la prueba de forma no pasaba. Cambio de producto en `src/engine/polynomialFactorZ.ts`: `verifyFactorResult` sustituye un resultado sin factorizar por `(a-b)(a²+ab+b²)` (o `(a+b)(a²-ab+b²)`) solo si la identidad es equivalente al original por CAS; alcance acotado a binomios de cubos con variables de una letra. Evidencia: `tests/algebra229AsB16.audit.test.ts` (fila fuente N2 en la matriz congelada, diferencia exacta cero y forma `(a-b)*(a^2+a*b+b^2)`). Global OPEN.

**Siguiente único:** `ALGEBRA229-AS-B-17-TEST-FIRST` — `a^{3}+b^{3}` (fila N2 de la matriz congelada; ver fila completa en Section B).

---

## 2026-10-20 UTC — AS-B-15 PASS_SCOPED bilateral (continuity r181)

**ALGEBRA229-AS-B-15** — factorizar `x^{3}-x^{2}-x+1` → `\left(x - 1\right)^{2} \left(x + 1\right)` (fila fuente N2 en la matriz congelada Section B).

| Repo | Technical SHA | Gates (SUCCESS sobre el SHA exacto, evento push) |
|------|---------------|--------------------------------------------------|
| Lite | `1d55948449316534410a2b8f13e4d5f1a4661333` | cumulative [39456655537](https://github.com/c2melendez/precision-lab-lite/actions/runs/39456655537), h1d [39456655582](https://github.com/c2melendez/precision-lab-lite/actions/runs/39456655582), scientific-ui [39456655551](https://github.com/c2melendez/precision-lab-lite/actions/runs/39456655551) |

Test-first sin cambios de producto: el motor ya devolvía una factorización equivalente al original en ambos repos. Evidencia: `tests/algebra229AsB15.audit.test.ts` (fila fuente N2 en la matriz congelada, diferencia exacta cero con el original y forma `(x-1)^2*(x+1)`). Global OPEN.

**Siguiente único:** `ALGEBRA229-AS-B-16-TEST-FIRST` — `a^{3}-b^{3}` → `\left(a - b\right) \left(a^{2} + a b + b^{2}\right)` (fila N2 de la matriz congelada).

---

## 2026-10-20 UTC — AS-B-14 PASS_SCOPED bilateral (continuity r180)

**ALGEBRA229-AS-B-14** — factorizar `x^{4}+x^{2}+1` → `\left(x^{2} - x + 1\right) \left(x^{2} + x + 1\right)` (fila fuente N3 en la matriz congelada Section B).

| Repo | Technical SHA | Gates (SUCCESS sobre el SHA exacto, evento push) |
|------|---------------|--------------------------------------------------|
| Lite | `63e72af491249ba9f975196083673816ac6a5fc1` | cumulative [39455229746](https://github.com/c2melendez/precision-lab-lite/actions/runs/39455229746), h1d [39455229733](https://github.com/c2melendez/precision-lab-lite/actions/runs/39455229733), scientific-ui [39455229732](https://github.com/c2melendez/precision-lab-lite/actions/runs/39455229732) |

Test-first sin cambios de producto: el motor ya devolvía una factorización equivalente al original en ambos repos, con dos factores cuadráticos. Evidencia: `tests/algebra229AsB14.audit.test.ts` (fila fuente N3 en la matriz congelada, diferencia exacta cero con el original y forma `(x^2-x+1)*(x^2+x+1)`). Global OPEN.

**Siguiente único:** `ALGEBRA229-AS-B-15-TEST-FIRST` — `x^{3}-x^{2}-x+1` → `\left(x - 1\right)^{2} \left(x + 1\right)` (fila N2 de la matriz congelada).

---

## 2026-10-20 UTC — AS-B-13 PASS_SCOPED bilateral (continuity r179)

**ALGEBRA229-AS-B-13** — factorizar `2x^{3}-x^{2}-13x-6` → `\left(x - 3\right) \left(x + 2\right) \left(2 x + 1\right)` (fila fuente N3 en la matriz congelada Section B).

| Repo | Technical SHA | Gates (SUCCESS sobre el SHA exacto, evento push) |
|------|---------------|--------------------------------------------------|
| Lite | `b344fb9e86cad8985c35fc80b149e9c3e9a5870f` | cumulative [39453853229](https://github.com/c2melendez/precision-lab-lite/actions/runs/39453853229), h1d [39453853159](https://github.com/c2melendez/precision-lab-lite/actions/runs/39453853159), scientific-ui [39453853301](https://github.com/c2melendez/precision-lab-lite/actions/runs/39453853301) |

Test-first sin cambios de producto: el motor ya devolvía una factorización equivalente al original en ambos repos, con tres factores lineales. Evidencia: `tests/algebra229AsB13.audit.test.ts` (fila fuente, diferencia exacta cero y forma `(x-3)*(x+2)*(2*x+1)`) y `backend/tests/test_algebra229_as_b13.py` (`/api/v1/factor` por HTTP, producto de tres factores). Global OPEN.

**Siguiente único:** `ALGEBRA229-AS-B-14-TEST-FIRST` — `x^{4}+x^{2}+1` → `\left(x^{2} - x + 1\right) \left(x^{2} + x + 1\right)` (fila N3; diferencia de cuadrados en ℚ).

---

## 2026-10-20 UTC — AS-B-12 PASS_SCOPED bilateral (continuity r178)

**ALGEBRA229-AS-B-12** — factorizar `x^{5}-x` → `x \left(x - 1\right) \left(x + 1\right) \left(x^{2} + 1\right)` (fila fuente N2 en la matriz congelada Section B).

| Repo | Technical SHA | Gates (SUCCESS sobre el SHA exacto, evento push) |
|------|---------------|--------------------------------------------------|
| Lite | `b3dae7877e5061fcd387c44185ca4de69765b4d2` | cumulative [39452215145](https://github.com/c2melendez/precision-lab-lite/actions/runs/39452215145), h1d [39452215277](https://github.com/c2melendez/precision-lab-lite/actions/runs/39452215277), scientific-ui [39452215142](https://github.com/c2melendez/precision-lab-lite/actions/runs/39452215142) |

Test-first sin cambios de producto: el motor ya devolvía una factorización equivalente al original en ambos repos. Evidencia: `tests/algebra229AsB12.audit.test.ts` (fila fuente, diferencia exacta cero y forma `x*(x-1)*(x+1)*(x^2+1)`) y `backend/tests/test_algebra229_as_b12.py` (`/api/v1/factor` por HTTP, producto de cuatro factores). Global OPEN.

**Siguiente único:** `ALGEBRA229-AS-B-13-TEST-FIRST` — `2x^{3}-x^{2}-13x-6` → `\left(x - 3\right) \left(x + 2\right) \left(2 x + 1\right)` (fila N3).

---

## 2026-10-20 UTC — AS-B-11 PASS_SCOPED bilateral (continuity r177)

**ALGEBRA229-AS-B-11** — factorizar `ax+ay+bx+by` → `\left(a + b\right) \left(x + y\right)` (fila fuente N2 en la matriz congelada Section B; agrupación de términos).

| Repo | Technical SHA | Gates (SUCCESS sobre el SHA exacto, evento push) |
|------|---------------|--------------------------------------------------|
| Lite | `4cc7a98fb6e4f73b42027d7a483d4b45a289336c` | cumulative [39450887559](https://github.com/c2melendez/precision-lab-lite/actions/runs/39450887559), h1d [39450887543](https://github.com/c2melendez/precision-lab-lite/actions/runs/39450887543), scientific-ui [39450887610](https://github.com/c2melendez/precision-lab-lite/actions/runs/39450887610) |

Test-first sin cambios de producto: el motor ya devolvía una factorización equivalente al original en ambos repos, con la forma de producto de dos binomios. Evidencia: `tests/algebra229AsB11.audit.test.ts` (fila fuente, diferencia exacta cero y forma `(a+b)*(x+y)`) y `backend/tests/test_algebra229_as_b11.py` (`/api/v1/factor` por HTTP, producto de dos factores). Entrada probada con `*` explícito para evitar ambigüedad de multiplicación implícita. Global OPEN.

**Siguiente único:** `ALGEBRA229-AS-B-12-TEST-FIRST` — `x^{5}-x` → `x \left(x - 1\right) \left(x + 1\right) \left(x^{2} + 1\right)` (fila N2).

---

## 2026-10-20 UTC — AS-B-10 PASS_SCOPED bilateral (continuity r176)

**ALGEBRA229-AS-B-10** — factorizar `x^{3}+3x^{2}+3x+1` → `\left(x + 1\right)^{3}` (fila fuente N2 en la matriz congelada Section B).

| Repo | Technical SHA | Gates (SUCCESS sobre el SHA exacto, evento push) |
|------|---------------|--------------------------------------------------|
| Lite | `c6db6a48f03283656668dafc8583aad78770223e` | cumulative [39449549075](https://github.com/c2melendez/precision-lab-lite/actions/runs/39449549075), h1d [39449549079](https://github.com/c2melendez/precision-lab-lite/actions/runs/39449549079), scientific-ui [39449549069](https://github.com/c2melendez/precision-lab-lite/actions/runs/39449549069) |

Test-first sin cambios de producto: el motor ya devolvía una factorización equivalente al original en ambos repos. Evidencia: `tests/algebra229AsB10.audit.test.ts` (fila fuente, diferencia exacta cero y forma de potencia) y `backend/tests/test_algebra229_as_b10.py` (`/api/v1/factor` por HTTP, potencia cúbica). Global OPEN.

**Siguiente único:** `ALGEBRA229-AS-B-11-TEST-FIRST` — `ax+ay+bx+by` → `\left(a + b\right) \left(x + y\right)` (fila N2, agrupación de términos).

---

## 2026-10-20 UTC — AS-B-09 PASS_SCOPED bilateral (continuity r175)

**ALGEBRA229-AS-B-09** — factorizar `6x^{2}+5x-4` → `\left(2 x - 1\right) \left(3 x + 4\right)` (fila fuente N2 en la matriz congelada Section B).

| Repo | Technical SHA | Gates (SUCCESS sobre el SHA exacto, evento push) |
|------|---------------|--------------------------------------------------|
| Lite | `af3ffa577b773d53141bd91422065190a6ff6246` | cumulative [39448188601](https://github.com/c2melendez/precision-lab-lite/actions/runs/39448188601), h1d [39448188469](https://github.com/c2melendez/precision-lab-lite/actions/runs/39448188469), scientific-ui [39448188431](https://github.com/c2melendez/precision-lab-lite/actions/runs/39448188431) |

Test-first sin cambios de producto: el motor ya devolvía una factorización equivalente al original en ambos repos. Evidencia: `tests/algebra229AsB09.audit.test.ts` (fila fuente y diferencia exacta cero) y `backend/tests/test_algebra229_as_b09.py` (`/api/v1/factor` por HTTP, dos factores). Global OPEN.

**Siguiente único:** `ALGEBRA229-AS-B-10-TEST-FIRST` — `x^{3}+3x^{2}+3x+1` → `\left(x + 1\right)^{3}` (fila N2).

---

## 2026-10-20 UTC — AS-B-08 PASS_SCOPED bilateral (continuity r174)

**ALGEBRA229-AS-B-08** — factorizar `x^{4}-5x^{2}+4` → `\left(x - 2\right) \left(x - 1\right) \left(x + 1\right) \left(x + 2\right)` (fila fuente N2 en la matriz congelada Section B).

| Repo | Technical SHA | Gates (SUCCESS sobre el SHA exacto, evento push) |
|------|---------------|--------------------------------------------------|
| Lite | `2becdde36276762df3018a9077e49a1df3ed5745` | cumulative [39443972473](https://github.com/c2melendez/precision-lab-lite/actions/runs/39443972473), scientific-ui [39443973517](https://github.com/c2melendez/precision-lab-lite/actions/runs/39443973517), h1d [39443971788](https://github.com/c2melendez/precision-lab-lite/actions/runs/39443971788) |

Test-first sin cambios de producto: el motor ya devolvía una factorización equivalente al original en ambos repos. Evidencia: `tests/algebra229AsB08.audit.test.ts` (fila fuente y diferencia exacta cero) y `backend/tests/test_algebra229_as_b08.py` (`/api/v1/factor` por HTTP, cuatro factores). Global OPEN.

**Siguiente único:** `ALGEBRA229-AS-B-09-TEST-FIRST` — `6x^{2}+5x-4` → `\left(2 x - 1\right) \left(3 x + 4\right)` (fila N2).

---

## 2026-10-20 UTC — AS-B-07 PASS_SCOPED bilateral (continuity r173)

**ALGEBRA229-AS-B-07** — factorizar `x^{6}-1` → `\left(x - 1\right) \left(x + 1\right) \left(x^{2} - x + 1\right) \left(x^{2} + x + 1\right)` (fila fuente N2 en la matriz congelada Section B).

| Repo | Technical SHA | Gates (todos SUCCESS sobre el SHA exacto, evento push) | Conclusion |
|------|---------------|--------------------------------------------------------|------------|
| Lite | `89b7055fdf65dd1f239fc426eb33ee66fa282cd6` | cumulative [39434995883](https://github.com/c2melendez/precision-lab-lite/actions/runs/39434995883), scientific-ui [39434995961](https://github.com/c2melendez/precision-lab-lite/actions/runs/39434995961), h1d [39434995969](https://github.com/c2melendez/precision-lab-lite/actions/runs/39434995969) | SUCCESS |
| Plus | `da361aee09728e0e0525e43615b6418b4ec9fb14` | cumulative [39433181526](https://github.com/c2melendez/precision-lab-plus/actions/runs/39433181526), h1d [39433181543](https://github.com/c2melendez/precision-lab-plus/actions/runs/39433181543) | SUCCESS |

**Incidente de producto en Lite (resuelto):** en `6bafda3` el gate acumulado falló porque Algebrite `factor(x^6-1)` devolvía `(x-1)(x+1)(x^2+x+1)(x^2+1)`, no equivalente al original (diferencia `x^5+x^4-x^2-x`). Corrección en `89b7055`: `factor(...)` ahora se verifica contra su entrada; si el resultado es un polinomio entero no equivalente, se usa una factorización univariada sobre ℤ (Kronecker, `src/engine/polynomialFactorZ.ts`) solo si su equivalencia se comprueba. Resultados con radicales o fracciones no se reemplazan (AS-FAC-09 real). Plus no tuvo incidente (SymPy).

**Cambios de pruebas en Lite:** `tests/algebra114AsLim.audit.test.ts` AS-LIM-05 pasaba de `it.fails` (GAP conocido) a `it`, porque el GAP quedó cerrado; la aserción no cambió. Nuevas pruebas `tests/polynomialFactorZ.test.ts` (9 casos: x^6-1, x^4-1, x^4+4, x^3+27, 2x^2-2, irreducible, entradas no polinómicas, radicales, entrada no factor).

**Observación de carga (preexistente):** AS-FAC-09 (`factor(x^4+1)`) excede el timeout de 5 s de Vitest en corridas paralelas (~4.8 s aislado); la línea base del HEAD anterior también lo falla en la misma corrida agrupada. No es causado por este cambio.

Evidencia AS-B-07: `tests/algebra229AsB07.audit.test.ts` (fila fuente y factorización con diferencia exacta cero) y `backend/tests/test_algebra229_as_b07.py` (`/api/v1/factor` por HTTP, cuatro factores). Verificado por conclusión de runs vía API.

**Siguiente único:** `ALGEBRA229-AS-B-08-TEST-FIRST` — x^{4}-5x^{2}+4 → \left(x - 2\right) \left(x - 1\right) \left(x + 1\right) \left(x + 2\right) (fila N2) según la matriz congelada Section B (`qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz`).

Bloqueos sin cambio: H2-SG28-DIST-01..08, SECURITY-S25, SY-P-23, SY-X-04-PLUS-HTTP. Global **OPEN**.

**Nota de proceso:** los filtros `paths` de push/PR de cumulative y H1d no excluyen `qa/certification/CONTINUITY_NEXT_ACTION.json`; en commits documentales actualizar solo `continuity.json` y `.md` (ese JSON es un espejo no vinculante, quedó en r160).

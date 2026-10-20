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

# Registro de ejecución — índice vigente

## 2026-10-20 UTC — Reconciliación cerrada (AS-A-01..05 + ledger AS-A-06)

Evidencia tabular: [EXECUTION_LOG_AS229_SECTION_A.md](./EXECUTION_LOG_AS229_SECTION_A.md).

| Caso | Lite cumulative | Plus cumulative |
|------|-----------------|-----------------|
| AS-A-01 | [39392408916](https://github.com/c2melendez/precision-lab-lite/actions/runs/39392408916) | [39392421243](https://github.com/c2melendez/precision-lab-plus/actions/runs/39392421243) |
| AS-A-02 | [39392889929](https://github.com/c2melendez/precision-lab-lite/actions/runs/39392889929) | [39392902252](https://github.com/c2melendez/precision-lab-plus/actions/runs/39392902252) |
| AS-A-03 | [39395561487](https://github.com/c2melendez/precision-lab-lite/actions/runs/39395561487) | [39395572574](https://github.com/c2melendez/precision-lab-plus/actions/runs/39395572574) |
| AS-A-04 | [39396680764](https://github.com/c2melendez/precision-lab-lite/actions/runs/39396680764) | [39396699584](https://github.com/c2melendez/precision-lab-plus/actions/runs/39396699584) |
| AS-A-05 | [39397703380](https://github.com/c2melendez/precision-lab-lite/actions/runs/39397703380) | [39397716265](https://github.com/c2melendez/precision-lab-plus/actions/runs/39397716265) |

**Ledger:** `continuity.json` r152 `next_action` = **AS-A-06**. Espejo: `CONTINUITY_NEXT_ACTION.json`.

**H1d:** fail Chromium [39400163336](https://github.com/c2melendez/precision-lab-lite/actions/runs/39400163336) **superseded** por SUCCESS [39402434939](https://github.com/c2melendez/precision-lab-lite/actions/runs/39402434939). Cumulative [39402434954](https://github.com/c2melendez/precision-lab-lite/actions/runs/39402434954) SUCCESS.

Global **OPEN**. **Siguiente:** AS-A-06 expand `(x+y+z)^2`.

---

## 2026-10-20 UTC — AS-A-10 PASS_SCOPED bilateral (continuity r157)

Commit técnico Lite `373702e` / Plus `a82daab` (test-first fila AS-A-10 `(x^2+x+1)^3`). Runs Cumulative Lite 39410230278, H1d 39410230284; Plus 39410227638, H1d 39410227610 — todos SUCCESS sobre el SHA exacto. Evidencia ampliada en `EXECUTION_LOG_AS229_SECTION_A.md`. Siguiente único: ALGEBRA229-AS-A-11-TEST-FIRST `(a+b+c)^3`.

---

## 2026-10-20 UTC — AS-A-12 PASS_SCOPED bilateral (continuity r160)

Commit técnico Lite `aacb5c3` (test-first AS-A-12 `(x^2-1)^2`, vitest 2 passed) / Plus `663c9f8` (pytest AS-A-12 HTTP 2 passed). Runs sobre el SHA exacto — Lite: cumulative 39414422310, scientific-ui 39414422330, h1d 39414422305; Plus: cumulative 39414425350, h1d 39414425369. Todos SUCCESS (push). Global OPEN. Siguiente: AS-A-13.

---

## 2026-10-20 UTC — AS-A-13 PASS_SCOPED bilateral (continuity r161)

Commit técnico Lite `3120dc5` (test-first AS-A-13 `(x+h)^3-x^3`, vitest 2 passed) / Plus `e27d0d0` (pytest AS-A-13 HTTP 2 passed). Runs sobre el SHA exacto — Lite: cumulative 39416212022, scientific-ui 39416211907, h1d 39416211887; Plus: cumulative 39416218253, h1d 39416218107. Todos SUCCESS (push). Global OPEN. Siguiente: AS-A-13.

---

## 2026-10-20 UTC — AS-A-14 PASS_SCOPED bilateral (continuity r162)

Commit técnico Lite `655ab02` (test-first AS-A-14, vitest 2 passed) / Plus `45435c0` (pytest AS-A-14 HTTP 2 passed). Runs sobre el SHA exacto — Lite: cumulative 39418368131, scientific-ui 39418368033, h1d 39418368058; Plus: cumulative 39418372218, h1d 39418372114. Todos SUCCESS (push). Global OPEN. Siguiente: AS-A-15.

---

## 2026-10-20 UTC — AS-A-15 PASS_SCOPED bilateral (continuity r163)

Commit técnico Lite `7be68cb` (test-first AS-A-15 `(x+1/x)^3`) / Plus `dbf6cf6` (pytest AS-A-15 HTTP). Runs sobre el SHA exacto — Lite: cumulative 39419446051, scientific-ui 39419445961, h1d 39419445944; Plus: cumulative 39419450009, h1d 39419449888. Todos SUCCESS (push). Global OPEN. Siguiente: AS-A-16.

---

## 2026-10-20 UTC — AS-A-16 PASS_SCOPED bilateral (continuity r164)

Commit técnico Lite `a08db76` (test-first AS-A-16 `(1+i)^4`) / Plus `c26e2cf` (pytest AS-A-16 HTTP). Runs sobre el SHA exacto — Lite: cumulative 39420901531, scientific-ui 39420901831, h1d 39420901417; Plus: cumulative 39420913944, h1d 39420913777. Todos SUCCESS (push). Global OPEN. Siguiente: AS-A-17.

---

## 2026-10-20 UTC — AS-A-17 PASS_SCOPED bilateral; sección A completa (continuity r165)

Commit técnico Lite `72bf8e0` (test-first AS-A-17 `(2x-y)^5`) / Plus `795afd0` (pytest AS-A-17 HTTP). Runs sobre el SHA exacto — Lite: cumulative 39422323741, scientific-ui 39422323909, h1d 39422323671; Plus: cumulative 39422333606, h1d 39422333812. Todos SUCCESS (push). Sección A completa (AS-A-01..17). Global OPEN. Siguiente: AS-B-01 (factorizar).

---

## 2026-10-20 UTC — AS-B-01 PASS_SCOPED bilateral (continuity r166)

Commit técnico Lite `aaf9e7d` (test-first AS-B-01 `factor x^2-5x+6`) / Plus `186699a` (pytest AS-B-01 HTTP). Runs sobre el SHA exacto — Lite: cumulative 39423612063, scientific-ui 39423612133, h1d 39423612136; Plus: cumulative 39423621287, h1d 39423621325. Todos SUCCESS (push). Global OPEN. Siguiente: AS-B-02.

---

## 2026-10-20 UTC — AS-B-02 PASS_SCOPED bilateral (continuity r167)

Commit técnico Lite `20f228e` (test-first AS-B-02 `factor x^2-9`) / Plus `300d73f` (pytest AS-B-02 HTTP). Runs sobre el SHA exacto — Lite: cumulative 39424822522, scientific-ui 39424822635, h1d 39424822528; Plus: cumulative 39424832850, h1d 39424833210. Todos SUCCESS (push). Global OPEN. Siguiente: AS-B-03.

---

## 2026-10-20 UTC — AS-B-03 PASS_SCOPED bilateral (continuity r168)

Commit técnico Lite `5be7b01` (test-first AS-B-03 `factor x^3-8`) / Plus `ab3ead0` (pytest AS-B-03 HTTP). Runs sobre el SHA exacto — Lite: cumulative 39425818360, scientific-ui 39425818757, h1d 39425818572; Plus: cumulative 39425828486, h1d 39425828468. Todos SUCCESS (push). Global OPEN. Siguiente: AS-B-04.

---

## 2026-10-20 UTC — AS-B-04 PASS_SCOPED bilateral (continuity r169)

Commit técnico Lite `56ec7ea` (test-first AS-B-04 `factor x^3+27`) / Plus `82cc071` (pytest AS-B-04 HTTP). Runs sobre el SHA exacto — Lite: cumulative 39426977672, scientific-ui 39426977392, h1d 39426977717; Plus: cumulative 39426990236, h1d 39426990101. Todos SUCCESS (push). Global OPEN. Siguiente: AS-B-05.

---

## 2026-10-20 UTC — AS-B-05 PASS_SCOPED bilateral (continuity r170)

Commit técnico Lite `72b00bd` (test-first AS-B-05 `factor x^4-1`) / Plus `21672c6` (pytest AS-B-05 HTTP). Runs sobre el SHA exacto — Lite: cumulative 39428243384, scientific-ui 39428243353, h1d 39428243346; Plus: cumulative 39428253897, h1d 39428253880. Todos SUCCESS (push). Global OPEN. Siguiente: AS-B-06.

---

## 2026-10-20 UTC — AS-B-06 PASS_SCOPED bilateral (continuity r171)

Commit técnico Lite `8339acf` (test-first AS-B-06 `factor x^4+4`) / Plus `63dec80` (pytest AS-B-06 HTTP + corrección de temporización SG28 tras fallo de `2cf4209`, ver CURRENT_STATE). Runs sobre el SHA exacto — Lite: cumulative 39429477924, scientific-ui 39429477795, h1d 39429477800; Plus: cumulative 39431271219, SG28 backend isolation 39431271237, h1d 39431271249. Runs rojos previos en Plus: 39429492475 (cumulative, SG28 timing) y 39430648591/39430648632 (cumulative/SG28, `ValueError` del tope de 10 s en `f9d4fce`); Todos los SUCCESS citados son push. Global OPEN. Siguiente: AS-B-07.

---

## 2026-10-20 UTC — AS-B-07: Plus PASS, Lite FAIL_PRODUCT (continuity r172)

Commit técnico Lite `6bafda3` (test-first AS-B-07 `factor x^6-1`) / Plus `da361ae` (pytest AS-B-07 HTTP). Lite: cumulative 39433167930 **failure** (producto: Algebrite `factor(x^6-1)` incorrecto), scientific-ui 39433167821 success, h1d 39433168379 success. Plus: cumulative 39433181526 success, h1d 39433181543 success. Global OPEN. Siguiente: decisión sobre corrección de factorización verificada en Lite (ALGEBRA229-AS-B-07-LITE-FACTOR).

---

## 2026-10-20 UTC — AS-B-07 PASS_SCOPED bilateral (continuity r173)

Lite: test-first `6bafda3` (acumulativo 39433167930 **failure**: Algebrite `factor(x^6-1)` incorrecto), corrección `89b7055` (factor verificado + respaldo univariado; cumulative 39434995883, scientific-ui 39434995961, h1d 39434995969 SUCCESS). Plus: test-first `da361ae` (cumulative 39433181526, h1d 39433181543 SUCCESS). AS-LIM-05 pasa de GAP (`it.fails`) a `it`. Global OPEN. Siguiente: AS-B-08.

---

## 2026-10-20 UTC — AS-B-08 PASS_SCOPED bilateral (continuity r174)

Commit técnico Lite `2becdde` (test-first AS-B-08 `factor x^4-5x^2+4`, sin cambios de producto). Runs sobre el SHA exacto: cumulative [39443972473](https://github.com/c2melendez/precision-lab-lite/actions/runs/39443972473), scientific-ui [39443973517](https://github.com/c2melendez/precision-lab-lite/actions/runs/39443973517), h1d [39443971788](https://github.com/c2melendez/precision-lab-lite/actions/runs/39443971788). Todos SUCCESS (push). Global OPEN. Siguiente: AS-B-09.

---

## 2026-10-20 UTC — AS-B-09 PASS_SCOPED bilateral (continuity r175)

Commit técnico Lite `af3ffa5` (test-first AS-B-09 `factor 6x^2+5x-4`, sin cambios de producto). Runs sobre el SHA exacto: cumulative [39448188601](https://github.com/c2melendez/precision-lab-lite/actions/runs/39448188601), h1d [39448188469](https://github.com/c2melendez/precision-lab-lite/actions/runs/39448188469), scientific-ui [39448188431](https://github.com/c2melendez/precision-lab-lite/actions/runs/39448188431). Todos SUCCESS (push). Global OPEN. Siguiente: AS-B-10.

---

## 2026-10-20 UTC — AS-B-10 PASS_SCOPED bilateral (continuity r176)

Commit técnico Lite `c6db6a4` (test-first AS-B-10 `factor x^3+3x^2+3x+1`, sin cambios de producto). Runs sobre el SHA exacto: cumulative [39449549075](https://github.com/c2melendez/precision-lab-lite/actions/runs/39449549075), h1d [39449549079](https://github.com/c2melendez/precision-lab-lite/actions/runs/39449549079), scientific-ui [39449549069](https://github.com/c2melendez/precision-lab-lite/actions/runs/39449549069). Todos SUCCESS (push). Global OPEN. Siguiente: AS-B-11.

---

## 2026-10-20 UTC — AS-B-11 PASS_SCOPED bilateral (continuity r177)

Commit técnico Lite `4cc7a98` (test-first AS-B-11 `factor ax+ay+bx+by`, sin cambios de producto). Runs sobre el SHA exacto: cumulative [39450887559](https://github.com/c2melendez/precision-lab-lite/actions/runs/39450887559), h1d [39450887543](https://github.com/c2melendez/precision-lab-lite/actions/runs/39450887543), scientific-ui [39450887610](https://github.com/c2melendez/precision-lab-lite/actions/runs/39450887610). Todos SUCCESS (push). Global OPEN. Siguiente: AS-B-12.

---

## 2026-10-20 UTC — AS-B-12 PASS_SCOPED bilateral (continuity r178)

Commit técnico Lite `b3dae78` (test-first AS-B-12 `factor x^5-x`, sin cambios de producto). Runs sobre el SHA exacto: cumulative [39452215145](https://github.com/c2melendez/precision-lab-lite/actions/runs/39452215145), h1d [39452215277](https://github.com/c2melendez/precision-lab-lite/actions/runs/39452215277), scientific-ui [39452215142](https://github.com/c2melendez/precision-lab-lite/actions/runs/39452215142). Todos SUCCESS (push). Global OPEN. Siguiente: AS-B-13.

---

## 2026-10-20 UTC — AS-B-13 PASS_SCOPED bilateral (continuity r179)

Commit técnico Lite `b344fb9` (test-first AS-B-13 `factor 2x^3-x^2-13x-6`, sin cambios de producto). Runs sobre el SHA exacto: cumulative [39453853229](https://github.com/c2melendez/precision-lab-lite/actions/runs/39453853229), h1d [39453853159](https://github.com/c2melendez/precision-lab-lite/actions/runs/39453853159), scientific-ui [39453853301](https://github.com/c2melendez/precision-lab-lite/actions/runs/39453853301). Todos SUCCESS (push). Global OPEN. Siguiente: AS-B-14.

---

## 2026-10-20 UTC — AS-B-14 PASS_SCOPED bilateral (continuity r180)

Commit técnico Lite `63e72af` (test-first AS-B-14 `factor x^4+x^2+1`, sin cambios de producto). Runs sobre el SHA exacto: cumulative [39455229746](https://github.com/c2melendez/precision-lab-lite/actions/runs/39455229746), h1d [39455229733](https://github.com/c2melendez/precision-lab-lite/actions/runs/39455229733), scientific-ui [39455229732](https://github.com/c2melendez/precision-lab-lite/actions/runs/39455229732). Todos SUCCESS (push). Global OPEN. Siguiente: AS-B-15.

---

## 2026-10-20 UTC — AS-B-15 PASS_SCOPED bilateral (continuity r181)

Commit técnico Lite `1d55948` (test-first AS-B-15 `factor x^3-x^2-x+1`, sin cambios de producto). Runs sobre el SHA exacto: cumulative [39456655537](https://github.com/c2melendez/precision-lab-lite/actions/runs/39456655537), h1d [39456655582](https://github.com/c2melendez/precision-lab-lite/actions/runs/39456655582), scientific-ui [39456655551](https://github.com/c2melendez/precision-lab-lite/actions/runs/39456655551). Todos SUCCESS (push). Global OPEN. Siguiente: AS-B-16.

---

## 2026-10-20 UTC — AS-B-16 PASS_SCOPED bilateral (continuity r182)

Commit técnico Lite `4c82294` (test-first AS-B-16 `factor a^3-b^3`). Cambio de producto en Lite. Runs sobre el SHA exacto: cumulative [39459168172](https://github.com/c2melendez/precision-lab-lite/actions/runs/39459168172), h1d [39459168011](https://github.com/c2melendez/precision-lab-lite/actions/runs/39459168011), scientific-ui [39459168124](https://github.com/c2melendez/precision-lab-lite/actions/runs/39459168124). Todos SUCCESS (push). Global OPEN. Siguiente: AS-B-17.

---

## 2026-10-20 UTC — AS-B-17 PASS_SCOPED bilateral (continuity r183)

Commit técnico Lite `672360f` (test-first AS-B-17 `factor a^3+b^3`, sin cambios de producto). Runs sobre el SHA exacto: cumulative [39461130911](https://github.com/c2melendez/precision-lab-lite/actions/runs/39461130911), h1d [39461130713](https://github.com/c2melendez/precision-lab-lite/actions/runs/39461130713), scientific-ui [39461131049](https://github.com/c2melendez/precision-lab-lite/actions/runs/39461131049). Todos SUCCESS (push). Decisión de alcance: B-24 y B-25 incluidas con sufijo «sobre ℝ» / «sobre ℂ»; implementación en orden de matriz. Global OPEN. Siguiente: AS-B-18.

---

## 2026-10-20 UTC — AS-B-18 PASS_SCOPED bilateral (continuity r184)

Commit técnico Lite `ea5a76d` (test-first AS-B-18 `factor x^8-1`, sin cambios de producto). Runs sobre el SHA exacto: cumulative [39462375918](https://github.com/c2melendez/precision-lab-lite/actions/runs/39462375918), h1d [39462375646](https://github.com/c2melendez/precision-lab-lite/actions/runs/39462375646), scientific-ui [39462375444](https://github.com/c2melendez/precision-lab-lite/actions/runs/39462375444). Todos SUCCESS (push). Global OPEN. Siguiente: AS-B-19.

---

## Histórico AS-PAR / Syntax

Blob previo Lite `245c517bee89f76b1fd2622eaf68b2524aa6319c` / commit `2f380654…`.

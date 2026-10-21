> Decisiones de alcance, de producto y de proceso: ver `qa/certification/ALGEBRA229_DECISIONS.md`.

## 2026-10-21 UTC — Trigonometría EV-D-01 PASS_SCOPED bilateral (continuity r204)

**EV-D-01** — `\\sin(\\pi/6) → 1/2` (fila oficial de `ejercicios_trigonometria.md.gz`).

Evidencia (test-first, sin cambio de producto):
- **Lite** SHA `13bdc7c`: cumulative [39545169322](https://github.com/c2melendez/precision-lab-lite/actions/runs/39545169322), h1d [39545169419](https://github.com/c2melendez/precision-lab-lite/actions/runs/39545169419), scientific-ui [39545169496](https://github.com/c2melendez/precision-lab-lite/actions/runs/39545169496) SUCCESS. Canales: ASCII `sin(pi/6)` y LaTeX oficial vía `parseExpression` + Algebrite.
- **Plus** SHA técnico `4e625d1` (scope HTTP ASCII tras fallar LaTeX crudo): cumulative [39545579931](https://github.com/c2melendez/precision-lab-plus/actions/runs/39545579931), h1d [39545579919](https://github.com/c2melendez/precision-lab-plus/actions/runs/39545579919) SUCCESS. Canal HTTP: solo `sin(pi/6)`; LaTeX raw no es ruta de producto en `/evaluate`.

Alcance: evaluación exacta de sen(π/6)=1/2. No cierra el módulo trig completo ni MathLive UI integral Plus. Global OPEN. Siguiente: EV-D-02.

---

> Nota: AS-B-28 PASS_SCOPED permanece en r203; AS-B-29 ON_HOLD. `continuity.json` r204 es la fuente de next_action.

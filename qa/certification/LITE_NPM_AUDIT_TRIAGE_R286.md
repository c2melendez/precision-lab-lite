# Lite — triage del hard gate npm audit (r286)

**Fecha:** 2026-10-24 UTC  
**Repositorio/rama:** `c2melendez/precision-lab-lite` / `qa/syntax-audit-in625-a1`  
**SHA auditado:** `14153e8bfd4f8557c24c7d195915b0a0907baa00`  
**Run:** [CI 40072711615](https://github.com/c2melendez/precision-lab-lite/actions/runs/40072711615)  
**Artefacto:** [lite-npm-audit, ID 12552200925](https://github.com/c2melendez/precision-lab-lite/actions/runs/40072711615/artifacts/12552200925)  
**Decisión:** `BLOCKED`; no rebajar el hard gate.

## Hallazgos confirmados en npm-audit.json

| Paquete instalado | Versión del lock | Severidad reportada | Causa / alcance | Ruta segura de análisis |
|---|---:|---|---|---|
| `vitest` y `@vitest/mocker` | 5.0.1 | Moderate | GHSA-qxg6-89mg-rqv8 y GHSA-xp26-3454-mjgp; el rango vulnerable termina antes de 5.0.3. | Actualizar a una versión corregida compatible de Vitest 5 y regenerar lock; ejecutar unitarias y typecheck. |
| `fast-uri` | 3.1.8 | Moderate + Low | Cuatro advisories, rangos vulnerables hasta 3.1.8. | Actualización compatible a >=3.1.9 mediante resolución normal o override estrecho; identificar primero el consumidor en el lock. |
| `katex` | 0.16.47 | Low | GHSA-238p-pmpm-9mq7; npm informa fix disponible en 0.19.1, marcado major respecto a la versión actual. | Evaluar primero una versión corregida compatible y validar renderizado matemático visual; no subir major automáticamente. |
| `postcss-selector-parser` | 6.1.4 | Moderate | GHSA-rj75-hqrm-r3gf; vulnerable por debajo de 7.1.6; afecta a `postcss-nested` y `tailwindcss`. | La resolución sugerida por npm implica Tailwind CSS 4.3.3 (major). No forzar parser 7 dentro de Tailwind 3 sin compatibilidad demostrada; planificar migración separada o alternativa mantenida. |
| `postcss-nested` | 6.2.0 | Moderate | Hereda el riesgo de `postcss-selector-parser`. | Tratar junto con la decisión Tailwind/parser, no como actualización aislada. |
| `tailwindcss` | 3.4.19 | Moderate | Su árbol incluye el parser vulnerable; npm ofrece Tailwind 4.3.3 como fix, con cambio major. | No migrar a Tailwind 4 en el mismo cambio de seguridad sin revisar configuración, plugins y CSS generado. |
| `serialize-javascript` | 7.1.0 | Low | GHSA-m5mm-p8h7-m29v; rango vulnerable <7.1.3. | Actualizar el paquete transitivo a versión corregida si el consumidor permite esa resolución y regenerar lock. |

El informe agregado declara **8 vulnerabilidades: 2 low, 6 moderate, 0 high y 0 critical**. El aviso de `glob@11.1.0` en la instalación aparece como warning de deprecación/seguridad, pero no se cuenta aquí como una vulnerabilidad adicional fuera del JSON del audit.

## Plan de remediación, por riesgo

1. **Cambios acotados primero:** actualizar Vitest/`@vitest/mocker`, `fast-uri` y `serialize-javascript` a versiones corregidas compatibles, mediante resolución de dependencias/overrides solo si el árbol lo permite. No editar versiones del lock a mano sin integridad reproducible.
2. **KaTeX:** revisar la versión corregida disponible, comparar salida visual y ejecutar pruebas de renderizado antes de aceptar el bump.
3. **Tailwind/parser:** es la decisión de mayor impacto. No forzar un override de `postcss-selector-parser` 7 en Tailwind 3 ni ejecutar una migración mayor sin prueba. Documentar la alternativa compatible con soporte vigente, o planificar migración Tailwind 4 en un cambio aislado con validación visual.
4. Regenerar `package-lock.json` usando npm, ejecutar `npm ci`, `npm audit --package-lock-only`, typecheck, unitarias, build y E2E pertinentes.
5. Solo tras un cambio real del lock/dependencias, repetir CI. Mantener el hard gate tal como está hasta que el audit quede limpio o exista una excepción formal aprobada por el protocolo.

## No duplicar trabajo

No repetir los gates que ya pasaron en el SHA auditado: H1c 40072711602, Playwright 40072711609, cumulative 40072711574, Algebra 229 integrity 40072711589 y los demás diagnósticos verdes anotados en `CURRENT_STATE.md`. El S19 de Plus usó Lite SHA `6cbec7645b73ad18875d4472182c704eb35228b0`, por lo que no certifica diferencialmente el SHA `14153e8`.

**Estado de certificación:** global `OPEN`; CI de Lite `BLOCKED`; PR #48 no se fusiona mientras el hard gate permanezca rojo.

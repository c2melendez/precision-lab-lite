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
| `katex` | 0.16.47 | Low | GHSA-238p-pmpm-9mq7; el advisory oficial fija la corrección mínima en 0.18.2; como el rango actual `^0.16.11` no la admite, actualizar la dependencia directa y validar visualmente antes de aceptar. | Evaluar primero una versión corregida compatible y validar renderizado matemático visual; no subir major automáticamente. |
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


## Confirmación del árbol de dependencias (lockfile r286)

Inspección de `package-lock.json` (lockfile v3, blob SHA `fc0be1058f039f6127c081e8ad01dadc06773b98`):

- `vitest@5.0.1` depende directamente de `@vitest/mocker@5.0.1`; ambos deben actualizarse coordinadamente a una versión corregida compatible, sin mezclar versiones Vitest.
- `fast-uri@3.1.8` es dependencia directa de `ajv@8.20.0` mediante el rango `^3.0.1`. El rango permite una versión corregida 3.x; primero se debe comprobar que el resolvedor pueda llevarla a >=3.1.9 sin override innecesario.
- `serialize-javascript@7.1.0` llega a través de `@rollup/plugin-terser@1.0.0` (rango `^7.0.3`), por lo que hay que confirmar compatibilidad de la versión resuelta antes de forzar una actualización transitiva.
- `tailwindcss@3.4.19` depende directamente de `postcss-selector-parser` con rango `^6.1.2` y de `postcss-nested@6.2.0`; este último también depende de parser `^6.1.1`. Un override a parser 7 no satisface estos rangos y no es una remediación segura.
- `katex@0.16.47` es dependencia directa del producto; cualquier actualización debe validar renderizado, fórmulas de Algebra 229 y E2E visual pertinente.

Esta inspección confirma que el primer lote de menor riesgo es Vitest/mocker y los dos transitivos `fast-uri` y `serialize-javascript`, pero **no prueba aún** que la remediación esté aplicada ni que el audit haya quedado limpio. El entorno de trabajo actual no tiene checkout local del repositorio para regenerar el lock con npm; por tanto no se cambia `package-lock.json` ni se dispara CI en este paso. El siguiente paso de implementación requiere un entorno de trabajo con npm y el repositorio, o una ejecución controlada de workflow diseñada explícitamente para generar y validar el lock; no crear un workflow improvisado ni modificar el lock manualmente.


## Verificación de versiones corregidas en advisories oficiales (2026-10-24)

La revisión de los avisos oficiales concreta estas versiones mínimas para preparar la propuesta; **no implica que se hayan instalado ni validado en el repositorio**:

- Vitest y `@vitest/mocker`: **5.0.3** corrige los advisories GHSA-qxg6-89mg-rqv8 y GHSA-xp26-3454-mjgp. Actualizarlos coordinadamente, evitando mezcla de versiones. [Advisory Vitest](https://github.com/vitest-dev/vitest/security/advisories/GHSA-qxg6-89mg-rqv8)
- `fast-uri`: **3.1.9** corrige también GHSA-w74x-v6f9-j3xg (publicado 19-oct-2026); 3.1.8 no basta para el audit actual. El rango de `ajv` `^3.0.1` permite 3.1.9, por lo que probar primero la resolución normal sin override. [Advisory GHSA-w74x-v6f9-j3xg](https://github.com/advisories/GHSA-w74x-v6f9-j3xg)
- `serialize-javascript`: **7.1.3** corrige GHSA-m5mm-p8h7-m29v. [Advisory oficial](https://github.com/yahoo/serialize-javascript/security/advisories/GHSA-m5mm-p8h7-m29v)
- `katex`: la versión mínima corregida del advisory GHSA-238p-pmpm-9mq7 es **0.18.2**, no hace falta asumir 0.19.1 como mínimo. El rango actual `^0.16.11` debe cambiar para aceptar 0.18.2 y se requiere regresión visual del renderizador. [Advisory oficial](https://github.com/KaTeX/KaTeX/security/advisories/GHSA-238p-pmpm-9mq7)
- `postcss-selector-parser`: el fix publicado es **7.1.6**, pero el árbol actual Tailwind 3.4.19 / postcss-nested 6.2.0 declara rangos 6.x. No forzar 7.1.6 por override. Revisar si el upstream publica un backport 6.x; en caso contrario, aislar la migración de Tailwind como decisión de mayor impacto. [Advisory oficial](https://github.com/advisories/GHSA-rj75-hqrm-r3gf)

**Lote candidato de menor riesgo para una rama de remediación:** Vitest + mocker 5.0.3, fast-uri 3.1.9 y serialize-javascript 7.1.3, con lock generado por npm. KaTeX 0.18.2 requiere cambio directo y prueba visual. El hard gate no se debe repetir hasta que los cambios de dependencias estén aplicados y las verificaciones locales resulten satisfactorias.

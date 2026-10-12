# Syntax309 SY-P-23 — Convención explícita y estado de certificación

**Entrada oficial:** `a/bc`. **Estado:** ABIERTO / convención no declarada en interfaz (no certificar como PASS).

## Lecturas matemáticas distintas

Para `a=12`, `b=3`, `c=2`:

- `(a/b)*c` = **8**, multiplicación después de dividir.
- `a/(b*c)` = **2**, producto entero en el denominador.

Las dos lecturas explícitas cuentan con pruebas numéricas independientes en Lite y Plus y gates verdes. Esas pruebas **no** demuestran que la cadena ambigua `a/bc` tenga una interpretación universal.

## Identificadores compuestos

Plus admite nombres de variables de varias letras (como `bc`). Por tanto, `a/bc` también puede representar división entre `a` y la variable `bc` (por ejemplo, `a=12, bc=6` produce **2**). No es equivalente a imponer automáticamente `b*c` cuando hay una variable llamada `bc`. La prueba de lectura como variables independientes `a,b,c` permanece marcada como **XFAIL estricto** en Plus: no contabilizarla como PASS.

## Convención operativa segura durante la certificación

Para comunicar una interpretación matemática inequívoca, solicitar paréntesis y multiplicaciones explícitas: escribir `(a/b)*c` o `a/(b*c)`; cuando `bc` sea una sola variable, usar `a/bc` exclusivamente si se conoce que `bc` está definida como identificador compuesto. La UI aún no demuestra una advertencia visual ni una selección de lectura. **Estas recomendaciones documentales no equivalen a una funcionalidad implementada.**

## Evidencia

- Lite SHA `23bc858a9234322b46ec58f1042d06d97c406d22`: acumulativo [38185608993](https://github.com/c2melendez/precision-lab-lite/actions/runs/38185608993), H1d [38185608896](https://github.com/c2melendez/precision-lab-lite/actions/runs/38185608896), build [38185608895](https://github.com/c2melendez/precision-lab-lite/actions/runs/38185608895): SUCCESS.
- Plus SHA `cc946386adedc80048e647bc6be16f1c66df7afc`: acumulativo [38185857142](https://github.com/c2melendez/precision-lab-plus/actions/runs/38185857142), H1d [38185857134](https://github.com/c2melendez/precision-lab-plus/actions/runs/38185857134): SUCCESS.

## Criterios de salida

1. Decidir una convención explícita compatible con el soporte de identificadores compuestos de cada motor.
2. Mostrar al usuario la interpretación efectiva o una advertencia para entradas ambiguas en ambos frontends.
3. Probar el canal entrada → parser → eco/resultado con casos numéricos discriminantes en Lite y Plus.
4. Validar gates acumulativos verdes y registrar evidencia por ID. Hasta entonces **SY-P-23 permanece OPEN**.

## 2026-10-11 — Primera advertencia visible (implementación, CI pendiente)
- Frontend Científica muestra mensaje accesible `role="status"` si la entrada es `a/bc` o su representación MathLive `\\frac{a}{bc}`.
- Advierte sobre las dos agrupaciones explícitas `(a/b)*c` y `a/(b*c)`, y protege el caso de variable compuesta `bc`. No reescribe la expresión ni cambia el motor.
- Plus commit técnico `e03fd1871fab60db3a31ff4126e730df4b0e6071`, ruta `frontend/src/components/BasicMode.tsx`, gate acumulativo iniciado `38186538399`.
- Lite commit técnico `0b07e42c17730a7ca8e44d3e92c6f76abd0e28b7`, ruta `src/modes/BasicScientific/BasicScientificMode.tsx`, gate acumulativo iniciado `38186542231`.
- Los gates posteriores no estaban terminados en la observación. PENDIENTE: confirmar final y añadir prueba E2E del aviso con edición MathLive, además de verificar expresiones agrupadas sin advertencia falsa. No cerrar SY-P-23 ni convertir XFAIL en PASS.

## Actualización de estado y evidencias (2026-10-11)

**Estado vigente: OPEN — convención global no resuelta.** La frase anterior “la UI aún no demuestra una advertencia visual” se refiere al estado histórico previo a la implementación, no al presente. **La advertencia accesible ya existe** y las pruebas E2E de Lite y Plus cubren aparición para `a/bc`, no reescritura de entrada y ausencia ante agrupaciones explícitas. La UI no ofrece actualmente una selección universal de interpretación.

**Cobertura matemática y UI validada:** con a=9,b=3,c=2.5, los casos agrupados producen 7.5 = 15/2 y 1.2 = 6/5, incluso con paréntesis redundantes. Lite: H1d [38207655199](https://github.com/c2melendez/precision-lab-lite/actions/runs/38207655199), cumulative [38207655164](https://github.com/c2melendez/precision-lab-lite/actions/runs/38207655164), build [38207655170](https://github.com/c2melendez/precision-lab-lite/actions/runs/38207655170), éxito. Plus: H1d [38207857573](https://github.com/c2melendez/precision-lab-plus/actions/runs/38207857573), cumulative [38207857516](https://github.com/c2melendez/precision-lab-plus/actions/runs/38207857516), éxito. Plus preserva `bc` definida independientemente del producto explícito `b*c`.

**Bloqueo real restante:** adoptar y demostrar una convención compatible con cada motor para `a/bc` sin desambiguación explícita o una interfaz que fuerce resolución de ambigüedad antes de evaluar. El caso backend de Plus con variables individuales `b` y `c` permanece **XFAIL estricto**. Los resultados de expresiones explícitas no convierten el caso ambiguo en PASS ni certifican paridad funcional de sustituciones entre motores. SG28 multihost permanece pendiente de evidencia externa.


## 2026-10-11 — SY-P-23: bloqueo de ambigüedad no resuelta en UI Plus
- Implementación Plus: `frontend/src/components/BasicMode.tsx` SHA 941ae5a62011b0467f157d270f0bd61c5e3fa539. Si se introduce exactamente `a/bc` o `\\frac{a}{bc}` SIN sustitución no vacía `bc`, la UI exige definir bc o agrupar `(a/b)*c` / `a/(b*c)` antes de enviar al endpoint. Con bc definida, conserva el flujo existente de variable compuesta. No cambia backend, ni corrige XFAIL de variables separadas.
- Nueva prueba UI E2E Plus `frontend/e2e/in625-h1d-reentry.spec.ts` SHA 121914ba4320fa7bf4924f576e392fb4a10ddd9d comprueba ambas formas ambiguas, error accesible y que no salga solicitud POST `/evaluate`. Pendiente CI de los últimos cambios, NO PASS todavía.
- Alcance acotado: bloqueo solo para entrada completa exacta; no declarar un detector general de ambigüedad en toda expresión. Lite conserva advertencia y su convención parser; no imponer identificadores compuestos en Lite. SY-P-23 OPEN hasta validación CI + aceptación de la convención y extensión general; SG28 multihost BLOCKED.


## 2026-10-12 — Revisión contractual de SY-P-23 tras validación de 38247671320 / 38247671293
- Se verificó en GitHub que Plus H1d `38247671320` y cumulative `38247671293` finalizaron SUCCESS sobre SHA técnico `fd55b41a7a15e60f60ded48a6d3311bea7497306`.
- La fuente oficial en ambos repositorios `qa/certification/syntax309_sy_p_cases.jsonl` establece para SY-P-23 (N2, `convencion`, `a/bc`) dos lecturas admitidas por convención declarada; NO prescribe universalmente una. Se comprobó la existencia de `qa/certification/SY_P_23_CONVENTION.md` en ambos proyectos; conservar ese contrato, no crear duplicados.
- Evidencia de implementaciones divergentes: Lite `tests/syntax309SyPConventionNumeric.audit.test.ts` demuestra tokens `a / b c` y equivalencia estructural con `a/b*c`; Plus `backend/tests/test_syntax309_syp_interpretation.py` conserva `bc` nombrada, y la lectura alternativa separada continúa `xfail(strict=True)`. Plus UI requiere bc definida o agrupación explícita en entradas exactas reconocidas. No son dos certificaciones de semántica universal iguales.
- Decisión: mantener SY-P-23 OPEN para paridad de convención y casos compuestos generales; SG28 multihost BLOCKED. No modificar parseadores ni transformar XFAIL en PASS sin autorización contractual y evidencia matemática. Próximo paso ejecutable: añadir cobertura de paridad centrada en salida/aviso y en las entradas con valores discriminantes para las convenciones reales; verificar Syntax309 y cumulative por motor antes del cierre.

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

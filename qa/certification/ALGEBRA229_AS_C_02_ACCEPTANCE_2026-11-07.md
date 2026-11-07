# Algebra229 AS-C-02 - aceptación bilateral

**Resultado: PASS bilateral.** Certificación global continúa **OPEN**.

## Contrato
- AS-C-02, N2, `simplificar`: `\frac{x^{3}-1}{x^{2}-1}` → `\frac{x^{2} + x + 1}{x + 1}`, sin nota de dominio en la fila congelada.

## Historial de este bloque
- Test-first inicial: Lite con 4/5 pasando (falla equivalencia simbólica); Plus con 3/4 (el endpoint devolvía la entrada sin cancelar).
- Corrección: Plus usa `cancel` sobre el resultado de `simplify` cuando no aumenta la complejidad; Lite acepta `simplify(expand(...))` solo si da `0` o no tiene denominador.
- Oráculo de Plus: normalización de notación `**` → `^`; expectativa matemática intacta.

## Evidencia Lite — SHA `c9fe409310f287d25f231c07dfdf68fdb055ec1a`
- Cumulative 42335763410 SUCCESS; focal AS-C-02 5/5; 2,281 passed.
- CI 42335763323, H1d 42335763455, Scientific UI 42335763346, Runner 42335763341: SUCCESS.

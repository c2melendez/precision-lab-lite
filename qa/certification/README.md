# Precision Lab — Punto de entrada permanente de certificación

Este archivo vive en la rama predeterminada (`main`) y **solo sirve para localizar** la documentación canónica del sistema de certificación. No es el estado de ejecución ni un handoff.

## Rama canónica activa
`qa/syntax-audit-in625-a1`

## Directorio canónico
`qa/certification/`

## Repositorios coordinados
- Lite: `c2melendez/precision-lab-lite`
- Plus: `c2melendez/precision-lab-plus`

## Protocolo de resolución
1. Lee este archivo en la rama predeterminada de ambos repositorios.
2. Confirma que ambos indican la misma rama canónica; si difieren, **no elijas una arbitrariamente**: revisa historial y evidencia antes de modificar.
3. Lee el `qa/certification/README.md` de esa rama canónica y luego sus `CURRENT_STATE.md`, `EXECUTION_PROTOCOL.md`, `MANUAL_CAPABILITY_GAPS.md` y `EXECUTION_LOG.md`.
4. Verifica HEAD reales y GitHub Actions para evitar estados obsoletos.
5. Al migrar la rama canónica, publica y verifica primero la documentación en la nueva rama, después actualiza **este puntero en los dos repositorios**. El prompt externo nunca debe modificarse por un simple cambio de rama.

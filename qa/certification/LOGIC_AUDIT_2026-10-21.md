# Auditoría lógica de la certificación — 2026-10-21 (revisión 232)

Aplica a `c2melendez/precision-lab-lite` y `c2melendez/precision-lab-plus`, rama
`qa/syntax-audit-in625-a1`. Verifica dos preguntas por separado:

1. ¿Cada decisión matemática tomada para ejecutar la matriz es correcta?
2. ¿El procedimiento de certificación demuestra que el producto cumple lo esperado?

Un gate de GitHub Actions en verde es evidencia necesaria pero no suficiente: se
comprobó además que las pruebas correspondan a la fuente congelada, que cubran los
casos límite y que no conviertan una aproximación ni una excepción de dominio en
una aprobación matemática.

## 0. Veredicto ejecutivo

- **Matemática: correcta.** Ninguna fila certificada convirtió una singularidad en
  un valor finito. Las convenciones declaradas (`0^0=1`, ramas complejas, raíz real
  impar vs. potencia principal) son las que la propia matriz admite o exige declarar,
  y son coherentes entre bloques.
- **Proceso: sólido en la cadena de evidencia, con brechas documentales y de
  trazabilidad.** Cada cierre EV-L/I/E/R tiene SHA técnico exacto, gate acumulativo
  ejecutado, guard con `skip=false` y conteos verificables. Las brechas detectadas
  eran: índices de estado obsoletos, oráculos hardcodeados sin anclaje automático a
  la fila congelada, manifiesto de fuentes no cableado en CI y paridad de protocolo
  incompleta en Plus.
- **Defecto de producto abierto (no certificado):** Plus devuelve
  `success=true` y `result_text="zoo"` para `ln(1-1)` y `ln(cos(pi/2))`. La fila
  EV-T-11 exige error claro; Plus falla hoy esa fila. EV-T no está certificado, por
  lo que no hay aprobación indebida, pero el defecto queda como precondición
  obligatoria de EV-T.
- **Certificación global: OPEN.** Los cinco bloqueos no cambian.

## 1. Reconciliación documental (estado vs. commits y corridas)

Evidencia base: `continuity.json` revisión 231, HEAD Lite `b7bd70a3`, HEAD Plus
`4ec07aed`, cierres r229/r230/r231 con gates exactos.

| Artefacto | Estado encontrado | ¿Vigente? | Acción r232 |
| --- | --- | --- | --- |
| `continuity.json` | rev 231, `next_action = EXP-EV-M-EVALUATION`, HEADs coincidentes | Sí | Se sube a rev 232 con esta auditoría |
| `CURRENT_STATE.md` | corte superior r231 correcto; 13 cortes apilados | Parcial | Se registra r232 arriba; ver §7 |
| `EXECUTION_LOG.md` | r231 al final; histórico acumulativo | Sí | Se añade r232 |
| `CONTINUITY_NEXT_ACTION.json` | rev **160**, `next AS-A-13`; Lite avisaba citando rev **191** (también obsoleta); Plus sin aviso | **No** | Reemplazado por puntero a `continuity.json` rev 232 |
| `CONTINUITY.md` | termina en AS-PAR-02 (~rev 133) con "Reentrada exacta" obsoleta | **No** | Banner de vigencia + puntero |
| `GLOBAL_CERTIFICATION_DASHBOARD.md` | corte más reciente 2026-10-19 (AS-AVS-02) | **No** | Corte r232 al inicio |
| `README.md` | afirma que el tablero muestra "solo el corte vigente" | Era falso | Corregido por el corte r232 |

Conclusión: la ambigüedad que motivó esta revisión existía fuera de
`continuity.json`. El índice canónico era correcto; los artefactos secundarios
contradecían el estado real. Se corrigieron para que una sesión nueva no pueda
heredar un objetivo obsoleto.

## 2. Decisiones adicionales tomadas para ejecutar la matriz

| # | Decisión | Filas | Naturaleza | ¿Produce el resultado esperado? | ¿Relaja el oráculo? |
| --- | --- | --- | --- | --- | --- |
| 1 | G2 admite formas equivalentes | EV-D-11 (`PASS_SCOPED_EQUIVALENT`) | Criterio de contrato | Sí: `1` literal en Plus, identidad no colapsada en Lite, ambas equivalentes | No. G2 está definido en el protocolo; no certifica capacidad de simplificación |
| 2 | Rango principal de `arccot` | EV-I-07 | Convención + producto | Sí, con rango declarado | No |
| 3 | Reescritura de composiciones completas | EV-I-09/10 | Producto | Sí para composición numérica completa; anidada fuera de alcance (gap declarado) | No |
| 4 | Razón de logaritmos / potencia perfecta | EV-L | Producto | Sí | No |
| 5 | `exp(log a + log b)` exacto | EV-E-10 | Producto | Sí (`6` exacto) | No |
| 6 | Oráculo numérico con forma exacta | EV-E-12 | Decisión de certificación | Sí: `result_approx=2.716923932`; `result_text` es fracción exacta | No: regla 2 (forma exacta) y regla 5 se cumplen; la limitación de presentación queda declarada y no se acredita como fila de presentación |
| 7 | `0^0 = 1` | EV-E-14 | Convención admitida por la fila | Sí, por convención explícita | No para evaluación directa. **Acotada**: no aplica a límites ni formas indeterminadas 4.M |
| 8 | Raíz real para índice impar; principal para potencia fraccionaria | EV-R-03/05, EV-R-14 | Convención por notación, admitida por la matriz | Sí; ambas ramas coexisten de forma coherente | No: la fila R-14 exige declarar la rama |
| 9 | `sqrt(-4)=2i` en rama compleja | EV-R-13 | Convención declarada | Sí; coherente con EV-L-13 (`ln(-1)=iπ`) y EV-T-12 | No: la fila admite la rama compleja si se declara |
| 10 | Alcance acotado de racionalización y denesting | EV-R-08 (`|b-a^2|=1`), EV-R-11/12 | Alcance de producto | Sí, exacto | No: no se reescribe nada fuera del alcance |

Veredicto: las diez decisiones son matemáticamente correctas y compatibles con la
matriz congelada. Ninguna sustituye un error de dominio por un valor finito ni
convierte una aproximación en aprobación de exactitud.

## 3. Singularidades: verificación empírica (no solo lo declarado)

Probado en ambos motores con las mismas entradas (Lite LaTeX, Plus ASCII/LaTeX).

| Fila | Entrada | Lite | Plus | Esperado | Estado |
| --- | --- | --- | --- | --- | --- |
| EV-L-12 | `ln(0)` | `DOMAIN_ERROR` | `DOMAIN_ERROR` | error claro | OK |
| EV-L-13 | `ln(-1)` | `i*pi` | `I*pi` | `iπ` en C (declarado) | OK |
| EV-L-14 | `log_1(5)` / `log(5,1)` | `DOMAIN_ERROR` | `DOMAIN_ERROR` | base inválida | OK |
| EV-E-14 | `0^0` | `1` | `1` | `1` por convención | OK (acotado) |
| EV-R-13 | `sqrt(-4)` | `2*i` | `2*I` | `2i` en C | OK |
| EV-R-14 | `(-8)^(1/3)` | `2*(-1)^(1/3)` | `2*(-1)**(1/3)` | principal | OK |
| — | `1/0`, `0/0` | `DOMAIN_ERROR` | `DOMAIN_ERROR` | error | OK |
| — | `tan(pi/2)` | `DOMAIN_ERROR` | `DOMAIN_ERROR` | error | OK |
| EV-T-12 | `sqrt(cos pi)` | `i` | `I` | `i` en C | OK (fila aún no certificada) |
| **EV-T-11** | `ln(cos(pi/2))` | `DOMAIN_ERROR` | **`success=true`, `zoo`** | error claro | **Plus FALLA** |

Hallazgo: en Plus la guarda de dominio del logaritmo es **sintáctica/parcial**.
`ln(0)`, `ln(0+0)`, `ln(sin(0))` y `log(0,10)` se detectan; `ln(1-1)` y
`ln(cos(pi/2))` no, y el motor devuelve `zoo` (infinito complejo de SymPy) como si
fuera un resultado. En un logaritmo real eso es una singularidad presentada como
valor. Lite responde `DOMAIN_ERROR` en ambos casos.

Implicación para el proceso: EV-T-11 detecta exactamente este tipo de fuga. Una
prueba que solo comprobara `success == True` habría aprobado una singularidad; el
patrón correcto es el usado en EV-L (exigir `DOMAIN_ERROR`). El defecto debe
corregirse antes de certificar EV-T; no afecta a EV-L/I/E/R ya cerrados.

## 4. Trazabilidad pruebas ↔ fuente congelada

- La fuente congelada es `legacy_sources/matriz_log_exp_radicales.md.gz`;
  `MANIFEST.json` fija `sha256_raw = bb7030e2…` y `bytes_raw = 47710`. El verificador
  `check_legacy_sources.py` devuelve PASS en ambos repos.
- Brecha detectada: las suites comprobaban **presencia de la fila** y hardcodeaban el
  oráculo, sin verificar que el valor hardcodeado coincidiera con la columna
  "Resultado esperado" de la fila congelada. Una edición de la matriz o un error de
  transcripción del test no se detectaba.
- Brecha detectada: la regla 2 del protocolo (`\approx` exige conservar forma exacta)
  no se comprobaba en EV-E; un motor que imprimiera solo el decimal habría pasado.
- Brecha detectada: `check_legacy_sources.py` **no está cableado en ningún workflow**;
  la inmutabilidad del insumo no se controla en CI.
- Corregido en el commit de tests: EV-E aproximadas anclan la referencia congelada a
  la fila y prohíben salida solo decimal; EV-E-10/11 y EV-R-03/05/06/07/08/09/10/11/12
  anclan sus oráculos. Pendiente: cablear el verificador de manifiesto en el gate
  acumulativo.

## 5. Paridad de protocolos

El protocolo de Plus carecía de tres reglas presentes en Lite:

1. No declarar certificación global por pruebas estructurales.
2. No bloquear IN625 por deuda independiente (S25/security/npm/mutation/CI) salvo
   regresión causada por el cambio actual.
3. Si una matriz posterior descubre una fuga de sintaxis anterior, agregar caso
   permanente y recertificar el subbloque afectado.

Sin la regla 3, Plus podía cerrar un bloque sin recertificar el subbloque afectado
por una fuga descubierta después. Sincronizado en r232.

## 6. Estado vivo y desviación estructural

`CURRENT_STATE.md` se ha vuelto **append-only en la práctica** (13 cortes
apilados), mientras el protocolo lo define como "fotografía autoritativa actual" y
reserva el historial para `EXECUTION_LOG.md`. El corte superior es correcto, pero el
archivo ya no es una fotografía. Recomendación: en el próximo mantenimiento,
trasladar los cortes antiguos al log y dejar solo el vigente. No se reescribe ahora
para no introducir riesgo documental en medio de una auditoría.

## 7. Acciones correctivas y estado

| Acción | Estado |
| --- | --- |
| Puntero único de estado (`CONTINUITY_NEXT_ACTION.json`) | Hecho r232 |
| Banner de vigencia en `CONTINUITY.md` | Hecho r232 |
| Corte r232 en `GLOBAL_CERTIFICATION_DASHBOARD.md` | Hecho r232 |
| Alcance explícito de `0^0` (evaluación directa, no límites) | Hecho r232 |
| Registro del defecto Plus `zoo` como precondición de EV-T | Hecho r232 |
| Paridad de protocolo Lite/Plus | Hecho r232 |
| Anclaje de oraculos a la fila congelada + forma exacta | Hecho (gates Lite 39686329058 / Plus 39686337173 SUCCESS) |
| Cablear `check_legacy_sources.py` en el gate acumulativo | Pendiente (siguiente bloque, no bloquea EV-M) |
| Corrección de producto `zoo` + prueba EV-T-11 con `DOMAIN_ERROR` | Pendiente, obligatorio antes de certificar EV-T |

## 8. Límites de esta auditoría

- Cubre lo certificado (EV-L/I/E/R), las filas singulares del bloque EV y el bloque
  siguiente (EV-M) a nivel de sonda. No cubre los ~600 casos restantes
  (EC/IN/LM/DV/IT/ID) ni una revisión línea a línea de todo el motor.
- La verificación es local + CI sobre SHA exactos; no sustituye una revisión humana
  independiente de la matriz.
- El defecto `zoo` está reproducido, no corregido; su corrección requiere cambio de
  producto y gate nuevo.

## 9. Evidencia

- Índice canónico: `qa/certification/continuity.json` rev 231 → 232.
- Cierres r231: Lite `c7875936` (cumulative 39683361872, 349 archivos, 2055 passed,
  EV-R 6/6, guard `skip=false`); Plus `870766b9` (cumulative 39683393101, 1824
  passed, 6 xfailed, EV-R 6/6).
- Refuerzo de tests r232 (SHA exacto): Lite `c4a49a51` - cumulative 39686329058 SUCCESS
  (349 archivos, 2056 passed, 8 expected fail, 34 todo, guard `skip=false`), h1d
  39686328895 y scientific-ui 39686328765 SUCCESS. Plus `89bf0e26` - cumulative
  39686337173 SUCCESS (1825 passed, 6 xfailed, cobertura 88.04%, guard `skip=false`),
  h1d 39686337053 SUCCESS.
  `continuity.json` rev 232).
- Manifiesto: `LER sha256_raw=bb7030e2…`, 47710 bytes, verificación local PASS.
- Reproducción del defecto: `ln(1-1)` y `ln(cos(pi/2))` → `{"success": true,
  "result_text": "zoo"}` en Plus; `DOMAIN_ERROR` en Lite.

# Precision Lab — Tablero global de certificación
Fecha de corte: 2026-10-15 (America/Tegucigalpa). Rama: `qa/syntax-audit-in625-a1`.
Estado global: **ABIERTO**. Porcentaje global: **ND**, falta reconciliar requisitos únicos por módulo y canal.

## Actualización verificada — SY-V-13 (2026-10-15)
- Próximo caso secuencial: SY-V-14, límite derecho de 1/x en 0, esperado +infinito. Las referencias SY-V-12 en la fotografía anterior conservan su carácter histórico.
- Lite: corrección de formato decimal para reentrada, regresión de precisión y comparación semántica del límite. Parser/handler con transporte simulado, resultado a tolerancia 1e-9; no prueba simbólica exacta ni UI nativa específica.
- Plus: intención de límite desde LaTeX original, conversión completa de cuerpo, endpoint /limit y resultado exacto 1 con reentrada HTTP por /evaluate; detector/conversor/HTTP probados por separado.
- SY-V-13 PASS bilateral en el alcance descrito. Lite SHA 9ae9005bf4598a6c1c785db9f2cd60559aea3047: cumulative https://github.com/c2melendez/precision-lab-lite/actions/runs/38693549546 (1282 PASS +30 TODO), H1d 38693549584, build 38693549420 y E2E científico genérico 38693549424 SUCCESS. Plus SHA bff8bfa0487e8e928d38990a28fc66667d3a7ba0: cumulative https://github.com/c2melendez/precision-lab-plus/actions/runs/38693185310 (1169 backend PASS +1 XFAIL; 833 frontend PASS +28 TODO), H1d 38693185327 SUCCESS. Todos verificados por SHA; logs de acumulativos inspeccionados.
- Científica sigue PARCIAL; 7/12 secciones abordadas, porcentaje global ND. IN625/H2/SG28 OPEN y DIST BLOCKED.

## Lectura rápida
- Dos frentes principales en evaluación: IN625 (625 casos) y Syntax309 (309 casos). No representan todas las matrices del proyecto ni deben sumarse como requisitos independientes sin deduplicación.
- Syntax309 ha abordado 7/12 secciones; el avance secuencial llega a SY-V-13. Esto mide recorrido, NO porcentaje certificado.
- La regresión actual también ejecuta Matrices, Estadística, Unidades y Gráficas. No es correcto describir toda la CI como exclusivamente sintaxis.
- Geometría y cierre visual completo requieren inventario de evidencia; ND no significa cero pruebas ni producto inexistente.
- SG28/H2 OPEN; DIST multinodo BLOCKED. El bloqueo no impide el frente matemático autorizado.

## Estados y conteos
**PASS acotado**: prueba concreta aprobada en el canal y SHA citados. **PARCIAL**: evidencia útil sin cierre integral. **PENDIENTE**: trabajo identificado sin cierre. **BLOCKED**: depende de evidencia/capacidad externa. **ND**: conteo de requisitos todavía no reconciliado.
Los conteos de tests no son ejercicios únicos. TODO, XFAIL, pruebas omitidas y gaps manuales nunca cuentan como PASS.
Cada fila requiere finalmente: requisitos totales, PASS, FAIL, pendientes, bloqueados, manuales, motor, canal y evidencia. Donde no existe ese desglose se conserva ND, sin inventar porcentajes.

## Tablero por módulo
| Módulo | Lite: evidencia actual | Plus: evidencia actual | Estado integral | Pendientes de cierre / siguiente acción |
|---|---|---|---|---|
| Científica | Syntax309 parser/motor/handler; SY-V-12 derivada respecto a y y conservación de C, incluida reentrada | SY-V-12 HTTP original, MathResponse, derivada y C en reentrada | PARCIAL; total/PASS/FAIL de requisitos: ND | Continuar SY-V-13; cubrir teclado/MathLive/browser específicos; reconciliar álgebra, cálculo, trigonometría, EDO y complejos |
| Gráficas | 6 tests aprobados en exhaustive-module09-graphing | 6 tests backend aprobados en test_exhaustive_module09_graphing; 7 tests GraphMode frontend | PARCIAL; requisitos: ND | Matriz gráfica completa, oráculos numéricos y visuales; Argand/raíces, dominio complejo, superficies Re/Im y módulo/fase |
| Matrices | 10 tests en exhaustive-module06-matrices y 18 en matrixOps aprobados | 6 tests backend módulo06 y 5 MatrixMode frontend aprobados | PARCIAL; requisitos: ND | Vincular cada operación/dimensión/error a matriz canónica; entrada natural, teclado, resultado e historial |
| Estadística | 6 tests módulo07 aprobados | 7 tests backend módulo07 aprobados | PARCIAL; requisitos: ND | Vincular descriptiva, distribuciones, regresiones, errores y flujos UI a requisitos únicos |
| Geometría | Sin evidencia específica reconciliada en este corte | Sin evidencia específica reconciliada en este corte | PENDIENTE DE INVENTARIO; requisitos: ND | Localizar contrato, implementación y pruebas; áreas/volúmenes, construcciones y regiones sombreadas. No inferir ausencia de función por nombre de archivo |
| Unidades | 5 tests módulo08 aprobados | 5 tests frontend módulo08 aprobados | PARCIAL; requisitos: ND | Categorías, precisión, errores, teclado, historial y paridad visual/funcional |

Los números anteriores son subconjuntos identificados por archivo en los logs actuales; NO totales por módulo ni cobertura porcentual. Suites E2E existentes no se consideran ejecutadas solo porque su archivo exista.

## Áreas transversales
| Área | Evidencia / situación | Estado y siguiente acción |
|---|---|---|
| Entrada y comportamiento IN625 | Bloques A–G y H1 con cierres históricos; G3 34/34 documentado; H1 tiene clasificación PASS/GAP | OPEN. Mantener excepciones de MANUAL_CAPABILITY_GAPS y resolver H2 |
| Seguridad/cancelación H2/SG28 | Prototipo Plus y regresiones automatizadas; no certificación distribuida real | PARCIAL. Continuar frente A en entorno aislado |
| DIST-01..08 | Falta evidencia contractual entre nodos independientes | BLOCKED. No sustituir por mocks, múltiples procesos o runners sin coordinación real |
| Historial y reusar | Pruebas previas y gaps EN-RE-22/29/30 documentados | PARCIAL. Reconciliar estado actual de restauración exacta, compartir y persistencia; notas históricas no bastan |
| Teclado/editor | Suites de inventario, paridad y E2E disponibles; cobertura de casos específicos desigual | PARCIAL. Matriz tecla → MathLive → parser → motor → resultado por módulo |
| Visual/responsive/accesibilidad | qa/s26/VISUAL_MATRIX.md conserva 22 filas pendientes × 4 viewports (88 celdas) | PENDIENTE documental. Reconciliar capturas/SHA por celda; ampliar Geometría y temas según contrato. 88 celdas no son toda la cobertura visual |
| Paridad Lite/Plus | Gates bilaterales verdes; diferencias de canal y convenciones siguen documentadas | PARCIAL. Comparar mismo requisito y mismo alcance, no solo número de tests |

## Syntax309 por sección
| Sección | Casos oficiales | Situación de trazabilidad |
|---|---:|---|
| SY-P Precedencia | 33 | Abordada; convenciones pendientes, incluyendo SY-P-23 |
| SY-F Funciones | 48 | Abordada; auditoría 48 IDs no equivale a cierre UI/semántico universal |
| SY-E Exponentes/fracciones | 31 | Abordada; conservar gaps de MathLive y ramas complejas |
| SY-N Números/precisión | 31 | Abordada; reconciliar convenciones y canales |
| SY-D Delimitadores | 14 | Recorrido hasta D-14; PASS por alcance registrado, no cierre UI universal |
| SY-U Operadores/Unicode | 25 | Recorrido hasta U-25 según CURRENT_STATE; revisar alcance por caso |
| SY-V Variables/cálculo | 28 | V-13: gates verdes, siguiente V-14 |
| SY-Q Ecuaciones/sistemas | 23 | Pendiente de esta secuencia; pueden existir otras suites previas |
| SY-M Matrices/vectores | 20 | Pendiente de esta secuencia; no significa módulo sin pruebas |
| SY-S Alias en español | 20 | Pendiente de esta secuencia |
| SY-R Reentrada | 14 | Pendiente de esta secuencia; IN625 H1 es evidencia distinta |
| SY-X Estrés/hostiles | 22 | Pendiente de esta secuencia; ejecutar aislado |
| Total | 309 | Certificación integral OPEN |

## Evidencia anterior verificada — corte SY-V-12
| Suite | SHA técnico | Run | Resultado |
|---|---|---|---|
| Lite acumulativo | fad5697aa2f59ae554a416cccfc53c6ad6851470 | [38692018733](https://github.com/c2melendez/precision-lab-lite/actions/runs/38692018733) | 1280 PASS + 30 TODO; 96 archivos |
| Plus acumulativo | cafe0f8b2cf6f0e37afcdb302b57534ddc3ab346 | [38691996868](https://github.com/c2melendez/precision-lab-plus/actions/runs/38691996868) | Backend 1168 PASS + 1 XFAIL; frontend 832 PASS + 28 TODO |
| Lite adicionales, mismo SHA | fad5697aa2f59ae554a416cccfc53c6ad6851470 | H1d 38692018735; build 38692018785; UI científico genérico 38692018821 | SUCCESS |
| Plus H1d, mismo SHA | cafe0f8b2cf6f0e37afcdb302b57534ddc3ab346 | 38691996750 | SUCCESS |
| Plus prototipo aislamiento, SHA de producto anterior | 40d15d7861d69ea3b638ee6ace555e5a3e770bab | 38691963524 | SUCCESS; no atribuir al SHA de tests ni a DIST real |

Logs consultados: Lite job 116279868315; Plus backend 116279795750 y frontend 116279796053. No se ha disparado nueva CI para este tablero documental.
SY-V-12 prueba presencia de C y derivada respecto a y igual a x en entrada/salida. No demuestra UI MathLive nativa ni unicidad de la constante respecto a todos los parámetros.

## Historia conservada, no mezclada con el corte actual
El baseline de CURRENT_STATE documenta Oracle Audit 74/74 shards, 2132/2132 casos planificados, 4026 casos canónicos y Product Certification Wave 2 22/22 PASS. Son dimensiones y campañas distintas; no sumar entre sí ni tratarlas como certificación vigente de todas las funciones.

## Hoja de ruta y actualización
1. Continuidad matemática: consultar fixture oficial y continuar SY-V-14 (límite derecho de 1/x en 0 = +infinito), tras resolver cualquier regresión. No volver a U-04.
2. Completar trazabilidad por requisito de los módulos: localizar fuentes originales y enlazar caso → test → canal → SHA → run → resultado. Priorizar inventario de Geometría y reconciliación visual para llenar ND.
3. Mantener orden autorizado: Syntax309 → Álgebra114 → Álgebra229 → Trigonometría → Log/Exp/Radicales → Matrices/Vectores → EDO/Complejos → Gráficas → paridad final.
4. Agrupar casos independientes del mismo bloque en lotes revisables cuando compartan preparación; cada caso conserva su ID y oráculo. No sacrificar diagnóstico ni alterar el orden canónico.
5. En cada cierre actualizar CURRENT_STATE, EXECUTION_LOG y este tablero bilateralmente. No incrementar conteos por reejecución. Mostrar fecha/SHA y separar histórico de vigente.
6. Calcular porcentaje solo cuando haya denominador de requisitos únicos y estados excluyentes reconciliados. Hasta entonces ND.

Fuentes: [CURRENT_STATE](CURRENT_STATE.md), [protocolo](EXECUTION_PROTOCOL.md), [gaps](MANUAL_CAPABILITY_GAPS.md), [fixture](syntax309_cases.jsonl), [auditoría SY-F](SY_F_48_COVERAGE_AUDIT.md), [matriz visual](../s26/VISUAL_MATRIX.md). Inventario de archivos consultado en Lite 26dc6eaa2c2c157f8d557e936567f57a4236292a y Plus b05038f8d980f870a2c4eeaf9e1f0e72ed6baaca.

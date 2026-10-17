# SY-X-14 — contrato de expansión y bloqueo de profundidad

El fixture descriptivo común permanece intacto. Se inicia con `x` y se aplica `source = "\\frac{1}{" + source + "}"` exactamente50veces. La fuente operativa tiene501caracteres y50comandos frac; no es lícito sustituirla por x antes de la ingesta o validación.

La traducción HTTP conserva50divisiones. El testigo explícito `source = "1/(" + source + ")"` aplicado50veces mide201caracteres. Un AST SymPy sin evaluar de ese testigo tiene201nodos yprofundidad101. Los límites Plus existentes son longitud500,nodos200,profundidad30. La petición traducida cabe en longitud, pero el validador rechaza primero la profundidad30; elevar solo ese límite no resolvería también el presupuesto de nodos. No se modifica ninguno en este lote.

El oráculo matemático es x para50niveles y1/x para49o51, siempre con x≠0 heredado de la fuente. Lite verifica paridad, condición original visible, cero anidado rechazado, recuperación5 y reentrada. Copiar el LaTeX x sin las restricciones crea una nueva expresión; no se atribuye persistencia automática del dominio original a ese acto.

Plus debe mantener el caso matemático50niveles BLOCKED/XFAILestricto, aunque el aviso HTTP/MathLive y la recuperación pasen. Un rechazo de límites no es resolución matemática. No certificar paridad nativa Plus por un testigo de menos niveles ni relajar el oráculo para lograr verde.

Condición de salida: reconciliación explícita de la aceptación con ambos presupuestos AST (profundidad y nodos), conservando evaluación acotada, entrada original no presimplificada, dominio y regresiones. Hasta ese cambio de precondición, reutilizar la evidencia de rechazo revisada; no repetir la misma prueba bloqueada en otra sesión. Continuar el siguiente caso independiente de Syntax309.


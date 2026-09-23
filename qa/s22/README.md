# S22 — PWA / offline

Fuente normativa: Suite exhaustiva v2.0, Fase 16 — Lite/PWA.

## Gate

S22 certifica en el build de producción de Precision Lab Lite:

- manifest válido e instalable;
- service worker registrado y controlador;
- segunda carga offline del shell;
- una operación local soportada (`2+2`) funcionando offline;
- navegación/recarga offline sin página en blanco;
- actualización real de build v1 → v2 bajo el mismo origen;
- activación del service worker actualizado;
- ausencia de cache incompatible: la versión v2 queda disponible tras volver offline;
- cálculo local posterior a la actualización sigue funcionando.

## Método de actualización

El harness genera un marcador estático `s22-version.txt` como `s22-v1` en el
primer build. Con la página ya controlada por el service worker, reemplaza el
marcador por `s22-v2` y reconstruye `dist` mientras `vite preview` mantiene
el mismo origen. Después fuerza `registration.update()`, espera activación,
recarga y vuelve offline. El gate exige ver `s22-v2` desde cache y poder
calcular `2+2`.

El marcador se crea solo durante CI y no forma parte del producto versionado.

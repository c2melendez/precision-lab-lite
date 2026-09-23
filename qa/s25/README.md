# S25 — Seguridad de cadena de suministro y despliegue

Política del gate:
- npm audit: high/critical bloquean; moderate se reporta.
- build de producción obligatorio.
- index.html debe declarar referrer policy strict-origin-when-cross-origin.

Limitación de hosting:
Precision Lab Lite se publica en GitHub Pages. El repositorio no controla headers HTTP de respuesta como X-Content-Type-Options, X-Frame-Options o CSP de cabecera. No se simulan esos controles en código. CSP de meta tampoco se fuerza en S25 porque el PWA/MathLive/worker requieren una validación específica antes de imponer una política que podría romper funcionalidad.

El control de framing y headers HTTP queda clasificado como dependiente del hosting. Si el deployment migra a un hosting configurable, esos headers deben convertirse en gate de release.

# S26.2 — Contrato del módulo Geometría

## Posición en navegación

Orden visible final:
1. Científica
2. Matrices
3. Gráficas
4. Estadística
5. **Geometría**
6. Unidades

Aplica tanto a Lite como a Plus.

## Alcance funcional

### Figuras 2D
- áreas;
- perímetros;
- diagonales;
- polígonos;
- círculos;
- sectores/arcos.

### Triángulos y ángulos
- tipos de triángulo;
- Pitágoras;
- semejanza;
- relaciones angulares;
- trigonometría;
- ley de senos;
- ley de cosenos.

### Figuras compuestas y regiones sombreadas
Debe poder resolver composiciones como:
- semicírculos dentro de cuadrados/rectángulos;
- círculos inscritos;
- triángulos dentro de polígonos;
- regiones con huecos;
- figuras en L;
- trapecios y polígonos compuestos;
- áreas por suma/resta de subregiones.

### Sólidos 3D
- volumen;
- área superficial;
- figuras estándar y composiciones soportadas.

## Constructor geométrico

Herramientas mínimas:
- seleccionar;
- punto;
- línea/recta/segmento;
- polígono;
- triángulo;
- rectángulo/cuadrado;
- círculo;
- arco/semicírculo;
- elipse;
- texto/etiqueta;
- medida;
- sombreado/selección de región;
- borrar/deshacer/rehacer;
- cuadrícula.

El usuario puede:
- asignar medidas numéricas;
- asignar variables (`x`, `2x`, `3/2 x`, etc.);
- superponer figuras;
- definir huecos/restas;
- seleccionar la región objetivo;
- elegir qué propiedad resolver.

## Importación de imagen

Flujo propuesto:
1. importar imagen;
2. detectar figuras/segmentos/arcos/etiquetas;
3. mostrar interpretación editable;
4. usuario confirma/corrige;
5. seleccionar región o propiedad;
6. resolver.

Regla de seguridad matemática:
- una detección visual no confirmada no debe convertirse silenciosamente en respuesta definitiva.

## Salida

Mostrar:
- figura interpretada;
- datos conocidos;
- fórmula/estrategia;
- descomposición en subfiguras;
- pasos;
- resultado exacto;
- aproximación cuando aplique;
- unidades;
- región sombreada destacada.

## Teclado

El teclado virtual global debe estar disponible también en Geometría para introducir números, variables y expresiones.

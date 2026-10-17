# Matriz de estrés — Álgebra simbólica

Batería para medir la capacidad real de los motores simbólicos de la calculadora (Precision Lab Lite / Plus) y localizar oportunidades de mejora.

Cubre: factorizar, expandir, simplificar, fracciones parciales, racionalizar, división de polinomios, ecuaciones con parámetros, valor absoluto y raíces extrañas en ecuaciones radicales.

Se añaden criterios complementarios recomendados:
- Conservación de dominio y condiciones al simplificar.
- Manejo de supuestos (`x > 0`, `x real`, `a \neq 0`, etc.).
- Convenciones en raíces pares/imparares y exponentes racionales.
- Casos degenerados en ecuaciones con parámetros.
- Fracciones parciales de expresiones impropias.
- Racionalización tanto de denominador como de numerador.
- Álgebra multivariable, simetría y expresiones cíclicas.
- Exactitud simbólica frente a aproximación numérica.
- Casos límite: cancelaciones, identidades polinómicas, suma telescópica/geométrica.

Trabajo en `\mathbb{R}` salvo indicación. Variables simbólicas reales.  
`\sqrt{\cdot}` denote raíz principal no negativa cuando el radicando es real no negativo.  
Raíces de índice impar de negativos: se espera la raíz real, salvo que el modo sea `\mathbb{C}`.  
Se aceptan formas equivalentes, pero el motor no debe perder dominios ni casos en silencio.  
En ecuaciones con parámetros, se esperan casos completos.  
En ecuaciones radicales, se deben filtrar raíces extrañas.

Niveles:
- N1: básico, operación directa.
- N2: intermedio, requiere reglas algebraicas y condiciones.
- N3: avanzado/estrés, requiere casos, dominio, simetría o robustez simbólica.

---

## A. Simplificación algebraica, equivalencia y dominio

| ID | Nivel | Ejercicio | Resultado esperado |
|---|---:|---|---|
| AS-SIM-01 | N1 | \(3x+2y-x+5y\) | \(2x+7y\) |
| AS-SIM-02 | N1 | \((x^{2})^{3}\) | \(x^{6}\) |
| AS-SIM-03 | N1 | \(x^{2}x^{3}\) | \(x^{5}\) |
| AS-SIM-04 | N1 | \((xy)^{3}\) | \(x^{3}y^{3}\) |
| AS-SIM-05 | N2 | \(\frac{x^{2}-1}{x-1}\) | \(x+1\), con \(x\neq1\) |
| AS-SIM-06 | N2 | \(\frac{x^{2}-4}{x^{2}-4x+4}\) | \(\frac{x+2}{x-2}\), con \(x\neq2\) |
| AS-SIM-07 | N2 | \(\sqrt{x^{2}}\) | \(\lvert x\rvert\) (no \(x\)) |
| AS-SIM-08 | N2 | \(\sqrt{x^{3}}\) | \(x\sqrt{x}\), con \(x\ge0\) |
| AS-SIM-09 | N3 | \(\frac{x-1}{1-x}\) | \(-1\), con \(x\neq1\) |
| AS-SIM-10 | N3 | \(\frac{1/x-1/y}{x-y}\) | \(-\frac{1}{xy}\), con \(x\neq0\), \(y\neq0\), \(x\neq y\) |

---

## B. Expansión

| ID | Nivel | Ejercicio | Resultado esperado |
|---|---:|---|---|
| AS-EXP-01 | N1 | \((x+1)(x-1)\) | \(x^{2}-1\) |
| AS-EXP-02 | N1 | \((x+2)^{2}\) | \(x^{2}+4x+4\) |
| AS-EXP-03 | N2 | \((2x-1)(3x+4)\) | \(6x^{2}+5x-4\) |
| AS-EXP-04 | N2 | \((x+1)(x^{2}-x+1)\) | \(x^{3}+1\) |
| AS-EXP-05 | N2 | \((x-1)(x^{2}+x+1)\) | \(x^{3}-1\) |
| AS-EXP-06 | N2 | \((x+y)^{3}\) | \(x^{3}+3x^{2}y+3xy^{2}+y^{3}\) |
| AS-EXP-07 | N2 | \((2x-3)^{3}\) | \(8x^{3}-36x^{2}+54x-27\) |
| AS-EXP-08 | N3 | \((x+2)(x-3)(x+1)\) | \(x^{3}-7x-6\) |
| AS-EXP-09 | N3 | \((a+b+c)^{2}\) | \(a^{2}+b^{2}+c^{2}+2ab+2ac+2bc\) |
| AS-EXP-10 | N3 | \(-(x-1)(x+2)\) | \(-x^{2}-x+2\) |

---

## C. Factorización

| ID | Nivel | Ejercicio | Resultado esperado |
|---|---:|---|---|
| AS-FAC-01 | N1 | \(x^{2}-9\) | \((x-3)(x+3)\) |
| AS-FAC-02 | N1 | \(x^{2}+5x+6\) | \((x+2)(x+3)\) |
| AS-FAC-03 | N2 | \(6x^{2}-11x+3\) | \((3x-1)(2x-3)\) |
| AS-FAC-04 | N2 | \(x^{3}-1\) | \((x-1)(x^{2}+x+1)\) |
| AS-FAC-05 | N2 | \(x^{3}+1\) | \((x+1)(x^{2}-x+1)\) |
| AS-FAC-06 | N2 | \(x^{3}-6x^{2}+11x-6\) | \((x-1)(x-2)(x-3)\) |
| AS-FAC-07 | N2 | \(x^{4}-5x^{2}+4\) | \((x-1)(x+1)(x-2)(x+2)\) |
| AS-FAC-08 | N3 | \(x^{4}+4\) | \((x^{2}-2x+2)(x^{2}+2x+2)\) |
| AS-FAC-09 | N3 | \(x^{4}+1\) sobre \(\mathbb{R}\) | \((x^{2}+\sqrt{2}x+1)(x^{2}-\sqrt{2}x+1)\) |
| AS-FAC-10 | N3 | \(x^{3}+y^{3}\) | \((x+y)(x^{2}-xy+y^{2})\) |
| AS-FAC-11 | N3 | \(x^{3}+x^{2}+x+1\) | \((x+1)(x^{2}+1)\) |
| AS-FAC-12 | N3 | \(x^{2}(y-z)+y^{2}(z-x)+z^{2}(x-y)\) | \((x-y)(x-z)(y-z)\) |

---

## D. Fracciones parciales

| ID | Nivel | Ejercicio | Resultado esperado |
|---|---:|---|---|
| AS-PF-01 | N2 | \(\frac{3x+5}{(x+1)(x+2)}\) | \(\frac{2}{x+1}+\frac{1}{x+2}\) |
| AS-PF-02 | N2 | \(\frac{1}{x(x-1)^{2}}\) | \(\frac{1}{x}-\frac{1}{x-1}+\frac{1}{(x-1)^{2}}\) |
| AS-PF-03 | N2 | \(\frac{x+1}{x(x^{2}+1)}\) | \(\frac{1}{x}+\frac{1-x}{x^{2}+1}\) |
| AS-PF-04 | N2 | \(\frac{2x+3}{x^{2}-4}\) | \(\frac{7}{4(x-2)}+\frac{1}{4(x+2)}\) |
| AS-PF-05 | N3 | \(\frac{x^{3}+1}{x^{2}-1}\) | \(x+\frac{1}{x-1}\), con \(x\neq\pm1\) |
| AS-PF-06 | N3 | \(\frac{1}{(x^{2}+1)(x^{2}+4)}\) | \(\frac{1}{3}\left(\frac{1}{x^{2}+1}-\frac{1}{x^{2}+4}\right)\) |
| AS-PF-07 | N3 | \(\frac{x}{(x^{2}+1)(x^{2}+4)}\) | \(\frac{x}{3(x^{2}+1)}-\frac{x}{3(x^{2}+4)}\) |
| AS-PF-08 | N3 | \(\frac{x^{4}}{x^{2}-1}\) | \(x^{2}+1+\frac{1}{2(x-1)}-\frac{1}{2(x+1)}\), con \(x\neq\pm1\) |

---

## E. Racionalización

| ID | Nivel | Ejercicio | Resultado esperado |
|---|---:|---|---|
| AS-RAT-01 | N1 | \(\frac{1}{\sqrt{2}}\) | \(\frac{\sqrt{2}}{2}\) |
| AS-RAT-02 | N1 | \(\frac{1}{\sqrt{2}+1}\) | \(\sqrt{2}-1\) |
| AS-RAT-03 | N2 | \(\frac{1}{\sqrt{2}+\sqrt{3}}\) | \(\sqrt{3}-\sqrt{2}\) |
| AS-RAT-04 | N2 | \(\frac{1}{\sqrt[3]{2}}\) | \(\frac{\sqrt[3]{4}}{2}\) |
| AS-RAT-05 | N2 | \(\frac{1}{\sqrt[3]{2}+1}\) | \(\frac{\sqrt[3]{4}-\sqrt[3]{2}+1}{3}\) |
| AS-RAT-06 | N2 | \(\frac{\sqrt{x+h}-\sqrt{x}}{h}\) | \(\frac{1}{\sqrt{x+h}+\sqrt{x}}\), con \(x>0\), \(h>-x\), \(h\neq0\) |
| AS-RAT-07 | N3 | \(\sqrt{2+\sqrt{3}}\) | \(\frac{\sqrt{6}+\sqrt{2}}{2}\) |
| AS-RAT-08 | N3 | \(\sqrt{5+2\sqrt{6}}\) | \(\sqrt{3}+\sqrt{2}\) |
| AS-RAT-09 | N3 | \(\frac{1}{\sqrt{x}+\sqrt{y}}\) | \(\frac{\sqrt{x}-\sqrt{y}}{x-y}\), con \(x,y\ge0\), \(x\neq y\) |
| AS-RAT-10 | N3 | \(\frac{\sqrt{3}}{\sqrt{2}+\sqrt{3}}\) | \(3-\sqrt{6}\) |

---

## F. División de polinomios

| ID | Nivel | Ejercicio | Resultado esperado |
|---|---:|---|---|
| AS-DIV-01 | N1 | \(\frac{x^{2}-4}{x-2}\) | Cociente \(x+2\), resto \(0\); como función racional, \(x\neq2\) |
| AS-DIV-02 | N2 | \(\frac{x^{3}-8}{x-2}\) | Cociente \(x^{2}+2x+4\), resto \(0\) |
| AS-DIV-03 | N2 | \(\frac{x^{3}+2x^{2}-x+5}{x+1}\) | Cociente \(x^{2}+x-2\), resto \(7\) |
| AS-DIV-04 | N3 | \(\frac{x^{4}+x^{3}+x^{2}+x+1}{x^{2}+1}\) | Cociente \(x^{2}+x\), resto \(1\) |
| AS-DIV-05 | N3 | \(\frac{2x^{3}-3x^{2}+5x-7}{x-1}\) | Cociente \(2x^{2}-x+4\), resto \(-3\) |
| AS-DIV-06 | N3 | \(\frac{x^{3}+1}{x^{2}-x+1}\) | Cociente \(x+1\), resto \(0\) |
| AS-DIV-07 | N3 | \(\frac{x^{5}-1}{x-1}\) | Cociente \(x^{4}+x^{3}+x^{2}+x+1\), resto \(0\) |
| AS-DIV-08 | N3 | \(\frac{x^{3}+ax^{2}+bx+c}{x-1}\) | Cociente \(x^{2}+(a+1)x+(a+b+1)\), resto \(a+b+c+1\) |

---

## G. Ecuaciones con parámetros

| ID | Nivel | Ejercicio | Resultado esperado |
|---|---:|---|---|
| AS-PAR-01 | N2 | \(ax=b\) | Si \(a\neq0\), \(x=\frac{b}{a}\); si \(a=0,b=0\), toda \(x\); si \(a=0,b\neq0\), sin solución |
| AS-PAR-02 | N2 | \((a-1)x=a+1\) | Si \(a\neq1\), \(x=\frac{a+1}{a-1}\); si \(a=1\), sin solución |
| AS-PAR-03 | N2 | \(x^{2}=a\) en \(\mathbb{R}\) | Si \(a>0\), \(x=\pm\sqrt{a}\); si \(a=0\), \(x=0\); si \(a<0\), sin solución real |
| AS-PAR-04 | N2 | \(x^{2}-2mx+m^{2}-1=0\) | \(x=m+1\) o \(x=m-1\) |
| AS-PAR-05 | N3 | \(x^{2}+mx+1=0\) en \(\mathbb{R}\) | Si \(|m|>2\), \(x=\frac{-m\pm\sqrt{m^{2}-4}}{2}\); si \(|m|=2\), raíz doble \(x=-\frac{m}{2}\); si \(|m|<2\), sin solución real |
| AS-PAR-06 | N3 | \(\sqrt{x}=a\) | Si \(a\ge0\), \(x=a^{2}\); si \(a<0\), sin solución real |
| AS-PAR-07 | N3 | \(\sqrt{x-a}=b\) | Si \(b\ge0\), \(x=a+b^{2}\); si \(b<0\), sin solución real |
| AS-PAR-08 | N3 | \(|x-a|=b\) | Si \(b<0\), sin solución; si \(b=0\), \(x=a\); si \(b>0\), \(x=a\pm b\) |
| AS-PAR-09 | N3 | \(|x-a|=|x-b|\) | Si \(a\neq b\), \(x=\frac{a+b}{2}\); si \(a=b\), toda \(x\) |
| AS-PAR-10 | N3 | \(\frac{x}{x-a}=1\) | Si \(a\neq0\), sin solución; si \(a=0\), toda \(x\neq0\) |

---

## H. Valor absoluto

| ID | Nivel | Ejercicio | Resultado esperado |
|---|---:|---|---|
| AS-AVS-01 | N1 | \(|x|^{2}\) | \(x^{2}\) |
| AS-AVS-02 | N2 | \(|xy|\) | \(|x||y|\) |
| AS-AVS-03 | N2 | \(|x-1|+|x+1|\) | \(-2x\) si \(x<-1\); \(2\) si \(-1\le x\le1\); \(2x\) si \(x>1\) |
| AS-AVS-04 | N2 | \(|2x-3|\) | \(3-2x\) si \(x<\frac{3}{2}\); \(2x-3\) si \(x\ge\frac{3}{2}\) |
| AS-AVS-05 | N3 | \(|x|+x\) | \(2x\) si \(x\ge0\); \(0\) si \(x<0\) |
| AS-AVS-06 | N3 | \(|x|-x\) | \(0\) si \(x\ge0\); \(-2x\) si \(x<0\) |
| AS-AVS-07 | N3 | \(|x|=x-1\) | Sin solución; si se eleva al cuadrado aparece \(x=\frac{1}{2}\), que es extraña |
| AS-AVS-08 | N3 | \(|x-1|=x+1\) | \(x=0\) |
| AS-AVS-09 | N3 | \(|x|+|x-1|=2\) | \(x=-\frac{1}{2}\) o \(x=\frac{3}{2}\) |
| AS-AVS-10 | N3 | \(|x-1|+|x-5|=c\) | Si \(c<4\), sin solución; si \(c=4\), \(x\in[1,5]\); si \(c>4\), \(x=3\pm\frac{c}{2}\) |

---

## I. Raíces extrañas en ecuaciones radicales

| ID | Nivel | Ejercicio | Resultado esperado |
|---|---:|---|---|
| AS-RAD-01 | N2 | \(\sqrt{x}=-2\) | Sin solución real; \(x=4\) es raíz extraña si se eleva al cuadrado |
| AS-RAD-02 | N2 | \(\sqrt{x+3}=x+1\) | \(x=1\); \(x=-2\) es extraña |
| AS-RAD-03 | N2 | \(\sqrt{2x-1}=x-1\) | \(x=2+\sqrt{2}\); \(x=2-\sqrt{2}\) es extraña |
| AS-RAD-04 | N3 | \(\sqrt{x^{2}}=x-1\) | Sin solución; \(x=\frac{1}{2}\) es extraña |
| AS-RAD-05 | N3 | \(\sqrt{3-x}=x\) | \(x=\frac{-1+\sqrt{13}}{2}\); la otra raíz cuadrática es extraña |
| AS-RAD-06 | N3 | \(\sqrt[4]{x}=-1\) | Sin solución real; \(x=1\) es extraña si se eleva a la cuarta |
| AS-RAD-07 | N3 | \(\sqrt[3]{x-1}=x-1\) | \(x=0,1,2\); todas válidas (raíz impar) |
| AS-RAD-08 | N3 | \(\sqrt{x}+\sqrt{x-1}=1\) | \(x=1\) |
| AS-RAD-09 | N3 | \(\sqrt{x-1}=x-3\) | \(x=5\); \(x=2\) es extraña |
| AS-RAD-10 | N3 | \(\sqrt{x}+\sqrt{x+3}=3\) | \(x=1\) |

---

## J. Dominio, condiciones y pérdida silenciosa

| ID | Nivel | Ejercicio | Resultado esperado |
|---|---:|---|---|
| AS-DOM-01 | N2 | Simplificar \(\frac{x^{2}-1}{x-1}\) | Debe devolver \(x+1\) pero conservar la condición \(x\neq1\) |
| AS-DOM-02 | N2 | \(\frac{x-1}{x^{2}-1}\) | \(\frac{1}{x+1}\), con \(x\neq\pm1\) |
| AS-DOM-03 | N3 | Resolver \(\frac{x^{2}-1}{x-1}=0\) | Solo \(x=-1\); \(x=1\) no pertenece al dominio |
| AS-DOM-04 | N3 | \(\frac{\sqrt{x^{2}}}{x}\) | \(\frac{|x|}{x}\), con \(x\neq0\); vale \(1\) si \(x>0\) y \(-1\) si \(x<0\) |
| AS-DOM-05 | N2 | Dominio de \(\frac{1}{\sqrt{x-1}}\) | \(x>1\) |
| AS-DOM-06 | N3 | Dominio real de \(\sqrt{\frac{x}{x-1}}\) | \(x\le0\) o \(x>1\) |

---

## K. Multivariable, simetría y colecciones

| ID | Nivel | Ejercicio | Resultado esperado |
|---|---:|---|---|
| AS-MUL-01 | N2 | \((x+y)(x-y)+z^{2}\) | \(x^{2}-y^{2}+z^{2}\) |
| AS-MUL-02 | N2 | \(x^{2}+2xy+y^{2}-z^{2}\) | \((x+y-z)(x+y+z)\) |
| AS-MUL-03 | N3 | \(x^{3}+y^{3}+z^{3}-3xyz\) | \((x+y+z)(x^{2}+y^{2}+z^{2}-xy-yz-zx)\) |
| AS-MUL-04 | N3 | \(\frac{x-y}{x^{2}-y^{2}}\) | \(\frac{1}{x+y}\), con \(x\neq\pm y\); debe notar el hueco en \(x=y\) |
| AS-MUL-05 | N3 | Bajo el supuesto \(x+y+z=0\), simplificar \(x^{3}+y^{3}+z^{3}\) | \(3xyz\) |
| AS-MUL-06 | N3 | \(x^{2}+y^{2}+z^{2}-xy-yz-zx\) | \(\frac{1}{2}\left((x-y)^{2}+(y-z)^{2}+(z-x)^{2}\right)\) |

---

## L. Convenciones de raíces, exponentes y ramas

| ID | Nivel | Ejercicio | Resultado esperado |
|---|---:|---|---|
| AS-CONV-01 | N2 | \(\sqrt[3]{-8}\) | En \(\mathbb{R}\): \(-2\); en \(\mathbb{C}\) principal: \(1+i\sqrt{3}\) |
| AS-CONV-02 | N3 | \((-8)^{2/3}\) | Convención real: \(4\); rama principal compleja: \(-2+2i\sqrt{3}\); debe declarar la convención |
| AS-CONV-03 | N2 | \(x^{0}\) | \(1\) si \(x\neq0\); \(0^{0}\) debe declararse, no resolverse en silencio |
| AS-CONV-04 | N2 | \(\sqrt{-4}\) | En \(\mathbb{R}\): error claro; en \(\mathbb{C}\): \(2i\) |
| AS-CONV-05 | N3 | \(\sqrt[4]{x^{4}}\) | \(|x|\), no \(x\) |
| AS-CONV-06 | N2 | \(\sqrt[3]{x^{3}}\) | \(x\) |
| AS-CONV-07 | N2 | \(\sqrt{x^{2}-2x+1}\) | \(|x-1|\) |
| AS-CONV-08 | N3 | \(\sqrt{x^{2}-6x+9}+\sqrt{x^{2}+6x+9}\) | \(|x-3|+|x+3|\); equivale a \(-2x\) si \(x<-3\), \(6\) si \(-3\le x\le3\), \(2x\) si \(x>3\) |

---

## M. Robustez exacta y casos límite

| ID | Nivel | Ejercicio | Resultado esperado |
|---|---:|---|---|
| AS-LIM-01 | N3 | \(\frac{1-x^{2}}{1-x}\) | \(1+x\), con \(x\neq1\) |
| AS-LIM-02 | N3 | \(\frac{x^{n}-1}{x-1}\), \(n\in\mathbb{N}\) | \(\sum_{k=0}^{n-1}x^{k}\), con \(x\neq1\) como función racional |
| AS-LIM-03 | N3 | \(\frac{x^{n}-a^{n}}{x-a}\) | \(\sum_{k=0}^{n-1}x^{n-1-k}a^{k}\), con \(x\neq a\) como función racional |
| AS-LIM-04 | N3 | \(\sqrt{2}\sqrt{8}\) | \(4\) exacto, no aproximación flotante |
| AS-LIM-05 | N3 | \(x^{6}-1\) | \((x-1)(x+1)(x^{2}+x+1)(x^{2}-x+1)\) |
| AS-LIM-06 | N3 | \(\frac{x^{100}-1}{x-1}\) | Debe devolver la suma geométrica o forma factorizada, sin intentar expandir 100 términos en pantalla |

---

## Taxonomía de fallos sugerida para esta matriz

| Código | Tipo de fallo | Severidad |
|---|---|---|
| AS1 | Simplificación algebraica incorrecta | Crítica |
| AS2 | Pérdida silenciosa de dominio o condiciones | Crítica |
| AS3 | Factorización incompleta o incorrecta | Alta |
| AS4 | Fracciones parciales mal descompuestas | Alta |
| AS5 | Racionalización con signo o conjugado incorrecto | Media |
| AS6 | Faltan casos degenerados en ecuaciones con parámetros | Crítica |
| AS7 | Valor absoluto tratado erróneamente como identidad | Alta |
| AS8 | No se filtran raíces extrañas en ecuaciones radicales | Crítica |
| AS9 | Convención de raíces/exponentes no declarada | Media |
| AS10 | Pérdida de exactitud simbólica o colapso ante expresiones largas | Alta |

---

## Resumen de cobertura

| Sección | N1 | N2 | N3 | Total |
|---|---:|---:|---:|---:|
| A. Simplificación | 4 | 4 | 2 | 10 |
| B. Expansión | 2 | 5 | 3 | 10 |
| C. Factorización | 2 | 5 | 5 | 12 |
| D. Fracciones parciales | 0 | 4 | 4 | 8 |
| E. Racionalización | 2 | 4 | 4 | 10 |
| F. División de polinomios | 1 | 2 | 5 | 8 |
| G. Ecuaciones con parámetros | 0 | 5 | 5 | 10 |
| H. Valor absoluto | 1 | 3 | 6 | 10 |
| I. Raíces extrañas | 0 | 3 | 7 | 10 |
| J. Dominio y condiciones | 0 | 3 | 3 | 6 |
| K. Multivariable y simetría | 0 | 2 | 4 | 6 |
| L. Convenciones de raíces | 0 | 4 | 4 | 8 |
| M. Robustez exacta | 0 | 0 | 6 | 6 |
| **Total** | **12** | **44** | **58** | **114** |
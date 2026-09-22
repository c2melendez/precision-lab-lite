# QA fast CI diagnostic — Lite

- npm_ci: 0
- npm_audit: 1
- typecheck: 0
- unit: 1
- build: 0

## npm-ci
~~~text
npm warn deprecated glob@11.1.0: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me

added 454 packages, and audited 455 packages in 4s

125 packages are looking for funding
  run `npm fund` for details

10 vulnerabilities (7 moderate, 2 high, 1 critical)

To address issues that do not require attention, run:
  npm audit fix

To address all issues (including breaking changes), run:
  npm audit fix --force

Run `npm audit` for details.
~~~

## typecheck
~~~text

> precision-lab-lite@0.1.0 typecheck
> tsc -b --noEmit

~~~

## unit
~~~text

> precision-lab-lite@0.1.0 test
> vitest run


[1m[7m[36m RUN [39m[27m[22m [36mv2.1.9 [39m[90m/home/runner/work/precision-lab-lite/precision-lab-lite[39m

 [32m✓[39m tests/parsing.test.ts [2m([22m[2m51 tests[22m[2m)[22m[90m 46[2mms[22m[39m
 [32m✓[39m tests/statFunctions.test.ts [2m([22m[2m29 tests[22m[2m)[22m[90m 28[2mms[22m[39m
 [32m✓[39m tests/graphing.test.ts [2m([22m[2m23 tests[22m[2m)[22m[90m 239[2mms[22m[39m
 [32m✓[39m tests/matrixOps.test.ts [2m([22m[2m18 tests[22m[2m)[22m[90m 10[2mms[22m[39m
 [32m✓[39m tests/percentile.test.ts [2m([22m[2m18 tests[22m[2m)[22m[90m 12[2mms[22m[39m
 [32m✓[39m tests/calculus.test.ts [2m([22m[2m25 tests[22m[2m)[22m[90m 211[2mms[22m[39m
 [32m✓[39m tests/unitConversion.test.ts [2m([22m[2m22 tests[22m[2m)[22m[90m 6[2mms[22m[39m
 [32m✓[39m tests/exhaustive-module10-keyboard-parity.test.ts [2m([22m[2m31 tests[22m[2m)[22m[90m 40[2mms[22m[39m
 [32m✓[39m tests/useRecentKeysStore.test.ts [2m([22m[2m7 tests[22m[2m)[22m[90m 6[2mms[22m[39m
 [32m✓[39m tests/distributions.test.ts [2m([22m[2m14 tests[22m[2m)[22m[90m 7[2mms[22m[39m
 [32m✓[39m tests/exhaustive-module02-algebra.test.ts [2m([22m[2m18 tests[22m[2m)[22m[90m 255[2mms[22m[39m
 [32m✓[39m tests/exhaustive-module07-statistics.test.ts [2m([22m[2m6 tests[22m[2m)[22m[90m 6[2mms[22m[39m
 [31m❯[39m tests/keyboardEngineParityV5.test.ts [2m([22m[2m33 tests[22m[2m | [22m[31m1 failed[39m[2m)[22m[90m 30[2mms[22m[39m
[31m   [31m×[31m paridad tecla → parser del teclado V5[2m > [22mmantiene marcadas como no disponibles las capacidades conocidas[90m 10[2mms[22m[31m[39m
[31m     → No existe la definición unavailable productoria: expected { glyph: 'Π', …(5) } to match object { unavailable: true }
(5 matching properties omitted from actual)[39m
 [32m✓[39m tests/exhaustive-module06-matrices.test.ts [2m([22m[2m9 tests[22m[2m)[22m[33m 624[2mms[22m[39m
   [33m[2m✓[22m[39m Suite exhaustiva original — Módulo 6: Matrices[2m > [22meigen 3x3 diagonal 2,3,5 [33m416[2mms[22m[39m
 [32m✓[39m tests/eigenOps.test.ts [2m([22m[2m7 tests[22m[2m)[22m[33m 1407[2mms[22m[39m
   [33m[2m✓[22m[39m computeEigenvalues[2m > [22m3x3 diagonal diag(2,3,5): eigenvalores exactos 2,3,5, eigenvectores = base estándar [33m432[2mms[22m[39m
   [33m[2m✓[22m[39m computeEigenvalues[2m > [22m3x3 tridiagonal [[2,1,0],[1,2,1],[0,1,2]]: eigenvalores 2, 2-√2, 2+√2 — mismo caso verificado en K0 contra el paquete real [33m464[2mms[22m[39m
 [32m✓[39m tests/exhaustive-module09-graphing.test.ts [2m([22m[2m6 tests[22m[2m)[22m[90m 31[2mms[22m[39m
 [31m❯[39m tests/keyboardParityV5.test.ts [2m([22m[2m4 tests[22m[2m | [22m[31m1 failed[39m[2m)[22m[90m 15[2mms[22m[39m
[31m   [31m×[31m paridad del teclado V5 de Lite[2m > [22mexpone signo y módulo en Álgebra y conserva límites reales[90m 6[2mms[22m[31m[39m
[31m     → expected false to be true // Object.is equality[39m
 [31m❯[39m tests/exhaustive-module10-keyboard-inventory.test.ts [2m([22m[2m4 tests[22m[2m | [22m[31m1 failed[39m[2m)[22m[90m 25[2mms[22m[39m
[31m   [31m×[31m Suite exhaustiva original — Módulo 10: inventario teclado Lite[2m > [22mLite marca exactamente sus cuatro divergencias documentadas[90m 8[2mms[22m[31m[39m
[31m     → expected [ 'derivada parcial', …(2) ] to deeply equal [ 'derivada parcial', …(3) ][39m
 [31m❯[39m tests/keyboardInventoryV5.test.ts [2m([22m[2m5 tests[22m[2m | [22m[31m1 failed[39m[2m)[22m[90m 43[2mms[22m[39m
[31m   [31m×[31m inventario estructural del teclado V5 de Lite[2m > [22mconserva las capacidades conocidas como no disponibles[90m 7[2mms[22m[31m[39m
[31m     → expected [ …(3) ] to deeply equal ArrayContaining{…}[39m
 [32m✓[39m tests/inequality.test.ts [2m([22m[2m11 tests[22m[2m)[22m[33m 361[2mms[22m[39m
 [32m✓[39m tests/exhaustive-module08-units.test.ts [2m([22m[2m5 tests[22m[2m)[22m[90m 5[2mms[22m[39m
 [32m✓[39m tests/exhaustive-module03-calculus.test.ts [2m([22m[2m10 tests[22m[2m)[22m[90m 144[2mms[22m[39m
 [32m✓[39m tests/linearInequalitySystem.test.ts [2m([22m[2m5 tests[22m[2m)[22m[90m 4[2mms[22m[39m
 [32m✓[39m tests/exhaustive-module04-ode.test.ts [2m([22m[2m7 tests[22m[2m)[22m[90m 155[2mms[22m[39m
 [31m❯[39m tests/exhaustive-module01-trigonometry.test.ts [2m([22m[2m30 tests[22m[2m | [22m[31m2 failed[39m[2m)[22m[90m 33[2mms[22m[39m
[31m   [31m×[31m Suite exhaustiva original — Módulo 1: Trigonometría[2m > [22mtan(pi/2) no produce un valor finito silencioso[90m 11[2mms[22m[31m[39m
[31m     → expected true to be false // Object.is equality[39m
[31m   [31m×[31m Suite exhaustiva original — Módulo 1: Trigonometría[2m > [22msec(pi/2) no produce un valor finito silencioso[90m 3[2mms[22m[31m[39m
[31m     → expected true to be false // Object.is equality[39m
 [32m✓[39m tests/linearSystem.test.ts [2m([22m[2m5 tests[22m[2m)[22m[90m 40[2mms[22m[39m
[90mstdout[2m | tests/linearSystem5x5.test.ts[2m > [22m[2mAuditoría 5x5 (Módulo B)[2m > [22m[2m5x5 solución única: identidad => x_i = i
[22m[39munique: "unique"

[90mstdout[2m | tests/linearSystem5x5.test.ts[2m > [22m[2mAuditoría 5x5 (Módulo B)[2m > [22m[2m5x5 compatible indeterminado: fila 5 dependiente
[22m[39minfinite: "infinite"

[90mstdout[2m | tests/linearSystem5x5.test.ts[2m > [22m[2mAuditoría 5x5 (Módulo B)[2m > [22m[2m5x5 incompatible: fila 5 contradictoria
[22m[39mnone: "none"

 [32m✓[39m tests/linearSystem5x5.test.ts [2m([22m[2m3 tests[22m[2m)[22m[90m 5[2mms[22m[39m
[90mstdout[2m | tests/reciprocalHyperbolicInverses.test.ts[2m > [22m[2mAuditoría Módulo A (hiperbólicas inversas recíprocas) — pipeline real[2m > [22m[2masech(0.5) = acosh(2)
[22m[39masech(0.5) = [33m1.3169578969248166[39m

[90mstdout[2m | tests/reciprocalHyperbolicInverses.test.ts[2m > [22m[2mAuditoría Módulo A (hiperbólicas inversas recíprocas) — pipeline real[2m > [22m[2macsch(2) = asinh(0.5)
[22m[39macsch(2) = [33m0.48121182505960347[39m

[90mstdout[2m | tests/reciprocalHyperbolicInverses.test.ts[2m > [22m[2mAuditoría Módulo A (hiperbólicas inversas recíprocas) — pipeline real[2m > [22m[2macoth(3) = atanh(1/3)
[22m[39macoth(3) = [33m0.34657359027997264[39m

 [32m✓[39m tests/reciprocalHyperbolicInverses.test.ts [2m([22m[2m3 tests[22m[2m)[22m[90m 8[2mms[22m[39m
 [32m✓[39m tests/systemSplit.test.ts [2m([22m[2m6 tests[22m[2m)[22m[90m 4[2mms[22m[39m
 [32m✓[39m tests/exhaustive-module05-complex.test.ts [2m([22m[2m6 tests[22m[2m)[22m[90m 85[2mms[22m[39m
[90mstdout[2m | tests/degreesNotation.test.ts[2m > [22m[2mAuditoría Módulo D (DMS)[2m > [22m[2mNivel 1: 90° = pi/2 rad
[22m[39m90° => ((90)*pi/180) = 1.570796...

[90mstdout[2m | tests/degreesNotation.test.ts[2m > [22m[2mAuditoría Módulo D (DMS)[2m > [22m[2mNivel 2: 45°30′ = 45.5° en radianes
[22m[39m45°30′ => ((45+30/60)*pi/180) = 0.794125... esperado: [33m0.7941248096574199[39m

[90mstdout[2m | tests/degreesNotation.test.ts[2m > [22m[2mAuditoría Módulo D (DMS)[2m > [22m[2mNivel 2 con segundos: 45°30′15″
[22m[39m45°30′15″ => ((45+30/60+15/3600)*pi/180) = 0.794198... esperado: [33m0.7941975317095864[39m

 [32m✓[39m tests/degreesNotation.test.ts [2m([22m[2m3 tests[22m[2m)[22m[90m 17[2mms[22m[39m
 [32m✓[39m tests/cbrtSign.test.ts [2m([22m[2m5 tests[22m[2m)[22m[90m 7[2mms[22m[39m
 [32m✓[39m tests/algebra.test.ts [2m([22m[2m3 tests[22m[2m)[22m[90m 95[2mms[22m[39m
 [32m✓[39m tests/exhaustive-module11-layout-responsive.test.ts [2m([22m[2m2 tests[22m[2m)[22m[90m 3[2mms[22m[39m
 [32m✓[39m tests/plusMinus.test.ts [2m([22m[2m3 tests[22m[2m)[22m[90m 6[2mms[22m[39m

[31m⎯⎯⎯⎯⎯⎯⎯[1m[7m Failed Tests 6 [27m[22m⎯⎯⎯⎯⎯⎯⎯[39m

[31m[1m[7m FAIL [27m[22m[39m tests/exhaustive-module01-trigonometry.test.ts[2m > [22mSuite exhaustiva original — Módulo 1: Trigonometría[2m > [22mtan(pi/2) no produce un valor finito silencioso
[31m[1m[7m FAIL [27m[22m[39m tests/exhaustive-module01-trigonometry.test.ts[2m > [22mSuite exhaustiva original — Módulo 1: Trigonometría[2m > [22msec(pi/2) no produce un valor finito silencioso
[31m[1mAssertionError[22m: expected true to be false // Object.is equality[39m

[32m- Expected[39m
[31m+ Received[39m

[32m- false[39m
[31m+ true[39m

[36m [2m❯[22m tests/exhaustive-module01-trigonometry.test.ts:[2m62:39[22m[39m
    [90m 60| [39m    [34mit[39m([32m`[39m[36m${[39mexpression[36m}[39m[32m no produce un valor finito silencioso`[39m[33m,[39m () [33m=>[39m {
    [90m 61| [39m      [35mconst[39m result [33m=[39m [34mnumeric[39m(expression)[33m;[39m
    [90m 62| [39m      [34mexpect[39m([33mNumber[39m[33m.[39m[34misFinite[39m(result))[33m.[39m[34mtoBe[39m([35mfalse[39m)[33m;[39m
    [90m   | [39m                                      [31m^[39m
    [90m 63| [39m    })[33m;[39m
    [90m 64| [39m  }

[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/6]⎯[22m[39m

[31m[1m[7m FAIL [27m[22m[39m tests/exhaustive-module10-keyboard-inventory.test.ts[2m > [22mSuite exhaustiva original — Módulo 10: inventario teclado Lite[2m > [22mLite marca exactamente sus cuatro divergencias documentadas
[31m[1mAssertionError[22m: expected [ 'derivada parcial', …(2) ] to deeply equal [ 'derivada parcial', …(3) ][39m

[32m- Expected[39m
[31m+ Received[39m

[2m  Array [[22m
[2m    "derivada parcial",[22m
[32m-   "productoria",[39m
[2m    "residuo en un polo (funciones racionales)",[22m
[2m    "singularidades (funciones racionales)",[22m
[2m  ][22m

[36m [2m❯[22m tests/exhaustive-module10-keyboard-inventory.test.ts:[2m56:25[22m[39m
    [90m 54| [39m  [34mit[39m([32m"Lite marca exactamente sus cuatro divergencias documentadas"[39m[33m,[39m ()…
    [90m 55| [39m    [35mconst[39m unavailable [33m=[39m [[33m...[39m[35mnew[39m [33mSet[39m(allKeys[33m.[39m[34mfilter[39m(k [33m=>[39m k[33m.[39munavailable)…
    [90m 56| [39m    [34mexpect[39m(unavailable)[33m.[39m[34mtoEqual[39m([
    [90m   | [39m                        [31m^[39m
    [90m 57| [39m      [32m"derivada parcial"[39m[33m,[39m
    [90m 58| [39m      [32m"productoria"[39m[33m,[39m

[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/6]⎯[22m[39m

[31m[1m[7m FAIL [27m[22m[39m tests/keyboardEngineParityV5.test.ts[2m > [22mparidad tecla → parser del teclado V5[2m > [22mmantiene marcadas como no disponibles las capacidades conocidas
[31m[1mAssertionError[22m: No existe la definición unavailable productoria: expected { glyph: 'Π', …(5) } to match object { unavailable: true }
(5 matching properties omitted from actual)[39m

[32m- Expected[39m
[31m+ Received[39m

[2m  Object {[22m
[32m-   "unavailable": true,[39m
[31m+   "unavailable": false,[39m
[2m  }[22m

[36m [2m❯[22m tests/keyboardEngineParityV5.test.ts:[2m72:81[22m[39m
    [90m 70| [39m      [32m"singularidades (funciones racionales)"[39m[33m,[39m
    [90m 71| [39m    ]) {
    [90m 72| [39m      [34mexpect[39m([34mkeyByLabel[39m(label)[33m,[39m [32m"No existe la definición unavailable "[39m…
    [90m   | [39m                                                                                [31m^[39m
    [90m 73| [39m        unavailable[33m:[39m [35mtrue[39m[33m,[39m
    [90m 74| [39m      })[33m;[39m

[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/6]⎯[22m[39m

[31m[1m[7m FAIL [27m[22m[39m tests/keyboardInventoryV5.test.ts[2m > [22minventario estructural del teclado V5 de Lite[2m > [22mconserva las capacidades conocidas como no disponibles
[31m[1mAssertionError[22m: expected [ …(3) ] to deeply equal ArrayContaining{…}[39m

[32m- Expected[39m
[31m+ Received[39m

[32m- ArrayContaining [[39m
[32m-   "productoria",[39m
[32m-   "derivada parcial",[39m
[31m+ Array [[39m
[2m    "residuo en un polo (funciones racionales)",[22m
[2m    "singularidades (funciones racionales)",[22m
[31m+   "derivada parcial",[39m
[2m  ][22m

[36m [2m❯[22m tests/keyboardInventoryV5.test.ts:[2m67:31[22m[39m
    [90m 65| [39m      [33m.[39m[34mmap[39m((key) [33m=>[39m key[33m.[39mariaLabel)[33m;[39m
    [90m 66| [39m
    [90m 67| [39m    [34mexpect[39m(unavailableLabels)[33m.[39m[34mtoEqual[39m(
    [90m   | [39m                              [31m^[39m
    [90m 68| [39m      expect[33m.[39m[34marrayContaining[39m([
    [90m 69| [39m        [32m"productoria"[39m[33m,[39m

[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/6]⎯[22m[39m

[31m[1m[7m FAIL [27m[22m[39m tests/keyboardParityV5.test.ts[2m > [22mparidad del teclado V5 de Lite[2m > [22mexpone signo y módulo en Álgebra y conserva límites reales
[31m[1mAssertionError[22m: expected false to be true // Object.is equality[39m

[32m- Expected[39m
[31m+ Received[39m

[32m- true[39m
[31m+ false[39m

[36m [2m❯[22m tests/keyboardParityV5.test.ts:[2m47:82[22m[39m
    [90m 45| [39m    [34mexpect[39m(calculus[33m.[39m[34mfind[39m((key) [33m=>[39m key[33m.[39mariaLabel [33m===[39m [32m"límite"[39m)[33m?.[39munavail…
    [90m 46| [39m    [34mexpect[39m(calculus[33m.[39m[34mfind[39m((key) [33m=>[39m key[33m.[39mariaLabel [33m===[39m [32m"derivada parcial"[39m…
    [90m 47| [39m    [34mexpect[39m(calculus[33m.[39m[34mfind[39m((key) [33m=>[39m key[33m.[39mariaLabel [33m===[39m [32m"productoria"[39m)[33m?.[39mun…
    [90m   | [39m                                                                                 [31m^[39m
    [90m 48| [39m  })[33m;[39m
    [90m 49| [39m})[33m;[39m

[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/6]⎯[22m[39m

[2m Test Files [22m [1m[31m5 failed[39m[22m[2m | [22m[1m[32m30 passed[39m[22m[90m (35)[39m
[2m      Tests [22m [1m[31m6 failed[39m[22m[2m | [22m[1m[32m431 passed[39m[22m[90m (437)[39m
[2m   Start at [22m 04:57:16
[2m   Duration [22m 5.76s[2m (transform 776ms, setup 0ms, collect 4.37s, tests 4.02s, environment 7ms, prepare 2.86s)[22m


::error file=/home/runner/work/precision-lab-lite/precision-lab-lite/tests/exhaustive-module01-trigonometry.test.ts,title=tests/exhaustive-module01-trigonometry.test.ts > Suite exhaustiva original — Módulo 1%3A Trigonometría > tan(pi/2) no produce un valor finito silencioso,line=62,column=39::AssertionError: expected true to be false // Object.is equality%0A%0A- Expected%0A+ Received%0A%0A- false%0A+ true%0A%0A ❯ tests/exhaustive-module01-trigonometry.test.ts:62:39%0A%0A

::error file=/home/runner/work/precision-lab-lite/precision-lab-lite/tests/exhaustive-module01-trigonometry.test.ts,title=tests/exhaustive-module01-trigonometry.test.ts > Suite exhaustiva original — Módulo 1%3A Trigonometría > sec(pi/2) no produce un valor finito silencioso,line=62,column=39::AssertionError: expected true to be false // Object.is equality%0A%0A- Expected%0A+ Received%0A%0A- false%0A+ true%0A%0A ❯ tests/exhaustive-module01-trigonometry.test.ts:62:39%0A%0A

::error file=/home/runner/work/precision-lab-lite/precision-lab-lite/tests/exhaustive-module10-keyboard-inventory.test.ts,title=tests/exhaustive-module10-keyboard-inventory.test.ts > Suite exhaustiva original — Módulo 10%3A inventario teclado Lite > Lite marca exactamente sus cuatro divergencias documentadas,line=56,column=25::AssertionError: expected [ 'derivada parcial', …(2) ] to deeply equal [ 'derivada parcial', …(3) ]%0A%0A- Expected%0A+ Received%0A%0A  Array [%0A    "derivada parcial",%0A-   "productoria",%0A    "residuo en un polo (funciones racionales)",%0A    "singularidades (funciones racionales)",%0A  ]%0A%0A ❯ tests/exhaustive-module10-keyboard-inventory.test.ts:56:25%0A%0A

::error file=/home/runner/work/precision-lab-lite/precision-lab-lite/tests/keyboardEngineParityV5.test.ts,title=tests/keyboardEngineParityV5.test.ts > paridad tecla → parser del teclado V5 > mantiene marcadas como no disponibles las capacidades conocidas,line=72,column=81::AssertionError: No existe la definición unavailable productoria: expected { glyph: 'Π', …(5) } to match object { unavailable: true }%0A(5 matching properties omitted from actual)%0A%0A- Expected%0A+ Received%0A%0A  Object {%0A-   "unavailable": true,%0A+   "unavailable": false,%0A  }%0A%0A ❯ tests/keyboardEngineParityV5.test.ts:72:81%0A%0A

::error file=/home/runner/work/precision-lab-lite/precision-lab-lite/tests/keyboardInventoryV5.test.ts,title=tests/keyboardInventoryV5.test.ts > inventario estructural del teclado V5 de Lite > conserva las capacidades conocidas como no disponibles,line=67,column=31::AssertionError: expected [ …(3) ] to deeply equal ArrayContaining{…}%0A%0A- Expected%0A+ Received%0A%0A- ArrayContaining [%0A-   "productoria",%0A-   "derivada parcial",%0A+ Array [%0A    "residuo en un polo (funciones racionales)",%0A    "singularidades (funciones racionales)",%0A+   "derivada parcial",%0A  ]%0A%0A ❯ tests/keyboardInventoryV5.test.ts:67:31%0A%0A

::error file=/home/runner/work/precision-lab-lite/precision-lab-lite/tests/keyboardParityV5.test.ts,title=tests/keyboardParityV5.test.ts > paridad del teclado V5 de Lite > expone signo y módulo en Álgebra y conserva límites reales,line=47,column=82::AssertionError: expected false to be true // Object.is equality%0A%0A- Expected%0A+ Received%0A%0A- true%0A+ false%0A%0A ❯ tests/keyboardParityV5.test.ts:47:82%0A%0A
~~~

## build
~~~text

> precision-lab-lite@0.1.0 build
> tsc -b && vite build

[36mvite v5.4.21 [32mbuilding for production...[36m[39m
transforming...
node_modules/algebrite/dist/algebrite.js (24083:6): Use of eval in "node_modules/algebrite/dist/algebrite.js" is strongly discouraged as it poses security risks and may cause issues with minification.
node_modules/algebrite/dist/algebrite.js (24083:6): Use of eval in "node_modules/algebrite/dist/algebrite.js" is strongly discouraged as it poses security risks and may cause issues with minification.
node_modules/algebrite/dist/algebrite.js (24083:6): Use of eval in "node_modules/algebrite/dist/algebrite.js" is strongly discouraged as it poses security risks and may cause issues with minification.
node_modules/algebrite/dist/algebrite.js (24083:6): Use of eval in "node_modules/algebrite/dist/algebrite.js" is strongly discouraged as it poses security risks and may cause issues with minification.
node_modules/algebrite/dist/algebrite.js (24083:6): Use of eval in "node_modules/algebrite/dist/algebrite.js" is strongly discouraged as it poses security risks and may cause issues with minification.
node_modules/algebrite/dist/algebrite.js (24083:6): Use of eval in "node_modules/algebrite/dist/algebrite.js" is strongly discouraged as it poses security risks and may cause issues with minification.
node_modules/algebrite/dist/algebrite.js (24083:6): Use of eval in "node_modules/algebrite/dist/algebrite.js" is strongly discouraged as it poses security risks and may cause issues with minification.
[32m✓[39m 114 modules transformed.
node_modules/algebrite/dist/algebrite.js (24083:6): Use of eval in "node_modules/algebrite/dist/algebrite.js" is strongly discouraged as it poses security risks and may cause issues with minification.
rendering chunks...
computing gzip size...
[2mdist/[22m[32mregisterSW.js                                    [39m[1m[2m    0.17 kB[22m[1m[22m
[2mdist/[22m[32mmanifest.webmanifest                             [39m[1m[2m    0.56 kB[22m[1m[22m
[2mdist/[22m[32mindex.html                                       [39m[1m[2m    1.03 kB[22m[1m[22m[2m │ gzip:   0.53 kB[22m
[2mdist/[22m[2massets/[22m[32mKaTeX_Size4-Regular-Dl5lxZxV.woff2        [39m[1m[2m    4.93 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mKaTeX_Size2-Regular-Dy4dx90m.woff2        [39m[1m[2m    5.21 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mKaTeX_Size1-Regular-mCD8mA8B.woff2        [39m[1m[2m    5.47 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mKaTeX_Caligraphic-Regular-Di6jR-x-.woff2  [39m[1m[2m    6.91 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mKaTeX_Caligraphic-Bold-Dq_IR9rO.woff2     [39m[1m[2m    6.91 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mKaTeX_Script-Regular-D3wIWfF6.woff2       [39m[1m[2m    9.64 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mKaTeX_SansSerif-Regular-DDBCnlJ7.woff2    [39m[1m[2m   10.34 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mKaTeX_Fraktur-Regular-CTYiF6lA.woff2      [39m[1m[2m   11.32 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mKaTeX_Fraktur-Bold-CL6g_b3V.woff2         [39m[1m[2m   11.35 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mKaTeX_SansSerif-Italic-C3H0VqGB.woff2     [39m[1m[2m   12.03 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mKaTeX_SansSerif-Bold-D1sUS0GD.woff2       [39m[1m[2m   12.22 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mKaTeX_Typewriter-Regular-CO6r4hn1.woff2   [39m[1m[2m   13.57 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mKaTeX_Math-BoldItalic-CZnvNsCZ.woff2      [39m[1m[2m   16.40 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mKaTeX_Math-Italic-t53AETM-.woff2          [39m[1m[2m   16.44 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mKaTeX_Main-BoldItalic-DxDJ3AOS.woff2      [39m[1m[2m   16.78 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mKaTeX_Main-Italic-NWA7e6Wa.woff2          [39m[1m[2m   16.99 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mKaTeX_Main-Bold-Cx986IdX.woff2            [39m[1m[2m   25.32 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mKaTeX_Main-Regular-B22Nviop.woff2         [39m[1m[2m   26.27 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mKaTeX_AMS-Regular-BQhdFMY1.woff2          [39m[1m[2m   28.08 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mcompute.worker-BS5Lpyoe.js                [39m[1m[2m  427.25 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[35mindex-bhCVTFha.css                        [39m[1m[2m   57.97 kB[22m[1m[22m[2m │ gzip:  14.13 kB[22m
[2mdist/[22m[2massets/[22m[36mindex-DGL4ea7n.js                         [39m[1m[33m1,451.21 kB[39m[22m[2m │ gzip: 393.08 kB[22m
[33m
(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rollupOptions.output.manualChunks to improve chunking: https://rollupjs.org/configuration-options/#output-manualchunks
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.[39m
[32m✓ built in 9.86s[39m

[36mPWA v0.20.5[39m
mode      [35mgenerateSW[39m
precache  [32m31 entries[39m [2m(2195.95 KiB)[22m
files generated
  [2mdist/sw.js[22m
  [2mdist/workbox-9c191d2f.js[22m
~~~

## npm audit stderr
~~~text
~~~

## npm audit metadata
~~~json
{
  "vulnerabilities": {
    "info": 0,
    "low": 0,
    "moderate": 7,
    "high": 2,
    "critical": 1,
    "total": 10
  },
  "dependencies": {
    "prod": 24,
    "dev": 477,
    "optional": 50,
    "peer": 0,
    "peerOptional": 0,
    "total": 500
  }
}
~~~

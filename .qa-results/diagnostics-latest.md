# QA fast CI diagnostic — Lite

- npm_ci: 0
- npm_audit: 1
- typecheck: 0
- unit: 1
- build: 0

## npm-ci
~~~text
npm warn deprecated glob@11.1.0: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me

added 454 packages, and audited 455 packages in 6s

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

 [32m✓[39m tests/parsing.test.ts [2m([22m[2m51 tests[22m[2m)[22m[90m 20[2mms[22m[39m
 [32m✓[39m tests/graphing.test.ts [2m([22m[2m23 tests[22m[2m)[22m[90m 171[2mms[22m[39m
 [32m✓[39m tests/statFunctions.test.ts [2m([22m[2m29 tests[22m[2m)[22m[90m 22[2mms[22m[39m
 [32m✓[39m tests/matrixOps.test.ts [2m([22m[2m18 tests[22m[2m)[22m[90m 10[2mms[22m[39m
 [32m✓[39m tests/percentile.test.ts [2m([22m[2m18 tests[22m[2m)[22m[90m 25[2mms[22m[39m
 [32m✓[39m tests/calculus.test.ts [2m([22m[2m25 tests[22m[2m)[22m[90m 178[2mms[22m[39m
 [32m✓[39m tests/unitConversion.test.ts [2m([22m[2m22 tests[22m[2m)[22m[90m 5[2mms[22m[39m
 [31m❯[39m tests/exhaustive-module10-keyboard-parity.test.ts [2m([22m[2m31 tests[22m[2m | [22m[31m1 failed[39m[2m)[22m[90m 33[2mms[22m[39m
[31m   [31m×[31m Suite exhaustiva original — Módulo 10: teclado ↔ motor (Lite)[2m > [22mProductoria Π cumple el requisito actualizado: activa y con plantilla real[90m 5[2mms[22m[31m[39m
[31m     → expected true to be falsy[39m
 [32m✓[39m tests/useRecentKeysStore.test.ts [2m([22m[2m7 tests[22m[2m)[22m[90m 4[2mms[22m[39m
 [32m✓[39m tests/distributions.test.ts [2m([22m[2m14 tests[22m[2m)[22m[90m 6[2mms[22m[39m
 [32m✓[39m tests/exhaustive-module02-algebra.test.ts [2m([22m[2m18 tests[22m[2m)[22m[90m 201[2mms[22m[39m
 [32m✓[39m tests/exhaustive-module07-statistics.test.ts [2m([22m[2m6 tests[22m[2m)[22m[90m 6[2mms[22m[39m
 [32m✓[39m tests/eigenOps.test.ts [2m([22m[2m7 tests[22m[2m)[22m[33m 1041[2mms[22m[39m
   [33m[2m✓[22m[39m computeEigenvalues[2m > [22m3x3 diagonal diag(2,3,5): eigenvalores exactos 2,3,5, eigenvectores = base estándar [33m307[2mms[22m[39m
   [33m[2m✓[22m[39m computeEigenvalues[2m > [22m3x3 tridiagonal [[2,1,0],[1,2,1],[0,1,2]]: eigenvalores 2, 2-√2, 2+√2 — mismo caso verificado en K0 contra el paquete real [33m351[2mms[22m[39m
 [32m✓[39m tests/keyboardEngineParityV5.test.ts [2m([22m[2m33 tests[22m[2m)[22m[90m 10[2mms[22m[39m
 [32m✓[39m tests/exhaustive-module06-matrices.test.ts [2m([22m[2m9 tests[22m[2m)[22m[33m 468[2mms[22m[39m
   [33m[2m✓[22m[39m Suite exhaustiva original — Módulo 6: Matrices[2m > [22meigen 3x3 diagonal 2,3,5 [33m321[2mms[22m[39m
 [32m✓[39m tests/keyboardParityV5.test.ts [2m([22m[2m4 tests[22m[2m)[22m[90m 9[2mms[22m[39m
 [32m✓[39m tests/exhaustive-module09-graphing.test.ts [2m([22m[2m6 tests[22m[2m)[22m[90m 22[2mms[22m[39m
 [32m✓[39m tests/keyboardInventoryV5.test.ts [2m([22m[2m5 tests[22m[2m)[22m[90m 17[2mms[22m[39m
 [32m✓[39m tests/exhaustive-module10-keyboard-inventory.test.ts [2m([22m[2m4 tests[22m[2m)[22m[90m 13[2mms[22m[39m
 [32m✓[39m tests/exhaustive-module08-units.test.ts [2m([22m[2m5 tests[22m[2m)[22m[90m 4[2mms[22m[39m
 [32m✓[39m tests/inequality.test.ts [2m([22m[2m11 tests[22m[2m)[22m[90m 300[2mms[22m[39m
 [32m✓[39m tests/exhaustive-module03-calculus.test.ts [2m([22m[2m10 tests[22m[2m)[22m[90m 87[2mms[22m[39m
 [32m✓[39m tests/linearInequalitySystem.test.ts [2m([22m[2m5 tests[22m[2m)[22m[90m 5[2mms[22m[39m
 [32m✓[39m tests/exhaustive-module04-ode.test.ts [2m([22m[2m7 tests[22m[2m)[22m[90m 115[2mms[22m[39m
 [31m❯[39m tests/exhaustive-module01-trigonometry.test.ts [2m([22m[2m30 tests[22m[2m | [22m[31m2 failed[39m[2m)[22m[90m 22[2mms[22m[39m
[31m   [31m×[31m Suite exhaustiva original — Módulo 1: Trigonometría[2m > [22mtan(pi/2) no produce un valor finito silencioso[90m 8[2mms[22m[31m[39m
[31m     → expected true to be false // Object.is equality[39m
[31m   [31m×[31m Suite exhaustiva original — Módulo 1: Trigonometría[2m > [22msec(pi/2) no produce un valor finito silencioso[90m 2[2mms[22m[31m[39m
[31m     → expected true to be false // Object.is equality[39m
 [32m✓[39m tests/linearSystem.test.ts [2m([22m[2m5 tests[22m[2m)[22m[90m 45[2mms[22m[39m
[90mstdout[2m | tests/linearSystem5x5.test.ts[2m > [22m[2mAuditoría 5x5 (Módulo B)[2m > [22m[2m5x5 solución única: identidad => x_i = i
[22m[39munique: "unique"

[90mstdout[2m | tests/linearSystem5x5.test.ts[2m > [22m[2mAuditoría 5x5 (Módulo B)[2m > [22m[2m5x5 compatible indeterminado: fila 5 dependiente
[22m[39minfinite: "infinite"

[90mstdout[2m | tests/linearSystem5x5.test.ts[2m > [22m[2mAuditoría 5x5 (Módulo B)[2m > [22m[2m5x5 incompatible: fila 5 contradictoria
[22m[39mnone: "none"

 [32m✓[39m tests/linearSystem5x5.test.ts [2m([22m[2m3 tests[22m[2m)[22m[90m 4[2mms[22m[39m
[90mstdout[2m | tests/reciprocalHyperbolicInverses.test.ts[2m > [22m[2mAuditoría Módulo A (hiperbólicas inversas recíprocas) — pipeline real[2m > [22m[2masech(0.5) = acosh(2)
[22m[39masech(0.5) = [33m1.3169578969248166[39m

[90mstdout[2m | tests/reciprocalHyperbolicInverses.test.ts[2m > [22m[2mAuditoría Módulo A (hiperbólicas inversas recíprocas) — pipeline real[2m > [22m[2macsch(2) = asinh(0.5)
[22m[39macsch(2) = [33m0.48121182505960347[39m

[90mstdout[2m | tests/reciprocalHyperbolicInverses.test.ts[2m > [22m[2mAuditoría Módulo A (hiperbólicas inversas recíprocas) — pipeline real[2m > [22m[2macoth(3) = atanh(1/3)
[22m[39macoth(3) = [33m0.34657359027997264[39m

 [32m✓[39m tests/reciprocalHyperbolicInverses.test.ts [2m([22m[2m3 tests[22m[2m)[22m[90m 6[2mms[22m[39m
 [32m✓[39m tests/exhaustive-module05-complex.test.ts [2m([22m[2m6 tests[22m[2m)[22m[90m 50[2mms[22m[39m
 [32m✓[39m tests/systemSplit.test.ts [2m([22m[2m6 tests[22m[2m)[22m[90m 4[2mms[22m[39m
[90mstdout[2m | tests/degreesNotation.test.ts[2m > [22m[2mAuditoría Módulo D (DMS)[2m > [22m[2mNivel 1: 90° = pi/2 rad
[22m[39m90° => ((90)*pi/180) = 1.570796...

[90mstdout[2m | tests/degreesNotation.test.ts[2m > [22m[2mAuditoría Módulo D (DMS)[2m > [22m[2mNivel 2: 45°30′ = 45.5° en radianes
[22m[39m45°30′ => ((45+30/60)*pi/180) = 0.794125... esperado: [33m0.7941248096574199[39m

[90mstdout[2m | tests/degreesNotation.test.ts[2m > [22m[2mAuditoría Módulo D (DMS)[2m > [22m[2mNivel 2 con segundos: 45°30′15″
[22m[39m45°30′15″ => ((45+30/60+15/3600)*pi/180) = 0.794198... esperado: [33m0.7941975317095864[39m

 [32m✓[39m tests/degreesNotation.test.ts [2m([22m[2m3 tests[22m[2m)[22m[90m 20[2mms[22m[39m
 [32m✓[39m tests/cbrtSign.test.ts [2m([22m[2m5 tests[22m[2m)[22m[90m 14[2mms[22m[39m
 [32m✓[39m tests/algebra.test.ts [2m([22m[2m3 tests[22m[2m)[22m[90m 82[2mms[22m[39m
 [32m✓[39m tests/exhaustive-module11-layout-responsive.test.ts [2m([22m[2m2 tests[22m[2m)[22m[90m 6[2mms[22m[39m
 [32m✓[39m tests/plusMinus.test.ts [2m([22m[2m3 tests[22m[2m)[22m[90m 5[2mms[22m[39m

[31m⎯⎯⎯⎯⎯⎯⎯[1m[7m Failed Tests 3 [27m[22m⎯⎯⎯⎯⎯⎯⎯[39m

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

[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/3]⎯[22m[39m

[31m[1m[7m FAIL [27m[22m[39m tests/exhaustive-module10-keyboard-parity.test.ts[2m > [22mSuite exhaustiva original — Módulo 10: teclado ↔ motor (Lite)[2m > [22mProductoria Π cumple el requisito actualizado: activa y con plantilla real
[31m[1mAssertionError[22m: expected true to be falsy[39m

[32m- Expected[39m
[31m+ Received[39m

[32m- false[39m
[31m+ true[39m

[36m [2m❯[22m tests/exhaustive-module10-keyboard-parity.test.ts:[2m38:34[22m[39m
    [90m 36| [39m    [35mconst[39m product [33m=[39m [34mkeyByLabel[39m([32m"productoria"[39m)[33m;[39m
    [90m 37| [39m    [34mexpect[39m(product)[33m.[39m[34mtoBeDefined[39m()[33m;[39m
    [90m 38| [39m    [34mexpect[39m(product[33m?.[39munavailable)[33m.[39m[34mtoBeFalsy[39m()[33m;[39m
    [90m   | [39m                                 [31m^[39m
    [90m 39| [39m    [34mexpect[39m(product[33m?.[39minsertLatex[33m.[39m[34mtrim[39m())[33m.[39mnot[33m.[39m[34mtoBe[39m([32m""[39m)[33m;[39m
    [90m 40| [39m  })[33m;[39m

[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/3]⎯[22m[39m

[2m Test Files [22m [1m[31m2 failed[39m[22m[2m | [22m[1m[32m33 passed[39m[22m[90m (35)[39m
[2m      Tests [22m [1m[31m3 failed[39m[22m[2m | [22m[1m[32m434 passed[39m[22m[90m (437)[39m
[2m   Start at [22m 04:49:57
[2m   Duration [22m 4.72s[2m (transform 714ms, setup 0ms, collect 3.62s, tests 3.03s, environment 5ms, prepare 2.27s)[22m


::error file=/home/runner/work/precision-lab-lite/precision-lab-lite/tests/exhaustive-module01-trigonometry.test.ts,title=tests/exhaustive-module01-trigonometry.test.ts > Suite exhaustiva original — Módulo 1%3A Trigonometría > tan(pi/2) no produce un valor finito silencioso,line=62,column=39::AssertionError: expected true to be false // Object.is equality%0A%0A- Expected%0A+ Received%0A%0A- false%0A+ true%0A%0A ❯ tests/exhaustive-module01-trigonometry.test.ts:62:39%0A%0A

::error file=/home/runner/work/precision-lab-lite/precision-lab-lite/tests/exhaustive-module01-trigonometry.test.ts,title=tests/exhaustive-module01-trigonometry.test.ts > Suite exhaustiva original — Módulo 1%3A Trigonometría > sec(pi/2) no produce un valor finito silencioso,line=62,column=39::AssertionError: expected true to be false // Object.is equality%0A%0A- Expected%0A+ Received%0A%0A- false%0A+ true%0A%0A ❯ tests/exhaustive-module01-trigonometry.test.ts:62:39%0A%0A

::error file=/home/runner/work/precision-lab-lite/precision-lab-lite/tests/exhaustive-module10-keyboard-parity.test.ts,title=tests/exhaustive-module10-keyboard-parity.test.ts > Suite exhaustiva original — Módulo 10%3A teclado ↔ motor (Lite) > Productoria Π cumple el requisito actualizado%3A activa y con plantilla real,line=38,column=34::AssertionError: expected true to be falsy%0A%0A- Expected%0A+ Received%0A%0A- false%0A+ true%0A%0A ❯ tests/exhaustive-module10-keyboard-parity.test.ts:38:34%0A%0A
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
[2mdist/[22m[2massets/[22m[32mcompute.worker-bpySG-cg.js                [39m[1m[2m  426.08 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[35mindex-bhCVTFha.css                        [39m[1m[2m   57.97 kB[22m[1m[22m[2m │ gzip:  14.13 kB[22m
[2mdist/[22m[2massets/[22m[36mindex-DiD6jtu7.js                         [39m[1m[33m1,450.34 kB[39m[22m[2m │ gzip: 392.83 kB[22m
[33m
(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rollupOptions.output.manualChunks to improve chunking: https://rollupjs.org/configuration-options/#output-manualchunks
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.[39m
[32m✓ built in 8.34s[39m

[36mPWA v0.20.5[39m
mode      [35mgenerateSW[39m
precache  [32m31 entries[39m [2m(2193.94 KiB)[22m
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

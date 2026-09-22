# QA fast CI diagnostic — Lite

- npm_ci: 0
- npm_audit: 1
- typecheck: 2
- unit: 0
- build: 2

## npm-ci
~~~text
npm warn deprecated glob@11.1.0: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me

added 454 packages, and audited 455 packages in 7s

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

src/components/NaturalInput.tsx(15,5): error TS2687: All declarations of 'mathVirtualKeyboard' must have identical modifiers.
src/components/NaturalInput.tsx(15,5): error TS2717: Subsequent property declarations must have the same type.  Property 'mathVirtualKeyboard' must be of type 'VirtualKeyboardInterface & EventTarget', but here has type '{ hide: () => void; } | undefined'.
src/components/NaturalInput.tsx(79,7): error TS18047: 'el' is possibly 'null'.
~~~

## unit
~~~text

> precision-lab-lite@0.1.0 test
> vitest run


[1m[7m[36m RUN [39m[27m[22m [36mv2.1.9 [39m[90m/home/runner/work/precision-lab-lite/precision-lab-lite[39m

 [32m✓[39m tests/parsing.test.ts [2m([22m[2m51 tests[22m[2m)[22m[90m 23[2mms[22m[39m
 [32m✓[39m tests/statFunctions.test.ts [2m([22m[2m29 tests[22m[2m)[22m[90m 18[2mms[22m[39m
 [32m✓[39m tests/graphing.test.ts [2m([22m[2m23 tests[22m[2m)[22m[90m 184[2mms[22m[39m
 [32m✓[39m tests/matrixOps.test.ts [2m([22m[2m18 tests[22m[2m)[22m[90m 10[2mms[22m[39m
 [32m✓[39m tests/percentile.test.ts [2m([22m[2m18 tests[22m[2m)[22m[90m 10[2mms[22m[39m
 [32m✓[39m tests/calculus.test.ts [2m([22m[2m25 tests[22m[2m)[22m[90m 164[2mms[22m[39m
 [32m✓[39m tests/unitConversion.test.ts [2m([22m[2m22 tests[22m[2m)[22m[90m 7[2mms[22m[39m
 [32m✓[39m tests/exhaustive-module10-keyboard-parity.test.ts [2m([22m[2m31 tests[22m[2m)[22m[90m 31[2mms[22m[39m
 [32m✓[39m tests/useRecentKeysStore.test.ts [2m([22m[2m7 tests[22m[2m)[22m[90m 5[2mms[22m[39m
 [32m✓[39m tests/distributions.test.ts [2m([22m[2m14 tests[22m[2m)[22m[90m 5[2mms[22m[39m
 [32m✓[39m tests/exhaustive-module02-algebra.test.ts [2m([22m[2m18 tests[22m[2m)[22m[90m 172[2mms[22m[39m
 [32m✓[39m tests/exhaustive-module07-statistics.test.ts [2m([22m[2m6 tests[22m[2m)[22m[90m 7[2mms[22m[39m
 [32m✓[39m tests/eigenOps.test.ts [2m([22m[2m7 tests[22m[2m)[22m[33m 952[2mms[22m[39m
   [33m[2m✓[22m[39m computeEigenvalues[2m > [22m3x3 diagonal diag(2,3,5): eigenvalores exactos 2,3,5, eigenvectores = base estándar [33m307[2mms[22m[39m
 [32m✓[39m tests/exhaustive-module06-matrices.test.ts [2m([22m[2m9 tests[22m[2m)[22m[33m 415[2mms[22m[39m
 [32m✓[39m tests/keyboardParityV5.test.ts [2m([22m[2m4 tests[22m[2m)[22m[90m 9[2mms[22m[39m
 [32m✓[39m tests/keyboardEngineParityV5.test.ts [2m([22m[2m33 tests[22m[2m)[22m[90m 20[2mms[22m[39m
 [32m✓[39m tests/exhaustive-module09-graphing.test.ts [2m([22m[2m6 tests[22m[2m)[22m[90m 23[2mms[22m[39m
 [32m✓[39m tests/keyboardInventoryV5.test.ts [2m([22m[2m5 tests[22m[2m)[22m[90m 31[2mms[22m[39m
 [32m✓[39m tests/exhaustive-module10-keyboard-inventory.test.ts [2m([22m[2m4 tests[22m[2m)[22m[90m 39[2mms[22m[39m
 [32m✓[39m tests/inequality.test.ts [2m([22m[2m11 tests[22m[2m)[22m[90m 222[2mms[22m[39m
 [32m✓[39m tests/exhaustive-module08-units.test.ts [2m([22m[2m5 tests[22m[2m)[22m[90m 7[2mms[22m[39m
 [32m✓[39m tests/exhaustive-module03-calculus.test.ts [2m([22m[2m10 tests[22m[2m)[22m[90m 103[2mms[22m[39m
 [32m✓[39m tests/linearInequalitySystem.test.ts [2m([22m[2m5 tests[22m[2m)[22m[90m 3[2mms[22m[39m
 [32m✓[39m tests/exhaustive-module04-ode.test.ts [2m([22m[2m7 tests[22m[2m)[22m[90m 112[2mms[22m[39m
 [32m✓[39m tests/exhaustive-module01-trigonometry.test.ts [2m([22m[2m30 tests[22m[2m)[22m[90m 14[2mms[22m[39m
[90mstdout[2m | tests/linearSystem5x5.test.ts[2m > [22m[2mAuditoría 5x5 (Módulo B)[2m > [22m[2m5x5 solución única: identidad => x_i = i
[22m[39munique: "unique"

[90mstdout[2m | tests/linearSystem5x5.test.ts[2m > [22m[2mAuditoría 5x5 (Módulo B)[2m > [22m[2m5x5 compatible indeterminado: fila 5 dependiente
[22m[39minfinite: "infinite"

[90mstdout[2m | tests/linearSystem5x5.test.ts[2m > [22m[2mAuditoría 5x5 (Módulo B)[2m > [22m[2m5x5 incompatible: fila 5 contradictoria
[22m[39mnone: "none"

 [32m✓[39m tests/linearSystem5x5.test.ts [2m([22m[2m3 tests[22m[2m)[22m[90m 5[2mms[22m[39m
 [32m✓[39m tests/linearSystem.test.ts [2m([22m[2m5 tests[22m[2m)[22m[90m 41[2mms[22m[39m
[90mstdout[2m | tests/reciprocalHyperbolicInverses.test.ts[2m > [22m[2mAuditoría Módulo A (hiperbólicas inversas recíprocas) — pipeline real[2m > [22m[2masech(0.5) = acosh(2)
[22m[39masech(0.5) = [33m1.3169578969248166[39m

[90mstdout[2m | tests/reciprocalHyperbolicInverses.test.ts[2m > [22m[2mAuditoría Módulo A (hiperbólicas inversas recíprocas) — pipeline real[2m > [22m[2macsch(2) = asinh(0.5)
[22m[39macsch(2) = [33m0.48121182505960347[39m

[90mstdout[2m | tests/reciprocalHyperbolicInverses.test.ts[2m > [22m[2mAuditoría Módulo A (hiperbólicas inversas recíprocas) — pipeline real[2m > [22m[2macoth(3) = atanh(1/3)
[22m[39macoth(3) = [33m0.34657359027997264[39m

 [32m✓[39m tests/reciprocalHyperbolicInverses.test.ts [2m([22m[2m3 tests[22m[2m)[22m[90m 6[2mms[22m[39m
 [32m✓[39m tests/systemSplit.test.ts [2m([22m[2m6 tests[22m[2m)[22m[90m 3[2mms[22m[39m
 [32m✓[39m tests/exhaustive-module05-complex.test.ts [2m([22m[2m6 tests[22m[2m)[22m[90m 68[2mms[22m[39m
[90mstdout[2m | tests/degreesNotation.test.ts[2m > [22m[2mAuditoría Módulo D (DMS)[2m > [22m[2mNivel 1: 90° = pi/2 rad
[22m[39m90° => ((90)*pi/180) = 1.570796...

[90mstdout[2m | tests/degreesNotation.test.ts[2m > [22m[2mAuditoría Módulo D (DMS)[2m > [22m[2mNivel 2: 45°30′ = 45.5° en radianes
[22m[39m45°30′ => ((45+30/60)*pi/180) = 0.794125... esperado: [33m0.7941248096574199[39m

[90mstdout[2m | tests/degreesNotation.test.ts[2m > [22m[2mAuditoría Módulo D (DMS)[2m > [22m[2mNivel 2 con segundos: 45°30′15″
[22m[39m45°30′15″ => ((45+30/60+15/3600)*pi/180) = 0.794198... esperado: [33m0.7941975317095864[39m

 [32m✓[39m tests/degreesNotation.test.ts [2m([22m[2m3 tests[22m[2m)[22m[90m 25[2mms[22m[39m
 [32m✓[39m tests/cbrtSign.test.ts [2m([22m[2m5 tests[22m[2m)[22m[90m 8[2mms[22m[39m
 [32m✓[39m tests/algebra.test.ts [2m([22m[2m3 tests[22m[2m)[22m[90m 63[2mms[22m[39m
 [32m✓[39m tests/exhaustive-module11-layout-responsive.test.ts [2m([22m[2m2 tests[22m[2m)[22m[90m 3[2mms[22m[39m
 [32m✓[39m tests/plusMinus.test.ts [2m([22m[2m3 tests[22m[2m)[22m[90m 5[2mms[22m[39m

[2m Test Files [22m [1m[32m35 passed[39m[22m[90m (35)[39m
[2m      Tests [22m [1m[32m437 passed[39m[22m[90m (437)[39m
[2m   Start at [22m 05:20:40
[2m   Duration [22m 4.59s[2m (transform 732ms, setup 0ms, collect 3.44s, tests 2.82s, environment 7ms, prepare 2.51s)[22m

~~~

## build
~~~text

> precision-lab-lite@0.1.0 build
> tsc -b && vite build

src/components/NaturalInput.tsx(15,5): error TS2687: All declarations of 'mathVirtualKeyboard' must have identical modifiers.
src/components/NaturalInput.tsx(15,5): error TS2717: Subsequent property declarations must have the same type.  Property 'mathVirtualKeyboard' must be of type 'VirtualKeyboardInterface & EventTarget', but here has type '{ hide: () => void; } | undefined'.
src/components/NaturalInput.tsx(79,7): error TS18047: 'el' is possibly 'null'.
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

import {describe, expect, it} from 'vitest';
import Algebrite from 'algebrite';
import {gunzipSync} from 'node:zlib';
import {readFileSync} from 'node:fs';
import {derivative} from '../src/engine/algebriteClient';
import {rewriteReciprocalFunctions} from '../src/engine/parsing';

const source = gunzipSync(readFileSync(new URL('../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz', import.meta.url))).toString();
const cases: [string, string, string, number[], (x: number) => number][] = [
  ['DV-H-01','sinh(x)',String.raw`\cosh x`,[-1,0,1],x=>Math.cosh(x)],
  ['DV-H-02','cosh(x)',String.raw`\sinh x`,[-1,0,1],x=>Math.sinh(x)],
  ['DV-H-03','tanh(x)',String.raw`\operatorname{sech}^{2}x`,[-1,0,1],x=>1/Math.cosh(x)**2],
  ['DV-H-04','csch(x)',String.raw`-\operatorname{csch} x\coth x`,[-2,-1,1,2],x=>-Math.cosh(x)/Math.sinh(x)**2],
  ['DV-H-05','sech(x)',String.raw`-\operatorname{sech} x\tanh x`,[-1,0,1],x=>-Math.tanh(x)/Math.cosh(x)],
  ['DV-H-06','coth(x)',String.raw`-\operatorname{csch}^{2}x`,[-2,-1,1,2],x=>-1/Math.sinh(x)**2],
  ['DV-H-07','sinh(3*x)',String.raw`3\cosh(3x)`,[-1,0,1],x=>3*Math.cosh(3*x)],
  ['DV-H-08','log(cosh(x))',String.raw`\tanh x`,[-1,0,1],x=>Math.tanh(x)],
  ['DV-H-09','x*sinh(x)',String.raw`\sinh x+x\cosh x`,[-1,0,1],x=>Math.sinh(x)+x*Math.cosh(x)],
  ['DV-H-10','tanh(x)^2',String.raw`2\tanh x\operatorname{sech}^{2}x`,[-1,0,1],x=>2*Math.tanh(x)/Math.cosh(x)**2],
  ['DV-H-11','exp(x)*cosh(x)',String.raw`e^{2x}`,[-1,0,1],x=>Math.exp(2*x)],
  ['DV-H-12','cosh(x)^2-sinh(x)^2','0',[-1,0,1],()=>0],
];

describe('TR324 direct hyperbolic derivatives',()=>{
  it.each(cases)('%s matches its matrix row and independent oracle', (id, expression, expected, samples, oracle)=>{
    const line = source.split('\n').find(row=>row.includes(`| ${id} |`));
    expect(line).toBeDefined();
    expect(line!.split('|')[3]).toContain(expected);
    const result = derivative(rewriteReciprocalFunctions(expression),'x',1);
    expect(result).not.toMatch(/\bd\s*\(/);
    for(const point of samples){
      const observed = parseFloat(Algebrite.run(`float(subst(${point},x,${result}))`));
      expect(Number.isFinite(observed)).toBe(true);
      // Algebrite prints six decimal places in floating results.
      expect(observed).toBeCloseTo(oracle(point),5);
    }
  });
});

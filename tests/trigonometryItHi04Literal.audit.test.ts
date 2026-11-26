import {describe,it,expect} from 'vitest';
import Algebrite from 'algebrite';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {parseExpression} from '../src/engine/parsing';
import {calcIndefiniteIntegral} from '../src/engine/stepEngine/calculus';

describe('TR324 IT-HI-04 original integral channel',()=>{
 it('evaluates the exact source integral on both real branches',()=>{
  const source=gunzipSync(readFileSync(new URL('../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz',import.meta.url))).toString();
  const row=source.split('\n').find(line=>line.includes('| IT-HI-04 |'))!;
  const literal=row.match(/`([^`]+)`/)![1].split(String.raw`,\ `)[0];
  const parsed=parseExpression(literal,'RAD');
  const answer=calcIndefiniteIntegral(parsed.algebrite,'x');
  const primitive=answer.resultLatex.replace(/\s*\+\s*C\s*$/,'');
  for(const x of [-3,-2,2,3]){
   const h=0.001;
   const at=(v:number)=>parseFloat(Algebrite.run(`float(subst(${v},x,${primitive}))`));
   expect((at(x+h)-at(x-h))/(2*h)).toBeCloseTo(Math.atanh(1/x),3);
  }
 });
});

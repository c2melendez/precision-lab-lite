import {describe,it,expect} from 'vitest';
import {calcDefiniteIntegral} from '../src/engine/stepEngine/calculus';
import {parseExpression} from '../src/engine/parsing';

describe('TR324 IT-D-08/14 improper integrals',()=>{
 it.each([
  ['cot(x)',-1,1],['cot(x)',1,-1],['cot(x)',0,1],['cot(x)',3,4],
  ['sec(x)^3',1,2],['sec(x)^3',2,1],['sec(x)^3',Math.PI/2,2],['sec(x)^3',-2,-1],
 ])('rejects divergent %s on %s..%s',(expr,lo,hi)=>{
  try {calcDefiniteIntegral(expr,'x',lo,hi);throw new Error('expected domain error');}
  catch(error){expect(error).toMatchObject({code:'DOMAIN_ERROR'});}
 });
 it.each([
  ['cot(x)',.5,1,Math.log(Math.sin(1)/Math.sin(.5))],
  ['sec(x)^3',0,.5,(1/Math.cos(.5)*Math.tan(.5)+Math.log(1/Math.cos(.5)+Math.tan(.5)))/2],
 ])('evaluates pole-free %s',(expr,lo,hi,expected)=>{
  expect(parseFloat(calcDefiniteIntegral(expr,'x',lo,hi).resultLatex)).toBeCloseTo(expected,5);
 });
 it.each([
  String.raw`\int_{-1}^{1}\cot x\,dx`,
  String.raw`\int_{1}^{2}\sec^{3}x\,dx`,
 ])('rejects pole in literal %s',literal=>{
  const parsed=parseExpression(literal,'RAD');
  try {calcDefiniteIntegral(parsed.algebrite,'x',9,9);throw new Error('expected domain error');}
  catch(error){expect(error).toMatchObject({code:'DOMAIN_ERROR'});}
 });
});

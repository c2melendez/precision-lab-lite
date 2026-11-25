import {describe,it,expect} from 'vitest';
import {calcDefiniteIntegral} from '../src/engine/stepEngine/calculus';

describe('TR324 IT-H-06/10 definite integrals',()=>{
 for(const [id,expression,oracle] of [
  ['06','csch(x)^2',()=>1/Math.tanh(1)-1/Math.tanh(2)],
  ['10','csch(x)*coth(x)',()=>1/Math.sinh(1)-1/Math.sinh(2)],
 ] as const){
  it.each([[-1,1],[1,-1],[0,1],[-1,0]])(`IT-H-${id} rejects pole within or at interval %s %s`,(lo,hi)=>{
   try { calcDefiniteIntegral(expression,'x',lo,hi); throw new Error('expected domain error'); }
   catch (error) { expect(error).toMatchObject({code:'DOMAIN_ERROR'}); }
  });
  it(`IT-H-${id} integrates on a pole-free interval`,()=>{
   const result=calcDefiniteIntegral(expression,'x',1,2);
   expect(parseFloat(result.resultLatex)).toBeCloseTo(oracle(),5);
  });
  it(`IT-H-${id} supports another variable`,()=>{
   const result=calcDefiniteIntegral(expression.replace(/\bx\b/g,'y'),'y',1,2);
   expect(parseFloat(result.resultLatex)).toBeCloseTo(oracle(),5);
  });
 }
});

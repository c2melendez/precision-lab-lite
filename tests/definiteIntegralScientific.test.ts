import { it, expect } from 'vitest';
import { parseExpression } from '../src/engine/parsing';
it.each([
  '\\int_{0}^{10} x\\,dx',
  '\\int_0^{10}x\\,dx',
  '\\int_{0}^{10}x dx',
])('parses visible definite integral %s', (latex)=>{
 const parsed=parseExpression(latex,'RAD');
 expect(parsed.algebrite).toBe('defintegral((x),0,10)');
});

it('parses the canonical antiderivative for plotting',()=>{
 const latex='-\\cos(x)+\\frac{\\cos^{3}(x)}{3}';
 const parsed=parseExpression(latex,'RAD');
 expect(parsed.freeVariables).toEqual(['x']);
 expect(parsed.algebrite).toContain('cos(x)');
});

it('evaluates the original interval to 50', async () => {
 const { indefiniteIntegral, evaluate, toLatex } = await import('../src/engine/algebriteClient');
 const antiderivative=indefiniteIntegral('(x)','x');
 const graphExpression=parseExpression(toLatex(antiderivative),'RAD').algebrite;
 const { analyzeGraph } = await import('../src/engine/stepEngine/graphing');
 expect(analyzeGraph(graphExpression,'x',[-10,10]).samples.some((point)=>point.x === 0 && point.y === 0)).toBe(true);
 const value=evaluate(`float(subst(10,x,${antiderivative}))-float(subst(0,x,${antiderivative}))`);
 expect(Number(value)).toBe(50);
});

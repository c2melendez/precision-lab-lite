import { describe, expect, it } from 'vitest';
import { parseExpression } from '../src/engine/parsing';
import { solveInequality } from '../src/engine/inequality';

describe('IN-H-02 cosh(x)<2', () => {
  it.each(['cosh(x)<2', String.raw`\cosh x<2`])('solves %s', input => {
    const p=parseExpression(input,'RAD');
    const result=solveInequality(p.algebrite,p.inequalityOperator!,'x');
    expect(result.resultText).toBe('-log(2+sqrt(3)) < x < log(2+sqrt(3))');
  });
  it('excludes both boundaries', () => {
    const b=Math.log(2+Math.sqrt(3));
    expect(Math.cosh(b)).toBeCloseTo(2,14);
    expect(Math.cosh(-b)).toBeCloseTo(2,14);
    expect(Math.cosh(0)).toBeLessThan(2);
  });
});

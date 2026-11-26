import {describe,it,expect} from 'vitest';
import Algebrite from 'algebrite';
import {indefiniteIntegral,derivative} from '../src/engine/algebriteClient';

describe('TR324 IT-HI complex branch preservation',()=>{
  it.each(['asinh(x)','x*asinh(x)'])(
    '%s must not introduce distributions into its complex derivative', expression=>{
      const primitive=indefiniteIntegral(expression,'x');
      const differentiated=derivative(primitive,'x',1);
      const value=Algebrite.run(`float(subst(1+i,x,${differentiated}))`);
      expect(value).not.toMatch(/dirac\(/i);
    },
  );
});

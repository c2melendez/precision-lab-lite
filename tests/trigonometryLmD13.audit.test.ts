import {describe, expect, it} from 'vitest';
import {gunzipSync} from 'node:zlib';
import {readFileSync} from 'node:fs';
import {calcLimit} from '../src/engine/stepEngine/calculus';

describe('LM-D-13', () => {
  it('anchors the original matrix row', () => {
    const text = gunzipSync(readFileSync(new URL('../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz', import.meta.url))).toString();
    const row = text.split('\n').find(line => line.includes('| LM-D-13 |'));
    expect(row).toContain(String.raw`\lim_{x\to\frac{\pi}{2}}\tan x`);
    expect(row).toContain('no existe');
  });
  it('reports the two-sided limit does not exist', () => {
    let caught: unknown;
    try { calcLimit('tan(x)', 'x', 'pi/2', Math.PI/2, 'both'); } catch (e) { caught = e; }
    expect(caught).toMatchObject({message: expect.stringMatching(/no existe.*laterales/i)});
  });
  it('preserves opposite lateral infinities', () => {
    expect(calcLimit('tan(x)', 'x', 'pi/2', Math.PI/2, 'left').resultLatex).toBe(String.raw`+\infty`);
    expect(calcLimit('tan(x)', 'x', 'pi/2', Math.PI/2, 'right').resultLatex).toBe(String.raw`-\infty`);
  });
});

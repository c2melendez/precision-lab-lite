import { describe, expect, it } from "vitest";
import { detectMatrixIntent } from "../src/engine/parsing/matrixIntent";
import { toFractionMatrix, determinant, invertMatrix, powerMatrix, transposeMatrix, multiplyMatrices } from "../src/engine/matrixOps";

describe("IN625 E2a — matrices y vectores",()=>{
  const m="\\begin{pmatrix}1&2\\\\3&4\\end{pmatrix}";
  it("EN-MT-01 pmatrix 2x2",()=>expect(detectMatrixIntent(m)).toEqual({kind:"literal",matrix:[["1","2"],["3","4"]]}));
  it("EN-MT-02 bmatrix equivalente",()=>expect(detectMatrixIntent("\\begin{bmatrix}1&2\\\\3&4\\end{bmatrix}")).toEqual({kind:"literal",matrix:[["1","2"],["3","4"]]}));
  it("EN-MT-03 vmatrix implica determinante",()=>expect(detectMatrixIntent("\\begin{vmatrix}1&2\\\\3&4\\end{vmatrix}")).toMatchObject({kind:"determinant"}));
  it("EN-MT-04 det pmatrix",()=>expect(detectMatrixIntent("\\det"+m)).toMatchObject({kind:"determinant"}));
  it("EN-MT-05 inversa",()=>expect(detectMatrixIntent(m+"^{-1}")).toMatchObject({kind:"inverse"}));
  it("EN-MT-06 potencia matricial",()=>expect(detectMatrixIntent(m+"^{2}")).toEqual({kind:"power",matrix:[["1","2"],["3","4"]],exponent:2}));
  it("EN-MT-07 T significa transpuesta",()=>expect(detectMatrixIntent(m+"^{T}")).toMatchObject({kind:"transpose"}));
  it("EN-MT-08 producto matriz-vector",()=>expect(detectMatrixIntent(m+"\\begin{pmatrix}1\\\\1\\end{pmatrix}")).toMatchObject({kind:"multiply"}));
  it("EN-MT-09 vector columna 3x1",()=>expect(detectMatrixIntent("\\begin{pmatrix}1\\\\2\\\\3\\end{pmatrix}")).toEqual({kind:"literal",matrix:[["1"],["2"],["3"]]}));
  it("EN-MT-10 filas desiguales -> error claro",()=>expect(()=>detectMatrixIntent("\\begin{pmatrix}1&2\\\\3\\end{pmatrix}")).toThrow(/misma longitud/));

  it("L2 operaciones exactas del contrato",()=>{
    const A=toFractionMatrix([["1","2"],["3","4"]]);
    expect(determinant(A).value.toFraction()).toBe("-2");
    expect(invertMatrix(A).result.map(r=>r.map(x=>x.toFraction()))).toEqual([["-2","1"],["3/2","-1/2"]]);
    expect(powerMatrix(A,2).result.map(r=>r.map(x=>x.toFraction()))).toEqual([["7","10"],["15","22"]]);
    expect(transposeMatrix(A).result.map(r=>r.map(x=>x.toFraction()))).toEqual([["1","3"],["2","4"]]);
    const v=toFractionMatrix([["1"],["1"]]);
    expect(multiplyMatrices(A,v).result.map(r=>r.map(x=>x.toFraction()))).toEqual([["3"],["7"]]);
  });
});

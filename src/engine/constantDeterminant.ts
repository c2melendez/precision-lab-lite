import {evaluate,toLatex} from "./algebriteClient";
import {parseExpression} from "./parsing";
import {compileNumeric} from "./numericFallback";
import {ErrorCode,type MathResult} from "../types";

/** SY-M-09: bounded 2x2 real constant determinant; rational matrices keep Fraction.js. */
export function constantDeterminant(cells:(string|number)[][],requestId:string):MathResult|null {
 if(cells.length!==2 || cells.some(row=>row.length!==2))return null;
 if(cells.every(row=>row.every(cell=>/^[+-]?\d+(?:\.\d+)?(?:\/[+-]?\d+)?$/.test(String(cell).trim()))))return null;
 const fail=(message:string):never=>{throw {code:ErrorCode.PARSE_ERROR,message};};
 const parsed=cells.map(row=>row.map(cell=>{
  const source=String(cell);
  if(source.length>128) return fail("Celda demasiado larga.");
  const p=parseExpression(source);
  if(p.isEquation||p.isInequality||p.freeVariables.length ||
     !/^(?:sqrt|pi|e|[0-9+\-*/^().\s])+$/.test(p.algebrite)){
   return fail("Este determinante requiere celdas numéricas reales con fracciones, raíces, pi o e.");
  }
  const value=compileNumeric(p.algebrite,"x")(0);
  if(!Number.isFinite(value))return fail("Las celdas deben tener un valor real finito.");
  return {expr:p.algebrite,value};
 }));
 const [[a,b],[c,d]]=parsed;
 const expression="("+a.expr+")*("+d.expr+")-("+b.expr+")*("+c.expr+")";
 const exact=evaluate(expression);
 const approx=a.value*d.value-b.value*c.value;
 if(!Number.isFinite(approx))return fail("El determinante debe tener un valor real finito.");
 const latex=toLatex(exact);
 return {success:true,resultLatex:latex,decimalApprox:String(approx),steps:[
  {id:"det2",latex:"\\det(A)=ad-bc="+latex,explanation:"Determinante 2×2 exacto: producto diagonal principal menos producto diagonal secundaria."}
 ],hasDetailedSteps:true,confidence:"SYMBOLIC",requestId};
}

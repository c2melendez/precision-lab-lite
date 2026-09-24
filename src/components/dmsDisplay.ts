export interface DmsValue {
  degrees: number;
  minutes: number;
  seconds: number;
  text: string;
  latex: string;
}

const DECIMAL_DEGREES_PATTERNS = [
  /^([+-]?(?:\d+(?:\.\d*)?|\.\d+))\s*°$/,
  /^([+-]?(?:\d+(?:\.\d*)?|\.\d+))\s*\^?\{?\\circ\}?$/,
  /^([+-]?(?:\d+(?:\.\d*)?|\.\d+))\s*\\degree$/,
];

export function parseDecimalDegreesInput(input: string): number | null {
  const value = input.trim().replace(/\\left|\\right/g, "");
  for (const pattern of DECIMAL_DEGREES_PATTERNS) {
    const match = pattern.exec(value);
    if (!match) continue;
    const n = Number(match[1]);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

export function decimalDegreesToDms(value: number): DmsValue | null {
  if (!Number.isFinite(value)) return null;

  const negative = value < 0 || Object.is(value, -0);
  const absolute = Math.abs(value);
  let degrees = Math.floor(absolute);
  const minutesFloat = (absolute - degrees) * 60;
  let minutes = Math.floor(minutesFloat);
  let seconds = Math.round((minutesFloat - minutes) * 60 * 10) / 10;

  if (seconds >= 60) {
    seconds = 0;
    minutes += 1;
  }
  if (minutes >= 60) {
    minutes = 0;
    degrees += 1;
  }

  const signedDegrees = negative ? -degrees : degrees;
  const degreeText = negative && degrees === 0 ? "-0" : String(signedDegrees);
  const secondsText = seconds.toFixed(1);

  return {
    degrees: signedDegrees,
    minutes,
    seconds,
    text: `${degreeText}° ${minutes}′ ${secondsText}″`,
    latex: `${degreeText}^{\\circ}\\ ${minutes}^{\\prime}\\ ${secondsText}^{\\prime\\prime}`,
  };
}

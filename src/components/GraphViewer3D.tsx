import type { GraphSurface3D } from "../engine/stepEngine/graphing";

// GraphViewer3D — Módulo J2 (spec_graficacion_matrices_estadistica_unidades.md,
// sección 3.2, Opción B confirmada en J0). Componente NUEVO Y SEPARADO de
// GraphViewer.tsx a propósito, no una rama condicional dentro de él: J0
// determinó que esta es la forma más segura de cumplir la condición dura
// (no romper graficación 2D/polar/paramétrica existente) — GraphViewer.tsx
// queda sin ninguna línea tocada por este módulo.
//
// Sin librería 3D nueva (three.js, Plotly, etc.) — decisión de diseño de
// J0: proyección isométrica fija de una malla de líneas (wireframe
// estático, sin rotación interactiva) dibujada con el mismo SVG puro que
// ya usa el resto de Lite. Esto SÍ es una divergencia funcional real
// frente a main (que usa Plotly con rotación 3D interactiva vía WebGL) —
// declarada explícitamente, no oculta, tal como permite la sección 11 del
// spec ("puede resultar en que Lite iguale a main en paramétrico pero no
// en 3D").

const WIDTH = 340;
const HEIGHT = 280;
const PADDING = 28;

// Ángulo isométrico estándar (30°) — mismo criterio usado en dibujo
// técnico/CAD para proyecciones isométricas sin distorsión de ejes.
const COS30 = Math.cos(Math.PI / 6);
const SIN30 = Math.sin(Math.PI / 6);

interface GraphViewer3DProps {
  surface: GraphSurface3D;
}

export function GraphViewer3D({ surface }: GraphViewer3DProps) {
  const { xValues, yValues, zGrid } = surface;

  const zFlat = zGrid.flat().filter((z): z is number => z !== null);
  const zMin = Math.min(...zFlat, -1);
  const zMax = Math.max(...zFlat, 1);
  const xMin = Math.min(...xValues);
  const xMax = Math.max(...xValues);
  const yMin = Math.min(...yValues);
  const yMax = Math.max(...yValues);

  // Normaliza cada eje a [-1, 1] antes de proyectar, para que ningún eje
  // domine visualmente solo por tener un rango numérico más grande (ej.
  // x en [-5,5] vs z en [-0.1,0.1]).
  const normX = (x: number) => (xMax === xMin ? 0 : ((x - xMin) / (xMax - xMin)) * 2 - 1);
  const normY = (y: number) => (yMax === yMin ? 0 : ((y - yMin) / (yMax - yMin)) * 2 - 1);
  const normZ = (z: number) => (zMax === zMin ? 0 : ((z - zMin) / (zMax - zMin)) * 2 - 1);

  // Proyección isométrica: (x,y,z) 3D -> (screenX,screenY) 2D. z sube en
  // pantalla (resta en Y de pantalla) igual que en cualquier dibujo
  // isométrico convencional.
  function project(xN: number, yN: number, zN: number): [number, number] {
    const scale = (Math.min(WIDTH, HEIGHT) - 2 * PADDING) / 3.2;
    const screenX = WIDTH / 2 + (xN - yN) * COS30 * scale;
    const screenY = HEIGHT / 2 + (xN + yN) * SIN30 * scale - zN * scale * 0.9;
    return [screenX, screenY];
  }

  const rowLines: string[] = [];
  for (let j = 0; j < yValues.length; j++) {
    const points: string[] = [];
    for (let i = 0; i < xValues.length; i++) {
      const z = zGrid[j][i];
      if (z === null) {
        if (points.length > 1) rowLines.push(points.join(" "));
        points.length = 0;
        continue;
      }
      const [sx, sy] = project(normX(xValues[i]), normY(yValues[j]), normZ(z));
      points.push(`${sx.toFixed(2)},${sy.toFixed(2)}`);
    }
    if (points.length > 1) rowLines.push(points.join(" "));
  }

  const colLines: string[] = [];
  for (let i = 0; i < xValues.length; i++) {
    const points: string[] = [];
    for (let j = 0; j < yValues.length; j++) {
      const z = zGrid[j][i];
      if (z === null) {
        if (points.length > 1) colLines.push(points.join(" "));
        points.length = 0;
        continue;
      }
      const [sx, sy] = project(normX(xValues[i]), normY(yValues[j]), normZ(z));
      points.push(`${sx.toFixed(2)},${sy.toFixed(2)}`);
    }
    if (points.length > 1) colLines.push(points.join(" "));
  }

  return (
    <div className="rounded-xl bg-chrome p-2">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-64 w-full"
        role="img"
        aria-label="Superficie 3D en proyección isométrica"
      >
        {rowLines.map((points, idx) => (
          <polyline key={`row-${idx}`} points={points} fill="none" stroke="#5B94C9" strokeWidth={1} strokeOpacity={0.8} />
        ))}
        {colLines.map((points, idx) => (
          <polyline key={`col-${idx}`} points={points} fill="none" stroke="#5B94C9" strokeWidth={1} strokeOpacity={0.5} />
        ))}
      </svg>
      <p className="px-1 pb-1 text-[10px] text-bone/40">
        Vista isométrica estática (sin rotación) — Lite dibuja la superficie con SVG propio, sin una librería 3D nueva.
      </p>
    </div>
  );
}

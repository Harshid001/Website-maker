export interface Point {
  x: number;
  y: number;
}

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

type WasmEngineModule = {
  calculate_zoom?: (currentZoom: number, delta: number, min: number, max: number) => number;
  calculate_pan?: (x: number, y: number, dx: number, dy: number) => Point;
  snap_to_grid?: (value: number, gridSize: number) => number;
  calculate_bounds?: (x: number, y: number, width: number, height: number) => Bounds;
  optimize_layout?: (layoutJson: string) => string;
};

let wasmModulePromise: Promise<WasmEngineModule | null> | null = null;

async function loadWasmEngine(): Promise<WasmEngineModule | null> {
  if (!wasmModulePromise) {
    const dynamicImport = new Function('specifier', 'return import(specifier)') as (
      specifier: string
    ) => Promise<WasmEngineModule>;

    wasmModulePromise = dynamicImport('/wasm-engine/wasm_engine.js')
      .then((module) => module as WasmEngineModule)
      .catch(() => null);
  }

  return wasmModulePromise;
}

export async function calculateZoom(currentZoom: number, delta: number, min = 0.2, max = 4) {
  const wasm = await loadWasmEngine();
  if (wasm?.calculate_zoom) return wasm.calculate_zoom(currentZoom, delta, min, max);
  return Math.min(max, Math.max(min, currentZoom + delta));
}

export async function calculatePan(x: number, y: number, dx: number, dy: number): Promise<Point> {
  const wasm = await loadWasmEngine();
  if (wasm?.calculate_pan) return wasm.calculate_pan(x, y, dx, dy);
  return { x: x + dx, y: y + dy };
}

export async function snapToGrid(value: number, gridSize = 8) {
  const wasm = await loadWasmEngine();
  if (wasm?.snap_to_grid) return wasm.snap_to_grid(value, gridSize);
  return Math.round(value / gridSize) * gridSize;
}

export async function calculateBounds(x: number, y: number, width: number, height: number): Promise<Bounds> {
  const wasm = await loadWasmEngine();
  if (wasm?.calculate_bounds) return wasm.calculate_bounds(x, y, width, height);
  return { x, y, width, height };
}

export async function optimizeLayout<T>(layout: T): Promise<T> {
  const wasm = await loadWasmEngine();
  if (wasm?.optimize_layout) {
    return JSON.parse(wasm.optimize_layout(JSON.stringify(layout))) as T;
  }
  return layout;
}

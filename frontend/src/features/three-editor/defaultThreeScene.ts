export interface ThreeSceneObject {
  id: string;
  name: string;
  type: 'cube' | 'sphere' | 'cone' | 'cylinder' | 'plane' | string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  color?: string;
  animation?: 'rotate' | 'float' | null;
}

export interface ThreeScenePreset {
  name: string;
  camera: [number, number, number];
  background: string;
  lights: Array<{
    type: 'ambient' | 'directional' | string;
    intensity: number;
    color: string;
    position?: [number, number, number];
  }>;
  objects: ThreeSceneObject[];
}

export const defaultThreeScene: ThreeScenePreset = {
  name: 'Default 3D Scene',
  camera: [0, 2.2, 5],
  background: '#050816',
  lights: [
    { type: 'ambient', intensity: 0.65, color: '#ffffff' },
    { type: 'directional', intensity: 1.2, color: '#ffffff', position: [4, 6, 5] },
  ],
  objects: [
    {
      id: 'placeholder-cube',
      name: 'Placeholder Cube',
      type: 'cube',
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1.2, 1.2, 1.2],
      color: '#6366f1',
      animation: 'rotate',
    },
  ],
};

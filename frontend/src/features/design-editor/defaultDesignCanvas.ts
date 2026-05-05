export interface DesignCanvasElement {
  id: string;
  type: 'text' | 'rect' | 'image-placeholder';
  x: number;
  y: number;
  width?: number;
  height?: number;
  text?: string;
  fill?: string;
  fontSize?: number;
}

export interface DesignCanvasDocument {
  width: number;
  height: number;
  background: string;
  elements: DesignCanvasElement[];
}

export const defaultDesignCanvas: DesignCanvasDocument = {
  width: 1080,
  height: 1080,
  background: '#111827',
  elements: [
    {
      id: 'headline',
      type: 'text',
      x: 96,
      y: 120,
      text: 'Editable Design',
      fill: '#ffffff',
      fontSize: 76,
    },
    {
      id: 'accent-rect',
      type: 'rect',
      x: 96,
      y: 320,
      width: 560,
      height: 220,
      fill: '#6366f1',
    },
    {
      id: 'image-placeholder',
      type: 'image-placeholder',
      x: 96,
      y: 610,
      width: 720,
      height: 260,
      fill: '#1f2937',
    },
  ],
};

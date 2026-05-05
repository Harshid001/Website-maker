import { defaultDesignCanvas, type DesignCanvasDocument } from './defaultDesignCanvas';
import type { Template } from '../../types/template.types';

export function loadDesignCanvasFromTemplate(template?: Template | null): DesignCanvasDocument {
  const canvas = template?.content?.canvasJson as unknown as DesignCanvasDocument | undefined;

  if (!canvas || !Array.isArray(canvas.elements)) {
    return defaultDesignCanvas;
  }

  return {
    ...defaultDesignCanvas,
    ...canvas,
    elements: canvas.elements.length ? canvas.elements : defaultDesignCanvas.elements,
  };
}

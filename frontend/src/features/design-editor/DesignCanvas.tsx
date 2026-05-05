import React, { useState } from 'react';
import { Layer, Rect, Stage, Text } from 'react-konva';
import { defaultDesignCanvas, type DesignCanvasDocument, type DesignCanvasElement } from './defaultDesignCanvas';

function RenderElement({
  element,
  selected,
  onSelect,
}: {
  element: DesignCanvasElement;
  selected: boolean;
  onSelect: () => void;
}) {
  if (element.type === 'text') {
    return (
      <Text
        x={element.x}
        y={element.y}
        text={element.text || ''}
        fontSize={element.fontSize || 48}
        fill={element.fill || '#ffffff'}
        fontStyle="bold"
        onClick={onSelect}
        onTap={onSelect}
      />
    );
  }

  return (
    <>
      <Rect
        x={element.x}
        y={element.y}
        width={element.width || 160}
        height={element.height || 120}
        fill={element.fill || '#6366f1'}
        cornerRadius={element.type === 'image-placeholder' ? 28 : 18}
        onClick={onSelect}
        onTap={onSelect}
      />
      {element.type === 'image-placeholder' ? (
        <Text
          x={element.x + 32}
          y={element.y + (element.height || 120) / 2 - 18}
          text="Image Placeholder"
          fontSize={32}
          fill="#cbd5e1"
          onClick={onSelect}
          onTap={onSelect}
        />
      ) : null}
      {selected ? (
        <Rect
          x={element.x - 6}
          y={element.y - 6}
          width={(element.width || 160) + 12}
          height={(element.height || 120) + 12}
          stroke="#22d3ee"
          strokeWidth={4}
          dash={[10, 8]}
        />
      ) : null}
    </>
  );
}

export default function DesignCanvas({ canvas = defaultDesignCanvas }: { canvas?: DesignCanvasDocument }) {
  const [selectedId, setSelectedId] = useState<string | null>(canvas.elements[0]?.id || null);
  const scale = Math.min(760 / canvas.width, 620 / canvas.height);

  return (
    <div className="flex min-h-[520px] items-center justify-center overflow-auto rounded-2xl bg-slate-950 p-4">
      <Stage width={canvas.width * scale} height={canvas.height * scale} scaleX={scale} scaleY={scale}>
        <Layer>
          <Rect x={0} y={0} width={canvas.width} height={canvas.height} fill={canvas.background} />
          {canvas.elements.map((element) => (
            <RenderElement
              key={element.id}
              element={element}
              selected={selectedId === element.id}
              onSelect={() => setSelectedId(element.id)}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}

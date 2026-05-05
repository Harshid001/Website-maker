import React from 'react';
import PreviewElement from './PreviewElement';

export default function PreviewSection({ section }) {
  if (!section) return null;

  const style = {
    position: 'absolute',
    left: section.x || 0,
    top: section.y || 0,
    width: section.width || '100%',
    height: section.height || 400,
    ...section.styles,
  };

  return (
    <div style={style}>
      {section.elements?.map((el) => (
        <PreviewElement key={el.id} element={el} />
      ))}
    </div>
  );
}

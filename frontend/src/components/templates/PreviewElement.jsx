import React from 'react';

export default function PreviewElement({ element }) {
  if (!element) return null;

  const style = {
    position: 'absolute',
    left: element.x || 0,
    top: element.y || 0,
    width: element.width || 'auto',
    height: element.height || 'auto',
    ...element.styles,
  };

  if (element.type === 'text') {
    return <div style={style}>{element.text}</div>;
  }
  
  if (element.type === 'image') {
    return (
      <img
        src={element.src || 'https://via.placeholder.com/800'}
        alt=""
        style={{ ...style, objectFit: 'cover' }}
      />
    );
  }
  
  if (element.type === 'button') {
    return <button style={style}>{element.text || 'Button'}</button>;
  }

  // Generic fallback for other types
  return (
    <div style={{
      ...style,
      backgroundColor: element.styles?.backgroundColor || 'rgba(255,255,255,0.05)',
      border: element.styles?.border || '1px dashed rgba(255,255,255,0.2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#94a3b8',
      fontSize: 12,
      overflow: 'hidden'
    }}>
      {element.text || element.type || 'element'}
    </div>
  );
}

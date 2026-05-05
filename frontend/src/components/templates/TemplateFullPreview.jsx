import React, { useRef, useState, useEffect } from 'react';
import PreviewSection from './PreviewSection';

export default function TemplateFullPreview({ template }) {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(0.75);
  
  const canvas = template.canvas || { width: 1440, height: 3000, background: '#ffffff' };
  const sections = template.sections || [];

  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const availableWidth = entry.contentRect.width;
        const canvasWidth = canvas.width || 1440;
        const newScale = Math.min(availableWidth / canvasWidth, 1);
        setScale(newScale);
      }
    });
    
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [canvas.width]);

  const height = (canvas.height || 3000) * scale;

  return (
    <div ref={containerRef} className="w-full h-full overflow-auto bg-slate-950 rounded-2xl relative">
      <div style={{ height: height, width: '100%', overflow: 'hidden' }}>
        <div
          className="template-preview-canvas"
          style={{
            width: canvas.width || 1440,
            minHeight: canvas.height || 3000,
            background: canvas.background || "#ffffff",
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            position: 'absolute',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          {sections.map(section => (
            <PreviewSection key={section.id || Math.random()} section={section} />
          ))}
        </div>
      </div>
    </div>
  );
}

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Box, Layers, Tag, Wand2, X } from 'lucide-react';
import { getTypeLabel } from '../../utils/templateUtils';
import TemplateMiniPreview from '../builder/TemplateMiniPreview';
import TemplateFullPreview from './TemplateFullPreview';

export function WebsiteLivePreview({ template, className = '' }) {
  const content = template?.content || {};

  if (template?.sections && template.sections.length > 0) {
    return <TemplateFullPreview template={template} />;
  }

  if (content.html || content.css) {
    return (
      <div className={`h-full w-full overflow-auto bg-white rounded-2xl ${className}`}>
        <style>{content.css || ''}</style>
        <div dangerouslySetInnerHTML={{ __html: content.html || '' }} />
      </div>
    );
  }

  if (template?.layoutPreview) {
    return (
      <div className={`h-full w-full overflow-auto bg-slate-950 flex justify-center items-start p-8 rounded-2xl ${className}`}>
        <div className="w-full max-w-4xl shadow-2xl rounded-2xl overflow-hidden">
          <TemplateMiniPreview layoutPreview={template.layoutPreview} className="rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full w-full flex items-center justify-center bg-slate-950 text-slate-400 rounded-2xl ${className}`}>
      <p>Full preview is not available for this template yet.</p>
    </div>
  );
}

export function AnimationLivePreview({ content, className = '', style = {} }) {
  return (
    <div className={`h-full w-full overflow-hidden bg-slate-950 ${className}`} style={style}>
      <style>{content?.css || ''}</style>
      <div dangerouslySetInnerHTML={{ __html: content?.html || '' }} />
    </div>
  );
}

const colorWithOpacity = (color, opacity) => {
  if (!color || color.startsWith('rgba')) return color;
  if (opacity === undefined || opacity >= 1) return color;
  return color;
};

export function DesignCanvasPreview({ canvasJson, className = '', selectedElementId = null, onSelectElement }) {
  const canvas = canvasJson || {};
  const width = canvas.width || 1080;
  const height = canvas.height || 1080;
  const gradientId = `design-gradient-${width}-${height}`.replace(/[^a-z0-9-]/gi, '');

  return (
    <div className={`flex h-full w-full items-center justify-center bg-slate-950 p-4 ${className}`}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="2D design template preview"
        className="max-h-full max-w-full rounded-2xl shadow-2xl shadow-black/40"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            {(canvas.gradient || [canvas.background || '#111827', '#6366f1']).map((color, index, list) => (
              <stop key={color + index} offset={`${(index / Math.max(list.length - 1, 1)) * 100}%`} stopColor={color} />
            ))}
          </linearGradient>
        </defs>
        <rect width={width} height={height} fill={`url(#${gradientId})`} />

        {(canvas.elements || []).map((element) => {
          const selected = selectedElementId === element.id;
          const interactiveProps = {
            onClick: () => onSelectElement?.(element.id),
            style: { cursor: onSelectElement ? 'pointer' : 'default' },
          };

          if (element.type === 'text') {
            return (
              <foreignObject
                key={element.id}
                {...interactiveProps}
                x={element.x}
                y={element.y}
                width={element.maxWidth || width - element.x * 2}
                height={element.fontSize * 3}
              >
                <div
                  xmlns="http://www.w3.org/1999/xhtml"
                  style={{
                    color: element.color,
                    fontFamily: element.fontFamily || 'Inter, sans-serif',
                    fontSize: `${element.fontSize}px`,
                    fontWeight: element.fontWeight || 700,
                    lineHeight: 1.05,
                    outline: selected ? '6px solid rgba(34,211,238,0.75)' : 'none',
                    borderRadius: 12,
                  }}
                >
                  {element.text}
                </div>
              </foreignObject>
            );
          }

          if (element.type === 'image') {
            return (
              <g key={element.id} {...interactiveProps}>
                <rect
                  x={element.x}
                  y={element.y}
                  width={element.width}
                  height={element.height}
                  rx={element.radius || 20}
                  fill={element.color || 'rgba(255,255,255,0.12)'}
                  stroke={selected ? '#22d3ee' : 'rgba(255,255,255,0.28)'}
                  strokeWidth={selected ? 8 : 3}
                  strokeDasharray="18 18"
                />
                <text x={element.x + element.width / 2} y={element.y + element.height / 2} textAnchor="middle" fill="#e2e8f0" fontSize={Math.max(22, width * 0.028)} fontWeight="800">
                  {element.label || 'Image'}
                </text>
              </g>
            );
          }

          if (element.shape === 'circle') {
            return (
              <ellipse
                key={element.id}
                {...interactiveProps}
                cx={element.x + element.width / 2}
                cy={element.y + element.height / 2}
                rx={element.width / 2}
                ry={element.height / 2}
                fill={colorWithOpacity(element.color, element.opacity)}
                opacity={element.opacity ?? 1}
                stroke={selected ? '#22d3ee' : 'none'}
                strokeWidth={selected ? 8 : 0}
              />
            );
          }

          return (
            <rect
              key={element.id}
              {...interactiveProps}
              x={element.x}
              y={element.y}
              width={element.width}
              height={element.height}
              rx={element.radius || 0}
              fill={colorWithOpacity(element.color, element.opacity)}
              opacity={element.opacity ?? 1}
              stroke={selected ? '#22d3ee' : 'none'}
              strokeWidth={selected ? 8 : 0}
            />
          );
        })}
      </svg>
    </div>
  );
}

function SceneMesh({ object }) {
  const ref = useRef(null);

  useFrame((_, delta) => {
    if (!ref.current) return;
    if (object.animation === 'rotate') {
      ref.current.rotation.y += delta * 0.75;
    }
    if (object.animation === 'float') {
      ref.current.position.y = object.position[1] + Math.sin(Date.now() / 500) * 0.08;
    }
  });

  const geometry = {
    cube: <boxGeometry args={[1, 1, 1]} />,
    sphere: <sphereGeometry args={[0.72, 32, 32]} />,
    cone: <coneGeometry args={[0.74, 1.2, 4]} />,
    cylinder: <cylinderGeometry args={[0.55, 0.55, 1, 32]} />,
    torus: <torusGeometry args={[0.62, 0.14, 24, 72]} />,
    plane: <planeGeometry args={[1, 1]} />,
  }[object.type] || <boxGeometry args={[1, 1, 1]} />;

  return (
    <mesh ref={ref} position={object.position || [0, 0, 0]} rotation={object.rotation || [0, 0, 0]} scale={object.scale || [1, 1, 1]}>
      {geometry}
      <meshStandardMaterial color={object.color || '#6366f1'} roughness={0.45} metalness={object.material === 'metal' ? 0.65 : 0.12} />
    </mesh>
  );
}

export function ThreeScenePreview({ scene, className = '' }) {
  const safeScene = scene || {};
  const objects = safeScene.objects || [];
  const directional = (safeScene.lights || []).find((light) => light.type === 'directional');
  const ambient = (safeScene.lights || []).find((light) => light.type === 'ambient');

  return (
    <div className={`h-full min-h-[320px] w-full overflow-hidden rounded-2xl bg-slate-950 ${className}`}>
      <Canvas camera={{ position: safeScene.camera || [0, 2, 5], fov: 48 }}>
        <color attach="background" args={[safeScene.background || '#050816']} />
        <ambientLight intensity={ambient?.intensity || 0.55} color={ambient?.color || '#ffffff'} />
        <directionalLight
          position={directional?.position || [4, 6, 5]}
          intensity={directional?.intensity || 1.2}
          color={directional?.color || '#ffffff'}
        />
        <group rotation={[0.15, -0.35, 0]}>
          {objects.map((object) => (
            <SceneMesh key={object.id || object.name} object={object} />
          ))}
        </group>
        <gridHelper args={[6, 12, '#334155', '#1e293b']} position={[0, -1.05, 0]} />
        <OrbitControls enablePan={false} minDistance={3} maxDistance={8} />
      </Canvas>
    </div>
  );
}

export function TemplateLivePreview({ template, project, className = '', animationStyle = {} }) {
  const item = project || template;
  const type = item?.type;
  const content = item?.content || {};

  if (type === 'website') return <WebsiteLivePreview template={item} className={className} />;
  if (type === '2d') return <DesignCanvasPreview canvasJson={content.canvasJson} className={className} />;
  if (type === '3d') return <ThreeScenePreview scene={content.threeScene} className={className} />;
  if (type === 'animation') return <AnimationLivePreview content={content} className={className} style={animationStyle} />;

  return (
    <div className="grid h-full min-h-[320px] place-items-center rounded-2xl bg-slate-950 text-slate-500">
      Preview unavailable
    </div>
  );
}

export default function TemplatePreviewModal({ template, onClose, onUse }) {
  if (!template) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-xl">
      <section className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl shadow-black/40">
        <header className="flex items-start justify-between gap-4 border-b border-slate-800 p-5">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-200">
                <Layers size={14} />
                {getTypeLabel(template.type)}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/10 px-3 py-1 text-xs font-semibold text-indigo-200">
                <Tag size={14} />
                {template.designType || template.category}
              </span>
            </div>
            <h2 className="text-2xl font-black text-white md:text-3xl">{template.title}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">{template.description}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-700 text-slate-400 transition hover:bg-slate-800 hover:text-white"
            aria-label="Close preview"
          >
            <X size={20} />
          </button>
        </header>

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_320px]">
          <div className="min-h-[420px] overflow-hidden bg-slate-950 p-4">
            <TemplateLivePreview template={template} className="rounded-2xl" />
          </div>

          <aside className="space-y-5 border-t border-slate-800 p-5 lg:border-l lg:border-t-0">
            {template.suitableFor?.length ? (
              <div>
                <p className="text-sm font-bold text-white">Suitable For</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {template.suitableFor.map((item) => (
                    <span key={item} className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {template.content?.sections?.length ? (
              <div>
                <p className="text-sm font-bold text-white">Sections</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {template.content.sections.map((section) => (
                    <span key={section} className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs text-slate-300">
                      {section}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            <div>
              <p className="text-sm font-bold text-white">Tags</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(template.tags || []).map((tag) => (
                  <span key={tag} className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs text-slate-300">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
              <div className="flex items-center gap-3">
                <Box size={18} className="text-cyan-300" />
                <div>
                  <p className="text-sm font-bold text-white">Workspace</p>
                  <p className="text-sm text-slate-400">{template.workspaceType}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-400">
                This preview renders the real template data that will be copied into a new editable project.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onUse(template)}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 text-sm font-bold text-white transition hover:bg-indigo-500"
            >
              <Wand2 size={18} />
              Use Template
            </button>
          </aside>
        </div>
      </section>
    </div>
  );
}

import { useState } from 'react';
import { Box, RotateCcw, Sun, Camera, Upload, Library, Palette, Layers } from 'lucide-react';
import { useBuilderStore } from '../../../store/builderStore';
import { ActionButton, PanelSection, PanelShell } from './PanelShell';

const tools = [
  { id: 'viewer', label: '3D Object Viewer', icon: Box, insertsNode: true },
  { id: 'productCard', label: 'Product 3D Card', icon: Box, insertsNode: true },
  { id: 'text3d', label: '3D Text', icon: Box, insertsNode: true },
  { id: 'bg3d', label: '3D Background', icon: Box, insertsNode: true },
  { id: 'rotate', label: 'Rotate Model', icon: RotateCcw },
  { id: 'material', label: 'Material Editor', icon: Palette },
  { id: 'lighting', label: 'Lighting Tool', icon: Sun },
  { id: 'camera', label: 'Camera Tool', icon: Camera },
  { id: 'upload', label: 'GLB/GLTF Upload', icon: Upload },
  { id: 'templates', label: '3D Template Library', icon: Library },
];

const materials = ['Matte', 'Glossy', 'Metallic', 'Glass', 'Wood', 'Marble', 'Neon Glow'];
const lightingPresets = ['Studio', 'Natural', 'Dramatic', 'Sunset', 'Cool Blue', 'Warm Ambient'];

export default function Elements3DPanel() {
  const [active, setActive] = useState(null);
  const [material, setMaterial] = useState('Matte');
  const [lighting, setLighting] = useState('Studio');
  const [rotationY, setRotationY] = useState(0);
  const { addElement, showToast } = useBuilderStore();

  const handleToolClick = (tool) => {
    setActive(tool.id);
    if (tool.insertsNode) {
      addElement('threeDObject', undefined, {
        name: tool.label,
        props: { material: material.toLowerCase(), lighting: lighting.toLowerCase() },
      });
    }
  };

  return (
    <PanelShell eyebrow="Depth" title="3D Visual Tool">
      <PanelSection title="3D tools">
        {tools.map((tool) => (
          <ActionButton
            key={tool.id}
            icon={tool.icon}
            label={tool.label}
            description={tool.insertsNode ? 'Click to insert on canvas' : 'Configure 3D settings'}
            onClick={() => handleToolClick(tool)}
          />
        ))}
      </PanelSection>

      {active && (
        <div className="space-y-4">
          {/* 3D Preview Placeholder with CSS 3D cube */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
            <div className="relative flex h-48 items-center justify-center overflow-hidden rounded-xl" style={{ background: 'linear-gradient(135deg, #111827, #1e293b, #334155)' }}>
              <div
                className="transition-transform duration-500"
                style={{
                  width: '80px',
                  height: '80px',
                  transformStyle: 'preserve-3d',
                  transform: `rotateX(-25deg) rotateY(${rotationY}deg)`,
                }}
              >
                {/* CSS 3D Cube faces */}
                {[
                  { transform: 'translateZ(40px)', bg: 'rgba(99,102,241,0.7)' },
                  { transform: 'rotateY(180deg) translateZ(40px)', bg: 'rgba(99,102,241,0.5)' },
                  { transform: 'rotateY(90deg) translateZ(40px)', bg: 'rgba(99,102,241,0.6)' },
                  { transform: 'rotateY(-90deg) translateZ(40px)', bg: 'rgba(99,102,241,0.4)' },
                  { transform: 'rotateX(90deg) translateZ(40px)', bg: 'rgba(99,102,241,0.3)' },
                  { transform: 'rotateX(-90deg) translateZ(40px)', bg: 'rgba(99,102,241,0.8)' },
                ].map((face, i) => (
                  <div key={i} className="absolute inset-0 rounded-lg border border-indigo-400/30" style={{ transform: face.transform, backgroundColor: face.bg, backfaceVisibility: 'hidden' }} />
                ))}
              </div>
              {/* Subtle grid floor */}
              <div className="absolute bottom-0 left-0 right-0 h-16 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(148,163,184,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.3) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            </div>

            <div className="mt-3">
              <label className="block">
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Rotation Y</span>
                <input type="range" min={0} max={360} value={rotationY} onChange={(e) => setRotationY(Number(e.target.value))} className="mt-1 w-full accent-indigo-500" />
              </label>
            </div>

            <p className="mt-3 text-xs font-black uppercase tracking-widest text-white">{tools.find((t) => t.id === active)?.label}</p>
            <p className="mt-1 text-[10px] leading-4 text-slate-500">Three.js is installed. This preview uses CSS 3D transforms. Full WebGL rendering activates when a 3D model is loaded.</p>
          </div>

          {/* Material selector */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
            <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-slate-500">Material</p>
            <div className="grid grid-cols-2 gap-1">
              {materials.map((m) => (
                <button key={m} type="button" onClick={() => { setMaterial(m); showToast(`Material set to ${m}.`); }} className={`rounded-lg px-2 py-1.5 text-[9px] font-bold uppercase tracking-widest ${material === m ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'}`}>{m}</button>
              ))}
            </div>
          </div>

          {/* Lighting selector */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
            <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-slate-500">Lighting preset</p>
            <div className="grid grid-cols-2 gap-1">
              {lightingPresets.map((l) => (
                <button key={l} type="button" onClick={() => { setLighting(l); showToast(`Lighting set to ${l}.`); }} className={`rounded-lg px-2 py-1.5 text-[9px] font-bold uppercase tracking-widest ${lighting === l ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'}`}>{l}</button>
              ))}
            </div>
          </div>
        </div>
      )}
    </PanelShell>
  );
}

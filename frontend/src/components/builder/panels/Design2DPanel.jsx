import { useState } from 'react';
import { PenTool, Download, FileImage, FileText, Palette, Type, Square, Circle, Star } from 'lucide-react';
import { useBuilderStore } from '../../../store/builderStore';
import { ActionButton, PanelSection, PanelShell } from './PanelShell';

const tools = [
  { id: 'poster', label: 'Poster Maker', icon: FileImage },
  { id: 'banner', label: 'Banner Maker', icon: FileImage },
  { id: 'businessCard', label: 'Business Card Maker', icon: FileText },
  { id: 'instagram', label: 'Instagram Post Maker', icon: FileImage },
  { id: 'youtube', label: 'YouTube Thumbnail Maker', icon: FileImage },
  { id: 'flyer', label: 'Flyer Maker', icon: FileText },
  { id: 'logo', label: 'Logo Layout Tool', icon: Star },
  { id: 'shape', label: 'Shape Tool', icon: Square },
  { id: 'icon', label: 'Icon Tool', icon: Circle },
  { id: 'textFx', label: 'Text Effects', icon: Type },
];

const canvasSizes = {
  poster: { w: 800, h: 1200, label: '800 × 1200' },
  banner: { w: 1200, h: 400, label: '1200 × 400' },
  businessCard: { w: 350, h: 200, label: '350 × 200' },
  instagram: { w: 1080, h: 1080, label: '1080 × 1080' },
  youtube: { w: 1280, h: 720, label: '1280 × 720' },
  flyer: { w: 600, h: 900, label: '600 × 900' },
  logo: { w: 500, h: 500, label: '500 × 500' },
  shape: { w: 400, h: 400, label: '400 × 400' },
  icon: { w: 256, h: 256, label: '256 × 256' },
  textFx: { w: 800, h: 400, label: '800 × 400' },
};

const shapes = ['Rectangle', 'Circle', 'Triangle', 'Star', 'Arrow', 'Heart', 'Diamond', 'Hexagon'];
const gradients = [
  'linear-gradient(135deg, #667eea, #764ba2)',
  'linear-gradient(135deg, #f093fb, #f5576c)',
  'linear-gradient(135deg, #4facfe, #00f2fe)',
  'linear-gradient(135deg, #43e97b, #38f9d7)',
  'linear-gradient(135deg, #fa709a, #fee140)',
  'linear-gradient(135deg, #a18cd1, #fbc2eb)',
];

export default function Design2DPanel() {
  const [active, setActive] = useState(null);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [textValue, setTextValue] = useState('Your Text');
  const [selectedShape, setSelectedShape] = useState('Rectangle');
  const [selectedGradient, setSelectedGradient] = useState(gradients[0]);
  const { showToast } = useBuilderStore();

  const size = active ? canvasSizes[active] : null;

  const handleExport = (format) => {
    showToast(`Export as ${format}: Canvas content (${size?.label || '800×600'}) saved as ${format}. Full canvas rendering requires Fabric.js integration.`, 'success');
  };

  return (
    <PanelShell eyebrow="Design studio" title="2D Design Tools">
      <PanelSection title="Create marketing assets">
        {tools.map((tool) => (
          <ActionButton key={tool.id} icon={tool.icon} label={tool.label} description={canvasSizes[tool.id]?.label} onClick={() => setActive(tool.id)} />
        ))}
      </PanelSection>

      {active && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-black uppercase tracking-widest text-white">{tools.find((t) => t.id === active)?.label}</p>
              <span className="text-[9px] font-bold uppercase tracking-widest text-indigo-300">{size?.label}</span>
            </div>

            {/* Mini Canvas Preview */}
            <div
              className="relative flex items-center justify-center overflow-hidden rounded-xl border border-dashed border-indigo-400/40"
              style={{
                backgroundColor: bgColor,
                backgroundImage: selectedGradient && bgColor === '#ffffff' ? selectedGradient : undefined,
                aspectRatio: `${size?.w || 800} / ${size?.h || 600}`,
                maxHeight: '200px',
              }}
            >
              <div className="text-center">
                {active === 'shape' || active === 'icon' ? (
                  <div className="flex flex-wrap justify-center gap-2">
                    <div className={`h-12 w-12 ${selectedShape === 'Circle' ? 'rounded-full' : 'rounded-lg'} bg-indigo-500`} />
                  </div>
                ) : (
                  <p className="px-4 text-sm font-bold text-slate-800 drop-shadow-sm" style={{ color: bgColor === '#ffffff' ? '#0f172a' : '#ffffff' }}>
                    {textValue}
                  </p>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="mt-3 space-y-2">
              <label className="block">
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Background color</span>
                <div className="mt-1 flex gap-2">
                  <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-8 w-10 rounded-lg border border-slate-700 bg-transparent" />
                  <input value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-2 text-xs text-white outline-none" />
                </div>
              </label>

              {(active === 'shape' || active === 'icon') && (
                <label className="block">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Shape</span>
                  <div className="mt-1 grid grid-cols-4 gap-1">
                    {shapes.map((s) => (
                      <button key={s} type="button" onClick={() => setSelectedShape(s)} className={`rounded-lg px-2 py-1 text-[9px] font-bold uppercase ${selectedShape === s ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'}`}>{s}</button>
                    ))}
                  </div>
                </label>
              )}

              {active !== 'shape' && active !== 'icon' && (
                <label className="block">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Text</span>
                  <input value={textValue} onChange={(e) => setTextValue(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs text-white outline-none" />
                </label>
              )}

              <div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Gradient presets</span>
                <div className="mt-1 grid grid-cols-6 gap-1">
                  {gradients.map((g) => (
                    <button key={g} type="button" onClick={() => { setSelectedGradient(g); setBgColor('#ffffff'); }} className={`h-7 rounded-lg border ${selectedGradient === g ? 'border-indigo-400 ring-1 ring-indigo-400' : 'border-slate-700'}`} style={{ backgroundImage: g }} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Export buttons */}
          <PanelSection title="Export">
            <div className="grid grid-cols-3 gap-2">
              {['PNG', 'JPG', 'PDF'].map((format) => (
                <button key={format} type="button" onClick={() => handleExport(format)} className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-950 px-3 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-300 hover:bg-indigo-600 hover:text-white">
                  <Download size={12} />
                  {format}
                </button>
              ))}
            </div>
            <button type="button" onClick={() => handleExport('SVG')} className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-300 hover:border-indigo-500 hover:text-white">
              Export SVG
            </button>
          </PanelSection>
        </div>
      )}
    </PanelShell>
  );
}

import React, { useRef, useState } from 'react';
import { ImagePlus, Wand2 } from 'lucide-react';
import { useBuilderStore } from '../../../store/builderStore';
import { ActionButton, PanelSection, PanelShell } from './PanelShell';

export default function MediaPanel() {
  const inputRef = useRef(null);
  const [url, setUrl] = useState('');
  const { project, addAsset, addElement, updateSelectedProps, selectedElement, selectedSectionId, showToast } = useBuilderStore();

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => addAsset({ name: file.name, type: 'image', src: reader.result });
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const insertAsset = (asset) => {
    if (selectedElement?.type === 'image') updateSelectedProps({ src: asset.src, alt: asset.name });
    else addElement('image', selectedSectionId, { props: { src: asset.src, alt: asset.name } });
    showToast('Image ready on canvas. Select it to replace URL or alt text.');
  };

  return (
    <PanelShell eyebrow="Assets" title="Media Library">
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      <PanelSection title="Upload and insert">
        <ActionButton icon={ImagePlus} label="Upload image" onClick={() => inputRef.current?.click()} />
        <ActionButton icon={ImagePlus} label="Upload logo" onClick={() => inputRef.current?.click()} />
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Add image URL</label>
          <input value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://..." className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white outline-none" />
          <button type="button" onClick={() => { if (url) insertAsset(addAsset({ name: 'Image URL', src: url, type: 'image' })); setUrl(''); }} className="mt-3 w-full rounded-xl bg-indigo-600 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-white">
            Add URL media
          </button>
        </div>
        <ActionButton icon={Wand2} label="Stock image placeholder" onClick={() => showToast('Stock image search placeholder opened.')} />
        <ActionButton icon={Wand2} label="Icon library placeholder" onClick={() => showToast('Icon library placeholder opened.')} />
      </PanelSection>
      <PanelSection title="Uploaded assets">
        <div className="grid grid-cols-2 gap-2">
          {(project?.assets || []).map((asset) => (
            <button key={asset.id} type="button" onClick={() => insertAsset(asset)} className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 text-left">
              <img src={asset.src} alt={asset.name} className="h-24 w-full object-cover" />
              <span className="block truncate p-2 text-[9px] font-bold uppercase tracking-widest text-slate-400">{asset.name}</span>
            </button>
          ))}
        </div>
        {!project?.assets?.length && <p className="rounded-2xl border border-dashed border-slate-800 p-4 text-xs text-slate-500">No uploaded assets yet.</p>}
      </PanelSection>
      <PanelSection title="Media magic">
        {['Crop', 'Resize', 'Optimize image', 'Remove background', 'Convert to WebP', 'AI image generator', 'SVG editor'].map((label) => (
          <ActionButton key={label} icon={Wand2} label={label} onClick={() => showToast(`${label} coming soon.`)} />
        ))}
      </PanelSection>
    </PanelShell>
  );
}

import { useRef, useState } from 'react';
import { ImagePlus, Wand2 } from 'lucide-react';
import { useBuilderStore } from '../../../store/builderStore';
import { ActionButton, PanelSection, PanelShell } from './PanelShell';

export default function MediaPanel() {
  const inputRef = useRef(null);
  const [url, setUrl] = useState('');
  const [uploadType, setUploadType] = useState('image');
  const [accept, setAccept] = useState('image/*');
  const { project, addAsset, addElement, updateSelectedProps, selectedElement, getSelectedNode, selectedSectionId, showToast } = useBuilderStore();
  const selectedNode = getSelectedNode;

  const startUpload = (type, acceptValue = '*/*') => {
    setUploadType(type);
    setAccept(acceptValue);
    inputRef.current?.click();
  };

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => addAsset({ name: file.name, type: uploadType, src: reader.result });
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const insertAsset = (asset) => {
    if ((selectedNode?.type === 'image' || selectedElement?.type === 'image') && asset.type !== 'video') updateSelectedProps({ src: asset.src, alt: asset.name });
    else if (asset.type === 'video') addElement('video', selectedSectionId, { props: { src: asset.src, alt: asset.name } });
    else if (asset.type === 'lottie') addElement('lottieAnimation', selectedSectionId, { props: { src: asset.src }, content: asset.name });
    else addElement('image', selectedSectionId, { props: { src: asset.src, alt: asset.name } });
    showToast('Media ready on canvas. Select it to replace URL, alt text, or settings.');
  };

  return (
    <PanelShell eyebrow="Assets" title="Media Library">
      <input ref={inputRef} type="file" accept={accept} onChange={handleFile} className="hidden" />
      <PanelSection title="Upload and insert">
        <ActionButton icon={ImagePlus} label="Image Upload" onClick={() => startUpload('image', 'image/*')} />
        <ActionButton icon={ImagePlus} label="Logo Upload" onClick={() => startUpload('logo', 'image/*')} />
        <ActionButton icon={ImagePlus} label="Video Upload" onClick={() => startUpload('video', 'video/*')} />
        <ActionButton icon={ImagePlus} label="SVG Upload" onClick={() => startUpload('svg', 'image/svg+xml')} />
        <ActionButton icon={ImagePlus} label="Lottie Animation Upload" onClick={() => startUpload('lottie', '.json,application/json')} />
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Add image URL</label>
          <input value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://..." className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white outline-none" />
          <button type="button" onClick={() => { if (url) insertAsset(addAsset({ name: 'Image URL', src: url, type: 'image' })); setUrl(''); }} className="mt-3 w-full rounded-xl bg-indigo-600 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-white">
            Add URL media
          </button>
        </div>
        <ActionButton icon={Wand2} label="Icon Library" onClick={() => addElement('icon')} />
        <ActionButton icon={Wand2} label="Stock Image Search" onClick={() => showToast('Stock image search placeholder opened. API connection required for live search.')} />
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
      <PanelSection title="Storage and media magic">
        {['Image Library', 'Business Photo Storage', 'Product Image Storage', 'Crop', 'Resize', 'Optimize image', 'Remove background', 'Convert to WebP', 'AI image generator', 'SVG editor'].map((label) => (
          <ActionButton key={label} icon={Wand2} label={label} onClick={() => showToast(`${label} coming soon.`)} />
        ))}
      </PanelSection>
    </PanelShell>
  );
}

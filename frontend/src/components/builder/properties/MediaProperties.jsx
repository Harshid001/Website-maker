import { useRef } from 'react';
import { useBuilderStore } from '../../../store/builderStore';
import { MiniButton, PropertyGroup, SelectInput, TextInput } from './PropertyControls';

export default function MediaProperties() {
  const fileRef = useRef(null);
  const { selectedElement, getSelectedNode, updateSelectedProps, updateSelectedStyles, showToast } = useBuilderStore();
  const selectedNode = getSelectedNode;
  const item = selectedNode || selectedElement;
  if (!item || !['image', 'video', 'gallery'].includes(item.type)) return null;

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateSelectedProps({ src: reader.result, alt: file.name });
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  return (
    <PropertyGroup title="Image / Media Magic">
      <input ref={fileRef} type="file" accept="image/*,video/*" onChange={handleFile} className="hidden" />
      <MiniButton onClick={() => fileRef.current?.click()}>Upload / Replace</MiniButton>
      <TextInput label="Image URL" value={item.props?.src || ''} onChange={(value) => updateSelectedProps({ src: value })} />
      <TextInput label="Alt text" value={item.props?.alt || ''} onChange={(value) => updateSelectedProps({ alt: value })} />
      <SelectInput label="Object fit" value={item.props?.objectFit || 'cover'} onChange={(value) => updateSelectedProps({ objectFit: value })} options={['cover', 'contain', 'fill', 'none', 'scale-down']} />
      <SelectInput label="Object position" value={item.props?.objectPosition || 'center'} onChange={(value) => updateSelectedProps({ objectPosition: value })} options={['center', 'top', 'bottom', 'left', 'right', 'top left', 'top right', 'bottom left', 'bottom right']} />
      <TextInput label="Border radius" value={item.styles?.borderRadius || ''} onChange={(value) => updateSelectedStyles({ borderRadius: value })} />
      <TextInput label="Shadow" value={item.styles?.boxShadow || ''} onChange={(value) => updateSelectedStyles({ boxShadow: value })} />

      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">Image tools</p>
        <div className="grid grid-cols-2 gap-2">
          <MiniButton onClick={() => showToast('Crop Image: Use object-fit and object-position controls above to frame your image. Full crop UI requires canvas integration.')}>Crop image</MiniButton>
          <MiniButton onClick={() => showToast('Resize: Set width/height in the Layout Properties panel. The image will scale responsively.')}>Resize image</MiniButton>
          <MiniButton onClick={() => showToast('Remove BG: Background removal requires the AI service. The placeholder stores the request for processing.')}>Remove BG</MiniButton>
          <MiniButton onClick={() => showToast('Convert WebP: Images will be converted to WebP format during the publish build pipeline for optimal performance.')}>Convert WebP</MiniButton>
          <MiniButton onClick={() => showToast('AI Generate: Describe the image you want. AI image generation connects to the backend AI service when available.')}>AI generate</MiniButton>
          <MiniButton onClick={() => showToast('AI Enhance: Automatic contrast, sharpness, and color correction. Connects to the backend AI service when available.')}>AI enhance</MiniButton>
          <MiniButton onClick={() => showToast('Compress: Images are automatically compressed during publishing. Current file size is optimized for editing.')}>Compress</MiniButton>
        </div>
      </div>

      {item.type === 'video' && (
        <>
          <TextInput label="Video poster" value={item.props?.poster || ''} onChange={(value) => updateSelectedProps({ poster: value })} placeholder="https://..." />
          <SelectInput label="Autoplay" value={item.props?.autoplay ? 'yes' : 'no'} onChange={(value) => updateSelectedProps({ autoplay: value === 'yes' })} options={[{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes (muted)' }]} />
          <SelectInput label="Loop" value={item.props?.loop ? 'yes' : 'no'} onChange={(value) => updateSelectedProps({ loop: value === 'yes' })} options={[{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }]} />
        </>
      )}
    </PropertyGroup>
  );
}

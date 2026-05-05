import { useRef } from 'react';
import { useBuilderStore } from '../../../store/builderStore';
import { responsiveStylesFor } from '../../../utils/renderHelpers';
import { MiniButton, PropertyGroup, SelectInput, SliderControl, TextArea, TextInput } from './PropertyControls';

export default function MediaProperties() {
  const fileRef = useRef(null);
  const { activeDevice, selectedElement, getSelectedNode, updateSelectedProps, updateSelectedStyles } = useBuilderStore();
  const selectedNode = getSelectedNode;
  const item = selectedNode || selectedElement;
  if (!item || !['image', 'video', 'gallery'].includes(item.type)) return null;
  const styles = { ...(item.styles || {}), ...responsiveStylesFor(item, activeDevice) };
  const galleryImages = item.props?.images || [];

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (item.type === 'gallery') {
        updateSelectedProps({ images: [reader.result, ...galleryImages] });
      } else {
        updateSelectedProps({ src: reader.result, alt: item.props?.alt || file.name });
      }
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  return (
    <PropertyGroup title="Image / Media Magic">
      <input ref={fileRef} type="file" accept="image/*,video/*" onChange={handleFile} className="hidden" />
      <MiniButton onClick={() => fileRef.current?.click()}>Upload / Replace</MiniButton>
      {item.type === 'gallery' ? (
        <TextArea
          label="Gallery image URLs"
          value={galleryImages.join('\n')}
          onChange={(value) => updateSelectedProps({ images: value.split('\n').map((url) => url.trim()).filter(Boolean) })}
          rows={5}
        />
      ) : (
        <>
          <TextInput label="Image URL" value={item.props?.src || ''} onChange={(value) => updateSelectedProps({ src: value })} />
          <TextInput label="Alt text" value={item.props?.alt || ''} onChange={(value) => updateSelectedProps({ alt: value })} />
        </>
      )}
      <SelectInput label="Object fit" value={item.props?.objectFit || 'cover'} onChange={(value) => updateSelectedProps({ objectFit: value })} options={['cover', 'contain', 'fill', 'none', 'scale-down']} />
      <SelectInput label="Object position" value={item.props?.objectPosition || 'center'} onChange={(value) => updateSelectedProps({ objectPosition: value })} options={['center', 'top', 'bottom', 'left', 'right', 'top left', 'top right', 'bottom left', 'bottom right']} />
      <div className="grid grid-cols-2 gap-2">
        <TextInput label="Width" value={styles.width || ''} onChange={(value) => updateSelectedStyles({ width: value })} />
        <TextInput label="Height" value={styles.height || ''} onChange={(value) => updateSelectedStyles({ height: value })} />
        <TextInput label="Border radius" value={styles.borderRadius || ''} onChange={(value) => updateSelectedStyles({ borderRadius: value })} />
        <TextInput label="Shadow" value={styles.boxShadow || ''} onChange={(value) => updateSelectedStyles({ boxShadow: value })} />
      </div>
      <SliderControl label="Opacity" value={Number(styles.opacity ?? 1) * 100} min={0} max={100} step={1} onChange={(value) => updateSelectedStyles({ opacity: String(value / 100) })} />

      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">Fit presets</p>
        <div className="grid grid-cols-2 gap-2">
          <MiniButton onClick={() => updateSelectedProps({ objectFit: 'cover', objectPosition: 'center' })}>Center crop</MiniButton>
          <MiniButton onClick={() => updateSelectedProps({ objectFit: 'contain', objectPosition: 'center' })}>Fit inside</MiniButton>
          <MiniButton onClick={() => updateSelectedProps({ objectFit: 'fill', objectPosition: 'center' })}>Stretch</MiniButton>
          <MiniButton onClick={() => updateSelectedStyles({ width: '100%', height: styles.height || 'auto' })}>Full width</MiniButton>
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

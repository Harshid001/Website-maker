import React, { useRef } from 'react';
import { useBuilderStore } from '../../../store/builderStore';
import { MiniButton, PropertyGroup, SelectInput, TextInput } from './PropertyControls';

export default function MediaProperties() {
  const fileRef = useRef(null);
  const { selectedElement, updateSelectedProps, updateSelectedStyles, showToast } = useBuilderStore();
  if (!selectedElement || !['image', 'video', 'gallery'].includes(selectedElement.type)) return null;

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
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      <MiniButton onClick={() => fileRef.current?.click()}>Replace image</MiniButton>
      <TextInput label="Image URL" value={selectedElement.props?.src || ''} onChange={(value) => updateSelectedProps({ src: value })} />
      <TextInput label="Alt text" value={selectedElement.props?.alt || ''} onChange={(value) => updateSelectedProps({ alt: value })} />
      <SelectInput label="Object fit" value={selectedElement.props?.objectFit || 'cover'} onChange={(value) => updateSelectedProps({ objectFit: value })} options={['cover', 'contain', 'fill']} />
      <SelectInput label="Object position" value={selectedElement.props?.objectPosition || 'center'} onChange={(value) => updateSelectedProps({ objectPosition: value })} options={['center', 'top', 'bottom', 'left', 'right']} />
      <TextInput label="Border radius" value={selectedElement.styles?.borderRadius || ''} onChange={(value) => updateSelectedStyles({ borderRadius: value })} />
      <TextInput label="Shadow" value={selectedElement.styles?.boxShadow || ''} onChange={(value) => updateSelectedStyles({ boxShadow: value })} />
      <div className="grid grid-cols-2 gap-2">
        {['Optimize image', 'Remove BG', 'Convert WebP', 'AI generate'].map((label) => <MiniButton key={label} onClick={() => showToast(`${label} coming soon.`)}>{label}</MiniButton>)}
      </div>
    </PropertyGroup>
  );
}

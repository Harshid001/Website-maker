import React from 'react';
import { useBuilderStore } from '../../../store/builderStore';
import { ColorInput, MiniButton, PropertyGroup, TextInput } from './PropertyControls';

export default function BackgroundProperties() {
  const { selectedItem, updateSelectedStyles, showToast } = useBuilderStore();
  const styles = selectedItem?.styles || {};

  return (
    <PropertyGroup title="Background">
      <ColorInput label="Solid color" value={styles.backgroundColor || '#ffffff'} onChange={(value) => updateSelectedStyles({ backgroundColor: value, backgroundImage: '' })} />
      <TextInput label="Gradient" value={styles.backgroundImage} onChange={(value) => updateSelectedStyles({ backgroundImage: value })} placeholder="linear-gradient(...)" />
      <TextInput label="Image background" value={styles.backgroundImage?.startsWith('url') ? styles.backgroundImage : ''} onChange={(value) => updateSelectedStyles({ backgroundImage: value ? `url(${value})` : '' })} placeholder="https://..." />
      <div className="grid grid-cols-2 gap-2">
        <MiniButton onClick={() => updateSelectedStyles({ backdropFilter: 'blur(18px)', backgroundColor: 'rgba(255,255,255,0.72)' })}>Glass</MiniButton>
        <MiniButton onClick={() => showToast('Video and pattern backgrounds are structured placeholders.')}>Video BG</MiniButton>
      </div>
    </PropertyGroup>
  );
}

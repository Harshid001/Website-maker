import React from 'react';
import { useBuilderStore } from '../../../store/builderStore';
import { ColorInput, MiniButton, PropertyGroup, SelectInput, TextInput } from './PropertyControls';

export default function DesignProperties() {
  const { selectedItem, updateSelectedStyles, showToast } = useBuilderStore();
  const styles = selectedItem?.styles || {};
  const update = (key) => (value) => updateSelectedStyles({ [key]: value });

  return (
    <PropertyGroup title="Design Properties">
      <ColorInput label="Background color" value={styles.backgroundColor || '#ffffff'} onChange={update('backgroundColor')} />
      <ColorInput label="Border color" value={styles.borderColor || '#e2e8f0'} onChange={update('borderColor')} />
      <div className="grid grid-cols-2 gap-2">
        <TextInput label="Border width" value={styles.borderWidth} onChange={update('borderWidth')} placeholder="1px" />
        <SelectInput label="Border style" value={styles.borderStyle || 'solid'} onChange={update('borderStyle')} options={['solid', 'dashed', 'dotted', 'none']} />
        <TextInput label="Radius" value={styles.borderRadius} onChange={update('borderRadius')} placeholder="16px" />
        <TextInput label="Opacity" value={styles.opacity} onChange={update('opacity')} placeholder="1" />
        <TextInput label="Blur" value={styles.filter} onChange={update('filter')} placeholder="blur(0px)" />
        <TextInput label="Hover transform" value={styles['--hover-transform']} onChange={update('--hover-transform')} placeholder="translateY(-4px)" />
      </div>
      <SelectInput
        label="Shadow preset"
        value={styles.boxShadow || 'none'}
        onChange={update('boxShadow')}
        options={[
          { value: 'none', label: 'None' },
          { value: '0 8px 20px rgba(15, 23, 42, 0.10)', label: 'Small' },
          { value: '0 18px 45px rgba(15, 23, 42, 0.14)', label: 'Medium' },
          { value: '0 28px 80px rgba(15, 23, 42, 0.22)', label: 'Large' },
        ]}
      />
      <TextInput label="Custom shadow" value={styles.boxShadow === 'none' ? '' : styles.boxShadow} onChange={update('boxShadow')} placeholder="0 18px 45px rgba(...)" />
      <div className="grid grid-cols-2 gap-2">
        <MiniButton onClick={() => updateSelectedStyles({ boxShadow: '0 18px 45px rgba(15, 23, 42, 0.14)' })}>Apply shadow</MiniButton>
        <MiniButton onClick={() => showToast('Overlay and pattern placeholders are ready for future background assets.')}>Pattern</MiniButton>
      </div>
    </PropertyGroup>
  );
}

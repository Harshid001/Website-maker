import React from 'react';
import { useBuilderStore } from '../../../store/builderStore';
import { MiniButton, PropertyGroup, SelectInput, TextInput, ToggleInput } from './PropertyControls';

export default function AnimationProperties() {
  const { selectedItem, updateSelectedAnimation, showToast } = useBuilderStore();
  const animation = selectedItem?.animation || {};

  return (
    <PropertyGroup title="AI Animations">
      <MiniButton onClick={() => { updateSelectedAnimation({ type: 'slide-up', duration: 700, delay: 80, easing: 'ease-out', trigger: 'scroll' }); showToast('Suggested animation applied.'); }}>Suggest animation</MiniButton>
      <SelectInput label="Animation type" value={animation.type || 'none'} onChange={(value) => updateSelectedAnimation({ type: value })} options={['none', 'fade-in', 'slide-up', 'slide-left', 'slide-right', 'zoom-in', 'bounce', 'button-glow']} />
      <div className="grid grid-cols-2 gap-2">
        <TextInput label="Duration" value={animation.duration || ''} onChange={(value) => updateSelectedAnimation({ duration: Number(value) || value })} />
        <TextInput label="Delay" value={animation.delay || ''} onChange={(value) => updateSelectedAnimation({ delay: Number(value) || value })} />
      </div>
      <SelectInput label="Easing" value={animation.easing || 'ease-out'} onChange={(value) => updateSelectedAnimation({ easing: value })} options={['ease-out', 'ease-in', 'ease-in-out', 'linear']} />
      <SelectInput label="Trigger" value={animation.trigger || 'load'} onChange={(value) => updateSelectedAnimation({ trigger: value })} options={['load', 'scroll', 'hover']} />
      <ToggleInput label="Loop" checked={animation.loop} onChange={(value) => updateSelectedAnimation({ loop: value })} />
    </PropertyGroup>
  );
}

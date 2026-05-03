import React from 'react';
import { useBuilderStore } from '../../../store/builderStore';
import { ColorInput, PropertyGroup, SelectInput, TextInput } from './PropertyControls';

export default function ButtonProperties() {
  const { selectedElement, updateSelectedContent, updateSelectedProps, updateSelectedStyles } = useBuilderStore();
  if (!selectedElement || selectedElement.type !== 'button') return null;

  return (
    <PropertyGroup title="Button Settings">
      <TextInput label="Button text" value={selectedElement.content || ''} onChange={updateSelectedContent} />
      <SelectInput label="Link type" value={selectedElement.props?.linkType || 'external'} onChange={(value) => updateSelectedProps({ linkType: value })} options={['external', 'internal page', 'scroll section']} />
      <TextInput label="Button link" value={selectedElement.props?.href || ''} onChange={(value) => updateSelectedProps({ href: value })} />
      <TextInput label="Internal page" value={selectedElement.props?.pageId || ''} onChange={(value) => updateSelectedProps({ pageId: value })} />
      <SelectInput label="Open in" value={selectedElement.props?.target || '_self'} onChange={(value) => updateSelectedProps({ target: value })} options={[{ value: '_self', label: 'Same tab' }, { value: '_blank', label: 'New tab' }]} />
      <SelectInput label="Button style" value={selectedElement.props?.variant || 'solid'} onChange={(value) => updateSelectedProps({ variant: value })} options={['solid', 'outline', 'ghost']} />
      <SelectInput label="Button size" value={selectedElement.props?.size || 'medium'} onChange={(value) => updateSelectedProps({ size: value })} options={['small', 'medium', 'large']} />
      <ColorInput label="Background" value={selectedElement.styles?.backgroundColor || '#6366f1'} onChange={(value) => updateSelectedStyles({ backgroundColor: value })} />
      <ColorInput label="Text color" value={selectedElement.styles?.color || '#ffffff'} onChange={(value) => updateSelectedStyles({ color: value })} />
      <TextInput label="Hover effect" value={selectedElement.props?.hoverEffect || ''} onChange={(value) => updateSelectedProps({ hoverEffect: value })} placeholder="lift, glow, scale" />
      <TextInput label="Scroll to section" value={selectedElement.props?.scrollTo || ''} onChange={(value) => updateSelectedProps({ scrollTo: value })} placeholder="#contact" />
    </PropertyGroup>
  );
}

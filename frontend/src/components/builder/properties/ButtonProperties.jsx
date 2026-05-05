import { useBuilderStore } from '../../../store/builderStore';
import { ColorInput, PropertyGroup, SelectInput, TextInput } from './PropertyControls';

export default function ButtonProperties() {
  const { selectedElement, getSelectedNode, updateSelectedContent, updateSelectedProps, updateSelectedStyles } = useBuilderStore();
  const selectedNode = getSelectedNode;
  const item = selectedNode || selectedElement;
  if (!item || !['button', 'navLink', 'footerLink', 'whatsappButton'].includes(item.type)) return null;

  return (
    <PropertyGroup title="Button Settings">
      <TextInput label="Button text" value={item.content || ''} onChange={updateSelectedContent} />
      <SelectInput label="Link type" value={item.props?.linkType || 'external'} onChange={(value) => updateSelectedProps({ linkType: value })} options={['external', 'internal page', 'scroll section', 'email', 'phone']} />
      <TextInput label="Button link" value={item.props?.href || ''} onChange={(value) => updateSelectedProps({ href: value })} />
      <TextInput label="Internal page" value={item.props?.pageId || ''} onChange={(value) => updateSelectedProps({ pageId: value })} />
      <SelectInput label="Open in" value={item.props?.target || '_self'} onChange={(value) => updateSelectedProps({ target: value })} options={[{ value: '_self', label: 'Same tab' }, { value: '_blank', label: 'New tab' }]} />
      <SelectInput label="Button style" value={item.props?.variant || 'solid'} onChange={(value) => updateSelectedProps({ variant: value })} options={['solid', 'outline', 'ghost', 'gradient']} />
      <SelectInput label="Button size" value={item.props?.size || 'medium'} onChange={(value) => updateSelectedProps({ size: value })} options={['small', 'medium', 'large', 'xl']} />
      <ColorInput label="Background" value={item.styles?.backgroundColor || '#6366f1'} onChange={(value) => updateSelectedStyles({ backgroundColor: value })} />
      <ColorInput label="Text color" value={item.styles?.color || '#ffffff'} onChange={(value) => updateSelectedStyles({ color: value })} />
      <TextInput label="Border radius" value={item.styles?.borderRadius || ''} onChange={(value) => updateSelectedStyles({ borderRadius: value })} placeholder="999px" />
      <TextInput label="Hover effect" value={item.props?.hoverEffect || ''} onChange={(value) => updateSelectedProps({ hoverEffect: value })} placeholder="lift, glow, scale" />
      <TextInput label="Scroll to section" value={item.props?.scrollTo || ''} onChange={(value) => updateSelectedProps({ scrollTo: value })} placeholder="#contact" />
      <TextInput label="Icon (left)" value={item.props?.iconLeft || ''} onChange={(value) => updateSelectedProps({ iconLeft: value })} placeholder="ArrowRight" />
    </PropertyGroup>
  );
}

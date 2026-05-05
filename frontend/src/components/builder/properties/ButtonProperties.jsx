import { useBuilderStore } from '../../../store/builderStore';
import { responsiveStylesFor } from '../../../utils/renderHelpers';
import { ColorInput, PropertyGroup, SelectInput, TextInput } from './PropertyControls';

export default function ButtonProperties() {
  const { activeDevice, selectedElement, getSelectedNode, updateSelectedContent, updateSelectedProps, updateSelectedStyles } = useBuilderStore();
  const selectedNode = getSelectedNode;
  const item = selectedNode || selectedElement;
  if (!item || !['button', 'navLink', 'footerLink', 'whatsappButton'].includes(item.type)) return null;
  const styles = { ...(item.styles || {}), ...responsiveStylesFor(item, activeDevice) };
  const applyHoverEffect = (value) => {
    const effectStyles = {
      none: { '--hover-transform': '', '--hover-box-shadow': '' },
      lift: { '--hover-transform': 'translateY(-3px)' },
      glow: { '--hover-box-shadow': '0 18px 45px rgba(99, 102, 241, 0.34)' },
      scale: { '--hover-transform': 'scale(1.03)' },
    }[value] || {};
    updateSelectedProps({ hoverEffect: value });
    updateSelectedStyles(effectStyles);
  };

  return (
    <PropertyGroup title="Button Settings">
      <TextInput label="Button text" value={item.content || ''} onChange={updateSelectedContent} />
      <SelectInput label="Link type" value={item.props?.linkType || 'external'} onChange={(value) => updateSelectedProps({ linkType: value })} options={['external', 'internal page', 'scroll section', 'email', 'phone']} />
      <TextInput label="Button link" value={item.props?.href || ''} onChange={(value) => updateSelectedProps({ href: value })} />
      <TextInput label="Internal page" value={item.props?.pageId || ''} onChange={(value) => updateSelectedProps({ pageId: value })} />
      <SelectInput label="Open in" value={item.props?.target || '_self'} onChange={(value) => updateSelectedProps({ target: value })} options={[{ value: '_self', label: 'Same tab' }, { value: '_blank', label: 'New tab' }]} />
      <SelectInput label="Button style" value={item.props?.variant || 'solid'} onChange={(value) => updateSelectedProps({ variant: value })} options={['solid', 'outline', 'ghost', 'gradient']} />
      <SelectInput label="Button size" value={item.props?.size || 'medium'} onChange={(value) => updateSelectedProps({ size: value })} options={['small', 'medium', 'large', 'xl']} />
      <ColorInput label="Background" value={styles.backgroundColor || '#6366f1'} onChange={(value) => updateSelectedStyles({ backgroundColor: value })} />
      <ColorInput label="Text color" value={styles.color || '#ffffff'} onChange={(value) => updateSelectedStyles({ color: value })} />
      <ColorInput label="Hover background" value={styles['--hover-background-color'] || styles.hoverBackgroundColor || '#4f46e5'} onChange={(value) => updateSelectedStyles({ '--hover-background-color': value })} />
      <ColorInput label="Hover text" value={styles['--hover-color'] || styles.hoverColor || styles.color || '#ffffff'} onChange={(value) => updateSelectedStyles({ '--hover-color': value })} />
      <div className="grid grid-cols-2 gap-2">
        <TextInput label="Border radius" value={styles.borderRadius || ''} onChange={(value) => updateSelectedStyles({ borderRadius: value })} placeholder="999px" />
        <TextInput label="Padding" value={styles.padding || ''} onChange={(value) => updateSelectedStyles({ padding: value })} placeholder="14px 22px" />
        <TextInput label="Font size" value={styles.fontSize || ''} onChange={(value) => updateSelectedStyles({ fontSize: value })} placeholder="14px" />
        <TextInput label="Shadow" value={styles.boxShadow || ''} onChange={(value) => updateSelectedStyles({ boxShadow: value })} placeholder="0 18px 45px rgba(...)" />
        <TextInput label="Border width" value={styles.borderWidth || ''} onChange={(value) => updateSelectedStyles({ borderWidth: value })} placeholder="1px" />
        <ColorInput label="Border color" value={styles.borderColor || '#e2e8f0'} onChange={(value) => updateSelectedStyles({ borderColor: value, borderStyle: styles.borderStyle || 'solid' })} />
      </div>
      <SelectInput label="Hover effect" value={item.props?.hoverEffect || 'none'} onChange={applyHoverEffect} options={['none', 'lift', 'glow', 'scale']} />
      <TextInput label="Scroll to section" value={item.props?.scrollTo || ''} onChange={(value) => updateSelectedProps({ scrollTo: value })} placeholder="#contact" />
      <TextInput label="Icon (left)" value={item.props?.iconLeft || ''} onChange={(value) => updateSelectedProps({ iconLeft: value })} placeholder="ArrowRight" />
    </PropertyGroup>
  );
}

import { useBuilderStore } from '../../../store/builderStore';
import { responsiveStylesFor } from '../../../utils/renderHelpers';
import { ColorInput, MiniButton, PropertyGroup, SelectInput, TextInput } from './PropertyControls';

export default function BackgroundProperties() {
  const { activeDevice, selectedItem, getSelectedNode, updateSelectedStyles } = useBuilderStore();
  const selectedNode = getSelectedNode;
  const item = selectedNode || selectedItem;
  const styles = item ? { ...(item.styles || {}), ...responsiveStylesFor(item, activeDevice) } : {};

  return (
    <PropertyGroup title="Background">
      <ColorInput label="Solid color" value={styles.backgroundColor || '#ffffff'} onChange={(value) => updateSelectedStyles({ backgroundColor: value, backgroundImage: '' })} />
      <TextInput label="Gradient" value={(!styles.backgroundImage || styles.backgroundImage?.startsWith('url')) ? '' : styles.backgroundImage} onChange={(value) => updateSelectedStyles({ backgroundImage: value })} placeholder="linear-gradient(135deg, #667eea, #764ba2)" />
      <TextInput label="Image URL" value={styles.backgroundImage?.startsWith('url') ? styles.backgroundImage.replace(/^url\(["']?|["']?\)$/g, '') : ''} onChange={(value) => updateSelectedStyles({ backgroundImage: value ? `url(${value})` : '' })} placeholder="https://..." />
      
      {/* Background position/size/repeat */}
      <div className="grid grid-cols-2 gap-2">
        <SelectInput label="BG size" value={styles.backgroundSize || 'cover'} onChange={(value) => updateSelectedStyles({ backgroundSize: value })} options={['cover', 'contain', 'auto', '100% 100%']} />
        <SelectInput label="BG position" value={styles.backgroundPosition || 'center'} onChange={(value) => updateSelectedStyles({ backgroundPosition: value })} options={['center', 'top', 'bottom', 'left', 'right', 'top left', 'top right', 'bottom left', 'bottom right']} />
        <SelectInput label="BG repeat" value={styles.backgroundRepeat || 'no-repeat'} onChange={(value) => updateSelectedStyles({ backgroundRepeat: value })} options={['no-repeat', 'repeat', 'repeat-x', 'repeat-y', 'space', 'round']} />
        <SelectInput label="BG attachment" value={styles.backgroundAttachment || 'scroll'} onChange={(value) => updateSelectedStyles({ backgroundAttachment: value })} options={['scroll', 'fixed', 'local']} />
      </div>

      {/* Overlay color */}
      <ColorInput label="Overlay color" value={styles['--bg-overlay'] || 'rgba(0,0,0,0)'} onChange={(value) => updateSelectedStyles({ '--bg-overlay': value })} />

      {/* Quick effects */}
      <div className="grid grid-cols-2 gap-2">
        <MiniButton onClick={() => updateSelectedStyles({ backdropFilter: 'blur(18px)', backgroundColor: 'rgba(255,255,255,0.72)' })}>Glass</MiniButton>
        <MiniButton onClick={() => updateSelectedStyles({ backgroundAttachment: 'fixed' })}>Parallax BG</MiniButton>
        <MiniButton onClick={() => updateSelectedStyles({
          backgroundImage: 'linear-gradient(45deg, rgba(99,102,241,.18) 25%, transparent 25%, transparent 75%, rgba(99,102,241,.18) 75%), linear-gradient(45deg, rgba(99,102,241,.18) 25%, transparent 25%, transparent 75%, rgba(99,102,241,.18) 75%)',
          backgroundSize: '24px 24px',
          backgroundPosition: '0 0, 12px 12px',
          backgroundRepeat: 'repeat',
        })}>Pattern BG</MiniButton>
        <MiniButton onClick={() => updateSelectedStyles({ backgroundImage: '', backgroundAttachment: 'scroll', backgroundRepeat: 'no-repeat' })}>Clear BG FX</MiniButton>
      </div>
    </PropertyGroup>
  );
}

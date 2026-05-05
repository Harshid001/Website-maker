import { Copy, Eye, EyeOff, Lock, Trash2, Unlock } from 'lucide-react';
import { useBuilderStore } from '../../../store/builderStore';
import { NODE_TYPES } from '../../../data/nodeSchema';
import { ColorInput, MiniButton, PropertyGroup, SelectInput, TextInput, ToggleInput } from './PropertyControls';

const rootSectionKind = (node) => {
  const label = `${node?.type || ''} ${node?.name || ''}`.toLowerCase();
  if (!node) return 'none';
  if (node.type === NODE_TYPES.NAVBAR || label.includes('navbar')) return 'navbar';
  if (node.type === NODE_TYPES.FOOTER || label.includes('footer')) return 'footer';
  if (label.includes('hero')) return 'hero';
  if (label.includes('service')) return 'services';
  return 'section';
};

export default function SectionSpecificProperties() {
  const {
    currentPage,
    nodesMap,
    getSelectedNode,
    updateNodeInMap,
    updateNodeStylesInMap,
    updateNodePropsInMap,
    updateNodeLayoutInMap,
    duplicateNodeInMap,
    deleteNodeFromMap,
    hideNodeInMap,
    lockNodeInMap,
  } = useBuilderStore();

  const node = getSelectedNode;
  const isRootSection = node && node.parentId === currentPage?.id;
  if (!node || !isRootSection) return null;

  const kind = rootSectionKind(node);
  const styles = node.styles || {};
  const props = node.props || {};
  const layout = node.layout || {};
  const childNodes = (node.children || []).map((id) => nodesMap[id]).filter(Boolean);
  const updateStyle = (key) => (value) => updateNodeStylesInMap(node.id, { [key]: value });
  const updateProp = (key) => (value) => updateNodePropsInMap(node.id, { [key]: value });
  const updateLayout = (key) => (value) => updateNodeLayoutInMap(node.id, { [key]: value });

  const applyHeroLayout = (value) => {
    updateNodePropsInMap(node.id, { layoutType: value });
    if (value === 'centered') {
      updateNodeStylesInMap(node.id, {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: styles.gap || '24px',
      });
    }
    if (value === 'split' || value === 'left text + right image') {
      updateNodeStylesInMap(node.id, {
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) minmax(320px, 0.8fr)',
        alignItems: 'center',
        gap: styles.gap || '48px',
        textAlign: 'left',
      });
    }
    if (value === 'full-screen') {
      updateNodeStylesInMap(node.id, { minHeight: '100vh' });
    }
  };

  const applyStickyNavbar = (checked) => {
    updateNodePropsInMap(node.id, { sticky: checked });
    updateNodeStylesInMap(node.id, checked
      ? { position: 'sticky', top: '0px', zIndex: 80 }
      : { position: 'relative', top: 'auto', zIndex: 'auto' });
  };

  const applyServicesGrid = (columns) => {
    const cols = Math.max(1, Number.parseInt(columns, 10) || 3);
    updateNodePropsInMap(node.id, { columns: cols, cardLayout: 'grid' });
    updateNodeStylesInMap(node.id, {
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
      gap: styles.gap || '24px',
    });
    childNodes.forEach((child) => {
      const isCard = child.type?.toLowerCase().includes('card');
      updateNodeStylesInMap(child.id, { gridColumn: isCard ? 'auto' : '1 / -1' });
    });
  };

  return (
    <PropertyGroup title={`${kind === 'section' ? 'Section' : kind} Settings`}>
      <TextInput label="Section name" value={node.name || ''} onChange={(value) => updateNodeInMap(node.id, { name: value })} />

      {kind === 'navbar' && (
        <>
          <SelectInput label="Position mode" value={layout.positionMode || 'flow'} onChange={updateLayout('positionMode')} options={['flow', 'free', 'flex-row', 'flex-column', 'grid']} />
          <div className="grid grid-cols-2 gap-2">
            <TextInput label="Width" value={layout.width || 'auto'} onChange={updateLayout('width')} />
            <TextInput label="Height" value={layout.height || 'auto'} onChange={updateLayout('height')} />
          </div>
          <ColorInput label="Background color" value={styles.backgroundColor || '#0f172a'} onChange={updateStyle('backgroundColor')} />
          <div className="grid grid-cols-2 gap-2">
            <TextInput label="Padding" value={styles.padding || ''} onChange={updateStyle('padding')} />
            <TextInput label="Margin" value={styles.margin || ''} onChange={updateStyle('margin')} />
            <TextInput label="Gap" value={styles.gap || layout.gap || ''} onChange={(value) => { updateStyle('gap')(value); updateLayout('gap')(value); }} />
            <TextInput label="Align" value={styles.alignItems || layout.alignItems || 'center'} onChange={(value) => { updateStyle('alignItems')(value); updateLayout('alignItems')(value); }} />
          </div>
          <ToggleInput label="Sticky navbar" checked={props.sticky} onChange={applyStickyNavbar} />
          <ToggleInput label="Auto-populate pages" checked={props.autoPopulatePages} onChange={updateProp('autoPopulatePages')} />
        </>
      )}

      {kind === 'hero' && (
        <>
          <SelectInput label="Layout type" value={props.layoutType || 'left text + right image'} onChange={applyHeroLayout} options={['left text + right image', 'centered', 'split', 'full-screen']} />
          <ColorInput label="Background color" value={styles.backgroundColor || '#ffffff'} onChange={updateStyle('backgroundColor')} />
          <TextInput label="Background image" value={styles.backgroundImage?.replace(/^url\((.*)\)$/i, '$1') || ''} onChange={(value) => updateStyle('backgroundImage')(value ? `url(${value})` : '')} />
          <div className="grid grid-cols-2 gap-2">
            <TextInput label="Section height" value={styles.minHeight || ''} onChange={updateStyle('minHeight')} />
            <TextInput label="Gap" value={styles.gap || ''} onChange={updateStyle('gap')} />
            <TextInput label="Padding" value={styles.padding || ''} onChange={updateStyle('padding')} />
            <TextInput label="Margin" value={styles.margin || ''} onChange={updateStyle('margin')} />
          </div>
          <SelectInput label="Text alignment" value={styles.textAlign || 'left'} onChange={updateStyle('textAlign')} options={['left', 'center', 'right']} />
        </>
      )}

      {kind === 'services' && (
        <>
          <ColorInput label="Background color" value={styles.backgroundColor || '#ffffff'} onChange={updateStyle('backgroundColor')} />
          <SelectInput label="Card layout" value={props.cardLayout || 'grid'} onChange={updateProp('cardLayout')} options={['grid', 'list', 'slider']} />
          <div className="grid grid-cols-2 gap-2">
            <TextInput label="Columns" value={props.columns || 3} onChange={applyServicesGrid} />
            <TextInput label="Card gap" value={styles.gap || ''} onChange={(value) => { updateStyle('gap')(value); updateLayout('gap')(value); }} />
            <TextInput label="Padding" value={styles.padding || ''} onChange={updateStyle('padding')} />
            <TextInput label="Margin" value={styles.margin || ''} onChange={updateStyle('margin')} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <MiniButton onClick={() => childNodes.filter((child) => child.type?.toLowerCase().includes('card')).forEach((child) => updateNodeStylesInMap(child.id, { borderRadius: '18px', boxShadow: '0 18px 45px rgba(15, 23, 42, 0.12)' }))}>Polish Cards</MiniButton>
            <MiniButton onClick={() => { updateNodePropsInMap(node.id, { cardLayout: 'slider' }); updateNodeStylesInMap(node.id, { display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory' }); }}>Slider Ready</MiniButton>
          </div>
        </>
      )}

      {(kind === 'section' || kind === 'footer') && (
        <>
          <ColorInput label="Background color" value={styles.backgroundColor || '#ffffff'} onChange={updateStyle('backgroundColor')} />
          <div className="grid grid-cols-2 gap-2">
            <TextInput label="Width" value={layout.width || 'auto'} onChange={updateLayout('width')} />
            <TextInput label="Height" value={layout.height || 'auto'} onChange={updateLayout('height')} />
            <TextInput label="Padding" value={styles.padding || ''} onChange={updateStyle('padding')} />
            <TextInput label="Margin" value={styles.margin || ''} onChange={updateStyle('margin')} />
          </div>
        </>
      )}

      <div className="grid grid-cols-2 gap-2">
        <MiniButton onClick={() => duplicateNodeInMap(node.id)}><Copy size={13} className="mr-1 inline" /> Duplicate</MiniButton>
        <MiniButton onClick={() => lockNodeInMap(node.id)}>{node.locked ? <Unlock size={13} className="mr-1 inline" /> : <Lock size={13} className="mr-1 inline" />} {node.locked ? 'Unlock' : 'Lock'}</MiniButton>
        <MiniButton onClick={() => hideNodeInMap(node.id)}>{node.hidden ? <EyeOff size={13} className="mr-1 inline" /> : <Eye size={13} className="mr-1 inline" />} {node.hidden ? 'Show' : 'Hide'}</MiniButton>
        <MiniButton tone="danger" onClick={() => deleteNodeFromMap(node.id)}><Trash2 size={13} className="mr-1 inline" /> Delete</MiniButton>
      </div>
    </PropertyGroup>
  );
}

import { useBuilderStore } from '../../../store/builderStore';
import { responsiveStylesFor } from '../../../utils/renderHelpers';
import { NumberInput, PropertyGroup, SelectInput, TextInput } from './PropertyControls';

const positionOptions = ['flow', 'free', 'flex-row', 'flex-column', 'grid'];
const alignOptions = ['left', 'center', 'right'];
const justifyOptions = ['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'];
const overflowOptions = ['visible', 'hidden', 'scroll', 'auto'];

export default function LayoutProperties() {
  const { activeDevice, getSelectedNode, updateNodeStylesInMap, updateNodeLayoutInMap } = useBuilderStore();
  
  const node = getSelectedNode;
  if (!node) return null;

  const layout = node.layout || {};
  const styles = { ...(node.styles || {}), ...responsiveStylesFor(node, activeDevice) };

  const updateStyle = (key) => (value) => updateNodeStylesInMap(node.id, { [key]: value });
  const updateLayout = (key) => (value) => updateNodeLayoutInMap(node.id, { [key]: value });
  const updatePosition = (key) => (value) => updateNodeLayoutInMap(node.id, { positionMode: 'free', [key]: value === '' ? 0 : value });
  const layoutValue = (key, fallback = '') => activeDevice === 'desktop' ? layout[key] ?? fallback : styles[key] ?? layout[key] ?? fallback;
  const positionModeValue = activeDevice === 'desktop'
    ? layout.positionMode || 'flow'
    : styles.position === 'absolute'
      ? 'free'
      : styles.display === 'grid'
        ? 'grid'
        : styles.flexDirection === 'row'
          ? 'flex-row'
          : styles.flexDirection === 'column'
            ? 'flex-column'
            : layout.positionMode || 'flow';

  return (
    <PropertyGroup title="Layout">
      <SelectInput label="Position Mode" value={positionModeValue} onChange={updateLayout('positionMode')} options={positionOptions} />

      <div className="grid grid-cols-2 gap-2 mt-3">
        <TextInput label="Width" value={layoutValue('width', 'auto')} onChange={updateLayout('width')} placeholder="100%" />
        <TextInput label="Height" value={layoutValue('height', 'auto')} onChange={updateLayout('height')} placeholder="auto" />
        <TextInput label="Min Width" value={styles.minWidth || ''} onChange={updateStyle('minWidth')} placeholder="0" />
        <TextInput label="Max Width" value={styles.maxWidth || ''} onChange={updateStyle('maxWidth')} placeholder="none" />
        <TextInput label="Min Height" value={styles.minHeight || ''} onChange={updateStyle('minHeight')} placeholder="0" />
        <TextInput label="Max Height" value={styles.maxHeight || ''} onChange={updateStyle('maxHeight')} placeholder="none" />

        <NumberInput label="X Pos" value={activeDevice === 'desktop' ? layout.x || 0 : parseFloat(styles.left) || layout.x || 0} onChange={updatePosition('x')} min={-5000} max={5000} allowEmpty={false} />
        <NumberInput label="Y Pos" value={activeDevice === 'desktop' ? layout.y || 0 : parseFloat(styles.top) || layout.y || 0} onChange={updatePosition('y')} min={-5000} max={5000} allowEmpty={false} />
        <TextInput label="Z-index" value={layoutValue('zIndex', 'auto')} onChange={updateLayout('zIndex')} placeholder="1" />
        <NumberInput label="Rotation" value={layout.rotation || 0} onChange={updateLayout('rotation')} min={-360} max={360} allowEmpty={false} />
      </div>

      <SelectInput label="Overflow" value={styles.overflow || 'visible'} onChange={updateStyle('overflow')} options={overflowOptions} />

      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3 mt-3">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">Spacing (Margin/Padding)</p>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <TextInput label="Margin" value={styles.margin || ''} onChange={updateStyle('margin')} placeholder="0" />
          <TextInput label="Padding" value={styles.padding || ''} onChange={updateStyle('padding')} placeholder="0" />
        </div>
        <div className="grid grid-cols-4 gap-2">
          <TextInput label="MT" value={styles.marginTop || ''} onChange={updateStyle('marginTop')} />
          <TextInput label="MR" value={styles.marginRight || ''} onChange={updateStyle('marginRight')} />
          <TextInput label="MB" value={styles.marginBottom || ''} onChange={updateStyle('marginBottom')} />
          <TextInput label="ML" value={styles.marginLeft || ''} onChange={updateStyle('marginLeft')} />
          <TextInput label="PT" value={styles.paddingTop || ''} onChange={updateStyle('paddingTop')} />
          <TextInput label="PR" value={styles.paddingRight || ''} onChange={updateStyle('paddingRight')} />
          <TextInput label="PB" value={styles.paddingBottom || ''} onChange={updateStyle('paddingBottom')} />
          <TextInput label="PL" value={styles.paddingLeft || ''} onChange={updateStyle('paddingLeft')} />
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-2">
        {['flex-row', 'flex-column', 'grid'].includes(positionModeValue) && (
          <TextInput label="Gap" value={layoutValue('gap', '')} onChange={updateLayout('gap')} placeholder="24px" />
        )}
        
        {positionModeValue === 'grid' && (
          <>
            <TextInput label="Grid columns" value={layoutValue('gridTemplateColumns', '')} onChange={updateLayout('gridTemplateColumns')} placeholder="repeat(3, 1fr)" />
            <TextInput label="Grid rows" value={layoutValue('gridTemplateRows', '')} onChange={updateLayout('gridTemplateRows')} placeholder="auto" />
          </>
        )}
        
        {['flex-row', 'flex-column'].includes(positionModeValue) && (
          <>
            <SelectInput label="Justify content" value={layoutValue('justifyContent', 'flex-start')} onChange={updateLayout('justifyContent')} options={justifyOptions} />
            <SelectInput label="Align items" value={layoutValue('alignItems', 'stretch')} onChange={updateLayout('alignItems')} options={['stretch', 'flex-start', 'center', 'flex-end', 'baseline']} />
            <SelectInput label="Flex wrap" value={styles.flexWrap || 'nowrap'} onChange={updateStyle('flexWrap')} options={['nowrap', 'wrap', 'wrap-reverse']} />
          </>
        )}
        
        <SelectInput label="Text align" value={styles.textAlign || 'left'} onChange={updateStyle('textAlign')} options={alignOptions} />
      </div>
    </PropertyGroup>
  );
}

import React from 'react';
import { useBuilderStore } from '../../../store/builderStore';
import { PropertyGroup, SelectInput, TextInput } from './PropertyControls';

const displayOptions = ['block', 'flex', 'grid'];
const alignOptions = ['left', 'center', 'right'];
const justifyOptions = ['flex-start', 'center', 'flex-end', 'space-between'];

export default function LayoutProperties() {
  const { selectedItem, updateSelectedStyles } = useBuilderStore();
  const styles = selectedItem?.styles || {};
  const update = (key) => (value) => updateSelectedStyles({ [key]: value });

  return (
    <PropertyGroup title="Layout">
      <div className="grid grid-cols-2 gap-2">
        <TextInput label="Width" value={styles.width} onChange={update('width')} placeholder="100%" />
        <TextInput label="Height" value={styles.height} onChange={update('height')} placeholder="auto" />
        <TextInput label="Position X" value={styles.left} onChange={update('left')} placeholder="0px" />
        <TextInput label="Position Y" value={styles.top} onChange={update('top')} placeholder="0px" />
        <TextInput label="Max width" value={styles.maxWidth} onChange={update('maxWidth')} placeholder="1200px" />
        <TextInput label="Min height" value={styles.minHeight} onChange={update('minHeight')} placeholder="320px" />
      </div>
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">Spacing</p>
        <div className="grid grid-cols-4 gap-2">
          <TextInput label="MT" value={styles.marginTop} onChange={update('marginTop')} />
          <TextInput label="MR" value={styles.marginRight} onChange={update('marginRight')} />
          <TextInput label="MB" value={styles.marginBottom} onChange={update('marginBottom')} />
          <TextInput label="ML" value={styles.marginLeft} onChange={update('marginLeft')} />
          <TextInput label="PT" value={styles.paddingTop} onChange={update('paddingTop')} />
          <TextInput label="PR" value={styles.paddingRight} onChange={update('paddingRight')} />
          <TextInput label="PB" value={styles.paddingBottom} onChange={update('paddingBottom')} />
          <TextInput label="PL" value={styles.paddingLeft} onChange={update('paddingLeft')} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <TextInput label="Margin" value={styles.margin} onChange={update('margin')} placeholder="0" />
        <TextInput label="Padding" value={styles.padding} onChange={update('padding')} placeholder="64px" />
        <TextInput label="Gap" value={styles.gap} onChange={update('gap')} placeholder="24px" />
        <TextInput label="Z-index" value={styles.zIndex} onChange={update('zIndex')} placeholder="1" />
      </div>
      <SelectInput label="Display" value={styles.display || 'block'} onChange={update('display')} options={displayOptions} />
      <SelectInput label="Flex direction" value={styles.flexDirection || 'row'} onChange={update('flexDirection')} options={['row', 'column', 'row-reverse', 'column-reverse']} />
      <TextInput label="Grid columns" value={styles.gridTemplateColumns || ''} onChange={update('gridTemplateColumns')} placeholder="repeat(3, 1fr)" />
      <SelectInput label="Justify content" value={styles.justifyContent || 'flex-start'} onChange={update('justifyContent')} options={justifyOptions} />
      <SelectInput label="Align items" value={styles.alignItems || 'stretch'} onChange={update('alignItems')} options={['stretch', 'flex-start', 'center', 'flex-end']} />
      <SelectInput label="Text align" value={styles.textAlign || 'left'} onChange={update('textAlign')} options={alignOptions} />
      <SelectInput label="Position" value={styles.position || 'relative'} onChange={update('position')} options={['relative', 'static', 'absolute', 'sticky']} />
    </PropertyGroup>
  );
}

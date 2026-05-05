import React from 'react';
import { useBuilderStore } from '../../../store/builderStore';
import { ColorInput, MiniButton, PropertyGroup, SelectInput, TextInput } from './PropertyControls';

export default function DesignProperties() {
  const { getSelectedNode, updateNodeStylesInMap, showToast } = useBuilderStore();
  const node = getSelectedNode;
  
  if (!node) return null;

  const styles = node.styles || {};
  const update = (key) => (value) => updateNodeStylesInMap(node.id, { [key]: value });

  return (
    <PropertyGroup title="Design Properties">
      <ColorInput label="Background color" value={styles.backgroundColor || '#ffffff'} onChange={update('backgroundColor')} />
      <TextInput label="Gradient" value={styles.backgroundImage || ''} onChange={update('backgroundImage')} placeholder="linear-gradient(135deg, #667eea, #764ba2)" />
      
      {/* Gradient presets */}
      <div>
        <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-slate-500">Gradient presets</span>
        <div className="grid grid-cols-4 gap-1">
          {[
            'linear-gradient(135deg, #667eea, #764ba2)',
            'linear-gradient(135deg, #f093fb, #f5576c)',
            'linear-gradient(135deg, #4facfe, #00f2fe)',
            'linear-gradient(135deg, #43e97b, #38f9d7)',
            'linear-gradient(135deg, #fa709a, #fee140)',
            'linear-gradient(135deg, #a18cd1, #fbc2eb)',
            'linear-gradient(135deg, #ffecd2, #fcb69f)',
            'linear-gradient(135deg, #0f172a, #334155)',
          ].map((g) => (
            <button key={g} type="button" onClick={() => updateNodeStylesInMap(node.id, { backgroundImage: g })} className="h-7 rounded-lg border border-slate-700 hover:ring-1 hover:ring-indigo-400" style={{ backgroundImage: g }} />
          ))}
        </div>
      </div>

      <ColorInput label="Border color" value={styles.borderColor || '#e2e8f0'} onChange={update('borderColor')} />
      <div className="grid grid-cols-2 gap-2">
        <TextInput label="Border width" value={styles.borderWidth || ''} onChange={update('borderWidth')} placeholder="1px" />
        <SelectInput label="Border style" value={styles.borderStyle || 'solid'} onChange={update('borderStyle')} options={['solid', 'dashed', 'dotted', 'double', 'none']} />
        <TextInput label="Radius" value={styles.borderRadius || ''} onChange={update('borderRadius')} placeholder="16px" />
        <TextInput label="Opacity" value={styles.opacity || ''} onChange={update('opacity')} placeholder="1" />
        <TextInput label="Blur" value={styles.filter || ''} onChange={update('filter')} placeholder="blur(0px)" />
        <TextInput label="Hover transform" value={styles['--hover-transform'] || ''} onChange={update('--hover-transform')} placeholder="translateY(-4px)" />
      </div>

      {/* Shadow */}
      <SelectInput
        label="Shadow preset"
        value={styles.boxShadow || 'none'}
        onChange={update('boxShadow')}
        options={[
          { value: 'none', label: 'None' },
          { value: '0 4px 12px rgba(15, 23, 42, 0.06)', label: 'Extra Small' },
          { value: '0 8px 20px rgba(15, 23, 42, 0.10)', label: 'Small' },
          { value: '0 18px 45px rgba(15, 23, 42, 0.14)', label: 'Medium' },
          { value: '0 28px 80px rgba(15, 23, 42, 0.22)', label: 'Large' },
          { value: '0 40px 100px rgba(15, 23, 42, 0.30)', label: 'Extra Large' },
        ]}
      />
      <TextInput label="Custom shadow" value={styles.boxShadow === 'none' ? '' : styles.boxShadow} onChange={update('boxShadow')} placeholder="0 18px 45px rgba(...)" />

      {/* Glassmorphism */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">Quick effects</p>
        <div className="grid grid-cols-2 gap-2">
          <MiniButton onClick={() => updateNodeStylesInMap(node.id, { backdropFilter: 'blur(18px)', backgroundColor: 'rgba(255,255,255,0.72)', border: '1px solid rgba(255,255,255,0.18)' })}>Glassmorphism</MiniButton>
          <MiniButton onClick={() => updateNodeStylesInMap(node.id, { boxShadow: '0 18px 45px rgba(15, 23, 42, 0.14)' })}>Apply shadow</MiniButton>
          <MiniButton onClick={() => updateNodeStylesInMap(node.id, { backdropFilter: 'blur(4px)', backgroundColor: 'rgba(0,0,0,0.4)' })}>Dark overlay</MiniButton>
          <MiniButton onClick={() => showToast('Pattern backgrounds are structured placeholders. Upload a pattern image via Background Properties.')}>Pattern</MiniButton>
        </div>
      </div>

      {/* Overlay color */}
      <ColorInput label="Overlay color" value={styles['--overlay-color'] || 'rgba(0,0,0,0)'} onChange={update('--overlay-color')} />
      
      {/* Stroke/Fill for decorative elements */}
      <div className="grid grid-cols-2 gap-2">
        <ColorInput label="Stroke color" value={styles.outlineColor || '#6366f1'} onChange={update('outlineColor')} />
        <TextInput label="Stroke width" value={styles.outlineWidth || ''} onChange={update('outlineWidth')} placeholder="0px" />
      </div>
      <SelectInput label="Outline style" value={styles.outlineStyle || 'none'} onChange={update('outlineStyle')} options={['none', 'solid', 'dashed', 'dotted', 'double']} />
    </PropertyGroup>
  );
}

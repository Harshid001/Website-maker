import React from 'react';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Copy,
  Crop,
  Eye,
  EyeOff,
  GripVertical,
  ImagePlus,
  Link,
  Lock,
  Maximize2,
  MoreHorizontal,
  Paintbrush,
  Trash2,
  Unlock,
  Wand2,
} from 'lucide-react';
import { useBuilderStore } from '../../store/builderStore';

const ToolButton = ({ title, onClick, children, tone = 'default', dragProps = {} }) => (
  <button
    type="button"
    title={title}
    aria-label={title}
    onClick={(event) => {
      event.stopPropagation();
      onClick?.(event);
    }}
    className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 transition-all ${
      tone === 'danger' ? 'text-red-200 hover:bg-red-500/15' : 'text-slate-200 hover:bg-slate-800 hover:text-white'
    }`}
    {...dragProps}
  >
    {children}
  </button>
);

export default function FloatingToolbar({ item, kind, sectionId, elementId, dragAttributes, dragListeners }) {
  const {
    duplicateSelected,
    deleteSelected,
    lockSelected,
    hideSelected,
    moveSelectedUp,
    moveSelectedDown,
    alignSelected,
    updateSelectedStyles,
    updateSelectedProps,
    rewriteSelectedText,
    showToast,
  } = useBuilderStore();

  if (!item) return null;

  const isText = ['heading', 'paragraph', 'button', 'card', 'testimonialCard', 'pricingCard', 'productCard'].includes(item.type);
  const isImage = ['image', 'video', 'gallery'].includes(item.type);
  const isButton = item.type === 'button';

  return (
    <div
      className="absolute left-1/2 top-0 z-40 flex -translate-x-1/2 -translate-y-[calc(100%+8px)] items-center gap-1 rounded-xl border border-slate-700 bg-slate-950/95 p-1 text-white shadow-2xl backdrop-blur"
      onClick={(event) => event.stopPropagation()}
    >
      <ToolButton title="Drag or move" dragProps={{ ...dragAttributes, ...dragListeners }}>
        <GripVertical size={15} />
      </ToolButton>
      <ToolButton title="Move up" onClick={moveSelectedUp}>↑</ToolButton>
      <ToolButton title="Move down" onClick={moveSelectedDown}>↓</ToolButton>
      <ToolButton title="Duplicate" onClick={duplicateSelected}>
        <Copy size={14} />
      </ToolButton>
      <ToolButton title={item.locked ? 'Unlock' : 'Lock'} onClick={lockSelected}>
        {item.locked ? <Unlock size={14} /> : <Lock size={14} />}
      </ToolButton>
      <ToolButton title={item.hidden ? 'Show' : 'Hide'} onClick={hideSelected}>
        {item.hidden ? <Eye size={14} /> : <EyeOff size={14} />}
      </ToolButton>

      {isText && (
        <>
          <span className="mx-1 h-5 w-px bg-slate-700" />
          <ToolButton title="Bold" onClick={() => updateSelectedStyles({ fontWeight: item.styles?.fontWeight === '800' ? '500' : '800' })}>
            <Bold size={14} />
          </ToolButton>
          <ToolButton title="Align center" onClick={() => updateSelectedStyles({ textAlign: item.styles?.textAlign === 'center' ? 'left' : 'center' })}>
            <AlignCenter size={14} />
          </ToolButton>
          <ToolButton title="Increase font size" onClick={() => updateSelectedStyles({ fontSize: `${Math.min(96, Number.parseInt(item.styles?.fontSize || '18', 10) + 2)}px` })}>
            T+
          </ToolButton>
          <ToolButton title="AI rewrite" onClick={() => rewriteSelectedText('professional')}>
            <Wand2 size={14} />
          </ToolButton>
        </>
      )}

      <span className="mx-1 h-5 w-px bg-slate-700" />
      <ToolButton title="Align left" onClick={() => alignSelected('left')}>
        <AlignLeft size={14} />
      </ToolButton>
      <ToolButton title="Align center" onClick={() => alignSelected('center')}>
        <AlignCenter size={14} />
      </ToolButton>
      <ToolButton title="Align right" onClick={() => alignSelected('right')}>
        <AlignRight size={14} />
      </ToolButton>

      {isImage && (
        <>
          <span className="mx-1 h-5 w-px bg-slate-700" />
          <ToolButton title="Replace image" onClick={() => showToast('Use Media Properties to upload or replace this image.')}>
            <ImagePlus size={14} />
          </ToolButton>
          <ToolButton title="Crop image" onClick={() => showToast('Crop image coming soon.')}>
            <Crop size={14} />
          </ToolButton>
          <ToolButton title="Fit image" onClick={() => updateSelectedProps({ objectFit: item.props?.objectFit === 'contain' ? 'cover' : 'contain' })}>
            <Maximize2 size={14} />
          </ToolButton>
          <ToolButton title="Remove background" onClick={() => showToast('Remove background coming soon.')}>
            <Wand2 size={14} />
          </ToolButton>
        </>
      )}

      {isButton && (
        <>
          <span className="mx-1 h-5 w-px bg-slate-700" />
          <ToolButton title="Edit link" onClick={() => showToast('Edit the link in Button Settings on the right.')}>
            <Link size={14} />
          </ToolButton>
          <ToolButton title="Button style" onClick={() => updateSelectedProps({ variant: item.props?.variant === 'outline' ? 'solid' : 'outline' })}>
            <Paintbrush size={14} />
          </ToolButton>
        </>
      )}

      <span className="mx-1 h-5 w-px bg-slate-700" />
      <ToolButton title="Delete" tone="danger" onClick={deleteSelected}>
        <Trash2 size={14} />
      </ToolButton>
      <ToolButton title={`${kind} options`} onClick={() => showToast(`${kind} options are available in the right properties panel.`)}>
        <MoreHorizontal size={14} />
      </ToolButton>
    </div>
  );
}

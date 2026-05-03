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
  ArrowUpToLine,
  ArrowDownToLine,
} from 'lucide-react';
import { useBuilderStore } from '../../store/builderStore';

const ToolButton = ({ title, onClick, children, tone = 'default' }) => (
  <button
    type="button"
    title={title}
    aria-label={title}
    onPointerDown={(event) => {
      event.stopPropagation();
      event.preventDefault();
      onClick?.(event);
    }}
    className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 transition-all ${
      tone === 'danger' ? 'text-red-200 hover:bg-red-500/15' : 'text-slate-200 hover:bg-slate-800 hover:text-white'
    }`}
  >
    {children}
  </button>
);

export default function FloatingToolbar({ nodeId }) {
  const {
    nodesMap,
    duplicateNodeInMap,
    deleteNodeFromMap,
    lockNodeInMap,
    hideNodeInMap,
    bringToFrontInMap,
    sendToBackInMap,
    updateNodeStylesInMap,
    updateNodePropsInMap,
    showToast,
  } = useBuilderStore();

  const node = nodesMap[nodeId];
  if (!node) return null;

  const isText = ['heading', 'paragraph', 'button', 'card', 'testimonialCard', 'pricingCard', 'productCard'].includes(node.type);
  const isImage = ['image', 'video', 'gallery'].includes(node.type);
  const isButton = node.type === 'button';

  return (
    <div
      className="absolute left-1/2 top-0 z-40 flex -translate-x-1/2 -translate-y-[calc(100%+8px)] items-center gap-1 rounded-xl border border-slate-700 bg-slate-950/95 p-1 text-white shadow-2xl backdrop-blur"
      onClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <div className="flex h-8 min-w-8 items-center justify-center px-1 text-slate-500 cursor-grab active:cursor-grabbing">
        <GripVertical size={15} />
      </div>
      <ToolButton title="Bring forward" onClick={() => bringToFrontInMap(nodeId)}><ArrowUpToLine size={14} /></ToolButton>
      <ToolButton title="Send backward" onClick={() => sendToBackInMap(nodeId)}><ArrowDownToLine size={14} /></ToolButton>
      <ToolButton title="Duplicate" onClick={() => duplicateNodeInMap(nodeId)}>
        <Copy size={14} />
      </ToolButton>
      <ToolButton title={node.locked ? 'Unlock' : 'Lock'} onClick={() => lockNodeInMap(nodeId)}>
        {node.locked ? <Unlock size={14} /> : <Lock size={14} />}
      </ToolButton>
      <ToolButton title={node.hidden ? 'Show' : 'Hide'} onClick={() => hideNodeInMap(nodeId)}>
        {node.hidden ? <Eye size={14} /> : <EyeOff size={14} />}
      </ToolButton>

      {isText && (
        <>
          <span className="mx-1 h-5 w-px bg-slate-700" />
          <ToolButton title="Bold" onClick={() => updateNodeStylesInMap(nodeId, { fontWeight: node.styles?.fontWeight === '800' ? '500' : '800' })}>
            <Bold size={14} />
          </ToolButton>
          <ToolButton title="Align center" onClick={() => updateNodeStylesInMap(nodeId, { textAlign: node.styles?.textAlign === 'center' ? 'left' : 'center' })}>
            <AlignCenter size={14} />
          </ToolButton>
          <ToolButton title="Increase font size" onClick={() => updateNodeStylesInMap(nodeId, { fontSize: `${Math.min(96, Number.parseInt(node.styles?.fontSize || '18', 10) + 2)}px` })}>
            T+
          </ToolButton>
        </>
      )}

      {isImage && (
        <>
          <span className="mx-1 h-5 w-px bg-slate-700" />
          <ToolButton title="Fit image" onClick={() => updateNodePropsInMap(nodeId, { objectFit: node.props?.objectFit === 'contain' ? 'cover' : 'contain' })}>
            <Maximize2 size={14} />
          </ToolButton>
        </>
      )}

      {isButton && (
        <>
          <span className="mx-1 h-5 w-px bg-slate-700" />
          <ToolButton title="Button style" onClick={() => updateNodePropsInMap(nodeId, { variant: node.props?.variant === 'outline' ? 'solid' : 'outline' })}>
            <Paintbrush size={14} />
          </ToolButton>
        </>
      )}

      <span className="mx-1 h-5 w-px bg-slate-700" />
      <ToolButton title="Delete" tone="danger" onClick={() => deleteNodeFromMap(nodeId)}>
        <Trash2 size={14} />
      </ToolButton>
      <ToolButton title={`Node options`} onClick={() => showToast(`Options are available in the right properties panel.`)}>
        <MoreHorizontal size={14} />
      </ToolButton>
    </div>
  );
}

import { useEffect, useMemo, useState } from 'react';
import BuilderTopBar from './BuilderTopBar';
import LeftSidebar from './LeftSidebar';
import LeftToolPanel from './LeftToolPanel';
import RightPropertiesPanel from './RightPropertiesPanel';
import WebsiteCanvas from './WebsiteCanvas';
import RoutingMapView from './RoutingMapView';
import { useBuilderStore } from '../../store/builderStore';
import InteractionModal from './prototype/InteractionModal';
import ContextMenu from './ContextMenu';
import BottomCanvasToolbar from './BottomCanvasToolbar';
import ExportPanel, { PreviewModal } from '../ExportPanel';

export default function BuilderLayout() {
  const {
    project,
    nodesMap,
    toast,
    leftPanelCollapsed,
    rightPanelCollapsed,
    fullscreenCanvas,
    canvasView,
    setLeftPanelCollapsed,
    setRightPanelCollapsed,
    clearSelection,
    deleteSelected,
    duplicateSelected,
    copySelected,
    pasteSelected,
    selectAllNodes,
    groupSelected,
    ungroupSelected,
    nudgeSelected,
    setActiveTool,
    undo,
    redo,
    zoomIn,
    zoomOut,
    resetZoom,
    fitToScreen,
    showToast,
  } = useBuilderStore();
  const [previewHTML, setPreviewHTML] = useState('');
  const exportBuilderState = useMemo(
    () => (project ? { ...project, nodesMap } : null),
    [nodesMap, project],
  );

  useEffect(() => {
    const handleKeyDown = (event) => {
      const target = event.target;
      const isTyping =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable;

      if (event.key === 'Escape') {
        clearSelection();
        return;
      }

      if (isTyping) return;

      const key = event.key.toLowerCase();

      if (event.ctrlKey || event.metaKey) {
        if (key === '+' || key === '=') {
          event.preventDefault();
          zoomIn(10);
          return;
        }
        if (key === '-' || key === '_') {
          event.preventDefault();
          zoomOut(10);
          return;
        }
        if (key === '0') {
          event.preventDefault();
          resetZoom();
          return;
        }
        if (key === '1') {
          event.preventDefault();
          fitToScreen();
          return;
        }
      }

      if (event.code === 'Space') {
        event.preventDefault();
        setActiveTool('hand');
        return;
      }

      if (event.key === 'Delete' || event.key === 'Backspace') {
        event.preventDefault();
        deleteSelected();
      }

      if (event.key.startsWith('Arrow')) {
        event.preventDefault();
        const amount = event.shiftKey ? 10 : 1;
        const dx = event.key === 'ArrowLeft' ? -amount : event.key === 'ArrowRight' ? amount : 0;
        const dy = event.key === 'ArrowUp' ? -amount : event.key === 'ArrowDown' ? amount : 0;
        nudgeSelected(dx, dy);
      }

      if ((event.ctrlKey || event.metaKey) && key === 'd') {
        event.preventDefault();
        duplicateSelected();
      }

      if ((event.ctrlKey || event.metaKey) && key === 'c') {
        event.preventDefault();
        copySelected();
      }

      if ((event.ctrlKey || event.metaKey) && key === 'v') {
        event.preventDefault();
        pasteSelected();
      }

      if ((event.ctrlKey || event.metaKey) && key === 'a') {
        event.preventDefault();
        selectAllNodes();
      }

      if ((event.ctrlKey || event.metaKey) && event.shiftKey && key === 'g') {
        event.preventDefault();
        ungroupSelected();
      } else if ((event.ctrlKey || event.metaKey) && key === 'g') {
        event.preventDefault();
        groupSelected();
      }

      if ((event.ctrlKey || event.metaKey) && key === 'z') {
        event.preventDefault();
        undo();
      }

      if ((event.ctrlKey || event.metaKey) && key === 'y') {
        event.preventDefault();
        redo();
      }

      const toolKeys = {
        v: 'select',
        h: 'hand',
        f: 'frame',
        s: 'section',
        t: 'text',
        r: 'container',
        i: 'image',
        b: 'button',
        p: 'prototype',
      };
      if (!event.ctrlKey && !event.metaKey && !event.altKey && toolKeys[key]) {
        event.preventDefault();
        setActiveTool(toolKeys[key]);
      }
    };

    const handleKeyUp = (event) => {
      if (event.code === 'Space') setActiveTool('select');
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [clearSelection, copySelected, deleteSelected, duplicateSelected, fitToScreen, groupSelected, nudgeSelected, pasteSelected, redo, resetZoom, selectAllNodes, setActiveTool, undo, ungroupSelected, zoomIn, zoomOut]);

  if (!project) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-950 text-white">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center">
          <h1 className="text-2xl font-black">Project not found</h1>
          <p className="mt-2 text-slate-400">Open the dashboard or create a new website to continue.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-slate-950 text-slate-200">
      <BuilderTopBar />
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <LeftSidebar />
        {!fullscreenCanvas && !leftPanelCollapsed && <LeftToolPanel />}
        <main className="relative min-w-0 flex-1 overflow-hidden bg-slate-950">
          {!fullscreenCanvas && leftPanelCollapsed && (
            <button
              type="button"
              onClick={() => setLeftPanelCollapsed(false)}
              className="absolute left-3 top-3 z-30 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-300 shadow-xl hover:text-white"
            >
              Open tools
            </button>
          )}
          {!fullscreenCanvas && rightPanelCollapsed && (
            <button
              type="button"
              onClick={() => setRightPanelCollapsed(false)}
              className="absolute right-3 top-3 z-30 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-300 shadow-xl hover:text-white"
            >
              Open properties
            </button>
          )}
          <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          <div className="relative z-10 h-full">
            {canvasView === 'routing' ? <RoutingMapView /> : <WebsiteCanvas />}
          </div>
          <BottomCanvasToolbar />
          <ExportPanel
            builderState={exportBuilderState}
            onPreview={setPreviewHTML}
            onStatus={showToast}
          />
        </main>
        {!fullscreenCanvas && !rightPanelCollapsed && <RightPropertiesPanel />}
      </div>
      {toast && (
        <div className={`fixed bottom-5 left-1/2 z-[120] -translate-x-1/2 rounded-2xl border px-5 py-3 text-xs font-black uppercase tracking-widest shadow-2xl ${
          toast.tone === 'error'
            ? 'border-red-400/40 bg-red-950 text-red-100'
            : toast.tone === 'success'
              ? 'border-emerald-400/40 bg-emerald-950 text-emerald-100'
              : 'border-indigo-400/40 bg-slate-950 text-white'
        }`}
        >
          {toast.message}
        </div>
      )}
      <InteractionModal />
      <ContextMenu />
      <PreviewModal html={previewHTML} onClose={() => setPreviewHTML('')} />
    </div>
  );
}

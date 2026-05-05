import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Circle, Image, Layers, MousePointer, Square, Type } from 'lucide-react';
import WorkspaceLayout from '../components/layout/WorkspaceLayout';
import { DesignCanvasPreview } from '../components/templates/TemplatePreviewModal';
import { getTemplateProject, updateTemplateProject } from '../utils/projectStorage';

const makeElementId = (type) => `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const hexOrFallback = (value, fallback = '#6366f1') => (String(value || '').startsWith('#') ? value : fallback);

function PreviewOverlay({ project, onClose }) {
  return (
    <div className="fixed inset-0 z-[130] bg-slate-950/90 p-4 backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-slate-700 bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-800 p-4">
          <div>
            <p className="text-sm font-semibold text-cyan-200">2D design preview</p>
            <h2 className="text-xl font-black text-white">{project.name}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800">
            Close
          </button>
        </div>
        <DesignCanvasPreview canvasJson={project.content.canvasJson} />
      </div>
    </div>
  );
}

export default function DesignWorkspace() {
  const { projectId } = useParams();
  const initialProject = useMemo(() => getTemplateProject(projectId), [projectId]);
  const [project, setProject] = useState(initialProject);
  const [selectedId, setSelectedId] = useState(initialProject?.content?.canvasJson?.elements?.find((item) => item.type === 'text')?.id || null);
  const [notice, setNotice] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  if (!project) {
    return (
      <WorkspaceLayout projectName="Project not found" publishLabel="Export" leftPanel={<div />} rightPanel={<div />}>
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center">
          <h1 className="text-2xl font-black text-white">Design project not found</h1>
          <Link to="/templates" className="mt-6 inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white">
            Back to templates
          </Link>
        </div>
      </WorkspaceLayout>
    );
  }

  const canvas = project.content.canvasJson || {};
  const elements = canvas.elements || [];
  const selectedElement = elements.find((element) => element.id === selectedId) || elements[0];

  const updateCanvas = (updates) => {
    setProject((current) => ({
      ...current,
      content: {
        ...current.content,
        canvasJson: {
          ...current.content.canvasJson,
          ...updates,
        },
      },
    }));
  };

  const updateElement = (elementId, updates) => {
    updateCanvas({
      elements: elements.map((element) => (element.id === elementId ? { ...element, ...updates } : element)),
    });
  };

  const addElement = (type) => {
    const baseX = Math.round(canvas.width * 0.12);
    const baseY = Math.round(canvas.height * 0.18);
    const next =
      type === 'text'
        ? {
            id: makeElementId('text'),
            type: 'text',
            text: 'New editable text',
            x: baseX,
            y: baseY,
            fontSize: Math.max(32, Math.round(canvas.width * 0.04)),
            fontWeight: 800,
            color: '#ffffff',
            fontFamily: 'Inter',
            maxWidth: canvas.width - baseX * 2,
            editable: true,
          }
        : type === 'image'
          ? {
              id: makeElementId('image'),
              type: 'image',
              x: baseX,
              y: baseY,
              width: Math.round(canvas.width * 0.48),
              height: Math.round(canvas.height * 0.24),
              radius: 24,
              label: 'Image Placeholder',
              color: 'rgba(255,255,255,0.14)',
              editable: true,
            }
          : {
              id: makeElementId(type),
              type: 'shape',
              shape: type === 'circle' ? 'circle' : 'rectangle',
              x: baseX,
              y: baseY,
              width: Math.round(canvas.width * 0.28),
              height: Math.round(canvas.height * 0.18),
              radius: type === 'circle' ? 999 : 24,
              color: '#22d3ee',
              opacity: 0.85,
              editable: true,
            };

    updateCanvas({ elements: [...elements, next] });
    setSelectedId(next.id);
  };

  const saveProject = () => {
    const saved = updateTemplateProject(project.id, project);
    setProject(saved);
    setNotice('Saved locally.');
  };

  const toolButtons = [
    { icon: MousePointer, label: 'Select', action: () => setNotice('Click a canvas element to select it.') },
    { icon: Type, label: 'Text', action: () => addElement('text') },
    { icon: Square, label: 'Rectangle', action: () => addElement('rectangle') },
    { icon: Circle, label: 'Circle', action: () => addElement('circle') },
    { icon: Image, label: 'Image', action: () => addElement('image') },
  ];

  const leftPanel = (
    <div className="flex flex-col gap-4">
      {toolButtons.map((tool) => {
        const Icon = tool.icon;
        return (
          <button
            key={tool.label}
            type="button"
            onClick={tool.action}
            className="group relative grid h-12 w-12 place-items-center rounded-xl text-slate-500 transition hover:bg-slate-800 hover:text-white"
          >
            <Icon size={20} />
            <span className="pointer-events-none absolute left-full ml-4 whitespace-nowrap rounded-lg bg-slate-800 px-3 py-2 text-xs font-bold text-white opacity-0 transition group-hover:opacity-100">
              {tool.label}
            </span>
          </button>
        );
      })}
    </div>
  );

  const rightPanel = (
    <div className="space-y-6 p-5">
      <div>
        <p className="text-sm font-black text-white">Design Properties</p>
        <p className="mt-1 text-sm text-slate-400">
          {canvas.width} x {canvas.height}px canvas
        </p>
      </div>

      {notice && <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-sm font-semibold text-emerald-200">{notice}</div>}

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-slate-300">Project name</span>
        <input
          value={project.name}
          onChange={(event) => setProject({ ...project, name: event.target.value })}
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
        />
      </label>

      <div>
        <div className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
          <Layers size={16} className="text-cyan-300" />
          Layers
        </div>
        <div className="space-y-2">
          {elements.map((element) => (
            <button
              key={element.id}
              type="button"
              onClick={() => setSelectedId(element.id)}
              className={`w-full rounded-xl border px-3 py-2 text-left text-sm transition ${
                selectedId === element.id ? 'border-cyan-400 bg-cyan-400/10 text-white' : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              {element.text || element.label || element.shape || element.type}
            </button>
          ))}
        </div>
      </div>

      {selectedElement && (
        <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950 p-4">
          <p className="text-sm font-bold text-white">Selected element</p>

          {selectedElement.type === 'text' && (
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-300">Text</span>
              <textarea
                value={selectedElement.text}
                onChange={(event) => updateElement(selectedElement.id, { text: event.target.value })}
                rows={3}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
              />
            </label>
          )}

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-300">X</span>
              <input
                type="number"
                value={Math.round(selectedElement.x || 0)}
                onChange={(event) => updateElement(selectedElement.id, { x: Number(event.target.value) })}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-300">Y</span>
              <input
                type="number"
                value={Math.round(selectedElement.y || 0)}
                onChange={(event) => updateElement(selectedElement.id, { y: Number(event.target.value) })}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
              />
            </label>
          </div>

          {selectedElement.type === 'text' && (
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-300">Font size</span>
              <input
                type="range"
                min="18"
                max="140"
                value={selectedElement.fontSize}
                onChange={(event) => updateElement(selectedElement.id, { fontSize: Number(event.target.value) })}
                className="w-full accent-indigo-500"
              />
            </label>
          )}

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-300">Color</span>
            <input
              type="color"
              value={hexOrFallback(selectedElement.color)}
              onChange={(event) => updateElement(selectedElement.id, { color: event.target.value, opacity: 1 })}
              className="h-11 w-full rounded-xl border border-slate-700 bg-slate-900"
            />
          </label>
        </div>
      )}
    </div>
  );

  return (
    <>
      <WorkspaceLayout
        projectName={project.name}
        leftPanel={leftPanel}
        rightPanel={rightPanel}
        publishLabel="Export"
        onSave={saveProject}
        onPreview={() => setShowPreview(true)}
        onPublish={() => setNotice('Export placeholder ready for PNG, JPG, SVG, and PDF outputs.')}
      >
        <DesignCanvasPreview canvasJson={canvas} selectedElementId={selectedId} onSelectElement={setSelectedId} />
      </WorkspaceLayout>

      {showPreview && <PreviewOverlay project={project} onClose={() => setShowPreview(false)} />}
    </>
  );
}

import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Box, Circle, Copy, Lightbulb, Move3D, RotateCw, Shapes } from 'lucide-react';
import WorkspaceLayout from '../components/layout/WorkspaceLayout';
import { ThreeScenePreview } from '../components/templates/TemplatePreviewModal';
import { getTemplateProject, updateTemplateProject } from '../utils/projectStorage';

const makeObjectId = (type) => `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

function PreviewOverlay({ project, onClose }) {
  return (
    <div className="fixed inset-0 z-[130] bg-slate-950/90 p-4 backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-slate-700 bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-800 p-4">
          <div>
            <p className="text-sm font-semibold text-cyan-200">3D scene preview</p>
            <h2 className="text-xl font-black text-white">{project.name}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800">
            Close
          </button>
        </div>
        <div className="min-h-0 flex-1 p-5">
          <ThreeScenePreview scene={project.content.threeScene} className="h-full" />
        </div>
      </div>
    </div>
  );
}

export default function ThreeWorkspace() {
  const { projectId } = useParams();
  const initialProject = useMemo(() => getTemplateProject(projectId), [projectId]);
  const [project, setProject] = useState(initialProject);
  const [selectedId, setSelectedId] = useState(initialProject?.content?.threeScene?.objects?.[0]?.id || null);
  const [notice, setNotice] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  if (!project) {
    return (
      <WorkspaceLayout projectName="Project not found" publishLabel="Export" leftPanel={<div />} rightPanel={<div />}>
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center">
          <h1 className="text-2xl font-black text-white">3D project not found</h1>
          <Link to="/templates" className="mt-6 inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white">
            Back to templates
          </Link>
        </div>
      </WorkspaceLayout>
    );
  }

  const scene = project.content.threeScene || {};
  const objects = scene.objects || [];
  const selectedObject = objects.find((object) => object.id === selectedId) || objects[0];

  const updateScene = (updates) => {
    setProject((current) => ({
      ...current,
      content: {
        ...current.content,
        threeScene: {
          ...current.content.threeScene,
          ...updates,
        },
      },
    }));
  };

  const updateObject = (objectId, updates) => {
    updateScene({
      objects: objects.map((object) => (object.id === objectId ? { ...object, ...updates } : object)),
    });
  };

  const addObject = (type) => {
    const next = {
      id: makeObjectId(type),
      name: `New ${type}`,
      type,
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: type === 'sphere' ? '#22d3ee' : '#6366f1',
      material: 'standard',
      animation: type === 'cube' ? 'rotate' : null,
      editable: true,
    };
    updateScene({ objects: [...objects, next] });
    setSelectedId(next.id);
  };

  const duplicateSelected = () => {
    if (!selectedObject) return;
    const clone = {
      ...selectedObject,
      id: makeObjectId(selectedObject.type),
      name: `${selectedObject.name} Copy`,
      position: [
        (selectedObject.position?.[0] || 0) + 0.6,
        selectedObject.position?.[1] || 0,
        selectedObject.position?.[2] || 0,
      ],
    };
    updateScene({ objects: [...objects, clone] });
    setSelectedId(clone.id);
  };

  const saveProject = () => {
    const saved = updateTemplateProject(project.id, project);
    setProject(saved);
    setNotice('Saved locally.');
  };

  const toolButtons = [
    { icon: Move3D, label: 'Move', action: () => setNotice('Use the transform inputs in the right panel to move objects.') },
    { icon: RotateCw, label: 'Rotate', action: () => selectedObject && updateObject(selectedObject.id, { animation: selectedObject.animation === 'rotate' ? null : 'rotate' }) },
    { icon: Box, label: 'Add Cube', action: () => addObject('cube') },
    { icon: Circle, label: 'Add Sphere', action: () => addObject('sphere') },
    { icon: Shapes, label: 'Add Cone', action: () => addObject('cone') },
    { icon: Copy, label: 'Duplicate', action: duplicateSelected },
    { icon: Lightbulb, label: 'Light', action: () => setNotice('Ambient and directional lights are already included in this scene preset.') },
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
        <p className="text-sm font-black text-white">3D Properties</p>
        <p className="mt-1 text-sm text-slate-400">{objects.length} editable scene objects</p>
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
        <p className="mb-3 text-sm font-bold text-white">Scene objects</p>
        <div className="space-y-2">
          {objects.map((object) => (
            <button
              key={object.id}
              type="button"
              onClick={() => setSelectedId(object.id)}
              className={`w-full rounded-xl border px-3 py-2 text-left text-sm transition ${
                selectedId === object.id ? 'border-cyan-400 bg-cyan-400/10 text-white' : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              {object.name}
            </button>
          ))}
        </div>
      </div>

      {selectedObject && (
        <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950 p-4">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-300">Object name</span>
            <input
              value={selectedObject.name}
              onChange={(event) => updateObject(selectedObject.id, { name: event.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-300">Material color</span>
            <input
              type="color"
              value={selectedObject.color || '#6366f1'}
              onChange={(event) => updateObject(selectedObject.id, { color: event.target.value })}
              className="h-11 w-full rounded-xl border border-slate-700 bg-slate-900"
            />
          </label>

          <div className="grid grid-cols-3 gap-2">
            {['X', 'Y', 'Z'].map((axis, index) => (
              <label key={axis} className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-300">{axis}</span>
                <input
                  type="number"
                  step="0.1"
                  value={selectedObject.position?.[index] || 0}
                  onChange={(event) => {
                    const position = [...(selectedObject.position || [0, 0, 0])];
                    position[index] = Number(event.target.value);
                    updateObject(selectedObject.id, { position });
                  }}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-2 py-2 text-sm text-white outline-none focus:border-indigo-500"
                />
              </label>
            ))}
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-300">Scale</span>
            <input
              type="range"
              min="0.3"
              max="2.8"
              step="0.1"
              value={selectedObject.scale?.[0] || 1}
              onChange={(event) => {
                const value = Number(event.target.value);
                updateObject(selectedObject.id, { scale: [value, value, value] });
              }}
              className="w-full accent-indigo-500"
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
        onPublish={() => setNotice('Export placeholder ready for GLB and OBJ outputs.')}
      >
        <ThreeScenePreview scene={scene} className="h-full rounded-3xl border border-slate-800 shadow-2xl shadow-black/30" />
      </WorkspaceLayout>

      {showPreview && <PreviewOverlay project={project} onClose={() => setShowPreview(false)} />}
    </>
  );
}

import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Clock, Code2, Infinity, Paintbrush, Play, Type } from 'lucide-react';
import WorkspaceLayout from '../components/layout/WorkspaceLayout';
import { AnimationLivePreview } from '../components/templates/TemplatePreviewModal';
import { getTemplateProject, updateTemplateProject } from '../utils/projectStorage';

const replaceInlineVariable = (html, name, value) => {
  const pattern = new RegExp(`--template-${name}:[^;"]+`);
  if (pattern.test(html)) return html.replace(pattern, `--template-${name}:${value}`);
  return html.replace('style="', `style="--template-${name}:${value};`);
};

function PreviewOverlay({ project, onClose }) {
  return (
    <div className="fixed inset-0 z-[130] bg-slate-950/90 p-4 backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-slate-700 bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-800 p-4">
          <div>
            <p className="text-sm font-semibold text-cyan-200">Animation preview</p>
            <h2 className="text-xl font-black text-white">{project.name}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800">
            Close
          </button>
        </div>
        <AnimationLivePreview content={project.content} />
      </div>
    </div>
  );
}

export default function AnimationWorkspace() {
  const { projectId } = useParams();
  const initialProject = useMemo(() => getTemplateProject(projectId), [projectId]);
  const [project, setProject] = useState(initialProject);
  const [notice, setNotice] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  if (!project) {
    return (
      <WorkspaceLayout projectName="Project not found" publishLabel="Export" leftPanel={<div />} rightPanel={<div />}>
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center">
          <h1 className="text-2xl font-black text-white">Animation project not found</h1>
          <Link to="/templates" className="mt-6 inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white">
            Back to templates
          </Link>
        </div>
      </WorkspaceLayout>
    );
  }

  const settings = project.content.settings || {
    duration: '2.4s',
    color: '#6366f1',
    loop: true,
    direction: 'normal',
  };

  const updateContent = (updates) => {
    setProject((current) => ({
      ...current,
      content: {
        ...current.content,
        ...updates,
      },
    }));
  };

  const updateSetting = (key, value) => {
    const nextSettings = { ...settings, [key]: value };
    const html =
      key === 'color'
        ? replaceInlineVariable(project.content.html, 'accent', value)
        : key === 'duration'
          ? replaceInlineVariable(project.content.html, 'duration', value)
          : project.content.html;

    updateContent({ settings: nextSettings, html });
  };

  const appendTextLayer = () => {
    const insertionPoint = project.content.html.lastIndexOf('</div>');
    const nextHtml =
      insertionPoint >= 0
        ? `${project.content.html.slice(0, insertionPoint)}<h2>New animated text</h2>${project.content.html.slice(insertionPoint)}`
        : `${project.content.html}<h2>New animated text</h2>`;

    updateContent({
      html: nextHtml,
    });
  };

  const saveProject = () => {
    const saved = updateTemplateProject(project.id, project);
    setProject(saved);
    setNotice('Saved locally.');
  };

  const toolButtons = [
    { icon: Play, label: 'Preview', action: () => setShowPreview(true) },
    { icon: Type, label: 'Add Text', action: appendTextLayer },
    { icon: Clock, label: 'Speed', action: () => setNotice('Adjust duration in the right panel.') },
    { icon: Paintbrush, label: 'Color', action: () => setNotice('Change the animation color in the right panel.') },
    { icon: Infinity, label: 'Loop', action: () => updateSetting('loop', !settings.loop) },
    { icon: Code2, label: 'Code', action: () => setNotice('Use the HTML, CSS, and JS fields in the right panel.') },
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
        <p className="text-sm font-black text-white">Animation Properties</p>
        <p className="mt-1 text-sm text-slate-400">{settings.animationType || project.category} preset</p>
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

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-300">Duration</span>
          <input
            value={settings.duration}
            onChange={(event) => updateSetting('duration', event.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-300">Color</span>
          <input
            type="color"
            value={settings.color || '#6366f1'}
            onChange={(event) => updateSetting('color', event.target.value)}
            className="h-10 w-full rounded-xl border border-slate-700 bg-slate-950"
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm font-semibold text-slate-300">
          <input type="checkbox" checked={Boolean(settings.loop)} onChange={(event) => updateSetting('loop', event.target.checked)} className="accent-indigo-500" />
          Loop
        </label>
        <select
          value={settings.direction || 'normal'}
          onChange={(event) => updateSetting('direction', event.target.value)}
          className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
        >
          <option value="normal">Normal</option>
          <option value="reverse">Reverse</option>
          <option value="alternate">Alternate</option>
        </select>
      </div>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-slate-300">HTML</span>
        <textarea
          value={project.content.html}
          onChange={(event) => updateContent({ html: event.target.value })}
          rows={7}
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-xs text-slate-200 outline-none focus:border-indigo-500"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-slate-300">CSS</span>
        <textarea
          value={project.content.css}
          onChange={(event) => updateContent({ css: event.target.value })}
          rows={8}
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-xs text-slate-200 outline-none focus:border-indigo-500"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-slate-300">JavaScript</span>
        <textarea
          value={project.content.js}
          onChange={(event) => updateContent({ js: event.target.value })}
          rows={4}
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-xs text-slate-200 outline-none focus:border-indigo-500"
        />
      </label>
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
        onPublish={() => setNotice('Export placeholder ready for CSS, JS, React, GSAP, or Lottie output.')}
      >
        <div className="h-full w-full overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl shadow-black/30">
          <AnimationLivePreview content={project.content} />
        </div>
      </WorkspaceLayout>

      {showPreview && <PreviewOverlay project={project} onClose={() => setShowPreview(false)} />}
    </>
  );
}

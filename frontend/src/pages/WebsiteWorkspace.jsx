import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Code2, Image, Layout, SquareMousePointer, Type } from 'lucide-react';
import WorkspaceLayout from '../components/layout/WorkspaceLayout';
import { WebsiteLivePreview } from '../components/templates/TemplatePreviewModal';
import { getTemplateProject, updateTemplateProject } from '../utils/projectStorage';

const editorCss = `
  .shopcraft-added-section {
    padding: 64px 7%;
    background: #ffffff;
    color: #0f172a;
    font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  }
  .shopcraft-added-section h2 {
    margin: 0 0 12px;
    font-size: 34px;
    line-height: 1.15;
  }
  .shopcraft-added-section p {
    max-width: 680px;
    margin: 0;
    color: #475569;
  }
  .shopcraft-added-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 46px;
    margin-top: 22px;
    padding: 0 22px;
    border-radius: 12px;
    background: #6366f1;
    color: #fff;
    font-weight: 800;
    text-decoration: none;
  }
  .shopcraft-added-image {
    min-height: 280px;
    border-radius: 24px;
    margin: 44px 7%;
    display: grid;
    place-items: center;
    background: linear-gradient(135deg, #111827, #6366f1, #22d3ee);
    color: #fff;
    font-weight: 900;
  }
`;

const ensureEditorCss = (css = '') => (css.includes('.shopcraft-added-section') ? css : `${css}\n${editorCss}`);

function PreviewOverlay({ project, onClose }) {
  return (
    <div className="fixed inset-0 z-[130] bg-slate-950/90 p-4 backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-slate-700 bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-800 p-4">
          <div>
            <p className="text-sm font-semibold text-cyan-200">Website preview</p>
            <h2 className="text-xl font-black text-white">{project.name}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800">
            Close
          </button>
        </div>
        <WebsiteLivePreview content={project.content} />
      </div>
    </div>
  );
}

export default function WebsiteWorkspace() {
  const { projectId } = useParams();
  const initialProject = useMemo(() => getTemplateProject(projectId), [projectId]);
  const [project, setProject] = useState(initialProject);
  const [notice, setNotice] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  if (!project) {
    return (
      <WorkspaceLayout projectName="Project not found" publishLabel="Export" leftPanel={<div />} rightPanel={<div />}>
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center">
          <h1 className="text-2xl font-black text-white">Template project not found</h1>
          <p className="mt-3 text-slate-400">Open a template from the library to create an editable workspace project.</p>
          <Link to="/templates" className="mt-6 inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white">
            Back to templates
          </Link>
        </div>
      </WorkspaceLayout>
    );
  }

  const updateContent = (updates) => {
    setProject((current) => ({
      ...current,
      content: {
        ...current.content,
        ...updates,
      },
    }));
  };

  const appendHtml = (snippet) => {
    updateContent({
      html: `${project.content.html}\n${snippet}`,
      css: ensureEditorCss(project.content.css),
    });
  };

  const saveProject = () => {
    const saved = updateTemplateProject(project.id, project);
    setProject(saved);
    setNotice('Saved locally.');
  };

  const tools = [
    {
      icon: Layout,
      label: 'Add Section',
      action: () =>
        appendHtml('<section class="shopcraft-added-section"><h2>New editable section</h2><p>Use this area for an offer, feature story, or page detail.</p></section>'),
    },
    {
      icon: Type,
      label: 'Add Text',
      action: () =>
        appendHtml('<section class="shopcraft-added-section"><h2>Editable headline</h2><p>Replace this text with your own message.</p></section>'),
    },
    {
      icon: SquareMousePointer,
      label: 'Add Button',
      action: () => appendHtml('<section class="shopcraft-added-section"><a class="shopcraft-added-button" href="#contact">New CTA Button</a></section>'),
    },
    {
      icon: Image,
      label: 'Add Image',
      action: () => appendHtml('<div class="shopcraft-added-image">Image Placeholder</div>'),
    },
    {
      icon: Code2,
      label: 'Edit Code',
      action: () => setNotice('Use the code fields in the right panel to edit HTML, CSS, and JS.'),
    },
  ];

  const leftPanel = (
    <div className="flex flex-col gap-4">
      {tools.map((tool) => {
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
        <p className="text-sm font-black text-white">Website Properties</p>
        <p className="mt-1 text-sm text-slate-400">Edit the live template source.</p>
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

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-slate-300">HTML</span>
        <textarea
          value={project.content.html}
          onChange={(event) => updateContent({ html: event.target.value })}
          rows={9}
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-xs text-slate-200 outline-none focus:border-indigo-500"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-slate-300">CSS</span>
        <textarea
          value={project.content.css}
          onChange={(event) => updateContent({ css: event.target.value })}
          rows={9}
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-xs text-slate-200 outline-none focus:border-indigo-500"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-slate-300">JavaScript</span>
        <textarea
          value={project.content.js}
          onChange={(event) => updateContent({ js: event.target.value })}
          rows={5}
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
        onPublish={() => setNotice('Export placeholder ready. Final file exporters can plug into this project content.')}
      >
        <div className="h-full w-full overflow-hidden rounded-3xl border border-slate-800 bg-white shadow-2xl shadow-black/30">
          <WebsiteLivePreview content={project.content} />
        </div>
      </WorkspaceLayout>

      {showPreview && <PreviewOverlay project={project} onClose={() => setShowPreview(false)} />}
    </>
  );
}

import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, Clock3, Eye, FileCode2, FileText, History, Home, Map, Maximize2, Minimize2, MoreHorizontal, PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen, Rocket, Save } from 'lucide-react';
import { useBuilderStore } from '../../store/builderStore';
import PrototypeModeToggle from './prototype/PrototypeModeToggle';
import ToolBar from './ToolBar';
import { generateWebsiteCode } from '../../services/codeGenerator';
import { projectStorage } from '../../services/projectStorage';
import { topBarTools } from '../../data/builderTools';

const formatTime = (value) => {
  if (!value) return 'Not saved yet';
  return new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(new Date(value));
};

export default function BuilderTopBar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [versionOpen, setVersionOpen] = useState(false);
  const [generatedCode, setGeneratedCode] = useState(null);
  const {
    project,
    currentPage,
    nodesMap,
    isSaving,
    lastSavedAt,
    setProject,
    commitNodesMap,
    saveProject,
    publishProject,
    switchPage,
    showToast,
    leftPanelCollapsed,
    rightPanelCollapsed,
    fullscreenCanvas,
    canvasView,
    setCanvasView,
    setLeftPanelCollapsed,
    setRightPanelCollapsed,
    setFullscreenCanvas,
  } = useBuilderStore();

  const handlePreview = async () => {
    const saved = await saveProject();
    if (saved) navigate(`/preview/${saved.id}`);
  };

  const handlePublish = async () => {
    const published = await publishProject();
    if (published) navigate(`/site/${published.slug}`);
  };

  const versionKey = project?.id ? `shopcraft_project_versions_${project.id}` : null;
  const readVersions = () => {
    if (!versionKey) return [];
    try {
      return JSON.parse(window.localStorage.getItem(versionKey) || '[]');
    } catch {
      return [];
    }
  };
  const [versions, setVersions] = useState([]);

  const openExport = () => {
    setGeneratedCode(generateWebsiteCode({ ...project, nodesMap }));
    setExportOpen(true);
  };

  const copyText = async (label, value) => {
    if (!value) return showToast(`${label} is not ready yet.`, 'error');
    await navigator.clipboard.writeText(value);
    showToast(`${label} copied.`, 'success');
  };

  const saveSnapshot = () => {
    const snapshot = {
      id: `version-${Date.now()}`,
      createdAt: new Date().toISOString(),
      project: { ...project, nodesMap },
    };
    const next = [snapshot, ...readVersions()].slice(0, 20);
    window.localStorage.setItem(versionKey, JSON.stringify(next));
    setVersions(next);
    showToast('Version snapshot saved.', 'success');
  };

  const openVersions = () => {
    setVersions(readVersions());
    setVersionOpen(true);
  };

  const restoreVersion = (snapshot) => {
    projectStorage.updateProject(project.id, snapshot.project);
    setProject(snapshot.project);
    commitNodesMap(snapshot.project.nodesMap || {}, { skipHistory: true });
    setVersionOpen(false);
    showToast('Version restored.', 'success');
  };

  const moreActions = {
    export: openExport,
    'version-history': openVersions,
    'connect-domain': () => showToast('Domain connection placeholder configured. DNS/backend connection required for live usage.'),
    settings: () => showToast('Open the Settings tool in the left panel to edit project settings.'),
  };

  const [pageDropdownOpen, setPageDropdownOpen] = useState(false);
  const pageDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pageDropdownRef.current && !pageDropdownRef.current.contains(event.target)) setPageDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSwitchPage = (pageId) => {
    switchPage(pageId);
    setPageDropdownOpen(false);
    if (project?.id) navigate(`/builder/website/${project.id}/page/${pageId}`, { replace: true });
  };

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 lg:px-6 shrink-0 z-50">
      <div className="flex items-center gap-4 min-w-0">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={18} />
          <span className="hidden md:inline text-[10px] font-black uppercase tracking-[0.18em]">Back to Dashboard</span>
        </Link>
        <div className="h-7 w-px bg-slate-800 hidden md:block" />
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-indigo-400">
            <Clock3 size={11} />
            <span>{isSaving ? 'Saving...' : `Saved ${formatTime(lastSavedAt)}`}</span>
          </div>
          <div className="flex items-center gap-1">
            <h1 className="truncate text-sm font-black uppercase tracking-widest text-white">{project?.name || 'Website Builder'}</h1>
            <span className="text-sm text-slate-600">/</span>
            <div className="relative" ref={pageDropdownRef}>
              <button
                type="button"
                onClick={() => setPageDropdownOpen((o) => !o)}
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-black uppercase tracking-widest text-slate-400 transition hover:bg-slate-800 hover:text-white"
              >
                <FileText size={12} />
                <span className="max-w-[120px] truncate">{currentPage?.name || 'Home'}</span>
                <ChevronDown size={12} />
              </button>
              {pageDropdownOpen && (
                <div className="absolute left-0 top-9 z-[100] w-64 rounded-2xl border border-slate-800 bg-slate-950 p-2 shadow-2xl">
                  <p className="px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.25em] text-slate-600">Switch Page</p>
                  {(project?.pages || []).map((page) => (
                    <button
                      key={page.id}
                      type="button"
                      onClick={() => handleSwitchPage(page.id)}
                      className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-bold transition ${
                        currentPage?.id === page.id
                          ? 'bg-indigo-600/20 text-indigo-200'
                          : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                      }`}
                    >
                      {page.isHome ? <Home size={13} className="shrink-0 text-indigo-400" /> : <FileText size={13} className="shrink-0 text-slate-500" />}
                      <span className="flex-1 truncate">{page.name}</span>
                      <span className="text-[9px] font-bold text-slate-600">/{page.slug}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto px-2 custom-scrollbar">
        <button
          type="button"
          onClick={() => setCanvasView(canvasView === 'design' ? 'routing' : 'design')}
          title={canvasView === 'design' ? 'View routing map' : 'View design'}
          className={`h-9 flex items-center gap-2 rounded-xl px-3 text-xs font-black uppercase tracking-widest transition-colors ${
            canvasView === 'routing' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Map size={14} />
          <span className="hidden sm:inline">Map</span>
        </button>
        <div className="h-7 w-px bg-slate-800" />
        <PrototypeModeToggle />
        <ToolBar />
        <div className="h-7 w-px bg-slate-800" />
        <button
          type="button"
          title={leftPanelCollapsed ? 'Open left tool panel' : 'Collapse left tool panel'}
          aria-label={leftPanelCollapsed ? 'Open left tool panel' : 'Collapse left tool panel'}
          onClick={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
          className="h-9 w-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800"
        >
          {leftPanelCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
        </button>
        <button
          type="button"
          title={rightPanelCollapsed ? 'Open right properties panel' : 'Collapse right properties panel'}
          aria-label={rightPanelCollapsed ? 'Open right properties panel' : 'Collapse right properties panel'}
          onClick={() => setRightPanelCollapsed(!rightPanelCollapsed)}
          className="h-9 w-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800"
        >
          {rightPanelCollapsed ? <PanelRightOpen size={16} /> : <PanelRightClose size={16} />}
        </button>
        <button
          type="button"
          title={fullscreenCanvas ? 'Exit fullscreen canvas' : 'Fullscreen canvas'}
          aria-label={fullscreenCanvas ? 'Exit fullscreen canvas' : 'Fullscreen canvas'}
          onClick={() => setFullscreenCanvas(!fullscreenCanvas)}
          className="h-9 w-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800"
        >
          {fullscreenCanvas ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Save"
          onClick={saveProject}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.16em] text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
        >
          <Save size={15} />
          <span className="hidden sm:inline">Save</span>
        </button>
        <button
          type="button"
          aria-label="Preview"
          onClick={handlePreview}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.16em] text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
        >
          <Eye size={15} />
          <span className="hidden sm:inline">Preview</span>
        </button>
        <button
          type="button"
          aria-label="Publish"
          onClick={handlePublish}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.16em] text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20"
        >
          <Rocket size={15} />
          <span className="hidden sm:inline">Publish</span>
        </button>
        <div className="relative">
          <button
            type="button"
            title="More options"
            onClick={() => setMenuOpen((open) => !open)}
            className="h-9 w-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <MoreHorizontal size={18} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-11 w-56 rounded-2xl border border-slate-800 bg-slate-950 p-2 shadow-2xl">
              {[
                { id: 'export', label: topBarTools.find((tool) => tool.id === 'export')?.name || 'Export Website', icon: FileCode2 },
                { id: 'version-history', label: topBarTools.find((tool) => tool.id === 'version-history')?.name || 'Version History', icon: History },
                { id: 'connect-domain', label: 'Connect domain', icon: Rocket },
                { id: 'settings', label: 'Open settings', icon: MoreHorizontal },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    moreActions[id]?.();
                  }}
                  className="flex w-full items-center gap-2 text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-900 hover:text-white"
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      {exportOpen && (
        <div className="fixed inset-0 z-[180] flex items-center justify-center bg-slate-950/80 p-6" onClick={() => setExportOpen(false)}>
          <div className="max-h-[86vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl custom-scrollbar" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-400">Clean export</p>
                <h3 className="text-2xl font-black text-white">Export Website</h3>
              </div>
              <button type="button" onClick={() => setExportOpen(false)} className="rounded-xl border border-slate-700 px-3 py-2 text-xs font-black uppercase tracking-widest text-slate-300">Close</button>
            </div>
            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              {[
                ['HTML', generatedCode?.html],
                ['CSS', generatedCode?.css],
                ['React', generatedCode?.react],
              ].map(([label, value]) => (
                <section key={label} className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs font-black uppercase tracking-widest text-white">{label}</p>
                    <button type="button" onClick={() => copyText(label, value)} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-white">Copy</button>
                  </div>
                  <textarea value={value || ''} readOnly rows={12} className="w-full resize-none rounded-xl border border-slate-800 bg-slate-900 p-3 font-mono text-[10px] text-slate-300 outline-none" />
                </section>
              ))}
            </div>
          </div>
        </div>
      )}
      {versionOpen && (
        <div className="fixed inset-0 z-[180] flex items-center justify-center bg-slate-950/80 p-6" onClick={() => setVersionOpen(false)}>
          <div className="w-full max-w-2xl rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-400">Snapshots</p>
                <h3 className="text-2xl font-black text-white">Version History</h3>
              </div>
              <button type="button" onClick={saveSnapshot} className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-black uppercase tracking-widest text-white">Save snapshot</button>
            </div>
            <div className="mt-5 space-y-3">
              {versions.map((version) => (
                <div key={version.id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <div>
                    <p className="text-sm font-black text-white">{project?.name || 'Project'} snapshot</p>
                    <p className="text-xs text-slate-500">{new Date(version.createdAt).toLocaleString()}</p>
                  </div>
                  <button type="button" onClick={() => restoreVersion(version)} className="rounded-xl border border-slate-700 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-white">Restore</button>
                </div>
              ))}
              {!versions.length && <p className="rounded-2xl border border-dashed border-slate-800 p-5 text-sm text-slate-500">No snapshots yet. Save one now to make restore available.</p>}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

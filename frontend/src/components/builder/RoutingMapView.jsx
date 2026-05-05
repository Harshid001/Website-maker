import React, { useMemo } from 'react';
import { FileText, Home, Link as LinkIcon, Plus } from 'lucide-react';
import { useBuilderStore } from '../../store/builderStore';

export default function RoutingMapView() {
  const { project, switchPage, setCanvasView, addPage } = useBuilderStore();

  const pages = project?.pages || [];
  const interactions = project?.interactions || [];

  const handlePageClick = (pageId) => {
    switchPage(pageId);
    setCanvasView('design');
  };

  const handleAddPage = () => {
    addPage('New Page');
  };

  // Build a basic adjacency list for visualization
  const connections = useMemo(() => {
    const map = {};
    interactions.forEach((interaction) => {
      if (interaction.sourcePageId && interaction.targetPageId) {
        if (!map[interaction.sourcePageId]) map[interaction.sourcePageId] = new Set();
        map[interaction.sourcePageId].add(interaction.targetPageId);
      }
    });
    return map;
  }, [interactions]);

  return (
    <div className="relative flex h-full w-full flex-col overflow-auto bg-slate-950 p-10">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-white">Routing Map</h2>
          <p className="mt-2 text-sm text-slate-400">
            Visualize your website's pages and how they connect.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddPage}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20"
        >
          <Plus size={16} />
          Add Page
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {pages.map((page) => {
          const outgoingLinks = Array.from(connections[page.id] || []);
          const incomingCount = interactions.filter((i) => i.targetPageId === page.id).length;

          return (
            <div
              key={page.id}
              className={`group relative flex cursor-pointer flex-col rounded-3xl border border-slate-800 bg-slate-900 p-6 transition-all hover:-translate-y-1 hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-500/20 ${
                project?.currentPageId === page.id ? 'ring-2 ring-indigo-500' : ''
              }`}
              onClick={() => handlePageClick(page.id)}
            >
              <div className="mb-4 flex items-center justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${page.isHome ? 'bg-indigo-600/20 text-indigo-400' : 'bg-slate-800 text-slate-400'}`}>
                  {page.isHome ? <Home size={24} /> : <FileText size={24} />}
                </div>
                {project?.currentPageId === page.id && (
                  <span className="rounded-full bg-indigo-600 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-white">Active</span>
                )}
              </div>
              
              <h3 className="mb-1 text-xl font-black text-white truncate">{page.name}</h3>
              <p className="mb-6 text-xs text-slate-500 truncate">Path: {page.path}</p>

              <div className="mt-auto flex items-center gap-4 border-t border-slate-800 pt-4">
                <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  <LinkIcon size={12} className="text-slate-500" />
                  <span>{outgoingLinks.length} Out</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  <LinkIcon size={12} className="text-slate-500" />
                  <span>{incomingCount} In</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

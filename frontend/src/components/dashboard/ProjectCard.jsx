import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Copy, Edit2, Eye, ExternalLink, MoreVertical, Rocket, Star, Trash2 } from 'lucide-react';
import { ProjectContext } from '../../context/ProjectContext';

const builderPathFor = (project) => {
  const routeByType = {
    website: 'website',
    design2d: 'design-2d',
    animation: 'animation',
    model3d: 'model-3d',
  };
  return `/builder/${routeByType[project.type] || 'website'}/${project.id}`;
};

export default function ProjectCard({ project }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { duplicateProject, deleteProject, publishProject, updateProject, toggleFavorite, isFavorite } = useContext(ProjectContext);
  const favorite = isFavorite?.(project.id) || project.favorite;

  const typeLabels = {
    website: 'Website',
    design2d: '2D Design',
    animation: 'Animation',
    model3d: '3D Model',
  };

  const openPublished = () => {
    if (project.published || project.status === 'published') navigate(`/site/${project.slug}`);
  };

  const renameProject = () => {
    const nextName = window.prompt('Rename project', project.name);
    if (!nextName?.trim()) return;
    updateProject(project.id, { ...project, name: nextName.trim() });
    setMenuOpen(false);
  };

  return (
    <div className="group overflow-hidden rounded-xl border border-gray-700 bg-gray-800 transition-all hover:border-gray-600">
      <div className="relative flex aspect-video items-center justify-center bg-gray-900">
        {project.thumbnail ? (
          <img src={project.thumbnail} alt={project.name} className="h-full w-full object-cover" />
        ) : (
          <span className="text-sm font-black uppercase tracking-widest text-gray-700">No Preview</span>
        )}
        <button
          type="button"
          title={favorite ? 'Remove from favorites' : 'Add to favorites'}
          onClick={() => toggleFavorite(project.id)}
          className={`absolute right-3 top-3 z-10 rounded-full border border-white/10 bg-slate-950/80 p-2 backdrop-blur transition-all hover:bg-slate-900 ${favorite ? 'text-amber-300' : 'text-slate-400 hover:text-white'}`}
        >
          <Star size={16} fill={favorite ? 'currentColor' : 'none'} />
        </button>
        <div className="absolute inset-0 flex items-center justify-center gap-4 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
          <Link to={builderPathFor(project)} className="rounded-full bg-primary p-3 text-white transition-transform hover:scale-110">
            <Edit2 size={20} />
          </Link>
          <Link to={`/preview/${project.id}`} className="rounded-full bg-white p-3 text-gray-900 transition-transform hover:scale-110">
            <Eye size={20} />
          </Link>
          {(project.published || project.status === 'published') && (
            <button type="button" onClick={openPublished} className="rounded-full bg-emerald-400 p-3 text-slate-950 transition-transform hover:scale-110">
              <ExternalLink size={20} />
            </button>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="mb-2 flex items-start justify-between">
          <h4 className="truncate pr-4 font-bold text-white">{project.name}</h4>
          <div className="relative">
            <button type="button" onClick={() => setMenuOpen((open) => !open)} className="text-gray-500 hover:text-white">
              <MoreVertical size={18} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-7 z-20 w-48 rounded-2xl border border-slate-700 bg-slate-950 p-2 shadow-2xl">
                <button type="button" onClick={() => navigate(builderPathFor(project))} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-bold text-slate-300 hover:bg-slate-900 hover:text-white">
                  <Edit2 size={13} /> Open builder
                </button>
                <button type="button" onClick={renameProject} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-bold text-slate-300 hover:bg-slate-900 hover:text-white">
                  <Edit2 size={13} /> Rename
                </button>
                <button type="button" onClick={() => navigate(`/preview/${project.id}`)} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-bold text-slate-300 hover:bg-slate-900 hover:text-white">
                  <Eye size={13} /> Preview
                </button>
                <button type="button" onClick={() => { publishProject(project.id); setMenuOpen(false); }} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-bold text-slate-300 hover:bg-slate-900 hover:text-white">
                  <Rocket size={13} /> Publish
                </button>
                <button type="button" onClick={() => { duplicateProject(project.id); setMenuOpen(false); }} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-bold text-slate-300 hover:bg-slate-900 hover:text-white">
                  <Copy size={13} /> Duplicate
                </button>
                <button type="button" onClick={() => { if (window.confirm('Delete this project?')) deleteProject(project.id); setMenuOpen(false); }} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-bold text-red-200 hover:bg-red-500/10">
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">{typeLabels[project.type] || 'Project'}</span>
          <span className={`rounded-full px-2 py-0.5 ${project.status === 'published' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
            {project.status || 'draft'}
          </span>
        </div>
      </div>
    </div>
  );
}

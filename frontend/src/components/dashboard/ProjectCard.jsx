import React from 'react';
import { Link } from 'react-router-dom';
import { MoreVertical, ExternalLink, Edit2 } from 'lucide-react';

export default function ProjectCard({ project }) {
  const typeLabels = {
    website: '🌐 Website',
    design2d: '🎨 2D Design',
    animation: '🎬 Animation',
    model3d: '🧊 3D Model',
  };

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden group hover:border-gray-600 transition-all">
      <div className="aspect-video bg-gray-900 relative flex items-center justify-center">
        {project.thumbnail ? (
          <img src={project.thumbnail} alt={project.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-4xl opacity-20">No Preview</span>
        )}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
          <Link to={`/builder/${project.type}/${project.id}`} className="p-3 bg-primary rounded-full text-white hover:scale-110 transition-transform">
            <Edit2 size={20} />
          </Link>
          {project.status === 'published' && (
            <Link to={`/site/${project.slug}`} className="p-3 bg-white text-gray-900 rounded-full hover:scale-110 transition-transform">
              <ExternalLink size={20} />
            </Link>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-bold text-white truncate pr-4">{project.name}</h4>
          <button className="text-gray-500 hover:text-white"><MoreVertical size={18} /></button>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-400">{typeLabels[project.type]}</span>
          <span className={`px-2 py-0.5 rounded-full ${
            project.status === 'published' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
          }`}>
            {project.status}
          </span>
        </div>
      </div>
    </div>
  );
}

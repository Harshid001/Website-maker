import React, { useContext, useState } from 'react';
import { ProjectContext } from '../context/ProjectContext';
import ProjectCard from '../components/dashboard/ProjectCard';
import { Search, Filter, Plus, FolderOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MyProjects() {
  const { projects } = useContext(ProjectContext);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.type === filter);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-bold text-white mb-4">My Projects</h1>
          <p className="text-gray-400">Manage and edit all your creative works in one place.</p>
        </div>
        <button 
          onClick={() => navigate('/create-new')}
          className="bg-primary px-6 py-3 rounded-xl text-white font-bold flex items-center gap-2 hover:bg-opacity-90 transition-all shadow-lg shadow-primary/20"
        >
          <Plus size={20} /> Create New
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center mb-8">
        <div className="flex bg-gray-800 p-1 rounded-xl border border-gray-700">
          {['all', 'website', 'design2d', 'animation', 'model3d'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all ${
                filter === type ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Search projects..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-800/50 border border-dashed border-gray-700 rounded-2xl p-20 text-center">
          <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <FolderOpen className="text-gray-500" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">No projects found</h2>
          <p className="text-gray-400 mb-8">
            {filter === 'all' 
              ? "You haven't created any projects yet. Start by creating your first masterpiece!"
              : `You don't have any ${filter} projects yet.`}
          </p>
          <button 
            onClick={() => navigate('/create-new')}
            className="bg-primary px-8 py-3 rounded-xl text-white font-bold hover:bg-opacity-90 transition-all"
          >
            Start Creating
          </button>
        </div>
      )}
    </div>
  );
}

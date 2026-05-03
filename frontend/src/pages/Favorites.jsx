import React, { useContext } from 'react';
import { ProjectContext } from '../context/ProjectContext';
import ProjectCard from '../components/dashboard/ProjectCard';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Favorites() {
  const { projects, favorites } = useContext(ProjectContext);
  const favoriteProjects = projects.filter(p => p.favorite || favorites.includes(p.id));
  const navigate = useNavigate();

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Your Favorites</h1>
        <p className="text-gray-400">Quickly access the projects you love the most.</p>
      </header>

      {favoriteProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {favoriteProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-800/50 border border-dashed border-gray-700 rounded-2xl p-20 text-center">
          <div className="w-20 h-20 bg-pink-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="text-pink-500" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">No favorites yet</h2>
          <p className="text-gray-400 max-w-md mx-auto mb-8">
            Click the star icon on any project to add it to your favorites list for quick access.
          </p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="bg-primary px-8 py-3 rounded-xl text-white font-bold hover:bg-opacity-90 transition-all"
          >
            Explore Projects
          </button>
        </div>
      )}
    </div>
  );
}

import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { ProjectContext } from '../context/ProjectContext';
import { AuthContext } from '../context/AuthContext';
import CreationCard from '../components/dashboard/CreationCard';
import ProjectCard from '../components/dashboard/ProjectCard';
import StatsCard from '../components/dashboard/StatsCard';
import { PROJECT_TYPES } from '../utils/constants';
import { Plus, Clock, Star, Layout, Palette, Box, Globe } from 'lucide-react';

export default function Dashboard() {
  const { projects } = useContext(ProjectContext);
  const { user } = useContext(AuthContext);

  return (
    <div className="p-10 max-w-7xl mx-auto">
      <header className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-4">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Creator Hub Live</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-2 uppercase tracking-tighter">Welcome, {user?.name || 'Creator'}!</h1>
          <p className="text-slate-400 text-lg font-medium">Ready to bring your ideas to life today?</p>
        </motion.div>
        
        <div className="flex gap-4">
          <StatsCard label="Projects" value={projects.length} />
          <StatsCard label="Published" value={projects.filter(p => p.status === 'published').length} />
        </div>
      </header>

      {/* 1. What do you want to create? */}
      <section className="mb-20">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Plus className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">What do you want to create?</h2>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Select a tool to get started</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROJECT_TYPES.map((type, index) => (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <CreationCard 
                title={type.name}
                description={type.description}
                icon={type.icon}
                color={type.color}
                path={type.path}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* 2. Your Creative Workspace (Preview Section) */}
      <section className="mb-20">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700">
              <Star className="text-indigo-400" size={24} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Your Creative Workspace</h2>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Manage your digital assets</p>
            </div>
          </div>
          <button className="text-indigo-400 hover:text-white transition-colors font-black uppercase tracking-widest text-xs">View All Projects</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { label: 'Recent Projects', icon: Clock, count: projects.length, color: 'slate' },
            { label: 'Saved Templates', icon: Layout, count: 0, color: 'indigo' },
            { label: 'Favorite Animations', icon: Star, count: 0, color: 'amber' },
            { label: 'Saved 2D Designs', icon: Palette, count: 0, color: 'pink' },
            { label: 'Saved 3D Visuals', icon: Box, count: 0, color: 'emerald' },
            { label: 'Published Websites', icon: Globe, count: projects.filter(p => p.status === 'published').length, color: 'cyan' },
          ].map((cat, i) => (
            <motion.div 
              key={cat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + (i * 0.05) }}
              className="group p-6 bg-slate-900/50 border border-slate-800 rounded-[2rem] hover:bg-slate-900 hover:border-slate-700 transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-white transition-colors">
                  <cat.icon size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-widest">{cat.label}</h4>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{cat.count} Items</p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full border border-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                <Plus size={14} className="text-slate-400" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. Recent Projects (Actual List) */}
      <section>
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700">
            <Layout className="text-indigo-400" size={24} />
          </div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Quick Access</h2>
        </div>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.slice(0, 6).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="bg-slate-900/30 border border-dashed border-slate-800 rounded-[3rem] p-20 text-center">
            <Layout className="mx-auto text-slate-700 mb-6" size={64} />
            <p className="text-slate-400 text-xl font-bold mb-8 uppercase tracking-widest">No projects found in this workspace</p>
            <button className="bg-indigo-600 px-10 py-4 rounded-2xl text-white font-black uppercase tracking-widest text-sm hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-500/20">
              Create Your First Project
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

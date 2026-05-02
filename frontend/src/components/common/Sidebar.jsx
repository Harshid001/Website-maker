import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Globe, 
  Palette, 
  Box, 
  PlayCircle, 
  Settings,
  Heart,
  FolderOpen,
  BookOpen,
  Cloud,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, isMobileMenuOpen, closeMobileMenu } = useUI();

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Create New', path: '/create-new', icon: PlusCircle },
    { type: 'divider' },
    { name: 'Websites', path: '/builder/website', icon: Globe },
    { name: '2D Designs', path: '/builder/design-2d', icon: Palette },
    { name: 'Animations', path: '/builder/animation', icon: PlayCircle },
    { name: '3D Models', path: '/builder/model-3d', icon: Box },
    { type: 'divider' },
    { name: 'My Projects', path: '/my-projects', icon: FolderOpen },
    { name: 'Favorites', path: '/favorites', icon: Heart },
    { name: 'Tutorials', path: '/tutorials', icon: BookOpen },
    { name: 'Publishing', path: '/publishing', icon: Cloud },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMobileMenu}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside 
        className={`
          ${sidebarCollapsed ? 'w-20' : 'w-64'} 
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          bg-gray-950 border-r border-gray-800 flex flex-col h-[calc(100vh-73px)] sticky top-[73px] 
          transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) z-[70] fixed lg:sticky
        `}
      >
        {/* Toggle Button (Desktop Only) */}
        <button 
          onClick={toggleSidebar}
          className="absolute -right-3 top-6 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white border border-indigo-500 shadow-lg hover:bg-indigo-500 transition-all active:scale-90 hidden lg:flex z-50"
        >
          {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar overflow-x-hidden">
          <div className="space-y-2">
            {links.map((link, index) => (
              link.type === 'divider' ? (
                <div key={`divider-${index}`} className="my-6 border-t border-gray-800/50 mx-2" />
              ) : (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => {
                    if (window.innerWidth < 1024) closeMobileMenu();
                  }}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group relative
                    ${isActive 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-900 border border-transparent'}
                    ${sidebarCollapsed ? 'justify-center px-0 w-12 mx-auto' : ''}
                  `}
                >
                  <link.icon size={20} className={`shrink-0 transition-transform duration-300 group-hover:scale-110 ${sidebarCollapsed ? 'm-0' : ''}`} />
                  
                  <AnimatePresence mode="wait">
                    {!sidebarCollapsed && (
                      <motion.span 
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.3 }}
                        className="font-bold text-sm tracking-tight whitespace-nowrap overflow-hidden"
                      >
                        {link.name}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Tooltip for collapsed mode */}
                  {sidebarCollapsed && (
                    <div className="fixed left-24 px-3 py-2 bg-gray-900 border border-gray-800 text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0 z-[100] shadow-2xl">
                      {link.name}
                      <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-gray-900 border-l border-b border-gray-800 rotate-45" />
                    </div>
                  )}

                  {/* Active Indicator */}
                  <NavLink
                    to={link.path}
                    className={({ isActive }) => `
                      absolute left-0 w-1 bg-indigo-500 rounded-r-full transition-all duration-300
                      ${isActive ? 'h-6' : 'h-0 opacity-0'}
                      ${sidebarCollapsed ? 'hidden' : ''}
                    `}
                  />
                </NavLink>
              )
            ))}
          </div>
        </div>
        
        <div className="p-4 mt-auto border-t border-gray-800/50">
          {!sidebarCollapsed ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2rem] p-5 shadow-2xl overflow-hidden relative group cursor-pointer"
            >
              <div className="relative z-10">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Cloud size={20} className="text-white" />
                </div>
                <p className="text-white font-black text-xs uppercase tracking-[0.2em] mb-1">Go Unlimited</p>
                <p className="text-indigo-100 text-[10px] font-medium mb-4 opacity-80 leading-relaxed">Unlock all AI features and templates.</p>
                <button className="w-full bg-white text-indigo-600 font-black py-2.5 rounded-xl text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all shadow-lg active:scale-95">
                  Upgrade Now
                </button>
              </div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all" />
            </motion.div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <button className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all active:scale-90 group relative">
                <Cloud size={20} />
                <div className="fixed left-24 px-3 py-2 bg-gray-900 border border-gray-800 text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0 z-[100] shadow-2xl">
                  Upgrade
                  <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-gray-900 border-l border-b border-gray-800 rotate-45" />
                </div>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

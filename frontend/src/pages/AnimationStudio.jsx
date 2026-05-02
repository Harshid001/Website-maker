import React, { useState } from 'react';
import WorkspaceLayout from '../components/layout/WorkspaceLayout';
import { 
  Film, 
  Play, 
  Square, 
  Circle, 
  Type, 
  Plus, 
  ChevronDown,
  Clock,
  Settings
} from 'lucide-react';

export default function AnimationStudio() {
  const [activeLayer, setActiveLayer] = useState(0);

  const LeftTools = () => (
    <div className="flex flex-col gap-4">
      {[
        { icon: Play, label: 'Preview' },
        { icon: Square, label: 'Shape' },
        { icon: Circle, label: 'Circle' },
        { icon: Type, label: 'Text' },
        { icon: Clock, label: 'Timeline' },
        { icon: Settings, label: 'Config' },
      ].map((item, i) => (
        <button 
          key={i}
          className="w-12 h-12 rounded-xl flex items-center justify-center text-slate-500 hover:text-white hover:bg-slate-800 transition-all group relative"
        >
          <item.icon size={20} />
          <span className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-[10px] font-bold uppercase tracking-widest rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-[100]">
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );

  const RightSettings = () => (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-black uppercase tracking-widest text-xs text-white">Animation Properties</h3>
        <ChevronDown size={14} className="text-slate-500" />
      </div>
      
      <div className="space-y-8">
        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 block">Duration</label>
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
            <p className="text-xs font-bold text-slate-300">5.0 seconds</p>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 block">Easing</label>
          <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700 cursor-pointer hover:border-slate-500">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Ease In Out</span>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 block">Timeline Layers</label>
          <div className="space-y-2">
            {['Intro Title', 'Logo Animation', 'Background Fade'].map((layer, i) => (
              <div 
                key={i} 
                onClick={() => setActiveLayer(i)}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  activeLayer === i ? 'bg-indigo-600/10 border-indigo-500' : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">{layer}</span>
                <Play size={10} className={activeLayer === i ? 'text-indigo-500' : 'text-slate-600'} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <WorkspaceLayout
      projectName="New Animation"
      leftPanel={<LeftTools />}
      rightPanel={<RightSettings />}
      onSave={() => console.log('Saving...')}
      onPreview={() => console.log('Previewing...')}
      onPublish={() => console.log('Exporting...')}
    >
      <div className="w-full h-full flex flex-col">
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="aspect-video bg-white w-full max-w-4xl shadow-2xl relative overflow-hidden flex items-center justify-center group">
            <div className="text-center">
              <Film size={60} className="text-slate-100 mb-4 mx-auto animate-pulse" />
              <p className="text-slate-200 font-black uppercase tracking-widest text-xl select-none">ANIMATION PREVIEW</p>
            </div>
            {/* Playhead Mockup */}
            <div className="absolute bottom-0 left-0 h-1 bg-indigo-500 w-1/3" />
          </div>
        </div>
        
        {/* Mock Timeline */}
        <div className="h-32 bg-slate-900 border-t border-slate-800 flex flex-col p-4">
          <div className="flex items-center justify-between mb-4 px-4">
            <div className="flex items-center gap-4">
              <Play size={16} className="text-indigo-500" />
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">00:01:24 / 00:05:00</div>
            </div>
            <Plus size={16} className="text-slate-500 hover:text-white cursor-pointer" />
          </div>
          <div className="flex-1 bg-slate-950 rounded-lg relative overflow-hidden">
            <div className="absolute top-0 bottom-0 left-1/3 w-px bg-white z-10" />
            <div className="h-full flex items-center px-4 gap-4 opacity-50">
              <div className="h-4 bg-indigo-600 rounded-full w-48" />
              <div className="h-4 bg-pink-600 rounded-full w-32" />
              <div className="h-4 bg-amber-600 rounded-full w-64" />
            </div>
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
}

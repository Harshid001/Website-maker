import React from 'react';
import WorkspaceLayout from '../components/layout/WorkspaceLayout';
import { 
  Box, 
  Move, 
  RotateCw, 
  Maximize, 
  Plus, 
  ChevronDown,
  Sun,
  Grid
} from 'lucide-react';

export default function Model3DStudio() {
  const LeftTools = () => (
    <div className="flex flex-col gap-4">
      {[
        { icon: Move, label: 'Move' },
        { icon: RotateCw, label: 'Rotate' },
        { icon: Maximize, label: 'Scale' },
        { icon: Box, label: 'Add Mesh' },
        { icon: Sun, label: 'Light' },
        { icon: Grid, label: 'View' },
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
        <h3 className="font-black uppercase tracking-widest text-xs text-white">3D Properties</h3>
        <ChevronDown size={14} className="text-slate-500" />
      </div>
      
      <div className="space-y-8">
        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 block">Transform</label>
          <div className="space-y-3">
            {['X', 'Y', 'Z'].map(axis => (
              <div key={axis} className="flex items-center gap-4 p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] font-black text-indigo-500">{axis}</span>
                <input type="text" defaultValue="0.00" className="bg-transparent border-none text-xs font-bold text-slate-300 focus:outline-none w-full" />
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 block">Material</label>
          <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700 cursor-pointer hover:border-slate-500 flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Standard Physical</span>
            <div className="w-4 h-4 rounded bg-white shadow-inner" />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 block">Scene Objects</label>
          <div className="space-y-2">
            {['Cube.001', 'Point Light', 'Main Camera'].map((obj, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700 cursor-pointer hover:border-slate-500">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">{obj}</span>
                <Box size={10} className="text-slate-600" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <WorkspaceLayout
      projectName="Model 3D"
      leftPanel={<LeftTools />}
      rightPanel={<RightSettings />}
      onSave={() => console.log('Saving...')}
      onPreview={() => console.log('Previewing...')}
      onPublish={() => console.log('Exporting...')}
    >
      {/* 3D Viewport Mockup */}
      <div className="w-full h-full relative group">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Box size={120} className="text-slate-900 mb-6 mx-auto animate-float" />
            <p className="text-slate-200 font-black uppercase tracking-[0.3em] text-3xl select-none opacity-50">3D VIEWPORT</p>
          </div>
        </div>
        
        {/* Orientation Gizmo Mockup */}
        <div className="absolute top-8 right-8 w-16 h-16 bg-slate-900/50 rounded-full border border-slate-800 flex items-center justify-center">
          <div className="relative w-10 h-10 border border-slate-700 rounded-full">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-3 bg-indigo-500 rounded-full" />
             <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 w-3 bg-pink-500 rounded-full" />
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
}

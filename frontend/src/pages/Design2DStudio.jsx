import React, { useState } from 'react';
import { motion } from 'framer-motion';
import WorkspaceLayout from '../components/layout/WorkspaceLayout';
import { 
  Type, 
  Square, 
  Circle, 
  Image as ImageIcon, 
  MousePointer, 
  Layers,
  ChevronDown,
  Plus,
  Palette,
  Sparkles,
  Loader2
} from 'lucide-react';
import { generateDesignText } from '../services/aiService';

export default function Design2DStudio() {
  const [activeTool, setActiveTool] = useState('select');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiText, setAiText] = useState(null);

  const handleGenerateText = async () => {
    setIsGenerating(true);
    try {
      const result = await generateDesignText({
        designType: 'Festival Poster',
        business: 'Radhe Jewellers',
        occasion: 'Diwali',
        offer: '20% off on making charges'
      });
      setAiText(result);
    } catch (error) {
      console.error('Design text generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const LeftTools = () => (
    <div className="flex flex-col gap-4">
      <button 
        onClick={handleGenerateText}
        disabled={isGenerating}
        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all group relative ${
          isGenerating ? 'bg-indigo-600/20 text-indigo-400' : 'text-amber-400 hover:text-amber-300 hover:bg-amber-400/10'
        }`}
      >
        {isGenerating ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
        <span className="absolute left-full ml-4 px-2 py-1 bg-amber-400 text-black text-[10px] font-bold uppercase tracking-widest rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-[100]">
          {isGenerating ? 'Generating...' : 'Magic Text'}
        </span>
      </button>
      {[
        { id: 'select', icon: MousePointer, label: 'Select' },
        { id: 'text', icon: Type, label: 'Text' },
        { id: 'rect', icon: Square, label: 'Rectangle' },
        { id: 'circle', icon: Circle, label: 'Circle' },
        { id: 'image', icon: ImageIcon, label: 'Image' },
        { id: 'layers', icon: Layers, label: 'Layers' },
      ].map((item) => (
        <button 
          key={item.id}
          onClick={() => setActiveTool(item.id)}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all group relative ${
            activeTool === item.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-white hover:bg-slate-800'
          }`}
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
        <h3 className="font-black uppercase tracking-widest text-xs text-white">Design Properties</h3>
        <ChevronDown size={14} className="text-slate-500" />
      </div>
      
      <div className="space-y-8">
        {/* AI Magic Text Section */}
        <div className="p-5 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-2xl border border-indigo-500/30">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-indigo-400" />
            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">AI Poster Genius</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed mb-4">Generate catchy marketing text for your posters instantly.</p>
          <button 
            onClick={handleGenerateText}
            disabled={isGenerating}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2"
          >
            {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
            {isGenerating ? 'Brewing Ideas...' : 'Generate Poster Text'}
          </button>
        </div>
        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 block">Dimensions</label>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <p className="text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-widest">Width</p>
              <p className="text-xs font-bold text-slate-300">1080px</p>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <p className="text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-widest">Height</p>
              <p className="text-xs font-bold text-slate-300">1080px</p>
            </div>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 block">Colors</label>
          <div className="flex gap-2">
            {['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#ffffff'].map(c => (
              <button key={c} className="w-8 h-8 rounded-lg border border-slate-800 shadow-sm" style={{ backgroundColor: c }} />
            ))}
            <button className="w-8 h-8 rounded-lg border border-slate-800 flex items-center justify-center text-slate-500">
              <Plus size={14} />
            </button>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 block">Layers</label>
          <div className="space-y-2">
            {['Text Element 1', 'Rectangle 2', 'Background Image'].map((layer, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700 cursor-pointer hover:border-slate-500">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">{layer}</span>
                <div className="w-2 h-2 rounded-full bg-indigo-500" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <WorkspaceLayout
      projectName="Untitled Design"
      leftPanel={<LeftTools />}
      rightPanel={<RightSettings />}
      onSave={() => console.log('Saving...')}
      onPreview={() => console.log('Previewing...')}
      onPublish={() => console.log('Exporting...')}
    >
      {/* Main Canvas Area */}
      <div className="w-[600px] h-[600px] bg-white shadow-2xl relative overflow-hidden flex items-center justify-center group">
        <div className="absolute inset-0 border-[20px] border-slate-50 transition-all group-hover:border-[10px]" />
        <div className="relative text-center p-12">
          {aiText ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">{aiText.title}</h2>
              <p className="text-xl font-bold text-indigo-600 uppercase tracking-widest">{aiText.subtitle}</p>
              <div className="bg-amber-400 text-black py-4 px-8 inline-block rounded-full font-black uppercase tracking-[0.2em] text-sm">
                {aiText.offerText}
              </div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mt-8">{aiText.cta}</p>
            </motion.div>
          ) : (
            <>
              <Palette size={80} className="text-slate-100 mb-4 mx-auto" />
              <p className="text-slate-200 font-black uppercase tracking-widest text-2xl select-none">2D DESIGN CANVAS</p>
            </>
          )}
        </div>
        
        {/* Selection Indicators (Mockup) */}
        <div className="absolute top-20 left-20 w-40 h-40 border-2 border-indigo-500 dashed">
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-white border border-indigo-500" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-white border border-indigo-500" />
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white border border-indigo-500" />
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white border border-indigo-500" />
        </div>
      </div>
    </WorkspaceLayout>
  );
}


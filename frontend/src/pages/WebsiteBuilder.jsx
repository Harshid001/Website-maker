import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { ProjectContext } from '../context/ProjectContext';
import { websiteCategories, websiteTemplates } from '../data/websiteTemplates';
import WorkspaceLayout from '../components/layout/WorkspaceLayout';
import { 
  Layout, 
  Palette, 
  Type, 
  Image as ImageIcon,
  Plus,
  Settings as SettingsIcon,
  Search,
  ChevronDown,
  Sparkles,
  Loader2
} from 'lucide-react';
import { generateWebsiteContent } from '../services/aiService';

export default function WebsiteBuilder() {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiContent, setAiContent] = useState(null);
  const [config, setConfig] = useState({
    name: '',
    category: '',
    template: null,
    theme: null,
  });
  
  const { addProject } = useContext(ProjectContext);

  const [recommendedTemplate, setRecommendedTemplate] = useState(null);

  const handleNext = async () => {
    if (step === 2 && config.category) {
      try {
        const suggestion = await suggestTemplate({
          profession: config.category,
          theme: config.theme || 'Default'
        });
        setRecommendedTemplate(suggestion.templateName);
      } catch (error) {
        console.error('Template suggestion failed:', error);
      }
    }
    setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  if (step === 1) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-xl"
        >
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black tracking-tighter text-white mb-4 uppercase">New Website</h1>
            <p className="text-slate-400">Give your digital home a name to get started.</p>
          </div>
          <div className="bg-slate-900 p-10 rounded-[2.5rem] border border-slate-800 shadow-2xl">
            <input 
              type="text" 
              value={config.name}
              onChange={(e) => setConfig({...config, name: e.target.value})}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-5 text-2xl text-white focus:ring-2 focus:ring-indigo-600 outline-none transition-all mb-8 placeholder:text-slate-800"
              placeholder="Project Name..."
              autoFocus
            />
            <button 
              disabled={!config.name}
              onClick={handleNext}
              className="w-full bg-indigo-600 py-5 rounded-2xl text-white font-bold text-xl hover:bg-indigo-500 disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-xl shadow-indigo-500/10"
            >
              Start Building
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="min-h-screen bg-slate-950 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-black tracking-tighter text-white mb-4 uppercase">Choose Category</h1>
            <p className="text-slate-400">Select your industry to load the best tools for you.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {websiteCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setConfig({...config, category: cat.id}); handleNext(); }}
                className={`p-8 rounded-[2rem] border transition-all flex flex-col items-center group ${
                  config.category === cat.id 
                    ? 'bg-indigo-600 border-indigo-500 shadow-xl shadow-indigo-500/20 scale-105' 
                    : 'bg-slate-900 border-slate-800 hover:border-slate-600 hover:scale-105'
                }`}
              >
                <div className="text-5xl mb-6 group-hover:rotate-12 transition-transform">{cat.icon}</div>
                <div className="font-bold uppercase tracking-widest text-xs text-white">{cat.name}</div>
              </button>
            ))}
          </div>
          <button onClick={handleBack} className="mt-16 text-slate-500 hover:text-white mx-auto flex items-center gap-2 font-bold uppercase tracking-widest text-xs transition-colors">
            Back to Name
          </button>
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="min-h-screen bg-slate-950 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-black tracking-tighter text-white mb-4 uppercase">Pick Template</h1>
            <p className="text-slate-400">Ready-made structures for {config.category}.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {websiteTemplates.filter(t => t.category === config.category).map((temp) => (
              <div key={temp.id} className={`bg-slate-900 rounded-[2rem] border overflow-hidden group transition-all hover:shadow-2xl hover:shadow-indigo-500/10 ${
                recommendedTemplate === temp.name ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-slate-800 hover:border-indigo-600'
              }`}>
                <div className="aspect-video bg-slate-950 relative overflow-hidden">
                  <img src={temp.thumbnail} alt={temp.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  
                  {recommendedTemplate === temp.name && (
                    <div className="absolute top-4 left-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg z-10">
                      <Sparkles size={10} /> Recommended
                    </div>
                  )}

                  <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center p-6">
                    <button 
                      onClick={() => { setConfig({...config, template: temp}); handleNext(); }}
                      className="bg-white text-slate-900 px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-indigo-600 hover:text-white transition-all shadow-xl"
                    >
                      Select Template
                    </button>
                  </div>
                </div>
                <div className="p-6 flex justify-between items-center">
                  <h3 className="font-bold text-white uppercase tracking-widest text-sm">{temp.name}</h3>
                  {recommendedTemplate === temp.name && <Sparkles size={16} className="text-indigo-400" />}
                </div>
              </div>
            ))}
          </div>
          <button onClick={handleBack} className="mt-16 text-slate-500 hover:text-white mx-auto flex items-center gap-2 font-bold uppercase tracking-widest text-xs transition-colors">
            Back to Categories
          </button>
        </div>
      </div>
    );
  }

  const handleAIGenerate = async () => {
    if (!config.name || !config.category) return;
    
    setIsGenerating(true);
    try {
      const result = await generateWebsiteContent({
        businessName: config.name,
        profession: config.category,
        city: 'Ahmedabad', // Default city for now
        services: ['General Services'],
        theme: 'Modern'
      });
      setAiContent(result);
    } catch (error) {
      console.error('AI Generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const LeftTools = () => (
    <div className="flex flex-col gap-4">
      <button 
        onClick={handleAIGenerate}
        disabled={isGenerating}
        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all group relative ${
          isGenerating ? 'bg-indigo-600/20 text-indigo-400' : 'text-amber-400 hover:text-amber-300 hover:bg-amber-400/10'
        }`}
      >
        {isGenerating ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
        <span className="absolute left-full ml-4 px-2 py-1 bg-amber-400 text-black text-[10px] font-bold uppercase tracking-widest rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-[100]">
          {isGenerating ? 'Generating...' : 'Magic AI'}
        </span>
      </button>
      {[
        { icon: Plus, label: 'Add' },
        { icon: Layout, label: 'Pages' },
        { icon: Palette, label: 'Style' },
        { icon: ImageIcon, label: 'Media' },
        { icon: Type, label: 'Text' },
        { icon: SettingsIcon, label: 'Tools' },
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

  const [seoContent, setSeoContent] = useState(null);
  const [isGeneratingSEO, setIsGeneratingSEO] = useState(false);

  const handleGenerateSEO = async () => {
    if (!config.name || !config.category) return;
    setIsGeneratingSEO(true);
    try {
      const result = await generateSEO({
        businessName: config.name,
        profession: config.category,
        city: 'Ahmedabad',
        services: ['General Services']
      });
      setSeoContent(result);
    } catch (error) {
      console.error('SEO Generation failed:', error);
    } finally {
      setIsGeneratingSEO(false);
    }
  };

  const [animations, setAnimations] = useState(null);
  const [isSuggestingAnimations, setIsSuggestingAnimations] = useState(false);

  const handleSuggestAnimations = async () => {
    if (!config.category) return;
    setIsSuggestingAnimations(true);
    try {
      const result = await suggestAnimation({
        profession: config.category,
        theme: config.theme || 'Default'
      });
      setAnimations(result.animations);
    } catch (error) {
      console.error('Animation suggestion failed:', error);
    } finally {
      setIsSuggestingAnimations(false);
    }
  };

  const RightSettings = () => (
    <div className="p-6 h-full overflow-y-auto custom-scrollbar pb-24">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-black uppercase tracking-widest text-xs text-white">Properties</h3>
        <ChevronDown size={14} className="text-slate-500" />
      </div>
      
      <div className="space-y-8">
        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 block">Selection</label>
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
            <p className="text-xs font-bold text-slate-300">Hero Section</p>
          </div>
        </div>

        {aiContent && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-indigo-600/10 rounded-2xl border border-indigo-500/30"
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} className="text-indigo-400" />
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">AI Content</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Custom text generated for {config.category}.
            </p>
          </motion.div>
        )}

        {/* SEO Section */}
        <div className="pt-8 border-t border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block">SEO Optimization</label>
            {!seoContent && !isGeneratingSEO && (
              <button onClick={handleGenerateSEO} className="text-[9px] font-black text-indigo-400 uppercase tracking-widest hover:text-white transition-colors">Generate</button>
            )}
          </div>
          {seoContent && (
            <div className="space-y-4">
              <div>
                <span className="text-[9px] font-bold text-slate-500 uppercase mb-1 block">Title Tag</span>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-300 font-medium">
                  {seoContent.seoTitle}
                </div>
              </div>
              <div>
                <span className="text-[9px] font-bold text-slate-500 uppercase mb-1 block">Description</span>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                  {seoContent.seoDescription}
                </div>
              </div>
            </div>
          )}
          {isGeneratingSEO && <div className="text-[10px] text-slate-500 animate-pulse font-bold uppercase tracking-widest">AI is thinking...</div>}
        </div>

        {/* Animations Section */}
        <div className="pt-8 border-t border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block">AI Animations</label>
            {!animations && !isSuggestingAnimations && (
              <button onClick={handleSuggestAnimations} className="text-[9px] font-black text-indigo-400 uppercase tracking-widest hover:text-white transition-colors">Suggest</button>
            )}
          </div>
          
          {animations ? (
            <div className="space-y-2">
              {animations.map((anim, i) => (
                <div key={i} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between group hover:border-indigo-500/50 cursor-pointer transition-all">
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">{anim}</span>
                  <Plus size={10} className="text-slate-600 group-hover:text-indigo-400" />
                </div>
              ))}
              <button onClick={handleSuggestAnimations} className="w-full text-[9px] font-bold text-slate-500 uppercase tracking-widest hover:text-indigo-400 transition-colors pt-2">Refresh Suggestions</button>
            </div>
          ) : isSuggestingAnimations ? (
            <div className="text-[10px] text-slate-500 animate-pulse font-bold uppercase tracking-widest">Analyzing design...</div>
          ) : (
            <p className="text-[9px] text-slate-500 leading-relaxed uppercase font-bold tracking-wider">Get AI-powered animation recommendations for your industry.</p>
          )}
        </div>

        {/* Media Section */}
        <div className="pt-8 border-t border-slate-800">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 block">Media Magic</label>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center gap-2 hover:border-indigo-500/50 transition-all group">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                <ImageIcon size={14} />
              </div>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Optimize</span>
            </button>
            <button className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center gap-2 hover:border-indigo-500/50 transition-all group">
              <div className="w-8 h-8 rounded-lg bg-purple-600/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                <ImageIcon size={14} />
              </div>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Remove BG</span>
            </button>
          </div>
          <p className="mt-3 text-[8px] text-slate-600 uppercase font-black tracking-widest text-center">AI Image Processing powered by Python</p>
        </div>

        <div className="pt-8 border-t border-slate-800">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 block">Background</label>
          <div className="flex gap-2">
            {['#6366f1', '#ec4899', '#f59e0b', '#ffffff'].map(c => (
              <button key={c} className="w-8 h-8 rounded-lg border border-slate-800 shadow-sm" style={{ backgroundColor: c }} />
            ))}
            <button className="w-8 h-8 rounded-lg border border-slate-800 flex items-center justify-center text-slate-500">
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <WorkspaceLayout
      projectName={config.name}
      leftPanel={<LeftTools />}
      rightPanel={<RightSettings />}
      onSave={() => console.log('Saving...')}
      onPreview={() => console.log('Previewing...')}
      onPublish={() => console.log('Publishing...')}
    >
      {/* Main Canvas */}
      <div className="w-full h-full max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200/20 flex flex-col">
        {/* Browser Top Bar */}
        <div className="h-10 bg-slate-100 border-b border-slate-200 flex items-center px-4 gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          </div>
          <div className="flex-1 max-w-md mx-auto h-6 bg-white rounded-md border border-slate-200 flex items-center px-3 gap-2">
            <Search size={10} className="text-slate-400" />
            <div className="text-[8px] font-bold text-slate-400 tracking-widest uppercase">www.shopcraft.io/{config.name.toLowerCase().replace(/ /g, '-')}</div>
          </div>
        </div>
        
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-white text-slate-900">
          <div className="p-16 text-center">
            <h2 className="text-6xl font-black tracking-tighter mb-6 uppercase">
              {aiContent ? aiContent.heroTitle : config.name}
            </h2>
            <p className="text-slate-400 text-xl max-w-xl mx-auto mb-10 leading-relaxed font-medium">
              {aiContent ? aiContent.heroSubtitle : `Welcome to the professional home of ${config.name}. We build quality experiences for our local community.`}
            </p>
            <button className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:scale-105 transition-transform shadow-xl shadow-slate-200">
              {aiContent ? aiContent.callToAction : 'Explore Our Services'}
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
              {[1, 2, 3].map(i => (
                <div key={i} className="group cursor-pointer">
                  <div className="aspect-square bg-slate-50 rounded-2xl mb-4 group-hover:scale-105 transition-transform duration-500 border border-slate-100" />
                  <h4 className="font-black uppercase tracking-widest text-xs mb-2">Feature {i}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Description of excellence</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
}


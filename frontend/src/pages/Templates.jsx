import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Eye, Film, Globe2, Palette, Search, Wand2 } from 'lucide-react';
import { websiteTemplates } from '../data/websiteTemplates';
import { designTemplates } from '../data/designTemplates';
import { animationTemplates } from '../data/animationTemplates';
import { modelTemplates } from '../data/modelTemplates';
import { projectStorage } from '../services/projectStorage';
import { aiMockService } from '../services/aiMockService';
import { rekeyTree } from '../utils/ids';
import { slugify } from '../utils/slugify';

const tabs = [
  { id: 'website', label: 'Websites', icon: Globe2, route: '/create/website' },
  { id: 'design2d', label: '2D Designs', icon: Palette, route: '/builder/design-2d' },
  { id: 'animation', label: 'Animations', icon: Film, route: '/builder/animation' },
  { id: 'model3d', label: '3D Models', icon: Box, route: '/builder/model-3d' },
];

const templateSets = {
  website: websiteTemplates,
  design2d: designTemplates,
  animation: animationTemplates,
  model3d: modelTemplates,
};

export default function Templates() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('website');
  const [query, setQuery] = useState('');
  const [notice, setNotice] = useState('');

  const filteredTemplates = useMemo(() => {
    const term = query.trim().toLowerCase();
    return (templateSets[activeTab] || []).filter((template) => {
      if (!term) return true;
      return [template.name, template.category, template.description].filter(Boolean).some((value) => String(value).toLowerCase().includes(term));
    });
  }, [activeTab, query]);

  const createWebsiteProject = (template, mode = 'edit') => {
    const pages = rekeyTree(template.pages);
    const homePage = pages.find((page) => page.isHome) || pages[0];
    const project = projectStorage.createProject({
      name: `${template.name} Website`,
      slug: slugify(template.name),
      type: 'website',
      category: template.category,
      businessDetails: {
        websiteName: `${template.name} Website`,
        businessCategory: template.category,
        brandStyle: template.name,
      },
      theme: template.theme,
      pages,
      currentPageId: homePage?.id,
      sections: homePage?.sections || [],
      seo: aiMockService.generateSEO({ name: template.name, category: template.category }),
      settings: { templateId: template.id, templateName: template.name },
    });
    navigate(mode === 'preview' ? `/preview/${project.id}` : `/builder/website/${project.id}`);
  };

  const handleUseTemplate = (template) => {
    if (activeTab === 'website') {
      createWebsiteProject(template, 'edit');
      return;
    }

    const route = tabs.find((tab) => tab.id === activeTab)?.route || '/dashboard';
    window.localStorage.setItem('shopcraft_last_template_action', JSON.stringify({ type: activeTab, template }));
    setNotice(`${template.name} is saved as the selected ${activeTab} starter. Opening the matching studio.`);
    navigate(route);
  };

  const handlePreviewTemplate = (template) => {
    if (activeTab === 'website') {
      createWebsiteProject(template, 'preview');
      return;
    }
    setNotice(`${template.name} preview is ready as a structured placeholder for this studio.`);
  };

  return (
    <div className="mx-auto max-w-7xl p-8">
      <header className="mb-12">
        <h1 className="mb-4 text-4xl font-bold text-white">Template Library</h1>
        <p className="text-gray-400">Choose a professional starter and open it in the right workspace.</p>
      </header>

      <div className="mb-8 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div className="flex rounded-xl border border-gray-700 bg-gray-800 p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => { setActiveTab(tab.id); setNotice(''); }}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all ${
                  activeTab === tab.id ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search templates..."
            className="w-full rounded-xl border border-gray-700 bg-gray-800 py-2 pl-10 pr-4 text-white outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {notice && (
        <div className="mb-6 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 px-5 py-4 text-sm font-bold text-indigo-100">
          {notice}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template) => (
          <article key={template.id} className="group overflow-hidden rounded-2xl border border-gray-700 bg-gray-800 transition-all hover:border-primary">
            <div className="relative aspect-video overflow-hidden bg-gray-900">
              <img src={template.thumbnail} alt={template.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
              <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                <button type="button" onClick={() => handleUseTemplate(template)} className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-xs font-black uppercase tracking-widest text-white">
                  <Wand2 size={15} />
                  Use
                </button>
                <button type="button" onClick={() => handlePreviewTemplate(template)} className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-white backdrop-blur-md hover:bg-white/20">
                  <Eye size={15} />
                  Preview
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between gap-3">
                <h4 className="font-bold text-white">{template.name}</h4>
                <span className="rounded bg-gray-900 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-500">{template.category}</span>
              </div>
              {template.description && <p className="mt-2 line-clamp-2 text-sm text-gray-400">{template.description}</p>}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

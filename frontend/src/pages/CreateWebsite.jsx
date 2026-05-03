import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bot, FilePlus2, LayoutTemplate, Sparkles, Upload } from 'lucide-react';
import { websiteCategories, websiteTemplates } from '../data/websiteTemplates';
import { getThemePreset } from '../data/themePresets';
import { aiMockService } from '../services/aiMockService';
import { projectStorage } from '../services/projectStorage';
import { rekeyTree } from '../utils/ids';
import { slugify } from '../utils/slugify';

const detailFields = [
  ['websiteName', 'Website name'],
  ['businessName', 'Business name'],
  ['businessCategory', 'Business category'],
  ['mainServices', 'Main services/products'],
  ['targetAudience', 'Target audience'],
  ['location', 'Location'],
  ['brandStyle', 'Brand style'],
  ['colorPreference', 'Color preference'],
  ['pagesNeeded', 'Pages needed'],
  ['contactNumber', 'Contact number'],
  ['email', 'Email'],
  ['socialLinks', 'Social links'],
  ['websiteGoal', 'Website goal'],
];

const methods = [
  { id: 'ai', label: 'Start with AI', icon: Bot, description: 'Generate a complete starter website from your details.' },
  { id: 'template', label: 'Start with Template', icon: LayoutTemplate, description: 'Choose a professionally structured template.' },
  { id: 'blank', label: 'Start Blank', icon: FilePlus2, description: 'Open the builder with clean starter pages.' },
  { id: 'import', label: 'Import Existing Layout', icon: Upload, description: 'Create a project with an import placeholder.' },
];

export default function CreateWebsite() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState('business');
  const [details, setDetails] = useState({
    websiteName: '',
    businessName: '',
    businessCategory: '',
    mainServices: '',
    targetAudience: '',
    location: '',
    brandStyle: 'Modern premium',
    colorPreference: '',
    pagesNeeded: 'Home, About, Services, Contact',
    contactNumber: '',
    email: '',
    socialLinks: '',
    websiteGoal: 'Generate leads',
  });
  const [method, setMethod] = useState('ai');
  const [templateId, setTemplateId] = useState('');
  const [notice, setNotice] = useState('');

  const matchingTemplates = useMemo(() => {
    const matches = websiteTemplates.filter((template) => template.category === category);
    return matches.length ? matches : websiteTemplates;
  }, [category]);

  const updateDetail = (key, value) => setDetails((current) => ({ ...current, [key]: value }));

  const buildProjectData = () => {
    const name = details.websiteName || details.businessName || `${websiteCategories.find((item) => item.id === category)?.name || 'Custom'} Website`;
    const base = {
      name,
      slug: slugify(name),
      type: 'website',
      category,
      businessDetails: { ...details, websiteName: name, businessCategory: details.businessCategory || category },
      theme: getThemePreset('modern-dark'),
      pages: undefined,
      sections: undefined,
      currentPageId: undefined,
      assets: [],
      seo: aiMockService.generateSEO({ name, businessDetails: details, category }),
      animations: [],
      published: false,
      publishedAt: null,
    };

    if (method === 'ai') {
      const generated = aiMockService.generateWebsite({ ...details, websiteName: name, businessCategory: category });
      const pages = rekeyTree(generated.pages);
      return { ...base, theme: generated.theme, pages, currentPageId: pages[0].id, sections: pages[0].sections, seo: generated.seo };
    }

    if (method === 'template') {
      const selected = websiteTemplates.find((template) => template.id === templateId) || matchingTemplates[0];
      const pages = rekeyTree(selected.pages);
      return { ...base, theme: selected.theme, pages, currentPageId: pages[0].id, sections: pages[0].sections };
    }

    if (method === 'import') {
      return { ...base, settings: { importPlaceholder: true, importSource: 'pending' } };
    }

    return base;
  };

  const createProject = () => {
    const project = projectStorage.createProject(buildProjectData());
    navigate(`/builder/website/${project.id}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-6xl">
        <button type="button" onClick={() => (step === 1 ? navigate('/dashboard') : setStep((value) => value - 1))} className="mb-8 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white">
          <ArrowLeft size={17} />
          {step === 1 ? 'Back to dashboard' : 'Back'}
        </button>

        <div className="mb-10">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-400">Website creation flow</p>
          <h1 className="mt-2 text-4xl font-black uppercase tracking-tight">Create a Website</h1>
          <div className="mt-6 grid grid-cols-3 gap-2">
            {[1, 2, 3].map((item) => <span key={item} className={`h-1 rounded-full ${step >= item ? 'bg-indigo-500' : 'bg-slate-800'}`} />)}
          </div>
        </div>

        {step === 1 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {websiteCategories.map((item) => (
              <button key={item.id} type="button" onClick={() => { setCategory(item.id); updateDetail('businessCategory', item.name); }} className={`rounded-3xl border p-6 text-left transition-all ${category === item.id ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 bg-slate-900 hover:border-indigo-500/60'}`}>
                <Sparkles size={22} className="mb-8 text-indigo-300" />
                <p className="text-sm font-black uppercase tracking-widest">{item.name}</p>
              </button>
            ))}
            <button type="button" onClick={() => setStep(2)} className="rounded-3xl bg-indigo-600 p-6 text-left text-sm font-black uppercase tracking-widest hover:bg-indigo-500">
              Continue to details
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {detailFields.map(([key, label]) => (
                <label key={key} className={key === 'websiteGoal' || key === 'mainServices' ? 'md:col-span-2' : ''}>
                  <span className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</span>
                  <textarea
                    rows={key === 'websiteGoal' || key === 'mainServices' ? 3 : 1}
                    value={details[key]}
                    onChange={(event) => updateDetail(key, event.target.value)}
                    className="w-full resize-none rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                  />
                </label>
              ))}
            </div>
            <button type="button" onClick={() => setStep(3)} className="mt-6 rounded-2xl bg-indigo-600 px-6 py-4 text-xs font-black uppercase tracking-widest hover:bg-indigo-500">
              Choose starting method
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="space-y-4">
              {methods.map((item) => {
                const Icon = item.icon;
                return (
                  <button key={item.id} type="button" onClick={() => { setMethod(item.id); if (item.id === 'import') setNotice('Import is a working placeholder. The project will open with import settings saved.'); }} className={`w-full rounded-3xl border p-5 text-left ${method === item.id ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 bg-slate-900 hover:border-indigo-500/60'}`}>
                    <Icon size={22} className="mb-4 text-indigo-300" />
                    <p className="text-sm font-black uppercase tracking-widest text-white">{item.label}</p>
                    <p className="mt-2 text-xs leading-5 text-slate-500">{item.description}</p>
                  </button>
                );
              })}
              {notice && <p className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-3 text-xs text-indigo-100">{notice}</p>}
            </div>

            <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-5">
              <h2 className="mb-4 text-lg font-black uppercase tracking-widest">Choose starter</h2>
              {method === 'template' ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {matchingTemplates.map((template) => (
                    <button key={template.id} type="button" onClick={() => setTemplateId(template.id)} className={`overflow-hidden rounded-2xl border text-left ${templateId === template.id ? 'border-indigo-500' : 'border-slate-800'}`}>
                      <img src={template.thumbnail} alt={template.name} className="h-36 w-full object-cover" />
                      <div className="p-3">
                        <p className="text-xs font-black uppercase tracking-widest">{template.name}</p>
                        <p className="mt-1 text-[10px] uppercase tracking-widest text-slate-500">{template.category}</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-950 p-10 text-center">
                  <Sparkles size={42} className="mx-auto mb-5 text-indigo-300" />
                  <p className="text-xl font-black">{methods.find((item) => item.id === method)?.label}</p>
                  <p className="mt-2 text-sm text-slate-500">The builder will create a valid project object and open your editable canvas.</p>
                </div>
              )}
              <button type="button" onClick={createProject} className="mt-6 w-full rounded-2xl bg-indigo-600 px-6 py-4 text-xs font-black uppercase tracking-widest hover:bg-indigo-500">
                Create project and open builder
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

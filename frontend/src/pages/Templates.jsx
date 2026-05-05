import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TemplateFilters from '../components/templates/TemplateFilters';
import TemplateGrid from '../components/templates/TemplateGrid';
import TemplatePreviewModal from '../components/templates/TemplatePreviewModal';
import TemplateSearch from '../components/templates/TemplateSearch';
import TemplateTabs from '../components/templates/TemplateTabs';
import { templates, templateCounts } from '../data/templates';
import { createProjectFromTemplate } from '../utils/projectStorage';
import { projectStorage } from '../services/projectStorage';
import {
  filterTemplates,
  getTemplateCategories,
  getTemplateTags,
  getWorkspaceRoute,
  getTypeLabel,
} from '../utils/templateUtils';

const FAVORITES_KEY = 'shopcraft-template-favorites';

const readFavorites = () => {
  if (typeof window === 'undefined') return [];

  try {
    return JSON.parse(window.localStorage.getItem(FAVORITES_KEY) || '[]');
  } catch {
    return [];
  }
};

export default function Templates() {
  const navigate = useNavigate();
  const [activeType, setActiveType] = useState('website');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [tag, setTag] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [favorites, setFavorites] = useState(readFavorites);

  const categories = useMemo(() => getTemplateCategories(templates, activeType), [activeType]);
  const tags = useMemo(() => getTemplateTags(templates, activeType), [activeType]);

  const visibleTemplates = useMemo(
    () =>
      filterTemplates(templates, {
        type: activeType,
        query,
        category,
        tag,
        sortBy,
      }),
    [activeType, category, query, sortBy, tag]
  );

  const handleTabChange = (type) => {
    setActiveType(type);
    setCategory('');
    setTag('');
    setPreviewTemplate(null);
  };

  const handleFavorite = (template) => {
    const nextFavorites = favorites.includes(template.id)
      ? favorites.filter((id) => id !== template.id)
      : [...favorites, template.id];

    setFavorites(nextFavorites);
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(nextFavorites));
  };

  const handleUseTemplate = (template) => {
    let project;
    if (template.workspaceType === 'website-builder') {
      project = projectStorage.createProjectFromTemplate(template);
    } else {
      project = createProjectFromTemplate(template);
    }
    navigate(getWorkspaceRoute(project));
  };

  const isWebsiteTab = activeType === 'website';

  return (
    <div className="min-h-full bg-[#050816] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 rounded-3xl border border-slate-800 bg-slate-950/70 p-6 shadow-2xl shadow-black/20 md:p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <span className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-sm font-semibold text-cyan-200">
                Design layouts first, professions as filters
              </span>
              <h1 className="mt-5 text-4xl font-black text-white md:text-5xl">Template Library</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">
                Choose by layout and visual direction: minimal, luxury, SaaS, editorial, booking, storefront, dashboard, and more. Professions stay available as use-case filters.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:min-w-[520px]">
              {Object.entries(templateCounts).map(([type, count]) => (
                <div key={type} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                  <p className="text-2xl font-black text-white">{count}</p>
                  <p className="mt-1 text-sm text-slate-400">{getTypeLabel(type)}</p>
                </div>
              ))}
            </div>
          </div>
        </header>

        <div className="sticky top-0 z-30 mb-7 space-y-4 border-b border-slate-900 bg-[#050816]/95 pb-5 pt-1 backdrop-blur-xl">
          <TemplateTabs activeType={activeType} counts={templateCounts} onChange={handleTabChange} />
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_1.35fr]">
            <TemplateSearch value={query} onChange={setQuery} />
            <TemplateFilters
              categories={categories}
              tags={tags}
              category={category}
              tag={tag}
              sortBy={sortBy}
              categoryLabel={isWebsiteTab ? 'All design types' : 'All categories'}
              tagLabel={isWebsiteTab ? 'All suitable professions' : 'All tags'}
              onCategoryChange={setCategory}
              onTagChange={setTag}
              onSortChange={setSortBy}
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-400">
            <span>
              Showing <strong className="text-white">{visibleTemplates.length}</strong>{' '}
              {isWebsiteTab ? 'website design layouts' : `${getTypeLabel(activeType).toLowerCase()} templates`}
            </span>
            <span>
              {isWebsiteTab
                ? 'Search covers design name, design type, suitable professions, tags, sections, and description.'
                : 'Search covers title, category, tags, description, and type.'}
            </span>
          </div>
        </div>

        <TemplateGrid
          templates={visibleTemplates}
          favorites={favorites}
          onFavorite={handleFavorite}
          onPreview={setPreviewTemplate}
          onUse={handleUseTemplate}
        />
      </div>

      <TemplatePreviewModal
        template={previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        onUse={handleUseTemplate}
      />
    </div>
  );
}

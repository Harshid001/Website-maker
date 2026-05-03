import React from 'react';
import { useBuilderStore } from '../../../store/builderStore';
import { MiniButton, PropertyGroup, TextArea, TextInput } from './PropertyControls';

export default function SEOProperties() {
  const { project, updateProjectSEO, generateSEO, showToast } = useBuilderStore();
  const seo = project?.seo || {};

  return (
    <PropertyGroup title="SEO Optimization">
      <TextInput label="Meta title" value={seo.metaTitle || ''} onChange={(value) => updateProjectSEO({ metaTitle: value })} />
      <TextArea label="Meta description" value={seo.metaDescription || ''} onChange={(value) => updateProjectSEO({ metaDescription: value })} />
      <TextInput label="Keywords" value={Array.isArray(seo.keywords) ? seo.keywords.join(', ') : seo.keywords || ''} onChange={(value) => updateProjectSEO({ keywords: value })} />
      <TextInput label="Slug" value={seo.slug || project?.slug || ''} onChange={(value) => updateProjectSEO({ slug: value })} />
      <TextInput label="Open Graph title" value={seo.ogTitle || ''} onChange={(value) => updateProjectSEO({ ogTitle: value })} />
      <TextInput label="Open Graph image" value={seo.ogImage || ''} onChange={(value) => updateProjectSEO({ ogImage: value })} />
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">SEO score</p>
        <p className="mt-1 text-3xl font-black text-emerald-300">{seo.score || 72}</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <MiniButton onClick={generateSEO}>Generate SEO</MiniButton>
        <MiniButton onClick={() => showToast('Image alt text and schema placeholders prepared.')}>Schema</MiniButton>
      </div>
    </PropertyGroup>
  );
}

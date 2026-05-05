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
      <TextInput label="Canonical URL" value={seo.canonical || ''} onChange={(value) => updateProjectSEO({ canonical: value })} placeholder="https://yoursite.com" />
      <TextInput label="Robots directive" value={seo.robots || ''} onChange={(value) => updateProjectSEO({ robots: value })} placeholder="index, follow" />

      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">SEO score</p>
        <div className="mt-2 flex items-end gap-3">
          <p className="text-3xl font-black text-emerald-300">{seo.score || 72}</p>
          <p className="mb-1 text-[9px] leading-4 text-slate-500">/ 100 — {(seo.score || 72) >= 80 ? 'Great! Your SEO is strong.' : (seo.score || 72) >= 60 ? 'Good, but room for improvement.' : 'Needs attention. Fill in missing meta tags.'}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <MiniButton onClick={generateSEO}>AI Generate SEO</MiniButton>
        <MiniButton onClick={() => showToast('Schema markup: Structured data (JSON-LD) will be auto-generated during publish based on page type and content.')}>Schema markup</MiniButton>
        <MiniButton onClick={() => showToast('Sitemap: An XML sitemap is automatically generated during the publish build, listing all pages and their slugs.')}>Generate sitemap</MiniButton>
        <MiniButton onClick={() => showToast('robots.txt: A robots.txt file is auto-generated during publish. Default allows all crawlers. Customize via Settings → SEO Settings.')}>Generate robots.txt</MiniButton>
        <MiniButton onClick={() => showToast('Alt Text AI: Select an image element first, then use this to auto-generate descriptive alt text based on image content.')}>Image alt text AI</MiniButton>
        <MiniButton onClick={() => showToast('Social preview: Your Open Graph tags (title + image) will appear in social media shares. Fill in OG title and OG image above.')}>Social preview</MiniButton>
      </div>
    </PropertyGroup>
  );
}

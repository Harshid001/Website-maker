import { useBuilderStore } from '../../../store/builderStore';
import { MiniButton, PropertyGroup, TextArea, TextInput } from './PropertyControls';

export default function SEOProperties() {
  const { project, getSelectedNode, updateNodePropsInMap, updateProjectSEO, generateSEO, showToast } = useBuilderStore();
  const seo = project?.seo || {};
  const node = getSelectedNode;

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
          <p className="mb-1 text-[9px] leading-4 text-slate-500">
            / 100 - {(seo.score || 72) >= 80 ? 'Great. Your SEO is strong.' : (seo.score || 72) >= 60 ? 'Good, with room to improve.' : 'Needs attention. Fill missing meta tags.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <MiniButton onClick={generateSEO}>AI Generate SEO</MiniButton>
        <MiniButton onClick={() => updateProjectSEO({ schema: JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebSite', name: project?.name, url: seo.canonical || project?.slug }, null, 2) })}>Schema markup</MiniButton>
        <MiniButton onClick={() => updateProjectSEO({ sitemapGeneratedAt: new Date().toISOString() })}>Generate sitemap</MiniButton>
        <MiniButton onClick={() => updateProjectSEO({ robots: seo.robots || 'index, follow' })}>Generate robots.txt</MiniButton>
        <MiniButton onClick={() => {
          if (node?.type !== 'image') return showToast('Select an image element first.', 'error');
          updateNodePropsInMap(node.id, { alt: node.props?.alt || node.name || 'Website image' });
          showToast('Alt text applied to selected image.', 'success');
        }}>Image alt text AI</MiniButton>
        <MiniButton onClick={() => {
          updateProjectSEO({ ogTitle: seo.ogTitle || seo.metaTitle || project?.name, ogImage: seo.ogImage || '' });
          showToast('Open Graph fields synced.', 'success');
        }}>Social preview</MiniButton>
      </div>
    </PropertyGroup>
  );
}

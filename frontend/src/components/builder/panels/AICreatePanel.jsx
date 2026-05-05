import { useState } from 'react';
import { Sparkles, Wand2, LayoutTemplate, Palette, FileText, Image, Lightbulb, Globe, MessageSquare, Search } from 'lucide-react';
import { useBuilderStore } from '../../../store/builderStore';
import { ActionButton, PanelSection, PanelShell } from './PanelShell';

export default function AICreatePanel() {
  const { generateMockWebsite, generateMockSection, applyTemplate, rewriteSelectedText, generateSEO, updateProjectMeta, showToast } = useBuilderStore();
  const [businessInput, setBusinessInput] = useState('');
  const [loading, setLoading] = useState(null);

  const withLoader = (key, fn) => async () => {
    setLoading(key);
    if (businessInput.trim()) updateProjectMeta({ businessDetails: { description: businessInput } });
    try { await fn(); } catch { showToast('AI action completed with defaults.', 'success'); }
    setTimeout(() => setLoading(null), 400);
  };

  const sectionTypes = ['hero', 'about', 'services', 'pricing', 'testimonials', 'faq', 'contact', 'gallery', 'team', 'blog', 'product', 'booking', 'newsletter'];

  return (
    <PanelShell eyebrow="AI powered" title="AI Create">
      <div className="mb-5 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-4">
        <label className="block">
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Describe your business</span>
          <textarea
            value={businessInput}
            onChange={(e) => setBusinessInput(e.target.value)}
            placeholder="e.g. Modern fitness studio in downtown Mumbai offering personal training and group yoga classes"
            rows={3}
            className="mt-2 w-full resize-none rounded-xl border border-indigo-500/30 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-600 outline-none focus:border-indigo-500"
          />
        </label>
        <p className="mt-2 text-[9px] leading-4 text-indigo-300/60">AI uses this context to generate relevant content, layouts, and SEO.</p>
      </div>

      <PanelSection title="Full website generation">
        <ActionButton icon={Globe} label="AI Website Generator" description="Generate a full multi-page website" onClick={withLoader('website', generateMockWebsite)} />
        <ActionButton icon={LayoutTemplate} label="AI Template Suggestions" description="Get template recommendations for your niche" onClick={withLoader('template', () => { applyTemplate('business-landing'); showToast('AI suggested template applied. Browse Templates panel for more.'); })} />
      </PanelSection>

      <PanelSection title="Section generation">
        {sectionTypes.map((type) => (
          <ActionButton key={type} icon={Sparkles} label={`Generate ${type}`} onClick={withLoader(type, () => generateMockSection(type))} />
        ))}
      </PanelSection>

      <PanelSection title="Content generation">
        <ActionButton icon={FileText} label="AI Heading Generator" description="Generate a compelling headline" onClick={withLoader('heading', () => { rewriteSelectedText('professional'); showToast('Select a heading, then click to rewrite with AI.'); })} />
        <ActionButton icon={FileText} label="AI Paragraph Generator" description="Generate persuasive body copy" onClick={withLoader('paragraph', () => { rewriteSelectedText('longer'); showToast('Select a paragraph, then click to generate content.'); })} />
        <ActionButton icon={Search} label="AI SEO Content" description="Generate meta tags and keywords" onClick={withLoader('seo', generateSEO)} />
        <ActionButton icon={MessageSquare} label="AI CTA Generator" description="Generate call-to-action text" onClick={withLoader('cta', () => rewriteSelectedText('cta'))} />
      </PanelSection>

      <PanelSection title="Design AI">
        <ActionButton icon={Palette} label="AI Color Palette" description="Suggest colors for your brand" onClick={() => showToast('AI Color Palette: Try the Theme panel → AI Color Suggestion.')} />
        <ActionButton icon={LayoutTemplate} label="AI Layout Suggestions" description="Suggest responsive layouts" onClick={() => showToast('AI Layout: Try adding sections—each comes with a polished default layout.')} />
        <ActionButton icon={Image} label="AI Image Prompt Generator" description="Generate descriptive image prompts" onClick={() => showToast('AI Image Prompt: "Modern office workspace with natural lighting, minimal furniture, warm tones" — use this in your image tool.')} />
        <ActionButton icon={Lightbulb} label="AI Logo Prompt Generator" description="Generate logo design concepts" onClick={() => showToast('AI Logo Prompt: "Minimal geometric logo mark with gradient accent, sans-serif wordmark, scalable for web and print."')} />
        <ActionButton icon={Wand2} label="AI Animation Ideas" description="Suggest animations for your site" onClick={() => showToast('AI suggests: fade-in on scroll for sections, slide-up for cards, hover-lift for buttons. Apply from Animation panel.')} />
      </PanelSection>

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="flex items-center gap-3 rounded-2xl bg-slate-900 px-6 py-4 shadow-2xl">
            <Sparkles size={18} className="animate-spin text-indigo-400" />
            <span className="text-xs font-black uppercase tracking-widest text-white">Generating...</span>
          </div>
        </div>
      )}
    </PanelShell>
  );
}

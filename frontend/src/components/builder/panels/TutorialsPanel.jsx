import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronRight, BookOpen } from 'lucide-react';
import { PanelShell } from './PanelShell';

const tutorials = [
  { title: 'Builder Walkthrough', content: 'The builder has three zones: the left panel for adding content, the central canvas for layout, and the right panel for editing properties. Click any element to select it, then modify styles, content, and behavior from the right panel. Use keyboard shortcuts like Ctrl+Z to undo and Ctrl+S to save.' },
  { title: 'Website Creation Guide', content: 'Start by choosing a template or building from scratch. Add a Navbar section first, then a Hero with your headline and CTA. Build out About, Services, and Contact sections. Each section comes with editable pre-built elements. Set your page slug and SEO before publishing.' },
  { title: 'Template Editing Guide', content: 'Templates provide a full page structure. After applying a template, click any text to edit it directly on canvas (double-click). Change colors and fonts from the Theme panel. Replace images from the Media panel or right-click any image. Templates include Home, About, and Contact pages by default.' },
  { title: 'SEO Guide', content: 'Open the SEO Properties section in the right panel (visible when no element is selected). Set your meta title (50-60 chars), meta description (150-160 chars), and target keywords. Use the AI SEO generator for quick suggestions. Add Open Graph tags for social sharing. Check the SEO score indicator for optimization feedback.' },
  { title: 'Publishing Guide', content: 'Click "Publish" in the top bar to generate a live site. Your site gets a URL based on the project slug. Before publishing, verify all pages, check responsive previews on tablet and mobile, and ensure all form endpoints are configured. The publish pipeline generates clean HTML/CSS from your node tree.' },
  { title: 'Domain Connection Guide', content: 'After publishing, go to Settings → Publishing Settings to connect a custom domain. Add a CNAME record pointing to the provided URL, or use an A record for root domains. SSL certificates are provisioned automatically. DNS propagation typically takes 24-48 hours.' },
  { title: '2D Design Guide', content: 'Use the 2D Design panel to create marketing assets like posters, social media graphics, and banners. Select a tool to see the canvas at the correct dimensions. Add text, shapes, and gradients, then export as PNG, JPG, or PDF. The canvas uses Fabric.js for advanced editing when fully integrated.' },
  { title: '3D Visual Guide', content: 'Insert 3D elements from the 3D panel. Each element uses Three.js under the hood. Choose materials (matte, glossy, metallic) and lighting presets (studio, dramatic, sunset). Upload GLB/GLTF models for custom 3D objects. The 3D viewer supports rotation, zoom, and camera angle adjustments.' },
  { title: 'Animation Guide', content: 'Select any element on the canvas, then choose an animation from the Animation panel. Configure duration, delay, and easing. Animations trigger on scroll (viewport entry), hover (mouse interaction), or page load. Use parallax for depth effects and text-reveal for headlines. Animations export as CSS @keyframes in the published site.' },
  { title: 'AI Assistant Guide', content: 'The AI panel generates content based on your business description. Enter your business details at the top, then use section generators, content writers, and SEO tools. AI can rewrite selected text in different tones (professional, shorter, longer, CTA). All AI features work with mock data locally and connect to the backend AI service when available.' },
];

export default function TutorialsPanel() {
  const [openId, setOpenId] = useState(0);

  return (
    <PanelShell eyebrow="Help" title="Tutorials">
      <div className="mb-4 rounded-2xl bg-indigo-500/10 p-4">
        <div className="flex items-center gap-2">
          <BookOpen size={16} className="text-indigo-300" />
          <p className="text-xs font-black uppercase tracking-widest text-white">Quick Start</p>
        </div>
        <p className="mt-2 text-[10px] leading-5 text-indigo-200/70">
          Use the left panel to add content. Select items on canvas. Edit in the right panel. Save with Ctrl+S. Preview with the eye icon.
        </p>
      </div>

      <div className="space-y-2">
        {tutorials.map((tutorial, index) => (
          <div key={tutorial.title} className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden">
            <button
              type="button"
              onClick={() => setOpenId(openId === index ? -1 : index)}
              className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-slate-900"
            >
              {openId === index ? <ChevronDown size={14} className="shrink-0 text-indigo-400" /> : <ChevronRight size={14} className="shrink-0 text-slate-500" />}
              <HelpCircle size={14} className={`shrink-0 ${openId === index ? 'text-indigo-300' : 'text-slate-600'}`} />
              <span className={`text-xs font-black uppercase tracking-widest ${openId === index ? 'text-white' : 'text-slate-400'}`}>{tutorial.title}</span>
            </button>
            {openId === index && (
              <div className="border-t border-slate-800 px-4 pb-4 pt-3">
                <p className="text-[11px] leading-5 text-slate-400">{tutorial.content}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </PanelShell>
  );
}

import { rekeyTree } from '../utils/ids';
import { getSectionBlueprint } from '../data/sectionBlocks';
import { getThemePreset } from '../data/themePresets';
import { slugify } from '../utils/slugify';

const businessLabel = (details = {}) =>
  details.businessName || details.websiteName || details.name || 'Your Brand';

export const generateSection = (type = 'hero', businessDetails = {}) => {
  const label = businessLabel(businessDetails);
  const section = rekeyTree(getSectionBlueprint(type));
  const heading = section.elements?.find((element) => element.type === 'heading');
  const paragraph = section.elements?.find((element) => element.type === 'paragraph');
  const button = section.elements?.find((element) => element.type === 'button');

  if (heading) heading.content = section.type === 'hero' ? `${label} that customers remember.` : `${label} ${section.name.replace('Section', '').trim()}`;
  if (paragraph) {
    paragraph.content = `AI drafted copy for ${label}, focused on ${businessDetails.websiteGoal || 'clear offers, trust, and faster conversions'}.`;
  }
  if (button) button.content = 'Book a Call';

  return section;
};

export const generateWebsite = (businessDetails = {}) => {
  const label = businessLabel(businessDetails);
  return {
    name: businessDetails.websiteName || label,
    theme: getThemePreset('startup-gradient'),
    seo: generateSEO({ name: label, businessDetails }),
    pages: [
      {
        id: 'ai-home',
        name: 'Home',
        slug: 'home',
        isHome: true,
        sections: ['hero', 'services', 'about', 'pricing', 'faq', 'contact', 'footer'].map((type) => generateSection(type, businessDetails)),
      },
    ],
  };
};

export const generateSEO = (project = {}) => {
  const details = project.businessDetails || project;
  const label = businessLabel(details) || project.name || 'Website';
  const category = details.businessCategory || project.category || 'website';
  const location = details.location ? ` in ${details.location}` : '';
  return {
    metaTitle: `${label} | ${category}${location}`,
    metaDescription: `${label} helps ${details.targetAudience || 'customers'} with ${details.mainServices || 'professional services'}${location}.`,
    keywords: [label, category, details.location, details.mainServices].filter(Boolean).join(', '),
    slug: slugify(label),
    ogTitle: `${label} - ${category}`,
    ogImage: project.seo?.ogImage || '',
    score: 91,
    schema: JSON.stringify({ '@type': 'LocalBusiness', name: label, address: details.location || '' }, null, 2),
  };
};

export const generateColorPalette = (category = 'business') => {
  const paletteByCategory = {
    restaurant: ['#b45309', '#991b1b', '#fff7ed', '#1f2937'],
    fitness: ['#ef4444', '#f97316', '#111827', '#facc15'],
    healthcare: ['#2563eb', '#14b8a6', '#ffffff', '#0f172a'],
    photography: ['#050505', '#d4af37', '#fffaf0', '#a1a1aa'],
    business: ['#2563eb', '#7c3aed', '#ffffff', '#0f172a'],
  };
  return paletteByCategory[category] || paletteByCategory.business;
};

export const generateFontPairing = (category = 'business') => {
  if (['restaurant', 'photography'].includes(category)) {
    return { heading: 'Georgia', body: 'Inter' };
  }
  return { heading: 'Inter', body: 'Inter' };
};

export const rewriteText = (text = '', tone = 'professional') => {
  if (!text.trim()) return 'Add clear, confident copy that helps visitors understand the next step.';
  const trimmed = text.trim().replace(/\s+/g, ' ');
  const variants = {
    professional: `Professional version: ${trimmed}`,
    shorter: trimmed.length > 90 ? `${trimmed.slice(0, 86)}...` : trimmed,
    longer: `${trimmed} This gives visitors more context, builds trust, and points them toward the next action.`,
    cta: 'Start your project today',
  };
  return variants[tone] || variants.professional;
};

export const suggestAnimations = () => [
  { type: 'fade-in', duration: 650, delay: 0, easing: 'ease-out', trigger: 'scroll' },
  { type: 'slide-up', duration: 700, delay: 80, easing: 'ease-out', trigger: 'scroll' },
  { type: 'button-glow', duration: 900, delay: 0, easing: 'ease-in-out', trigger: 'hover' },
];

export const generateBrandKit = (businessDetails = {}) => ({
  palette: generateColorPalette(businessDetails.businessCategory),
  fonts: generateFontPairing(businessDetails.businessCategory),
  voice: 'Clear, premium, helpful, and action-oriented.',
  logoPrompt: `Minimal logo mark for ${businessLabel(businessDetails)} with a premium digital feel.`,
});

export const aiMockService = {
  generateWebsite,
  generateSection,
  generateSEO,
  generateColorPalette,
  generateFontPairing,
  rewriteText,
  suggestAnimations,
  generateBrandKit,
};

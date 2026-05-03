import { elementPresets } from './elementPresets';

const heroImage = 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1100&auto=format&fit=crop';

const sectionBase = {
  styles: {
    padding: '88px 64px',
    backgroundColor: '#ffffff',
    color: '#0f172a',
  },
  animation: { type: 'none', duration: 600, delay: 0, easing: 'ease-out', trigger: 'load' },
  elements: [],
};

const withElement = (preset, overrides = {}) => ({
  ...preset,
  ...overrides,
  styles: { ...(preset.styles || {}), ...(overrides.styles || {}) },
  props: { ...(preset.props || {}), ...(overrides.props || {}) },
});

export const sectionBlueprints = {
  navbar: {
    ...sectionBase,
    id: 'section-navbar',
    type: 'navbar',
    name: 'Navbar',
    preview: 'A website navigation bar with editable logo and links.',
    styles: {
      ...sectionBase.styles,
      padding: '22px 64px',
      minHeight: '88px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid rgba(148, 163, 184, 0.22)',
    },
    elements: [
      withElement(elementPresets.heading, { id: 'navbar-logo', content: 'Brand', styles: { fontSize: '24px', marginBottom: '0' } }),
      withElement(elementPresets.button, { id: 'navbar-home', content: 'Home', styles: { backgroundColor: 'transparent', color: '#0f172a', padding: '10px 14px' } }),
      withElement(elementPresets.button, { id: 'navbar-services', content: 'Services', styles: { backgroundColor: 'transparent', color: '#0f172a', padding: '10px 14px' } }),
      withElement(elementPresets.button, { id: 'navbar-contact', content: 'Contact', styles: { backgroundColor: '#0f172a', color: '#ffffff', padding: '10px 16px' } }),
    ],
  },
  hero: {
    ...sectionBase,
    id: 'section-hero',
    type: 'hero',
    name: 'Hero Section',
    preview: 'Headline, supporting copy, CTA, and visual.',
    styles: {
      ...sectionBase.styles,
      display: 'grid',
      gridTemplateColumns: '1.05fr 0.95fr',
      alignItems: 'center',
      gap: '48px',
      minHeight: '640px',
    },
    elements: [
      withElement(elementPresets.heading, {
        id: 'hero-heading',
        content: 'Build a brand-ready website in minutes.',
        styles: { fontSize: '60px', maxWidth: '720px' },
      }),
      withElement(elementPresets.paragraph, {
        id: 'hero-copy',
        content: 'Launch a polished website with editable sections, responsive previews, AI helpers, templates, and clean publishing.',
      }),
      withElement(elementPresets.button, { id: 'hero-button', content: 'Start Designing' }),
      withElement(elementPresets.image, {
        id: 'hero-image',
        props: { src: heroImage, alt: 'Website design workspace' },
        styles: { minHeight: '380px', width: '100%' },
      }),
    ],
  },
  about: {
    ...sectionBase,
    id: 'section-about',
    type: 'about',
    name: 'About Section',
    preview: 'Credibility copy and supporting details.',
    styles: { ...sectionBase.styles, backgroundColor: '#f8fafc' },
    elements: [
      withElement(elementPresets.heading, { id: 'about-heading', content: 'A focused story customers understand fast.', styles: { fontSize: '42px' } }),
      withElement(elementPresets.paragraph, { id: 'about-copy', content: 'Explain your purpose, what makes you different, and why people should choose you. Keep the message clear, useful, and human.' }),
      withElement(elementPresets.card, { id: 'about-card', content: { title: 'Why it works', body: 'Strong positioning, clear navigation, and reusable sections make the site easy to grow.' } }),
    ],
  },
  services: {
    ...sectionBase,
    id: 'section-services',
    type: 'services',
    name: 'Services Section',
    preview: 'Three service cards with benefits.',
    elements: [
      withElement(elementPresets.heading, { id: 'services-heading', content: 'Services built around your goals.', styles: { fontSize: '42px' } }),
      withElement(elementPresets.paragraph, { id: 'services-copy', content: 'Show the offers that matter most and make the next step obvious.' }),
      withElement(elementPresets.card, { id: 'service-card-1', content: { title: 'Strategy', body: 'Clarify the message, audience, and conversion path.' } }),
      withElement(elementPresets.card, { id: 'service-card-2', content: { title: 'Design', body: 'Create a visual system with consistent sections and reusable components.' } }),
      withElement(elementPresets.card, { id: 'service-card-3', content: { title: 'Launch', body: 'Preview, publish, and iterate with confidence.' } }),
    ],
  },
  pricing: {
    ...sectionBase,
    id: 'section-pricing',
    type: 'pricing',
    name: 'Pricing Section',
    preview: 'Pricing cards for plans or offers.',
    styles: { ...sectionBase.styles, backgroundColor: '#f8fafc' },
    elements: [
      withElement(elementPresets.heading, { id: 'pricing-heading', content: 'Simple plans for every stage.', styles: { fontSize: '42px' } }),
      withElement(elementPresets.pricingCard, { id: 'pricing-basic', content: { title: 'Starter', price: '$49', body: 'Perfect for a lean launch.' } }),
      withElement(elementPresets.pricingCard, { id: 'pricing-growth', content: { title: 'Growth', price: '$99', body: 'More sections, SEO, and conversion polish.' } }),
      withElement(elementPresets.pricingCard, { id: 'pricing-pro', content: { title: 'Scale', price: '$199', body: 'Advanced pages, integrations, and analytics.' } }),
    ],
  },
  testimonials: {
    ...sectionBase,
    id: 'section-testimonials',
    type: 'testimonials',
    name: 'Testimonials Section',
    preview: 'Customer quotes and trust signals.',
    elements: [
      withElement(elementPresets.heading, { id: 'testimonials-heading', content: 'Trusted by teams who move fast.', styles: { fontSize: '42px' } }),
      withElement(elementPresets.testimonialCard, { id: 'testimonial-1', content: { quote: 'The builder made our launch feel simple and polished.', author: 'Aarav Mehta' } }),
      withElement(elementPresets.testimonialCard, { id: 'testimonial-2', content: { quote: 'We could update sections, copy, and colors without waiting on developers.', author: 'Nisha Rao' } }),
    ],
  },
  faq: {
    ...sectionBase,
    id: 'section-faq',
    type: 'faq',
    name: 'FAQ Section',
    preview: 'Answers to common customer questions.',
    styles: { ...sectionBase.styles, backgroundColor: '#f8fafc' },
    elements: [
      withElement(elementPresets.heading, { id: 'faq-heading', content: 'Questions, answered.', styles: { fontSize: '42px' } }),
      withElement(elementPresets.card, { id: 'faq-1', content: { title: 'Can I edit everything?', body: 'Yes. Select sections or elements, then use the right panel to update content, layout, style, SEO, and responsive settings.' } }),
      withElement(elementPresets.card, { id: 'faq-2', content: { title: 'Can I publish?', body: 'Publish creates a clean site route from the saved project data.' } }),
    ],
  },
  contact: {
    ...sectionBase,
    id: 'section-contact',
    type: 'contact',
    name: 'Contact Section',
    preview: 'Lead capture form and business details.',
    elements: [
      withElement(elementPresets.heading, { id: 'contact-heading', content: 'Let us build something useful.', styles: { fontSize: '42px' } }),
      withElement(elementPresets.paragraph, { id: 'contact-copy', content: 'Tell visitors how to reach you and what happens after they submit the form.' }),
      withElement(elementPresets.form, { id: 'contact-form' }),
    ],
  },
  footer: {
    ...sectionBase,
    id: 'section-footer',
    type: 'footer',
    name: 'Footer Section',
    preview: 'Brand, links, and social proof.',
    styles: { ...sectionBase.styles, padding: '48px 64px', backgroundColor: '#0f172a', color: '#f8fafc' },
    elements: [
      withElement(elementPresets.heading, { id: 'footer-brand', content: 'ShopCraft Studio', styles: { fontSize: '28px', color: 'inherit' } }),
      withElement(elementPresets.paragraph, { id: 'footer-copy', content: 'Built with a no-code website maker.', styles: { color: 'inherit', opacity: '0.68' } }),
      withElement(elementPresets.socialLinks, { id: 'footer-social' }),
    ],
  },
  gallery: {
    ...sectionBase,
    id: 'section-gallery',
    type: 'gallery',
    name: 'Gallery Section',
    preview: 'Image grid for work, products, or venue photos.',
    elements: [
      withElement(elementPresets.heading, { id: 'gallery-heading', content: 'A closer look at the experience.', styles: { fontSize: '42px' } }),
      withElement(elementPresets.gallery, { id: 'gallery-grid' }),
    ],
  },
  team: {
    ...sectionBase,
    id: 'section-team',
    type: 'team',
    name: 'Team Section',
    preview: 'Profiles for people behind the brand.',
    styles: { ...sectionBase.styles, backgroundColor: '#f8fafc' },
    elements: [
      withElement(elementPresets.heading, { id: 'team-heading', content: 'Meet the team.', styles: { fontSize: '42px' } }),
      withElement(elementPresets.card, { id: 'team-card-1', content: { title: 'Creative Lead', body: 'Guides brand, content, and customer experience.' } }),
      withElement(elementPresets.card, { id: 'team-card-2', content: { title: 'Operations Lead', body: 'Keeps the work practical, reliable, and measurable.' } }),
    ],
  },
  blog: {
    ...sectionBase,
    id: 'section-blog',
    type: 'blog',
    name: 'Blog Section',
    preview: 'Article cards for updates and insights.',
    elements: [
      withElement(elementPresets.heading, { id: 'blog-heading', content: 'Latest insights.', styles: { fontSize: '42px' } }),
      withElement(elementPresets.card, { id: 'blog-card-1', content: { title: 'How to launch faster', body: 'A simple checklist for moving from idea to published website.' } }),
      withElement(elementPresets.card, { id: 'blog-card-2', content: { title: 'Better homepage copy', body: 'Make the offer clear before asking visitors to act.' } }),
    ],
  },
  product: {
    ...sectionBase,
    id: 'section-product',
    type: 'product',
    name: 'Product Grid',
    preview: 'Product cards for shops and services.',
    elements: [
      withElement(elementPresets.heading, { id: 'product-heading', content: 'Featured products.', styles: { fontSize: '42px' } }),
      withElement(elementPresets.productCard, { id: 'product-card-1', content: { title: 'Signature Kit', price: '$79', body: 'A ready-to-use bundle for your customers.' } }),
      withElement(elementPresets.productCard, { id: 'product-card-2', content: { title: 'Premium Kit', price: '$129', body: 'More value, better packaging, stronger positioning.' } }),
      withElement(elementPresets.productCard, { id: 'product-card-3', content: { title: 'Founder Kit', price: '$199', body: 'A complete package for a confident launch.' } }),
    ],
  },
  custom: {
    ...sectionBase,
    id: 'section-custom',
    type: 'custom',
    name: 'Custom Blank Section',
    preview: 'A clean blank section ready for manual layout.',
    styles: {
      ...sectionBase.styles,
      minHeight: '360px',
      border: '1px dashed rgba(99, 102, 241, 0.28)',
    },
    elements: [],
  },
};

export const sectionBlocks = [
  { id: 'block-navbar', type: 'navbar', name: 'Navbar', category: 'Navigation sections', preview: sectionBlueprints.navbar.preview, section: sectionBlueprints.navbar },
  { id: 'block-hero', type: 'hero', name: 'Hero Section', category: 'Hero sections', preview: sectionBlueprints.hero.preview, section: sectionBlueprints.hero },
  { id: 'block-about', type: 'about', name: 'About Section', category: 'About sections', preview: sectionBlueprints.about.preview, section: sectionBlueprints.about },
  { id: 'block-services', type: 'services', name: 'Services Section', category: 'Services sections', preview: sectionBlueprints.services.preview, section: sectionBlueprints.services },
  { id: 'block-product', type: 'product', name: 'Product Grid', category: 'Product sections', preview: sectionBlueprints.product.preview, section: sectionBlueprints.product },
  { id: 'block-custom', type: 'custom', name: 'Custom Blank Section', category: 'Custom sections', preview: sectionBlueprints.custom.preview, section: sectionBlueprints.custom },
  { id: 'block-pricing', type: 'pricing', name: 'Pricing Section', category: 'Pricing sections', preview: sectionBlueprints.pricing.preview, section: sectionBlueprints.pricing },
  { id: 'block-testimonials', type: 'testimonials', name: 'Testimonials Section', category: 'Testimonial sections', preview: sectionBlueprints.testimonials.preview, section: sectionBlueprints.testimonials },
  { id: 'block-faq', type: 'faq', name: 'FAQ Section', category: 'FAQ sections', preview: sectionBlueprints.faq.preview, section: sectionBlueprints.faq },
  { id: 'block-contact', type: 'contact', name: 'Contact Section', category: 'Contact sections', preview: sectionBlueprints.contact.preview, section: sectionBlueprints.contact },
  { id: 'block-footer', type: 'footer', name: 'Footer Section', category: 'Footer sections', preview: sectionBlueprints.footer.preview, section: sectionBlueprints.footer },
  { id: 'block-gallery', type: 'gallery', name: 'Gallery Section', category: 'Gallery sections', preview: sectionBlueprints.gallery.preview, section: sectionBlueprints.gallery },
  { id: 'block-team', type: 'team', name: 'Team Section', category: 'Team sections', preview: sectionBlueprints.team.preview, section: sectionBlueprints.team },
  { id: 'block-blog', type: 'blog', name: 'Blog Section', category: 'Blog sections', preview: sectionBlueprints.blog.preview, section: sectionBlueprints.blog },
];

export const getSectionBlueprint = (type = 'hero') => sectionBlueprints[type] || sectionBlueprints.hero;

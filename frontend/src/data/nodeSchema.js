/**
 * nodeSchema.js
 * ─────────────────────────────────────────────────
 * Canonical node shape and factory for the node-based builder.
 * Every visible item in the canvas is a node.
 */

import { createId } from '../utils/ids';

// ─── Layout mode enum ──────────────────────────
export const LAYOUT_MODES = {
  FLOW: 'flow',
  FREE: 'free',
  FLEX_ROW: 'flex-row',
  FLEX_COLUMN: 'flex-column',
  GRID: 'grid',
};

// ─── Node type constants ────────────────────────
export const NODE_TYPES = {
  PAGE: 'page',
  SECTION: 'section',
  NAVBAR: 'navbar',
  FOOTER: 'footer',
  CONTAINER: 'container',
  GRID: 'grid',
  FLEX: 'flex',
  ROW: 'row',
  COLUMN: 'column',
  GROUP: 'group',
  HEADING: 'heading',
  PARAGRAPH: 'paragraph',
  BUTTON: 'button',
  NAV_LINK: 'navLink',
  FOOTER_LINK: 'footerLink',
  IMAGE: 'image',
  VIDEO: 'video',
  ICON: 'icon',
  DIVIDER: 'divider',
  SPACER: 'spacer',
  FORM: 'form',
  CONTACT_FORM: 'contactForm',
  BOOKING_FORM: 'bookingForm',
  MAP: 'map',
  MAP_EMBED: 'mapEmbed',
  WHATSAPP_BUTTON: 'whatsappButton',
  SOCIAL_LINKS: 'socialLinks',
  COUNTDOWN: 'countdown',
  SLIDER: 'slider',
  GALLERY: 'gallery',
  CARD: 'card',
  BLOG_CARD: 'blogCard',
  PRODUCT_CARD: 'productCard',
  TESTIMONIAL_CARD: 'testimonialCard',
  PRICING_CARD: 'pricingCard',
  SERVICE_CARD: 'serviceCard',
  CUSTOM_HTML: 'customHtml',
  LOTTIE_ANIMATION: 'lottieAnimation',
  THREE_D_OBJECT: 'threeDObject',
  SEARCH_BAR: 'searchBar',
  TABS: 'tabs',
  ACCORDION: 'accordion',
  MODAL: 'modal',
  DROPDOWN: 'dropdown',
  SIDEBAR: 'sidebar',
  BREADCRUMB: 'breadcrumb',
};

// ─── Types that contain text content ────────────
export const TEXT_NODE_TYPES = new Set([
  NODE_TYPES.HEADING,
  NODE_TYPES.PARAGRAPH,
  NODE_TYPES.BUTTON,
  NODE_TYPES.NAV_LINK,
  NODE_TYPES.FOOTER_LINK,
  NODE_TYPES.WHATSAPP_BUTTON,
  NODE_TYPES.COUNTDOWN,
  NODE_TYPES.SEARCH_BAR,
]);

// ─── Types that are resizable ───────────────────
export const RESIZABLE_NODE_TYPES = new Set([
  NODE_TYPES.SECTION,
  NODE_TYPES.CONTAINER,
  NODE_TYPES.GRID,
  NODE_TYPES.FLEX,
  NODE_TYPES.ROW,
  NODE_TYPES.COLUMN,
  NODE_TYPES.GROUP,
  NODE_TYPES.IMAGE,
  NODE_TYPES.VIDEO,
  NODE_TYPES.BUTTON,
  NODE_TYPES.NAV_LINK,
  NODE_TYPES.FOOTER_LINK,
  NODE_TYPES.SPACER,
  NODE_TYPES.FORM,
  NODE_TYPES.CONTACT_FORM,
  NODE_TYPES.BOOKING_FORM,
  NODE_TYPES.GALLERY,
  NODE_TYPES.SLIDER,
  NODE_TYPES.CARD,
  NODE_TYPES.BLOG_CARD,
  NODE_TYPES.PRODUCT_CARD,
  NODE_TYPES.TESTIMONIAL_CARD,
  NODE_TYPES.PRICING_CARD,
  NODE_TYPES.SERVICE_CARD,
  NODE_TYPES.MAP,
  NODE_TYPES.MAP_EMBED,
  NODE_TYPES.WHATSAPP_BUTTON,
  NODE_TYPES.COUNTDOWN,
  NODE_TYPES.CUSTOM_HTML,
  NODE_TYPES.LOTTIE_ANIMATION,
  NODE_TYPES.THREE_D_OBJECT,
  NODE_TYPES.SEARCH_BAR,
  NODE_TYPES.TABS,
  NODE_TYPES.ACCORDION,
  NODE_TYPES.MODAL,
  NODE_TYPES.DROPDOWN,
  NODE_TYPES.SIDEBAR,
  NODE_TYPES.BREADCRUMB,
]);

// ─── Types that are containers (can have children) ──
export const CONTAINER_NODE_TYPES = new Set([
  NODE_TYPES.PAGE,
  NODE_TYPES.SECTION,
  NODE_TYPES.NAVBAR,
  NODE_TYPES.FOOTER,
  NODE_TYPES.CONTAINER,
  NODE_TYPES.GRID,
  NODE_TYPES.FLEX,
  NODE_TYPES.ROW,
  NODE_TYPES.COLUMN,
  NODE_TYPES.GROUP,
  NODE_TYPES.CARD,
  NODE_TYPES.BLOG_CARD,
  NODE_TYPES.PRODUCT_CARD,
  NODE_TYPES.TESTIMONIAL_CARD,
  NODE_TYPES.PRICING_CARD,
  NODE_TYPES.SERVICE_CARD,
  NODE_TYPES.FORM,
  NODE_TYPES.CONTACT_FORM,
  NODE_TYPES.BOOKING_FORM,
  NODE_TYPES.GALLERY,
  NODE_TYPES.SLIDER,
  NODE_TYPES.TABS,
  NODE_TYPES.ACCORDION,
  NODE_TYPES.MODAL,
  NODE_TYPES.DROPDOWN,
  NODE_TYPES.SIDEBAR,
  NODE_TYPES.BREADCRUMB,
]);

// ─── Semantic HTML tag mapping for code gen ─────
export const NODE_TAG_MAP = {
  [NODE_TYPES.PAGE]: 'main',
  [NODE_TYPES.SECTION]: 'section',
  [NODE_TYPES.NAVBAR]: 'nav',
  [NODE_TYPES.FOOTER]: 'footer',
  [NODE_TYPES.GRID]: 'div',
  [NODE_TYPES.FLEX]: 'div',
  [NODE_TYPES.ROW]: 'div',
  [NODE_TYPES.COLUMN]: 'div',
  [NODE_TYPES.HEADING]: 'h2',
  [NODE_TYPES.PARAGRAPH]: 'p',
  [NODE_TYPES.BUTTON]: 'a',
  [NODE_TYPES.NAV_LINK]: 'a',
  [NODE_TYPES.FOOTER_LINK]: 'a',
  [NODE_TYPES.IMAGE]: 'img',
  [NODE_TYPES.VIDEO]: 'video',
  [NODE_TYPES.FORM]: 'form',
  [NODE_TYPES.CONTACT_FORM]: 'form',
  [NODE_TYPES.BOOKING_FORM]: 'form',
  [NODE_TYPES.CONTAINER]: 'div',
  [NODE_TYPES.GROUP]: 'div',
  [NODE_TYPES.CARD]: 'article',
  [NODE_TYPES.BLOG_CARD]: 'article',
  [NODE_TYPES.PRODUCT_CARD]: 'article',
  [NODE_TYPES.TESTIMONIAL_CARD]: 'blockquote',
  [NODE_TYPES.PRICING_CARD]: 'article',
  [NODE_TYPES.SERVICE_CARD]: 'article',
  [NODE_TYPES.ICON]: 'span',
  [NODE_TYPES.DIVIDER]: 'hr',
  [NODE_TYPES.SPACER]: 'div',
  [NODE_TYPES.MAP]: 'div',
  [NODE_TYPES.MAP_EMBED]: 'div',
  [NODE_TYPES.WHATSAPP_BUTTON]: 'a',
  [NODE_TYPES.SOCIAL_LINKS]: 'div',
  [NODE_TYPES.COUNTDOWN]: 'div',
  [NODE_TYPES.SLIDER]: 'div',
  [NODE_TYPES.GALLERY]: 'div',
  [NODE_TYPES.CUSTOM_HTML]: 'div',
  [NODE_TYPES.LOTTIE_ANIMATION]: 'div',
  [NODE_TYPES.THREE_D_OBJECT]: 'div',
  [NODE_TYPES.SEARCH_BAR]: 'form',
  [NODE_TYPES.TABS]: 'div',
  [NODE_TYPES.ACCORDION]: 'div',
  [NODE_TYPES.MODAL]: 'dialog',
  [NODE_TYPES.DROPDOWN]: 'div',
  [NODE_TYPES.SIDEBAR]: 'aside',
  [NODE_TYPES.BREADCRUMB]: 'nav',
};

/**
 * Create a new node with canonical shape.
 * @param {string} type - Node type from NODE_TYPES
 * @param {object} overrides - Partial node data to merge
 * @returns {object} Complete node object
 */
export const createNode = (type, overrides = {}) => {
  const id = overrides.id || createId('node');
  const now = new Date().toISOString();
  return {
    id,
    type,
    name: overrides.name || defaultNameFor(type),
    parentId: overrides.parentId || null,
    children: overrides.children || [],
    content: overrides.content ?? defaultContentFor(type),
    props: { ...(defaultPropsFor(type)), ...(overrides.props || {}) },
    styles: { ...(defaultStylesFor(type)), ...(overrides.styles || {}) },
    layout: {
      positionMode: LAYOUT_MODES.FLOW,
      x: 0,
      y: 0,
      width: 'auto',
      height: 'auto',
      rotation: 0,
      zIndex: 'auto',
      ...(overrides.layout || {}),
    },
    responsive: {
      desktop: {},
      tablet: {},
      mobile: {},
      ...(overrides.responsive || {}),
    },
    animation: overrides.animation || {},
    interactions: overrides.interactions || [],
    locked: overrides.locked || false,
    hidden: overrides.hidden || false,
    createdAt: overrides.createdAt || now,
    updatedAt: overrides.updatedAt || now,
  };
};

// ─── Default names ──────────────────────────────
const defaultNameFor = (type) => {
  const names = {
    [NODE_TYPES.PAGE]: 'Page',
    [NODE_TYPES.SECTION]: 'Section',
    [NODE_TYPES.NAVBAR]: 'Navbar',
    [NODE_TYPES.FOOTER]: 'Footer',
    [NODE_TYPES.CONTAINER]: 'Container',
    [NODE_TYPES.GRID]: 'Grid',
    [NODE_TYPES.FLEX]: 'Flex',
    [NODE_TYPES.ROW]: 'Row',
    [NODE_TYPES.COLUMN]: 'Column',
    [NODE_TYPES.GROUP]: 'Group',
    [NODE_TYPES.HEADING]: 'Heading',
    [NODE_TYPES.PARAGRAPH]: 'Paragraph',
    [NODE_TYPES.BUTTON]: 'Button',
    [NODE_TYPES.NAV_LINK]: 'Nav Link',
    [NODE_TYPES.FOOTER_LINK]: 'Footer Link',
    [NODE_TYPES.IMAGE]: 'Image',
    [NODE_TYPES.VIDEO]: 'Video',
    [NODE_TYPES.ICON]: 'Icon',
    [NODE_TYPES.DIVIDER]: 'Divider',
    [NODE_TYPES.SPACER]: 'Spacer',
    [NODE_TYPES.FORM]: 'Form',
    [NODE_TYPES.CONTACT_FORM]: 'Contact Form',
    [NODE_TYPES.BOOKING_FORM]: 'Booking Form',
    [NODE_TYPES.MAP]: 'Map',
    [NODE_TYPES.MAP_EMBED]: 'Map Embed',
    [NODE_TYPES.WHATSAPP_BUTTON]: 'WhatsApp Button',
    [NODE_TYPES.SOCIAL_LINKS]: 'Social Links',
    [NODE_TYPES.COUNTDOWN]: 'Countdown',
    [NODE_TYPES.SLIDER]: 'Slider',
    [NODE_TYPES.GALLERY]: 'Gallery',
    [NODE_TYPES.CARD]: 'Card',
    [NODE_TYPES.BLOG_CARD]: 'Blog Card',
    [NODE_TYPES.PRODUCT_CARD]: 'Product Card',
    [NODE_TYPES.TESTIMONIAL_CARD]: 'Testimonial Card',
    [NODE_TYPES.PRICING_CARD]: 'Pricing Card',
    [NODE_TYPES.SERVICE_CARD]: 'Service Card',
    [NODE_TYPES.CUSTOM_HTML]: 'Custom HTML',
    [NODE_TYPES.LOTTIE_ANIMATION]: 'Lottie Animation',
    [NODE_TYPES.THREE_D_OBJECT]: '3D Object',
    [NODE_TYPES.SEARCH_BAR]: 'Search Bar',
    [NODE_TYPES.TABS]: 'Tabs',
    [NODE_TYPES.ACCORDION]: 'Accordion',
    [NODE_TYPES.MODAL]: 'Modal',
    [NODE_TYPES.DROPDOWN]: 'Dropdown',
    [NODE_TYPES.SIDEBAR]: 'Sidebar',
    [NODE_TYPES.BREADCRUMB]: 'Breadcrumb',
  };
  return names[type] || 'Element';
};

// ─── Default content ────────────────────────────
const defaultContentFor = (type) => {
  const content = {
    [NODE_TYPES.HEADING]: 'Build Your Website',
    [NODE_TYPES.PARAGRAPH]: 'Add persuasive, polished content that explains your offer clearly.',
    [NODE_TYPES.BUTTON]: 'Get Started',
    [NODE_TYPES.NAV_LINK]: 'Home',
    [NODE_TYPES.FOOTER_LINK]: 'Privacy',
    [NODE_TYPES.VIDEO]: 'Video embed placeholder',
    [NODE_TYPES.ICON]: 'Sparkles',
    [NODE_TYPES.FORM]: 'Contact Form',
    [NODE_TYPES.CONTACT_FORM]: 'Contact Form',
    [NODE_TYPES.BOOKING_FORM]: 'Booking Form',
    [NODE_TYPES.MAP]: 'Map location',
    [NODE_TYPES.MAP_EMBED]: 'Map location',
    [NODE_TYPES.WHATSAPP_BUTTON]: 'WhatsApp',
    [NODE_TYPES.SOCIAL_LINKS]: 'Instagram / LinkedIn / YouTube',
    [NODE_TYPES.COUNTDOWN]: '07:12:30',
    [NODE_TYPES.SLIDER]: 'Slider',
    [NODE_TYPES.GALLERY]: 'Gallery',
    [NODE_TYPES.CUSTOM_HTML]: '<div>Custom HTML embed</div>',
    [NODE_TYPES.LOTTIE_ANIMATION]: 'Lottie animation placeholder',
    [NODE_TYPES.THREE_D_OBJECT]: '3D object placeholder',
    [NODE_TYPES.SEARCH_BAR]: 'Search',
    [NODE_TYPES.TABS]: 'Overview / Details / FAQ',
    [NODE_TYPES.ACCORDION]: 'Question and answer',
    [NODE_TYPES.MODAL]: 'Modal content',
    [NODE_TYPES.DROPDOWN]: 'Dropdown menu',
    [NODE_TYPES.SIDEBAR]: 'Sidebar navigation',
    [NODE_TYPES.BREADCRUMB]: 'Home / Page',
    [NODE_TYPES.CONTAINER]: '',
  };
  return content[type] ?? '';
};

// ─── Default props ──────────────────────────────
const defaultPropsFor = (type) => {
  const props = {
    [NODE_TYPES.BUTTON]: { href: '#contact', target: '_self', variant: 'solid', size: 'medium' },
    [NODE_TYPES.NAV_LINK]: { href: '/', target: '_self', linkType: 'internal page' },
    [NODE_TYPES.FOOTER_LINK]: { href: '#', target: '_self', linkType: 'external' },
    [NODE_TYPES.IMAGE]: {
      src: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&auto=format&fit=crop',
      alt: 'Modern workspace',
      objectFit: 'cover',
    },
    [NODE_TYPES.VIDEO]: { src: '', poster: '' },
    [NODE_TYPES.FORM]: { fields: ['Name', 'Email', 'Message'], requiredFields: ['Name', 'Email'], buttonText: 'Send Message', successMessage: 'Thanks. We will reply soon.', receiver: '' },
    [NODE_TYPES.CONTACT_FORM]: { fields: ['Name', 'Email', 'Message'], requiredFields: ['Name', 'Email'], buttonText: 'Send Message', successMessage: 'Thanks. We will reply soon.', receiver: '' },
    [NODE_TYPES.BOOKING_FORM]: { fields: ['Name', 'Email', 'Date', 'Time', 'Notes'], requiredFields: ['Name', 'Email', 'Date'], buttonText: 'Book Now', successMessage: 'Your booking request was received.', receiver: '' },
    [NODE_TYPES.MAP]: { location: 'Location' },
    [NODE_TYPES.MAP_EMBED]: { location: 'Location', embedUrl: '' },
    [NODE_TYPES.WHATSAPP_BUTTON]: { phone: '+919999999999', message: 'Hello, I want to know more.', href: 'https://wa.me/919999999999', target: '_blank' },
    [NODE_TYPES.SOCIAL_LINKS]: { links: ['Instagram', 'LinkedIn', 'YouTube'] },
    [NODE_TYPES.COUNTDOWN]: { targetDate: '', label: 'Launch offer ends soon' },
    [NODE_TYPES.SLIDER]: {
      images: [
        'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=900&auto=format&fit=crop',
      ],
      activeIndex: 0,
    },
    [NODE_TYPES.GALLERY]: {
      images: [
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&auto=format&fit=crop',
      ],
    },
    [NODE_TYPES.SEARCH_BAR]: { placeholder: 'Search', buttonText: 'Search' },
    [NODE_TYPES.TABS]: { tabs: ['Overview', 'Details', 'FAQ'], activeTab: 'Overview' },
    [NODE_TYPES.ACCORDION]: { items: [{ title: 'Question', body: 'Answer content goes here.' }] },
    [NODE_TYPES.MODAL]: { buttonText: 'Open Modal', title: 'Modal title' },
    [NODE_TYPES.DROPDOWN]: { label: 'Menu', items: ['Option 1', 'Option 2'] },
    [NODE_TYPES.THREE_D_OBJECT]: { modelUrl: '', material: 'matte', lighting: 'studio' },
  };
  return props[type] || {};
};

// ─── Default styles ─────────────────────────────
const defaultStylesFor = (type) => {
  const styles = {
    [NODE_TYPES.SECTION]: {
      padding: '96px 64px',
      backgroundColor: '#ffffff',
      color: '#0f172a',
      minHeight: '200px',
    },
    [NODE_TYPES.NAVBAR]: {
      padding: '16px 64px',
      backgroundColor: '#0f172a',
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
    [NODE_TYPES.FOOTER]: {
      padding: '48px 64px',
      backgroundColor: '#0f172a',
      color: '#94a3b8',
    },
    [NODE_TYPES.HEADING]: {
      fontSize: '48px',
      fontWeight: '800',
      lineHeight: '1.05',
      color: 'inherit',
      textAlign: 'left',
      marginBottom: '16px',
    },
    [NODE_TYPES.PARAGRAPH]: {
      fontSize: '18px',
      lineHeight: '1.7',
      color: 'inherit',
      opacity: '0.76',
      maxWidth: '680px',
    },
    [NODE_TYPES.BUTTON]: {
      backgroundColor: '#6366f1',
      color: '#ffffff',
      borderRadius: '999px',
      padding: '14px 22px',
      border: '1px solid transparent',
      fontWeight: '800',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      cursor: 'pointer',
    },
    [NODE_TYPES.NAV_LINK]: {
      color: 'inherit',
      padding: '10px 14px',
      fontWeight: '700',
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
    },
    [NODE_TYPES.FOOTER_LINK]: {
      color: 'inherit',
      opacity: '0.76',
      textDecoration: 'none',
      display: 'inline-flex',
    },
    [NODE_TYPES.IMAGE]: {
      width: '100%',
      minHeight: '280px',
      borderRadius: '18px',
      boxShadow: '0 24px 70px rgba(15, 23, 42, 0.18)',
    },
    [NODE_TYPES.VIDEO]: {
      minHeight: '260px',
      borderRadius: '18px',
      backgroundColor: '#0f172a',
    },
    [NODE_TYPES.ICON]: {
      width: '48px',
      height: '48px',
      color: '#6366f1',
      backgroundColor: 'rgba(99, 102, 241, 0.12)',
      borderRadius: '14px',
    },
    [NODE_TYPES.DIVIDER]: {
      height: '1px',
      backgroundColor: 'rgba(148, 163, 184, 0.35)',
      margin: '24px 0',
    },
    [NODE_TYPES.SPACER]: {
      height: '48px',
    },
    [NODE_TYPES.CONTAINER]: {
      padding: '32px',
      border: '1px dashed rgba(99, 102, 241, 0.35)',
      borderRadius: '18px',
      minHeight: '120px',
    },
    [NODE_TYPES.CARD]: {
      padding: '28px',
      backgroundColor: 'rgba(255,255,255,0.78)',
      borderRadius: '18px',
      border: '1px solid rgba(148, 163, 184, 0.22)',
      boxShadow: '0 18px 45px rgba(15, 23, 42, 0.10)',
    },
    [NODE_TYPES.PRODUCT_CARD]: {
      padding: '24px',
      borderRadius: '18px',
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
    },
    [NODE_TYPES.TESTIMONIAL_CARD]: {
      padding: '28px',
      borderRadius: '18px',
      backgroundColor: 'rgba(255,255,255,0.82)',
    },
    [NODE_TYPES.PRICING_CARD]: {
      padding: '28px',
      borderRadius: '18px',
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
    },
    [NODE_TYPES.SERVICE_CARD]: {
      padding: '28px',
      borderRadius: '18px',
      backgroundColor: 'rgba(255,255,255,0.78)',
      border: '1px solid rgba(148, 163, 184, 0.22)',
      boxShadow: '0 18px 45px rgba(15, 23, 42, 0.10)',
    },
    [NODE_TYPES.FORM]: {
      padding: '28px',
      backgroundColor: '#f8fafc',
      borderRadius: '18px',
    },
    [NODE_TYPES.CONTACT_FORM]: {
      padding: '28px',
      backgroundColor: '#f8fafc',
      borderRadius: '18px',
    },
    [NODE_TYPES.BOOKING_FORM]: {
      padding: '28px',
      backgroundColor: '#f8fafc',
      borderRadius: '18px',
    },
    [NODE_TYPES.MAP]: {
      minHeight: '260px',
      borderRadius: '18px',
      backgroundColor: '#e2e8f0',
    },
    [NODE_TYPES.MAP_EMBED]: {
      minHeight: '260px',
      borderRadius: '18px',
      backgroundColor: '#e2e8f0',
    },
    [NODE_TYPES.WHATSAPP_BUTTON]: {
      backgroundColor: '#22c55e',
      color: '#ffffff',
      borderRadius: '999px',
      padding: '12px 18px',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      fontWeight: '800',
      boxShadow: '0 18px 40px rgba(34, 197, 94, 0.25)',
    },
    [NODE_TYPES.SOCIAL_LINKS]: {
      display: 'flex',
      gap: '12px',
    },
    [NODE_TYPES.COUNTDOWN]: {
      display: 'inline-flex',
      padding: '14px 18px',
      borderRadius: '16px',
      backgroundColor: '#0f172a',
      color: '#ffffff',
      fontSize: '22px',
      fontWeight: '800',
    },
    [NODE_TYPES.SLIDER]: {
      minHeight: '320px',
      borderRadius: '18px',
      overflow: 'hidden',
      backgroundColor: '#e2e8f0',
    },
    [NODE_TYPES.GALLERY]: {
      display: 'grid',
      gap: '16px',
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    },
    [NODE_TYPES.GRID]: {
      display: 'grid',
      gap: '24px',
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
      padding: '24px',
    },
    [NODE_TYPES.FLEX]: {
      display: 'flex',
      gap: '24px',
      alignItems: 'center',
      padding: '24px',
    },
    [NODE_TYPES.ROW]: {
      display: 'flex',
      flexDirection: 'row',
      gap: '24px',
      padding: '24px',
    },
    [NODE_TYPES.COLUMN]: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      padding: '24px',
    },
    [NODE_TYPES.BLOG_CARD]: {
      padding: '28px',
      borderRadius: '18px',
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
    },
    [NODE_TYPES.CUSTOM_HTML]: {
      padding: '18px',
      borderRadius: '14px',
      backgroundColor: '#0f172a',
      color: '#e2e8f0',
      fontFamily: 'monospace',
      whiteSpace: 'pre-wrap',
    },
    [NODE_TYPES.LOTTIE_ANIMATION]: {
      minHeight: '220px',
      borderRadius: '18px',
      backgroundColor: '#f1f5f9',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    [NODE_TYPES.THREE_D_OBJECT]: {
      minHeight: '280px',
      borderRadius: '18px',
      background: 'linear-gradient(135deg, #111827, #334155)',
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    [NODE_TYPES.SEARCH_BAR]: {
      display: 'flex',
      gap: '8px',
      padding: '12px',
      borderRadius: '999px',
      border: '1px solid #e2e8f0',
      backgroundColor: '#ffffff',
    },
    [NODE_TYPES.TABS]: {
      padding: '20px',
      borderRadius: '18px',
      border: '1px solid #e2e8f0',
      backgroundColor: '#ffffff',
    },
    [NODE_TYPES.ACCORDION]: {
      padding: '20px',
      borderRadius: '18px',
      border: '1px solid #e2e8f0',
      backgroundColor: '#ffffff',
    },
    [NODE_TYPES.MODAL]: {
      padding: '24px',
      borderRadius: '18px',
      border: '1px solid #e2e8f0',
      backgroundColor: '#ffffff',
      position: 'relative',
    },
    [NODE_TYPES.DROPDOWN]: {
      padding: '14px 18px',
      borderRadius: '14px',
      border: '1px solid #e2e8f0',
      backgroundColor: '#ffffff',
    },
    [NODE_TYPES.SIDEBAR]: {
      padding: '24px',
      borderRadius: '18px',
      backgroundColor: '#0f172a',
      color: '#ffffff',
    },
    [NODE_TYPES.BREADCRUMB]: {
      display: 'flex',
      gap: '8px',
      color: '#64748b',
      fontSize: '14px',
    },
    [NODE_TYPES.GROUP]: {
      position: 'relative',
    },
  };
  return styles[type] || {};
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Decomposed card templates
// Each pre-built card is broken into parent + child nodes
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Creates a service card decomposed into child nodes.
 * Returns { parent, children } where children is an array of nodes.
 */
export const createServiceCard = (overrides = {}) => {
  const parentId = overrides.parentId || null;
  const parent = createNode(overrides.type || NODE_TYPES.SERVICE_CARD, {
    ...overrides,
    name: overrides.name || 'Service Card',
    parentId,
  });

  const iconNode = createNode(NODE_TYPES.ICON, {
    name: 'Card Icon',
    parentId: parent.id,
    content: 'Sparkles',
    styles: {
      width: '48px',
      height: '48px',
      color: '#6366f1',
      backgroundColor: 'rgba(99, 102, 241, 0.12)',
      borderRadius: '14px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  const titleNode = createNode(NODE_TYPES.HEADING, {
    name: 'Card Title',
    parentId: parent.id,
    content: overrides.title || 'Service Title',
    styles: {
      fontSize: '20px',
      fontWeight: '800',
      lineHeight: '1.2',
      color: 'inherit',
      marginBottom: '8px',
    },
  });

  const descNode = createNode(NODE_TYPES.PARAGRAPH, {
    name: 'Card Description',
    parentId: parent.id,
    content: overrides.description || 'Describe your service offering clearly.',
    styles: {
      fontSize: '15px',
      lineHeight: '1.6',
      color: 'inherit',
      opacity: '0.7',
    },
  });

  const btnNode = createNode(NODE_TYPES.BUTTON, {
    name: 'Card Button',
    parentId: parent.id,
    content: overrides.buttonText || 'Learn More',
    styles: {
      backgroundColor: '#6366f1',
      color: '#ffffff',
      borderRadius: '999px',
      padding: '10px 18px',
      border: '1px solid transparent',
      fontWeight: '700',
      fontSize: '13px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: '12px',
    },
  });

  parent.children = [iconNode.id, titleNode.id, descNode.id, btnNode.id];

  return {
    parent,
    children: [iconNode, titleNode, descNode, btnNode],
    allNodes: [parent, iconNode, titleNode, descNode, btnNode],
  };
};

/**
 * Creates a product card decomposed into child nodes.
 */
export const createProductCard = (overrides = {}) => {
  const parentId = overrides.parentId || null;
  const parent = createNode(NODE_TYPES.PRODUCT_CARD, {
    ...overrides,
    name: overrides.name || 'Product Card',
    parentId,
  });

  const imgNode = createNode(NODE_TYPES.IMAGE, {
    name: 'Product Image',
    parentId: parent.id,
    props: {
      src: overrides.imageSrc || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop',
      alt: overrides.imageAlt || 'Product image',
      objectFit: 'cover',
    },
    styles: {
      width: '100%',
      height: '200px',
      borderRadius: '12px',
      marginBottom: '12px',
    },
  });

  const titleNode = createNode(NODE_TYPES.HEADING, {
    name: 'Product Title',
    parentId: parent.id,
    content: overrides.title || 'Signature Product',
    styles: { fontSize: '18px', fontWeight: '800', lineHeight: '1.2', color: 'inherit', marginBottom: '4px' },
  });

  const priceNode = createNode(NODE_TYPES.PARAGRAPH, {
    name: 'Product Price',
    parentId: parent.id,
    content: overrides.price || '$49',
    styles: { fontSize: '24px', fontWeight: '800', color: '#6366f1', marginBottom: '8px' },
  });

  const descNode = createNode(NODE_TYPES.PARAGRAPH, {
    name: 'Product Description',
    parentId: parent.id,
    content: overrides.description || 'A premium product ready for your store.',
    styles: { fontSize: '14px', lineHeight: '1.6', color: 'inherit', opacity: '0.7' },
  });

  const btnNode = createNode(NODE_TYPES.BUTTON, {
    name: 'Buy Button',
    parentId: parent.id,
    content: overrides.buttonText || 'Add to Cart',
    styles: {
      backgroundColor: '#6366f1',
      color: '#ffffff',
      borderRadius: '999px',
      padding: '10px 18px',
      border: '1px solid transparent',
      fontWeight: '700',
      fontSize: '13px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: '12px',
      width: '100%',
    },
  });

  parent.children = [imgNode.id, titleNode.id, priceNode.id, descNode.id, btnNode.id];

  return {
    parent,
    children: [imgNode, titleNode, priceNode, descNode, btnNode],
    allNodes: [parent, imgNode, titleNode, priceNode, descNode, btnNode],
  };
};

/**
 * Creates a testimonial card decomposed into child nodes.
 */
export const createTestimonialCard = (overrides = {}) => {
  const parentId = overrides.parentId || null;
  const parent = createNode(NODE_TYPES.TESTIMONIAL_CARD, {
    ...overrides,
    name: overrides.name || 'Testimonial Card',
    parentId,
  });

  const avatarNode = createNode(NODE_TYPES.IMAGE, {
    name: 'Avatar',
    parentId: parent.id,
    props: {
      src: overrides.avatarSrc || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop',
      alt: overrides.authorName || 'Customer avatar',
      objectFit: 'cover',
    },
    styles: { width: '56px', height: '56px', borderRadius: '50%', marginBottom: '12px' },
  });

  const quoteNode = createNode(NODE_TYPES.PARAGRAPH, {
    name: 'Quote',
    parentId: parent.id,
    content: overrides.quote || 'The website feels polished, fast, and easy to trust.',
    styles: { fontSize: '16px', lineHeight: '1.6', fontStyle: 'italic', color: 'inherit', marginBottom: '12px' },
  });

  const nameNode = createNode(NODE_TYPES.HEADING, {
    name: 'Customer Name',
    parentId: parent.id,
    content: overrides.authorName || 'Happy Customer',
    styles: { fontSize: '14px', fontWeight: '800', color: 'inherit', marginBottom: '2px' },
  });

  const roleNode = createNode(NODE_TYPES.PARAGRAPH, {
    name: 'Customer Role',
    parentId: parent.id,
    content: overrides.authorRole || 'CEO, Acme Inc.',
    styles: { fontSize: '12px', color: 'inherit', opacity: '0.6' },
  });

  parent.children = [avatarNode.id, quoteNode.id, nameNode.id, roleNode.id];

  return {
    parent,
    children: [avatarNode, quoteNode, nameNode, roleNode],
    allNodes: [parent, avatarNode, quoteNode, nameNode, roleNode],
  };
};

/**
 * Creates a pricing card decomposed into child nodes.
 */
export const createPricingCard = (overrides = {}) => {
  const parentId = overrides.parentId || null;
  const parent = createNode(NODE_TYPES.PRICING_CARD, {
    ...overrides,
    name: overrides.name || 'Pricing Card',
    parentId,
  });

  const planNode = createNode(NODE_TYPES.HEADING, {
    name: 'Plan Name',
    parentId: parent.id,
    content: overrides.planName || 'Growth',
    styles: { fontSize: '20px', fontWeight: '800', color: 'inherit', marginBottom: '8px' },
  });

  const priceNode = createNode(NODE_TYPES.HEADING, {
    name: 'Price',
    parentId: parent.id,
    content: overrides.price || '$99/mo',
    styles: { fontSize: '36px', fontWeight: '800', color: '#6366f1', marginBottom: '16px' },
  });

  const descNode = createNode(NODE_TYPES.PARAGRAPH, {
    name: 'Plan Description',
    parentId: parent.id,
    content: overrides.description || 'Everything needed to launch confidently.',
    styles: { fontSize: '14px', lineHeight: '1.6', color: 'inherit', opacity: '0.7', marginBottom: '16px' },
  });

  const btnNode = createNode(NODE_TYPES.BUTTON, {
    name: 'Subscribe Button',
    parentId: parent.id,
    content: overrides.buttonText || 'Get Started',
    styles: {
      backgroundColor: '#6366f1',
      color: '#ffffff',
      borderRadius: '999px',
      padding: '12px 24px',
      border: '1px solid transparent',
      fontWeight: '700',
      fontSize: '14px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    },
  });

  parent.children = [planNode.id, priceNode.id, descNode.id, btnNode.id];

  return {
    parent,
    children: [planNode, priceNode, descNode, btnNode],
    allNodes: [parent, planNode, priceNode, descNode, btnNode],
  };
};

/**
 * Utility: flatten all nodes from a decomposed card into a map.
 */
export const nodesToMap = (nodes) => {
  const map = {};
  for (const node of nodes) {
    map[node.id] = node;
  }
  return map;
};

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
  GROUP: 'group',
  HEADING: 'heading',
  PARAGRAPH: 'paragraph',
  BUTTON: 'button',
  IMAGE: 'image',
  VIDEO: 'video',
  ICON: 'icon',
  DIVIDER: 'divider',
  SPACER: 'spacer',
  FORM: 'form',
  MAP: 'map',
  SOCIAL_LINKS: 'socialLinks',
  GALLERY: 'gallery',
  CARD: 'card',
  PRODUCT_CARD: 'productCard',
  TESTIMONIAL_CARD: 'testimonialCard',
  PRICING_CARD: 'pricingCard',
  SERVICE_CARD: 'serviceCard',
};

// ─── Types that contain text content ────────────
export const TEXT_NODE_TYPES = new Set([
  NODE_TYPES.HEADING,
  NODE_TYPES.PARAGRAPH,
  NODE_TYPES.BUTTON,
]);

// ─── Types that are resizable ───────────────────
export const RESIZABLE_NODE_TYPES = new Set([
  NODE_TYPES.SECTION,
  NODE_TYPES.CONTAINER,
  NODE_TYPES.GROUP,
  NODE_TYPES.IMAGE,
  NODE_TYPES.VIDEO,
  NODE_TYPES.BUTTON,
  NODE_TYPES.SPACER,
  NODE_TYPES.FORM,
  NODE_TYPES.GALLERY,
  NODE_TYPES.CARD,
  NODE_TYPES.PRODUCT_CARD,
  NODE_TYPES.TESTIMONIAL_CARD,
  NODE_TYPES.PRICING_CARD,
  NODE_TYPES.SERVICE_CARD,
  NODE_TYPES.MAP,
]);

// ─── Types that are containers (can have children) ──
export const CONTAINER_NODE_TYPES = new Set([
  NODE_TYPES.PAGE,
  NODE_TYPES.SECTION,
  NODE_TYPES.NAVBAR,
  NODE_TYPES.FOOTER,
  NODE_TYPES.CONTAINER,
  NODE_TYPES.GROUP,
  NODE_TYPES.CARD,
  NODE_TYPES.PRODUCT_CARD,
  NODE_TYPES.TESTIMONIAL_CARD,
  NODE_TYPES.PRICING_CARD,
  NODE_TYPES.SERVICE_CARD,
  NODE_TYPES.FORM,
]);

// ─── Semantic HTML tag mapping for code gen ─────
export const NODE_TAG_MAP = {
  [NODE_TYPES.PAGE]: 'main',
  [NODE_TYPES.SECTION]: 'section',
  [NODE_TYPES.NAVBAR]: 'nav',
  [NODE_TYPES.FOOTER]: 'footer',
  [NODE_TYPES.HEADING]: 'h2',
  [NODE_TYPES.PARAGRAPH]: 'p',
  [NODE_TYPES.BUTTON]: 'a',
  [NODE_TYPES.IMAGE]: 'img',
  [NODE_TYPES.VIDEO]: 'video',
  [NODE_TYPES.FORM]: 'form',
  [NODE_TYPES.CONTAINER]: 'div',
  [NODE_TYPES.GROUP]: 'div',
  [NODE_TYPES.CARD]: 'article',
  [NODE_TYPES.PRODUCT_CARD]: 'article',
  [NODE_TYPES.TESTIMONIAL_CARD]: 'blockquote',
  [NODE_TYPES.PRICING_CARD]: 'article',
  [NODE_TYPES.SERVICE_CARD]: 'article',
  [NODE_TYPES.ICON]: 'span',
  [NODE_TYPES.DIVIDER]: 'hr',
  [NODE_TYPES.SPACER]: 'div',
  [NODE_TYPES.MAP]: 'div',
  [NODE_TYPES.SOCIAL_LINKS]: 'div',
  [NODE_TYPES.GALLERY]: 'div',
};

/**
 * Create a new node with canonical shape.
 * @param {string} type - Node type from NODE_TYPES
 * @param {object} overrides - Partial node data to merge
 * @returns {object} Complete node object
 */
export const createNode = (type, overrides = {}) => {
  const id = overrides.id || createId('node');
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
    [NODE_TYPES.GROUP]: 'Group',
    [NODE_TYPES.HEADING]: 'Heading',
    [NODE_TYPES.PARAGRAPH]: 'Paragraph',
    [NODE_TYPES.BUTTON]: 'Button',
    [NODE_TYPES.IMAGE]: 'Image',
    [NODE_TYPES.VIDEO]: 'Video',
    [NODE_TYPES.ICON]: 'Icon',
    [NODE_TYPES.DIVIDER]: 'Divider',
    [NODE_TYPES.SPACER]: 'Spacer',
    [NODE_TYPES.FORM]: 'Form',
    [NODE_TYPES.MAP]: 'Map',
    [NODE_TYPES.SOCIAL_LINKS]: 'Social Links',
    [NODE_TYPES.GALLERY]: 'Gallery',
    [NODE_TYPES.CARD]: 'Card',
    [NODE_TYPES.PRODUCT_CARD]: 'Product Card',
    [NODE_TYPES.TESTIMONIAL_CARD]: 'Testimonial Card',
    [NODE_TYPES.PRICING_CARD]: 'Pricing Card',
    [NODE_TYPES.SERVICE_CARD]: 'Service Card',
  };
  return names[type] || 'Element';
};

// ─── Default content ────────────────────────────
const defaultContentFor = (type) => {
  const content = {
    [NODE_TYPES.HEADING]: 'Build Your Website',
    [NODE_TYPES.PARAGRAPH]: 'Add persuasive, polished content that explains your offer clearly.',
    [NODE_TYPES.BUTTON]: 'Get Started',
    [NODE_TYPES.VIDEO]: 'Video embed placeholder',
    [NODE_TYPES.ICON]: 'Sparkles',
    [NODE_TYPES.FORM]: 'Contact Form',
    [NODE_TYPES.MAP]: 'Map location',
    [NODE_TYPES.SOCIAL_LINKS]: 'Instagram / LinkedIn / YouTube',
    [NODE_TYPES.GALLERY]: 'Gallery',
    [NODE_TYPES.CONTAINER]: '',
  };
  return content[type] ?? '';
};

// ─── Default props ──────────────────────────────
const defaultPropsFor = (type) => {
  const props = {
    [NODE_TYPES.BUTTON]: { href: '#contact', target: '_self', variant: 'solid', size: 'medium' },
    [NODE_TYPES.IMAGE]: {
      src: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&auto=format&fit=crop',
      alt: 'Modern workspace',
      objectFit: 'cover',
    },
    [NODE_TYPES.VIDEO]: { src: '', poster: '' },
    [NODE_TYPES.FORM]: { fields: ['Name', 'Email', 'Message'], buttonText: 'Send Message', successMessage: 'Thanks. We will reply soon.' },
    [NODE_TYPES.MAP]: { location: 'Location' },
    [NODE_TYPES.SOCIAL_LINKS]: { links: ['Instagram', 'LinkedIn', 'YouTube'] },
    [NODE_TYPES.GALLERY]: {
      images: [
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&auto=format&fit=crop',
      ],
    },
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
    [NODE_TYPES.MAP]: {
      minHeight: '260px',
      borderRadius: '18px',
      backgroundColor: '#e2e8f0',
    },
    [NODE_TYPES.SOCIAL_LINKS]: {
      display: 'flex',
      gap: '12px',
    },
    [NODE_TYPES.GALLERY]: {
      display: 'grid',
      gap: '16px',
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
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
  const parent = createNode(NODE_TYPES.SERVICE_CARD, {
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

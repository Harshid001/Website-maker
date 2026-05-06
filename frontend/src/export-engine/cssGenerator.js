const STYLE_KEYS_TO_SKIP = new Set([
  '--hover-transform',
  '--hover-background-color',
  '--hover-color',
  '--hover-border-color',
  '--hover-box-shadow',
]);

const safeClassName = (prefix = 'export', value = '') =>
  `${prefix}-${String(value || 'item').replace(/[^a-zA-Z0-9_-]/g, '-')}`;

const kebab = (value = '') =>
  String(value)
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/_/g, '-')
    .toLowerCase();

const safeCSSValue = (value = '') =>
  String(value ?? '').replace(/<\/?style/gi, '').replace(/[{};]/g, '').trim();

const cssFromObject = (styles = {}) =>
  Object.entries(styles)
    .filter(([key, value]) => value !== undefined && value !== null && value !== '' && !STYLE_KEYS_TO_SKIP.has(key))
    .map(([key, value]) => `  ${key.startsWith('--') ? key : kebab(key)}: ${safeCSSValue(value)};`)
    .join('\n');

const layoutStyles = (node = {}) => {
  const layout = node.layout || {};
  const styles = {};

  if (layout.positionMode === 'free') {
    styles.position = ['section', 'navbar', 'footer'].includes(node.type) ? 'relative' : 'absolute';
    if (!['section', 'navbar', 'footer'].includes(node.type)) {
      styles.left = `${Number(layout.x) || 0}px`;
      styles.top = `${Number(layout.y) || 0}px`;
    }
  }

  if (layout.positionMode === 'flex-row') {
    styles.display = 'flex';
    styles.flexDirection = 'row';
  }

  if (layout.positionMode === 'flex-column') {
    styles.display = 'flex';
    styles.flexDirection = 'column';
  }

  if (layout.positionMode === 'grid') {
    styles.display = 'grid';
    styles.gridTemplateColumns = layout.gridTemplateColumns || 'repeat(3, minmax(0, 1fr))';
  }

  if (layout.gap) styles.gap = layout.gap;
  if (layout.alignItems) styles.alignItems = layout.alignItems;
  if (layout.justifyContent) styles.justifyContent = layout.justifyContent;
  if (layout.width && layout.width !== 'auto') styles.width = layout.width;
  if (layout.height && layout.height !== 'auto') styles.height = layout.height;
  if (layout.rotation) styles.transform = `rotate(${Number(layout.rotation) || 0}deg)`;
  if (layout.zIndex && layout.zIndex !== 'auto') styles.zIndex = layout.zIndex;

  return styles;
};

const flattenNodes = (sections = []) => {
  const nodes = [];
  const walk = (node) => {
    if (!node || node.hidden) return;
    nodes.push(node);
    (node.children || []).forEach(walk);
  };

  sections.forEach((section) => {
    if (section.props?.node) walk(section.props.node);
  });

  return nodes;
};

const flattenSections = (siteData = {}) =>
  (siteData.pages || []).flatMap((page) => page.sections || []);

const nodeCSSRules = (siteData = {}) => {
  const sections = flattenSections(siteData);
  const nodes = flattenNodes(sections);
  const rules = [];
  const laptopRules = [];
  const tabletRules = [];
  const mobileRules = [];

  nodes.forEach((node) => {
    const selector = `.${safeClassName('export-node', node.id || node.name || node.type)}`;
    const css = cssFromObject({
      ...(node.styles || {}),
      ...layoutStyles(node),
    });

    if (css) rules.push(`${selector} {\n${css}\n}`);

    const responsive = node.responsive || {};
    const laptop = cssFromObject(responsive.laptop || {});
    const tablet = cssFromObject(responsive.tablet || {});
    const mobile = cssFromObject(responsive.mobile || {});

    if (laptop) laptopRules.push(`${selector} {\n${laptop}\n}`);
    if (tablet) tabletRules.push(`${selector} {\n${tablet}\n}`);
    if (mobile) mobileRules.push(`${selector} {\n${mobile}\n}`);
  });

  return [
    rules.join('\n\n'),
    laptopRules.length ? `@media (max-width: 1200px) {\n${laptopRules.map((rule) => rule.replace(/^/gm, '  ')).join('\n')}\n}` : '',
    tabletRules.length ? `@media (max-width: 900px) {\n${tabletRules.map((rule) => rule.replace(/^/gm, '  ')).join('\n')}\n}` : '',
    mobileRules.length ? `@media (max-width: 640px) {\n${mobileRules.map((rule) => rule.replace(/^/gm, '  ')).join('\n')}\n}` : '',
  ].filter(Boolean).join('\n\n');
};

const legacySectionCSSRules = (siteData = {}) => {
  const sections = flattenSections(siteData);
  return sections
    .filter((section) => !section.props?.source && section.props?.styles)
    .map((section) => {
      const css = cssFromObject(section.props.styles);
      return css ? `.${safeClassName('export-section', section.id)} {\n${css}\n}` : '';
    })
    .filter(Boolean)
    .join('\n\n');
};

export function generateCSS(theme = {}, siteData = {}) {
  const primary = safeCSSValue(theme.primaryColor || '#667EEA');
  const background = safeCSSValue(theme.backgroundColor || '#ffffff');
  const text = safeCSSValue(theme.textColor || '#111827');
  const font = safeCSSValue(theme.fontFamily || 'Inter, Arial, sans-serif');

  const baseCSS = `:root {
  --color-primary: ${primary};
  --color-background: ${background};
  --color-text: ${text};
  --color-surface: #f8fafc;
  --color-border: #e5e7eb;
  --container-width: 1120px;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  font-family: ${font};
  background: var(--color-background);
  color: var(--color-text);
  line-height: 1.6;
}

img,
video {
  max-width: 100%;
  display: block;
}

a {
  color: inherit;
  text-decoration: none;
}

button,
input,
textarea {
  font: inherit;
}

.container {
  width: min(var(--container-width), 92%);
  margin: 0 auto;
}

.export-section {
  position: relative;
  overflow: hidden;
}

.site-navbar {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(255, 255, 255, 0.94);
  border-bottom: 1px solid var(--color-border);
  backdrop-filter: blur(12px);
}

.navbar-inner {
  min-height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.logo {
  font-size: 22px;
  font-weight: 800;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 28px;
}

.nav-links a {
  font-weight: 700;
}

.mobile-menu-btn {
  display: none;
  border: 0;
  border-radius: 10px;
  background: var(--color-primary);
  color: #ffffff;
  padding: 10px 14px;
  font-weight: 800;
  cursor: pointer;
}

.hero-section {
  padding: 112px 0;
  color: #ffffff;
  background: linear-gradient(135deg, var(--color-primary), #111827);
}

.hero-content {
  display: grid;
  grid-template-columns: minmax(0, 1.02fr) minmax(280px, 0.98fr);
  align-items: center;
  gap: 48px;
}

.hero-copy {
  max-width: 760px;
}

.hero-badge {
  display: inline-flex;
  margin-bottom: 18px;
  padding: 8px 16px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
  font-size: 14px;
  font-weight: 800;
}

.hero-section h1 {
  margin: 0 0 22px;
  font-size: clamp(40px, 7vw, 76px);
  line-height: 1.05;
}

.hero-section p {
  margin: 0 0 32px;
  max-width: 680px;
  font-size: 20px;
  opacity: 0.9;
}

.hero-image {
  width: 100%;
  min-height: 360px;
  border-radius: 24px;
  object-fit: cover;
  box-shadow: 0 28px 80px rgba(15, 23, 42, 0.28);
}

.primary-btn,
.contact-form button,
.node-type-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 999px;
  background: #ffffff;
  color: var(--color-primary);
  padding: 14px 24px;
  font-weight: 800;
  cursor: pointer;
}

.features-section,
.services-section,
.pricing-section,
.testimonials-section,
.faq-section,
.contact-section {
  padding: 88px 0;
}

.pricing-section,
.faq-section {
  background: var(--color-surface);
}

.section-heading {
  max-width: 760px;
  margin: 0 auto 42px;
  text-align: center;
}

.section-heading h2,
.contact-section h2 {
  margin: 0 0 14px;
  font-size: clamp(32px, 4vw, 48px);
  line-height: 1.1;
}

.section-heading p,
.contact-section p {
  margin: 0;
  color: #64748b;
  font-size: 18px;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}

.export-card {
  min-width: 0;
  border: 1px solid var(--color-border);
  border-radius: 18px;
  background: #ffffff;
  padding: 28px;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.08);
}

.export-card h3 {
  margin: 0 0 10px;
  font-size: 22px;
}

.export-card p {
  margin: 0;
  color: #64748b;
}

.card-price {
  display: block;
  margin-bottom: 16px;
  color: var(--color-primary);
  font-size: 32px;
  font-weight: 900;
}

.card-meta {
  display: block;
  margin-top: 18px;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #64748b;
}

.faq-list {
  max-width: 820px;
  margin: 0 auto;
  display: grid;
  gap: 14px;
}

.faq-item {
  border: 1px solid var(--color-border);
  border-radius: 14px;
  background: #ffffff;
  padding: 18px 20px;
}

.faq-item summary {
  cursor: pointer;
  font-weight: 800;
}

.faq-item p {
  margin: 12px 0 0;
  color: #64748b;
}

.contact-grid {
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 42px;
  align-items: start;
}

.contact-form,
.node-type-form,
.node-type-contactForm,
.node-type-bookingForm {
  display: grid;
  gap: 16px;
  border: 1px solid var(--color-border);
  border-radius: 18px;
  background: #ffffff;
  padding: 28px;
}

.contact-form label,
.form-field {
  display: grid;
  gap: 8px;
  font-size: 14px;
  font-weight: 800;
}

.contact-form input,
.contact-form textarea,
.form-field input,
.form-field textarea {
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 12px 14px;
  color: var(--color-text);
}

.contact-form textarea,
.form-field textarea {
  min-height: 130px;
  resize: vertical;
}

.contact-form button,
.node-type-form button,
.node-type-contactForm button,
.node-type-bookingForm button {
  background: var(--color-primary);
  color: #ffffff;
}

.site-footer {
  padding: 36px 0;
  background: #111827;
  color: #ffffff;
}

.footer-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.footer-inner p {
  margin: 4px 0 0;
  color: rgba(255, 255, 255, 0.72);
}

.node-type-navbar,
.node-type-section,
.node-type-footer {
  position: relative;
}

.node-type-image {
  object-fit: cover;
}

.node-type-socialLinks {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.node-type-socialLinks a {
  border: 1px solid currentColor;
  border-radius: 999px;
  padding: 8px 12px;
  font-weight: 700;
  opacity: 0.8;
}

.empty-site {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 48px;
  text-align: center;
}`;

  const responsiveCSS = `@media (max-width: 900px) {
  .hero-content,
  .contact-grid {
    grid-template-columns: 1fr;
  }

  .card-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }

  .site-navbar.nav-open .nav-links {
    position: absolute;
    top: 72px;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    border-bottom: 1px solid var(--color-border);
    background: #ffffff;
    padding: 14px 24px;
  }

  .site-navbar.nav-open .nav-links a {
    padding: 12px 0;
  }

  .mobile-menu-btn {
    display: inline-flex;
  }

  .hero-section,
  .features-section,
  .services-section,
  .pricing-section,
  .testimonials-section,
  .faq-section,
  .contact-section {
    padding: 72px 0;
  }

  .card-grid {
    grid-template-columns: 1fr;
  }

  .footer-inner {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (max-width: 560px) {
  .container {
    width: min(100% - 32px, var(--container-width));
  }

  .hero-section h1 {
    font-size: 40px;
  }

  .hero-section p,
  .section-heading p,
  .contact-section p {
    font-size: 16px;
  }
}`;

  return [
    baseCSS,
    legacySectionCSSRules(siteData),
    nodeCSSRules(siteData),
    responsiveCSS,
  ].filter(Boolean).join('\n\n');
}

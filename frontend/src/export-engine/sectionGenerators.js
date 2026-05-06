import {
  escapeAttribute,
  escapeHTML,
  escapeText,
  safeClassName,
  sanitizeHref,
  stripHTML,
} from './websiteGenerator.js';

const SELF_CLOSING_TAGS = new Set(['img', 'hr', 'br', 'input', 'meta', 'link']);

const textFromContent = (content, fallback = '') => {
  if (typeof content === 'string' || typeof content === 'number') return stripHTML(content);
  if (!content || typeof content !== 'object') return fallback;
  return stripHTML(content.title || content.quote || content.body || content.description || content.price || fallback);
};

const firstElement = (section, types = []) => {
  const elements = section.props?.elements || [];
  return elements.find((element) => types.includes(element.type));
};

const elementText = (element, fallback = '') => textFromContent(element?.content, fallback);

const cardElements = (section, types = ['card', 'serviceCard', 'pricingCard', 'testimonialCard', 'productCard']) =>
  (section.props?.elements || []).filter((element) => types.includes(element.type) && !element.hidden);

const objectCards = (section, fallback = []) => {
  if (Array.isArray(section.props?.cards)) return section.props.cards;
  const cards = cardElements(section).map((element) => {
    const content = element.content || {};
    if (typeof content === 'object') {
      return {
        title: content.title || content.planName || content.quote || element.name,
        description: content.body || content.description || content.quote || '',
        price: content.price || '',
        author: content.author || content.name || '',
      };
    }
    return {
      title: element.name || element.type || 'Card',
      description: textFromContent(content),
    };
  });
  return cards.length ? cards : fallback;
};

const sectionId = (section) =>
  escapeAttribute(section.props?.anchorId || section.type || section.id || 'section');

const sectionClasses = (section, ...extra) => [
  'export-section',
  safeClassName('export-section', section.id),
  `section-${section.type}`,
  ...extra,
].filter(Boolean).join(' ');

const tagForNode = (node, context = {}) => {
  if (!node) return 'div';
  if (node.type === 'navbar') return 'header';
  if (node.type === 'footer') return 'footer';
  if (node.type === 'section') return 'section';
  if (node.type === 'heading') return context.headingLevel === 1 ? 'h1' : 'h2';
  if (node.type === 'paragraph') return 'p';
  if (['button', 'navLink', 'footerLink', 'whatsappButton'].includes(node.type)) return 'a';
  if (node.type === 'image') return 'img';
  if (node.type === 'video') return 'video';
  if (['form', 'contactForm', 'bookingForm', 'searchBar'].includes(node.type)) return 'form';
  if (node.type === 'divider') return 'hr';
  if (node.type === 'testimonialCard') return 'blockquote';
  if (['card', 'serviceCard', 'pricingCard', 'productCard', 'blogCard'].includes(node.type)) return 'article';
  if (['map', 'mapEmbed'].includes(node.type)) return 'div';
  if (node.type === 'sidebar') return 'aside';
  if (node.type === 'breadcrumb') return 'nav';
  return 'div';
};

const nodeClasses = (node, context = {}) => [
  safeClassName('export-node', node.id || node.name || node.type),
  context.root ? 'export-section' : '',
  context.root ? `section-${context.sectionType || node.type}` : '',
  `node-type-${node.type || 'container'}`,
].filter(Boolean).join(' ');

const childrenHTML = (node, context = {}) =>
  (node.children || [])
    .map((child) => generateNodeHTML(child, {
      headingLevel: node.type === 'section' ? 2 : context.headingLevel,
      sectionType: context.sectionType,
    }))
    .filter(Boolean)
    .join('\n');

const renderFormFields = (node) => {
  const fields = node.props?.fields || ['Name', 'Email', 'Message'];
  return fields.map((field) => {
    const safeField = escapeText(field);
    const fieldId = `${safeClassName('field', node.id)}-${safeClassName('input', field)}`;
    const isMessage = /message|note|details/i.test(String(field));
    return `    <label class="form-field" for="${fieldId}">
      <span>${safeField}</span>
      ${isMessage
    ? `<textarea id="${fieldId}" name="${escapeAttribute(field)}" placeholder="${safeField}"></textarea>`
    : `<input id="${fieldId}" name="${escapeAttribute(field)}" type="text" placeholder="${safeField}" />`}
    </label>`;
  }).join('\n');
};

export function generateNodeHTML(node, context = {}) {
  if (!node || node.hidden) return '';

  const tag = tagForNode(node, context);
  const className = nodeClasses(node, context);
  const attrs = [`class="${className}"`];

  if (context.root) attrs.push(`id="${sectionId({ ...node, type: context.sectionType || node.type, props: {} })}"`);

  if (node.type === 'image') {
    attrs.push(`src="${escapeAttribute(node.props?.src || '')}"`);
    attrs.push(`alt="${escapeAttribute(node.props?.alt || node.name || 'Image')}"`);
    attrs.push('loading="lazy"');
  }

  if (node.type === 'video' && node.props?.src) {
    attrs.push(`src="${escapeAttribute(node.props.src)}"`);
    if (node.props?.poster) attrs.push(`poster="${escapeAttribute(node.props.poster)}"`);
    attrs.push('controls');
  }

  if (['button', 'navLink', 'footerLink', 'whatsappButton'].includes(node.type)) {
    attrs.push(`href="${sanitizeHref(node.props?.href || node.props?.scrollTo || '#')}"`);
    if (node.props?.target === '_blank') attrs.push('target="_blank" rel="noopener noreferrer"');
  }

  if (SELF_CLOSING_TAGS.has(tag)) return `  <${tag} ${attrs.join(' ')} />`;

  if (['form', 'contactForm', 'bookingForm'].includes(node.type)) {
    return `  <form ${attrs.join(' ')}>
${renderFormFields(node)}
    <button type="submit">${escapeText(node.props?.buttonText || 'Submit')}</button>
  </form>`;
  }

  if (node.type === 'gallery' || node.type === 'slider') {
    const images = node.props?.images || [];
    const imageMarkup = images.map((src, index) =>
      `    <img src="${escapeAttribute(src)}" alt="${escapeAttribute(`${node.name || 'Gallery'} ${index + 1}`)}" loading="lazy" />`,
    ).join('\n');
    return `  <div ${attrs.join(' ')}>
${imageMarkup || `    <span>${escapeText(node.content || 'Gallery')}</span>`}
  </div>`;
  }

  if (node.type === 'socialLinks') {
    const links = node.props?.links || ['Instagram', 'LinkedIn', 'YouTube'];
    return `  <div ${attrs.join(' ')}>
${links.map((link) => `    <a href="#" aria-label="${escapeAttribute(link)}">${escapeText(link)}</a>`).join('\n')}
  </div>`;
  }

  if (['map', 'mapEmbed'].includes(node.type)) {
    return `  <div ${attrs.join(' ')}>
    <p>${escapeText(node.props?.location || node.content || 'Map location')}</p>
  </div>`;
  }

  const childMarkup = childrenHTML(node, context);
  const text = escapeText(textFromContent(node.content, ''));
  const inner = childMarkup || (text ? `    ${text}` : '');

  if (!inner) return `  <${tag} ${attrs.join(' ')}></${tag}>`;

  return `  <${tag} ${attrs.join(' ')}>
${inner}
  </${tag}>`;
}

function generateNodeSection(section) {
  return generateNodeHTML(section.props?.node, { root: true, sectionType: section.type, headingLevel: 1 });
}

function generateNavbar(section) {
  if (section.props?.source === 'node') return generateNodeSection(section);

  const props = section.props || {};
  const logo = props.logo || elementText(firstElement(section, ['heading']), 'Brand');
  const links = props.links || (section.props?.elements || [])
    .filter((element) => ['button', 'navLink'].includes(element.type))
    .map((element) => ({ label: elementText(element, 'Link'), href: element.props?.href }));
  const normalizedLinks = links.length ? links : ['Home', 'Services', 'Contact'];

  return `<header id="${sectionId(section)}" class="${sectionClasses(section, 'site-navbar')}">
  <div class="container navbar-inner">
    <a class="logo" href="#">${escapeText(logo)}</a>
    <nav class="nav-links">
      ${normalizedLinks.map((link) => {
    const label = typeof link === 'string' ? link : link.label;
    const href = typeof link === 'string' ? `#${String(link).toLowerCase().replace(/[^a-z0-9]+/g, '-')}` : link.href;
    return `<a href="${sanitizeHref(href || '#')}">${escapeText(label)}</a>`;
  }).join('\n      ')}
    </nav>
    <button class="mobile-menu-btn" type="button" aria-label="Toggle navigation">Menu</button>
  </div>
</header>`;
}

function generateHero(section) {
  if (section.props?.source === 'node') return generateNodeSection(section);

  const heading = section.props?.heading || elementText(firstElement(section, ['heading']), 'Build Your Website Without Code');
  const subheading = section.props?.subheading || elementText(firstElement(section, ['paragraph']), 'Create, customize, preview, and export your website easily.');
  const button = firstElement(section, ['button']);
  const image = firstElement(section, ['image']);

  return `<section id="${sectionId(section)}" class="${sectionClasses(section, 'hero-section')}">
  <div class="container hero-content">
    <div class="hero-copy">
      <span class="hero-badge">${escapeText(section.props?.badge || 'No-Code Website Builder')}</span>
      <h1>${escapeText(heading)}</h1>
      <p>${escapeText(subheading)}</p>
      <a class="primary-btn" href="${sanitizeHref(button?.props?.href || section.props?.ctaHref || '#contact')}">${escapeText(section.props?.cta || elementText(button, 'Get Started'))}</a>
    </div>
    ${image?.props?.src ? `<img class="hero-image" src="${escapeAttribute(image.props.src)}" alt="${escapeAttribute(image.props.alt || heading)}" loading="lazy" />` : ''}
  </div>
</section>`;
}

function generateCardGrid(section, options = {}) {
  if (section.props?.source === 'node') return generateNodeSection(section);

  const fallback = options.fallback || [
    { title: 'Fast Editing', description: 'Drag, drop, and customize sections visually.' },
    { title: 'Responsive Design', description: 'Your website works on mobile, tablet, and desktop.' },
    { title: 'Export Code', description: 'Download clean HTML, CSS, and JS files.' },
  ];
  const cards = objectCards(section, fallback);
  const heading = section.props?.heading || elementText(firstElement(section, ['heading']), options.heading || 'Features');
  const copy = section.props?.copy || elementText(firstElement(section, ['paragraph']), '');

  return `<section id="${sectionId(section)}" class="${sectionClasses(section, options.className || 'features-section')}">
  <div class="container">
    <div class="section-heading">
      <h2>${escapeText(heading)}</h2>
      ${copy ? `<p>${escapeText(copy)}</p>` : ''}
    </div>
    <div class="card-grid">
      ${cards.map((card) => `<article class="export-card">
        ${card.price ? `<span class="card-price">${escapeText(card.price)}</span>` : ''}
        <h3>${escapeText(card.title || 'Card')}</h3>
        <p>${escapeText(card.description || card.body || '')}</p>
        ${card.author ? `<span class="card-meta">${escapeText(card.author)}</span>` : ''}
      </article>`).join('\n      ')}
    </div>
  </div>
</section>`;
}

function generatePricing(section) {
  return generateCardGrid(section, {
    className: 'pricing-section',
    heading: 'Simple plans for every stage.',
    fallback: [
      { title: 'Starter', price: '$49', description: 'Perfect for a lean launch.' },
      { title: 'Growth', price: '$99', description: 'More sections, SEO, and conversion polish.' },
      { title: 'Scale', price: '$199', description: 'Advanced pages, integrations, and analytics.' },
    ],
  });
}

function generateTestimonials(section) {
  return generateCardGrid(section, {
    className: 'testimonials-section',
    heading: 'Trusted by customers.',
    fallback: [
      { title: 'Great experience', description: 'The website feels polished, fast, and easy to trust.', author: 'Happy Customer' },
      { title: 'Easy updates', description: 'We can update sections and copy without waiting on developers.', author: 'Team Lead' },
    ],
  });
}

function generateFAQ(section) {
  if (section.props?.source === 'node') return generateNodeSection(section);

  const heading = section.props?.heading || elementText(firstElement(section, ['heading']), 'Questions, answered.');
  const items = section.props?.items || objectCards(section, [
    { title: 'Can I edit everything?', description: 'Yes. Update content, layout, style, SEO, and responsive settings.' },
    { title: 'Can I export my site?', description: 'Yes. Preview and download HTML, CSS, JS, and metadata as a ZIP.' },
  ]);

  return `<section id="${sectionId(section)}" class="${sectionClasses(section, 'faq-section')}">
  <div class="container">
    <div class="section-heading">
      <h2>${escapeText(heading)}</h2>
    </div>
    <div class="faq-list">
      ${items.map((item) => `<details class="faq-item">
        <summary>${escapeText(item.title || item.question || 'Question')}</summary>
        <p>${escapeText(item.description || item.answer || item.body || '')}</p>
      </details>`).join('\n      ')}
    </div>
  </div>
</section>`;
}

function generateContact(section) {
  if (section.props?.source === 'node') return generateNodeSection(section);

  const heading = section.props?.heading || elementText(firstElement(section, ['heading']), 'Let us build something useful.');
  const copy = section.props?.copy || elementText(firstElement(section, ['paragraph']), 'Tell visitors how to reach you and what happens next.');
  const form = firstElement(section, ['form', 'contactForm', 'bookingForm']);
  const fields = form?.props?.fields || ['Name', 'Email', 'Message'];

  return `<section id="${sectionId(section)}" class="${sectionClasses(section, 'contact-section')}">
  <div class="container contact-grid">
    <div>
      <h2>${escapeText(heading)}</h2>
      <p>${escapeText(copy)}</p>
    </div>
    <form class="contact-form">
      ${fields.map((field) => {
    const safeField = escapeText(field);
    const isMessage = /message|details|note/i.test(String(field));
    return `<label>
        <span>${safeField}</span>
        ${isMessage ? `<textarea placeholder="${safeField}"></textarea>` : `<input type="text" placeholder="${safeField}" />`}
      </label>`;
  }).join('\n      ')}
      <button type="submit">${escapeText(form?.props?.buttonText || 'Send Message')}</button>
    </form>
  </div>
</section>`;
}

function generateFooter(section) {
  if (section.props?.source === 'node') return generateNodeSection(section);

  const brand = section.props?.brand || elementText(firstElement(section, ['heading']), 'My Website');
  const copy = section.props?.copy || elementText(firstElement(section, ['paragraph']), 'Built with a no-code website builder.');

  return `<footer id="${sectionId(section)}" class="${sectionClasses(section, 'site-footer')}">
  <div class="container footer-inner">
    <div>
      <strong>${escapeText(brand)}</strong>
      <p>${escapeText(copy)}</p>
    </div>
    <p>&copy; ${new Date().getFullYear()} ${escapeHTML(brand)}. All rights reserved.</p>
  </div>
</footer>`;
}

export function generateSectionHTML(section, theme) {
  switch (section.type) {
    case 'navbar':
      return generateNavbar(section, theme);
    case 'hero':
      return generateHero(section, theme);
    case 'features':
      return generateCardGrid(section, { heading: 'Features', className: 'features-section' });
    case 'services':
      return generateCardGrid(section, { heading: 'Services built around your goals.', className: 'services-section' });
    case 'pricing':
      return generatePricing(section);
    case 'testimonials':
      return generateTestimonials(section);
    case 'faq':
      return generateFAQ(section);
    case 'contact':
      return generateContact(section);
    case 'footer':
      return generateFooter(section);
    default:
      return section.props?.source === 'node'
        ? generateNodeSection(section)
        : generateCardGrid(section, { heading: section.props?.name || 'Section', className: 'features-section' });
  }
}

import { websiteTemplates as designWebsiteTemplates, websiteDesignTypes, websiteProfessions } from './websiteDesignTemplates.js';

const paletteSets = [
  ['#0f172a', '#6366f1', '#22d3ee'],
  ['#111827', '#14b8a6', '#f59e0b'],
  ['#18181b', '#ec4899', '#8b5cf6'],
  ['#0b1120', '#22c55e', '#38bdf8'],
  ['#1f2937', '#f97316', '#facc15'],
  ['#050816', '#a855f7', '#22d3ee'],
  ['#111827', '#ef4444', '#fb7185'],
  ['#082f49', '#06b6d4', '#84cc16'],
];

export const templateTypeLabels = {
  website: 'Websites',
  '2d': '2D Designs',
  animation: 'Animations',
  '3d': '3D Models',
};

export const workspaceTypeByTemplateType = {
  website: 'website-builder',
  '2d': 'design-editor',
  '3d': 'three-editor',
  animation: 'animation-editor',
};

const difficultyCycle = ['Beginner', 'Intermediate', 'Advanced', 'Beginner', 'Intermediate'];

const slugifyTitle = (value) =>
  String(value)
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const escapeSvg = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const makeThumbnail = (title, type, palette) => {
  const [dark, accent, support] = palette;
  const typeLabel = templateTypeLabels[type] || type;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="960" height="540" viewBox="0 0 960 540">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${dark}"/>
          <stop offset="0.55" stop-color="${accent}"/>
          <stop offset="1" stop-color="${support}"/>
        </linearGradient>
        <radialGradient id="spot" cx="78%" cy="20%" r="60%">
          <stop offset="0" stop-color="#ffffff" stop-opacity="0.28"/>
          <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="960" height="540" fill="url(#g)"/>
      <rect width="960" height="540" fill="url(#spot)"/>
      <rect x="54" y="54" width="852" height="432" rx="34" fill="#020617" fill-opacity="0.34" stroke="#ffffff" stroke-opacity="0.22"/>
      <circle cx="780" cy="132" r="64" fill="#ffffff" fill-opacity="0.12"/>
      <circle cx="835" cy="368" r="104" fill="#020617" fill-opacity="0.18"/>
      <text x="74" y="120" fill="#e2e8f0" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="700">${escapeSvg(typeLabel)}</text>
      <text x="74" y="262" fill="#ffffff" font-family="Inter, Arial, sans-serif" font-size="58" font-weight="800">${escapeSvg(title)}</text>
      <text x="74" y="326" fill="#cbd5e1" font-family="Inter, Arial, sans-serif" font-size="26" font-weight="600">Ready to edit in ShopCraft Studio</text>
      <rect x="74" y="384" width="194" height="48" rx="14" fill="#ffffff" fill-opacity="0.16"/>
      <text x="104" y="416" fill="#ffffff" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="800">Use Template</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const emptyContent = {
  html: '',
  css: '',
  js: '',
  reactComponent: '',
  canvasJson: {},
  threeScene: {},
  animationCode: '',
};

const createTemplate = ({ type, title, category, tags, description, content, palette, index }) => ({
  id: `${type}-${slugifyTitle(title)}`,
  type,
  title,
  category,
  tags,
  description,
  thumbnail: makeThumbnail(title, type, palette),
  difficulty: difficultyCycle[index % difficultyCycle.length],
  workspaceType: workspaceTypeByTemplateType[type],
  content: {
    ...emptyContent,
    ...content,
  },
});

const websiteSpecs = [
  ['Modern Portfolio', 'Portfolio', ['modern', 'personal', 'responsive'], 'Showcase selected work, bio, services, proof, and a contact CTA.'],
  ['Developer Portfolio', 'Portfolio', ['developer', 'projects', 'resume'], 'A technical portfolio starter with skills, shipped projects, stack badges, and hiring CTA.'],
  ['Designer Portfolio', 'Portfolio', ['designer', 'case studies', 'creative'], 'A visual portfolio for designers with case studies, process notes, and testimonials.'],
  ['Business Landing Page', 'Business', ['business', 'lead generation', 'services'], 'A conversion-ready landing page for a local or service business.'],
  ['SaaS Landing Page', 'SaaS', ['saas', 'software', 'pricing'], 'A polished SaaS product page with feature blocks, stats, and trial CTA.'],
  ['Restaurant Menu Website', 'Restaurant', ['food', 'menu', 'booking'], 'A restaurant site with hero, menu highlights, reviews, and booking section.'],
  ['Cafe Website', 'Restaurant', ['cafe', 'menu', 'local'], 'A warm cafe website with daily specials, story, menu, and visit CTA.'],
  ['E-commerce Store', 'E-commerce', ['shop', 'products', 'checkout'], 'A product grid and storefront starter for selling curated goods online.'],
  ['Fashion Store', 'E-commerce', ['fashion', 'lookbook', 'retail'], 'A fashion retail homepage with collection cards, lookbook, and shopping CTA.'],
  ['Photography Studio', 'Creative', ['photography', 'gallery', 'booking'], 'A studio website for portfolios, packages, client proof, and booking inquiries.'],
  ['Gym & Fitness', 'Fitness', ['gym', 'fitness', 'membership'], 'A fitness studio landing page with programs, trainers, stats, and membership CTA.'],
  ['Yoga Studio', 'Fitness', ['yoga', 'wellness', 'classes'], 'A calm yoga studio website with class types, benefits, teachers, and schedule CTA.'],
  ['Digital Agency', 'Agency', ['agency', 'marketing', 'portfolio'], 'A digital agency homepage with service pillars, results, case proof, and contact CTA.'],
  ['Real Estate Website', 'Real Estate', ['property', 'listings', 'agents'], 'A real estate starter with listings, value props, metrics, and inquiry CTA.'],
  ['Jewellery Shop', 'Retail', ['jewellery', 'luxury', 'showcase'], 'A premium jewellery showcase with collection cards, trust stats, and store CTA.'],
  ['Local Service Business', 'Local Business', ['local', 'booking', 'services'], 'A practical website for repairs, cleaning, consulting, or similar local services.'],
  ['Salon & Spa', 'Beauty', ['salon', 'spa', 'appointments'], 'A beauty studio site with service menu, offers, reviews, and appointment CTA.'],
  ['Medical Clinic', 'Healthcare', ['clinic', 'doctors', 'appointments'], 'A clinic website with departments, care highlights, doctor trust, and appointment CTA.'],
  ['Coaching Institute', 'Education', ['coaching', 'courses', 'students'], 'An institute landing page with programs, success metrics, faculty, and admissions CTA.'],
  ['Event Landing Page', 'Events', ['event', 'tickets', 'schedule'], 'A high-energy event page with lineup, highlights, stats, and ticket CTA.'],
  ['Travel Agency', 'Travel', ['travel', 'packages', 'booking'], 'A travel agency homepage with destinations, packages, proof, and itinerary CTA.'],
  ['Hotel Booking Landing', 'Travel', ['hotel', 'booking', 'rooms'], 'A hotel booking page with room highlights, amenities, reviews, and reservation CTA.'],
  ['Mobile App Landing Page', 'SaaS', ['mobile app', 'download', 'features'], 'A mobile app landing page with feature cards, stats, screenshots, and download CTA.'],
  ['Product Showcase', 'Product', ['product', 'launch', 'features'], 'A product launch page with benefits, product cards, testimonials, and preorder CTA.'],
  ['Startup Pitch Website', 'Startup', ['startup', 'pitch', 'investors'], 'A startup pitch homepage with mission, traction, product, team proof, and investor CTA.'],
  ['Construction Company', 'Construction', ['construction', 'projects', 'services'], 'A construction website with project types, safety proof, stats, and quote CTA.'],
  ['Interior Design Studio', 'Design', ['interior', 'portfolio', 'studio'], 'A studio site for interiors with room showcases, services, and consultation CTA.'],
  ['Car Rental Website', 'Automotive', ['cars', 'rental', 'booking'], 'A car rental landing page with fleet cards, benefits, pricing, and booking CTA.'],
  ['Education Course Website', 'Education', ['course', 'learning', 'online'], 'A course landing page with curriculum, outcomes, instructor proof, and enrollment CTA.'],
  ['Personal Blog', 'Publishing', ['blog', 'writing', 'newsletter'], 'A personal blog starter with featured posts, newsletter, and author section.'],
  ['Food Delivery Landing', 'Food Tech', ['delivery', 'food', 'app'], 'A food delivery landing page with app benefits, restaurant categories, and order CTA.'],
  ['Freelancer Profile', 'Portfolio', ['freelancer', 'services', 'contact'], 'A freelancer profile page with services, projects, rates, and booking CTA.'],
  ['Non-Profit Website', 'Non-Profit', ['charity', 'donations', 'impact'], 'A non-profit homepage with cause story, impact stats, programs, and donate CTA.'],
  ['Finance Consultant', 'Finance', ['finance', 'consulting', 'planning'], 'A finance consultant website with services, trust metrics, testimonials, and call CTA.'],
  ['AI Tool Landing Page', 'AI', ['ai', 'automation', 'software'], 'An AI tool landing page with product story, use cases, outcomes, and trial CTA.'],
];

const buildWebsiteContent = (spec, index) => {
  const [title, category, tags] = spec;
  const id = slugifyTitle(title);
  const scope = `scw-${id}`;
  const [dark, accent, support] = paletteSets[index % paletteSets.length];
  const primaryAudience = tags[0] || category.toLowerCase();
  const services = [
    `${category} strategy`,
    `${title.replace('Website', '').replace('Landing Page', '').trim()} experience`,
    'Launch-ready content',
  ];
  const stats = [`${18 + index} projects`, `${91 + (index % 8)}% happy clients`, `${24 + index}h response`];

  const html = `
    <div class="${scope}">
      <nav class="${scope}__nav">
        <strong>${title}</strong>
        <div>
          <a href="#features">Features</a>
          <a href="#services">Services</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>
      <section class="${scope}__hero">
        <div>
          <span class="${scope}__eyebrow">${category}</span>
          <h1>${title} that feels polished from the first click.</h1>
          <p>A complete, responsive starter for ${primaryAudience} brands with persuasive sections, clean hierarchy, and clear conversion paths.</p>
          <div class="${scope}__actions">
            <a href="#contact">Start Editing</a>
            <a href="#features">View Sections</a>
          </div>
        </div>
        <aside class="${scope}__hero-card">
          <span>Live Starter</span>
          <strong>${stats[0]}</strong>
          <p>${spec[3]}</p>
        </aside>
      </section>
      <section id="features" class="${scope}__section">
        <div class="${scope}__section-title">
          <span>Features</span>
          <h2>Everything needed for a professional ${category.toLowerCase()} page.</h2>
        </div>
        <div class="${scope}__grid">
          <article><strong>Responsive layout</strong><p>Hero, content bands, proof, and footer adapt cleanly on mobile and desktop.</p></article>
          <article><strong>Conversion copy</strong><p>Editable headlines, benefits, CTA buttons, and trust cues are already in place.</p></article>
          <article><strong>Reusable sections</strong><p>Swap service cards, product highlights, images, and testimonials without rebuilding the page.</p></article>
        </div>
      </section>
      <section id="services" class="${scope}__section ${scope}__split">
        <div>
          <span class="${scope}__eyebrow">Services</span>
          <h2>Made for fast customization.</h2>
          <p>Use the editor tools to adjust colors, copy, spacing, images, and sections while keeping the design foundation intact.</p>
        </div>
        <div class="${scope}__services">
          ${services.map((service) => `<article><span></span><strong>${service}</strong><p>Editable block with room for pricing, details, or calls to action.</p></article>`).join('')}
        </div>
      </section>
      <section class="${scope}__stats">
        ${stats.map((stat) => `<div><strong>${stat}</strong><span>Template-ready proof point</span></div>`).join('')}
      </section>
      <section class="${scope}__quote">
        <p>"This template gives you the structure of a premium site without locking you into a generic layout."</p>
        <span>- ShopCraft Studio</span>
      </section>
      <footer id="contact" class="${scope}__footer">
        <div>
          <h2>Ready to make ${title} yours?</h2>
          <p>Edit the copy, swap visuals, and publish when your brand feels right.</p>
        </div>
        <a href="mailto:hello@example.com">Contact Now</a>
      </footer>
    </div>
  `;

  const css = `
    .${scope} {
      --surface: ${dark};
      --accent: ${accent};
      --support: ${support};
      background: #f8fafc;
      color: #0f172a;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      line-height: 1.6;
      overflow: hidden;
    }
    .${scope} * { box-sizing: border-box; }
    .${scope} a { color: inherit; text-decoration: none; }
    .${scope}__nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
      padding: 22px 7%;
      background: rgba(15, 23, 42, 0.94);
      color: #fff;
    }
    .${scope}__nav div { display: flex; gap: 18px; color: #cbd5e1; font-size: 14px; }
    .${scope}__hero {
      display: grid;
      grid-template-columns: minmax(0, 1.25fr) minmax(280px, 0.75fr);
      gap: 40px;
      align-items: center;
      min-height: 620px;
      padding: 74px 7%;
      color: #fff;
      background:
        linear-gradient(135deg, rgba(2, 6, 23, 0.92), rgba(15, 23, 42, 0.68)),
        linear-gradient(135deg, var(--surface), var(--accent), var(--support));
    }
    .${scope}__eyebrow,
    .${scope}__section-title span,
    .${scope}__hero-card span {
      display: inline-flex;
      margin-bottom: 14px;
      color: #a5f3fc;
      font-size: 13px;
      font-weight: 800;
    }
    .${scope} h1 { max-width: 760px; margin: 0; font-size: 58px; line-height: 1.04; }
    .${scope} h2 { margin: 0; font-size: 34px; line-height: 1.14; }
    .${scope} p { margin: 0; color: inherit; opacity: 0.78; }
    .${scope}__hero p { max-width: 620px; margin-top: 22px; font-size: 18px; }
    .${scope}__actions { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 32px; }
    .${scope}__actions a,
    .${scope}__footer a {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 48px;
      padding: 0 22px;
      border-radius: 12px;
      background: #fff;
      color: #0f172a;
      font-weight: 800;
    }
    .${scope}__actions a + a { background: rgba(255,255,255,0.12); color: #fff; border: 1px solid rgba(255,255,255,0.18); }
    .${scope}__hero-card {
      border: 1px solid rgba(255,255,255,0.18);
      border-radius: 24px;
      padding: 30px;
      background: rgba(255,255,255,0.11);
      box-shadow: 0 24px 70px rgba(2, 6, 23, 0.3);
      backdrop-filter: blur(16px);
    }
    .${scope}__hero-card strong { display: block; margin: 8px 0 16px; font-size: 42px; }
    .${scope}__section { padding: 76px 7%; background: #f8fafc; }
    .${scope}__section-title { max-width: 760px; margin-bottom: 28px; }
    .${scope}__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
    .${scope}__grid article,
    .${scope}__services article {
      min-height: 170px;
      border: 1px solid #e2e8f0;
      border-radius: 20px;
      padding: 24px;
      background: #fff;
      box-shadow: 0 18px 45px rgba(15, 23, 42, 0.07);
    }
    .${scope}__grid strong,
    .${scope}__services strong { display: block; margin-bottom: 10px; color: #0f172a; font-size: 18px; }
    .${scope}__split { display: grid; grid-template-columns: 0.8fr 1.2fr; gap: 42px; align-items: start; background: #eef2ff; }
    .${scope}__services { display: grid; gap: 14px; }
    .${scope}__services span { display: block; width: 34px; height: 8px; margin-bottom: 16px; border-radius: 999px; background: linear-gradient(90deg, var(--accent), var(--support)); }
    .${scope}__stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1px;
      background: #111827;
      color: #fff;
      padding: 1px;
    }
    .${scope}__stats div { padding: 36px 7%; background: #0f172a; }
    .${scope}__stats strong { display: block; font-size: 30px; }
    .${scope}__stats span { color: #94a3b8; font-size: 14px; }
    .${scope}__quote { padding: 74px 7%; background: #fff; text-align: center; }
    .${scope}__quote p { max-width: 820px; margin: 0 auto 18px; color: #0f172a; font-size: 28px; font-weight: 800; opacity: 1; }
    .${scope}__quote span { color: #64748b; }
    .${scope}__footer {
      display: flex;
      justify-content: space-between;
      gap: 28px;
      align-items: center;
      padding: 52px 7%;
      background: #020617;
      color: #fff;
    }
    .${scope}__footer p { margin-top: 10px; color: #cbd5e1; }
    .${scope}__footer a { background: linear-gradient(135deg, var(--accent), var(--support)); color: #fff; }
    @media (max-width: 900px) {
      .${scope}__hero,
      .${scope}__split,
      .${scope}__footer { grid-template-columns: 1fr; flex-direction: column; align-items: flex-start; }
      .${scope} h1 { font-size: 42px; }
      .${scope}__grid,
      .${scope}__stats { grid-template-columns: 1fr; }
      .${scope}__nav { align-items: flex-start; flex-direction: column; }
    }
  `;

  const js = `
    document.querySelectorAll('.${scope} a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (event) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          event.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  `;

  return { html, css, js };
};

const legacyWebsiteTemplates = websiteSpecs.map((spec, index) =>
  createTemplate({
    type: 'website',
    title: spec[0],
    category: spec[1],
    tags: spec[2],
    description: spec[3],
    palette: paletteSets[index % paletteSets.length],
    index,
    content: buildWebsiteContent(spec, index),
  })
);

const designSpecs = [
  ['Instagram Post', 'Social Media', [1080, 1080], ['instagram', 'square', 'promo']],
  ['Instagram Story', 'Social Media', [1080, 1920], ['story', 'vertical', 'social']],
  ['Facebook Cover', 'Social Media', [1640, 624], ['facebook', 'cover', 'banner']],
  ['YouTube Thumbnail', 'Video', [1280, 720], ['youtube', 'thumbnail', 'video']],
  ['YouTube Banner', 'Video', [2560, 1440], ['youtube', 'banner', 'channel']],
  ['Twitter/X Header', 'Social Media', [1500, 500], ['x', 'twitter', 'header']],
  ['LinkedIn Banner', 'Business', [1584, 396], ['linkedin', 'professional', 'banner']],
  ['Business Card', 'Print', [1050, 600], ['business card', 'print', 'brand']],
  ['Poster/Flyer', 'Print', [1240, 1748], ['poster', 'flyer', 'event']],
  ['Logo Design', 'Branding', [800, 800], ['logo', 'brand', 'mark']],
  ['Restaurant Menu Card', 'Food', [1200, 1600], ['menu', 'restaurant', 'food']],
  ['Sale Banner', 'Marketing', [1600, 900], ['sale', 'banner', 'offer']],
  ['Product Ad', 'Marketing', [1080, 1350], ['product', 'ad', 'commerce']],
  ['Event Poster', 'Events', [1240, 1748], ['event', 'poster', 'tickets']],
  ['Birthday Invitation', 'Invitations', [1080, 1350], ['birthday', 'invite', 'party']],
  ['Wedding Invitation', 'Invitations', [1080, 1350], ['wedding', 'invite', 'elegant']],
  ['Resume Design', 'Documents', [1240, 1754], ['resume', 'cv', 'profile']],
  ['Certificate Design', 'Documents', [1600, 1130], ['certificate', 'award', 'formal']],
  ['Brochure Front', 'Print', [1200, 900], ['brochure', 'front', 'business']],
  ['Brochure Back', 'Print', [1200, 900], ['brochure', 'back', 'details']],
  ['Infographic', 'Education', [1080, 1920], ['infographic', 'data', 'learning']],
  ['Quote Post', 'Social Media', [1080, 1080], ['quote', 'post', 'typography']],
  ['App Promo Banner', 'Marketing', [1600, 900], ['app', 'promo', 'download']],
  ['Website Hero Banner', 'Web', [1920, 900], ['website', 'hero', 'banner']],
  ['Podcast Cover', 'Media', [1400, 1400], ['podcast', 'cover', 'audio']],
  ['Book Cover', 'Publishing', [1600, 2560], ['book', 'cover', 'publishing']],
  ['Album Cover', 'Media', [1400, 1400], ['album', 'music', 'cover']],
  ['Real Estate Flyer', 'Real Estate', [1240, 1748], ['property', 'flyer', 'listing']],
  ['Gym Offer Poster', 'Fitness', [1080, 1350], ['gym', 'offer', 'fitness']],
  ['Jewellery Offer Poster', 'Retail', [1080, 1350], ['jewellery', 'offer', 'retail']],
  ['Food Menu Poster', 'Food', [1080, 1350], ['food', 'menu', 'poster']],
  ['Travel Poster', 'Travel', [1240, 1748], ['travel', 'destination', 'poster']],
  ['Education Poster', 'Education', [1240, 1748], ['education', 'course', 'poster']],
  ['Startup Pitch Cover', 'Startup', [1600, 900], ['startup', 'pitch', 'cover']],
  ['Brand Guidelines Sheet', 'Branding', [1600, 1200], ['brand', 'guidelines', 'identity']],
];

const buildDesignContent = (spec, index) => {
  const [title, category, size] = spec;
  const [width, height] = size;
  const [dark, accent, support] = paletteSets[index % paletteSets.length];
  const margin = Math.round(Math.min(width, height) * 0.08);
  const headline = title.replace('Design', '').replace('Poster', '').trim();
  const canvasJson = {
    width,
    height,
    background: dark,
    gradient: [dark, accent, support],
    exportFormats: ['PNG', 'JPG', 'SVG', 'PDF'],
    elements: [
      {
        id: 'background-panel',
        type: 'shape',
        shape: 'rectangle',
        x: margin,
        y: margin,
        width: width - margin * 2,
        height: height - margin * 2,
        radius: Math.round(Math.min(width, height) * 0.035),
        color: 'rgba(255,255,255,0.10)',
        editable: true,
      },
      {
        id: 'accent-shape',
        type: 'shape',
        shape: index % 2 === 0 ? 'circle' : 'rectangle',
        x: width - margin * 3.2,
        y: margin * 1.2,
        width: margin * 2.1,
        height: margin * 2.1,
        radius: margin,
        color: support,
        opacity: 0.88,
        editable: true,
      },
      {
        id: 'image-placeholder',
        type: 'image',
        x: margin,
        y: height * 0.52,
        width: width - margin * 2,
        height: height * 0.26,
        radius: 28,
        label: 'Image Placeholder',
        color: 'rgba(255,255,255,0.14)',
        editable: true,
      },
      {
        id: 'eyebrow',
        type: 'text',
        text: category,
        x: margin,
        y: margin * 1.7,
        fontSize: Math.max(24, Math.round(width * 0.035)),
        fontWeight: 700,
        color: support,
        fontFamily: 'Inter',
        editable: true,
      },
      {
        id: 'headline',
        type: 'text',
        text: headline,
        x: margin,
        y: margin * 2.55,
        fontSize: Math.max(44, Math.round(width * 0.075)),
        fontWeight: 900,
        color: '#ffffff',
        fontFamily: 'Inter',
        maxWidth: width - margin * 2,
        editable: true,
      },
      {
        id: 'subtitle',
        type: 'text',
        text: 'Edit text, colors, images, and layout in the design workspace.',
        x: margin,
        y: height - margin * 1.8,
        fontSize: Math.max(24, Math.round(width * 0.03)),
        fontWeight: 600,
        color: '#cbd5e1',
        fontFamily: 'Inter',
        maxWidth: width - margin * 2,
        editable: true,
      },
    ],
  };

  return { canvasJson };
};

export const designTemplates = designSpecs.map((spec, index) =>
  createTemplate({
    type: '2d',
    title: spec[0],
    category: spec[1],
    tags: spec[3],
    description: `Editable ${spec[1].toLowerCase()} design with real canvas size, text layers, shapes, image placeholder, and export-ready structure.`,
    palette: paletteSets[(index + 2) % paletteSets.length],
    index,
    content: buildDesignContent(spec, index),
  })
);

const makeObject = (name, type, position, color, scale = [1, 1, 1], extra = {}) => ({
  id: slugifyTitle(name),
  name,
  type,
  position,
  color,
  scale,
  rotation: extra.rotation || [0, 0, 0],
  animation: extra.animation || null,
  material: extra.material || 'standard',
  editable: true,
});

const scenePresets = {
  tree: (p) => [
    makeObject('Trunk', 'cylinder', [0, -0.65, 0], '#8b5a2b', [0.32, 1.25, 0.32]),
    makeObject('Lower Leaves', 'cone', [0, 0.25, 0], p[1], [1.25, 1.55, 1.25]),
    makeObject('Top Leaves', 'cone', [0, 1.1, 0], p[2], [0.9, 1.2, 0.9]),
  ],
  house: (p) => [
    makeObject('House Body', 'cube', [0, -0.15, 0], '#f8fafc', [1.7, 1.25, 1.4]),
    makeObject('Roof', 'cone', [0, 0.82, 0], p[1], [1.55, 0.75, 1.55], { rotation: [0, Math.PI / 4, 0] }),
    makeObject('Door', 'cube', [0, -0.58, 0.72], p[0], [0.42, 0.72, 0.06]),
  ],
  terrain: (p) => [
    makeObject('Ground', 'plane', [0, -0.9, 0], '#0f766e', [4.2, 1, 4.2], { rotation: [-Math.PI / 2, 0, 0] }),
    makeObject('Peak One', 'cone', [-0.9, 0, 0], p[1], [1.15, 1.75, 1.15]),
    makeObject('Peak Two', 'cone', [0.75, -0.15, -0.2], p[2], [1.35, 1.55, 1.35]),
  ],
  product: (p) => [
    makeObject('Product Body', 'cube', [0, 0, 0], p[1], [1.35, 1.9, 0.9], { animation: 'rotate' }),
    makeObject('Front Label', 'cube', [0, 0.12, 0.48], '#ffffff', [0.86, 0.86, 0.04]),
    makeObject('Display Base', 'cylinder', [0, -1.22, 0], p[2], [1.65, 0.25, 1.65]),
  ],
  device: (p) => [
    makeObject('Device Screen', 'cube', [0, 0.1, 0], '#020617', [1.25, 2.2, 0.08]),
    makeObject('Screen Glow', 'cube', [0, 0.1, 0.08], p[2], [1.05, 1.82, 0.04]),
    makeObject('Stand', 'cylinder', [0, -1.22, -0.18], p[1], [0.35, 0.6, 0.35]),
  ],
  furniture: (p) => [
    makeObject('Seat', 'cube', [0, -0.22, 0], p[1], [1.5, 0.22, 1.35]),
    makeObject('Back', 'cube', [0, 0.45, -0.6], p[2], [1.5, 1.15, 0.22]),
    makeObject('Leg Left', 'cylinder', [-0.55, -0.9, 0.45], p[0], [0.08, 0.8, 0.08]),
    makeObject('Leg Right', 'cylinder', [0.55, -0.9, 0.45], p[0], [0.08, 0.8, 0.08]),
  ],
  jewellery: (p) => [
    makeObject('Ring Band', 'torus', [0, 0, 0], '#facc15', [1.2, 1.2, 1.2], { animation: 'rotate' }),
    makeObject('Gem Stone', 'sphere', [0, 0.82, 0], p[2], [0.34, 0.34, 0.34]),
  ],
  coin: (p) => [
    makeObject('Coin Face', 'cylinder', [0, 0, 0], '#facc15', [1.1, 0.28, 1.1], { rotation: [Math.PI / 2, 0, 0], animation: 'rotate' }),
    makeObject('Center Mark', 'torus', [0, 0, 0.16], p[2], [0.56, 0.56, 0.56]),
  ],
  city: (p) => [
    makeObject('Block A', 'cube', [-1, -0.2, 0], p[1], [0.7, 1.6, 0.7]),
    makeObject('Block B', 'cube', [0, -0.45, 0.35], p[2], [0.75, 1.1, 0.75]),
    makeObject('Block C', 'cube', [1, -0.05, -0.2], '#e2e8f0', [0.72, 1.9, 0.72]),
  ],
  abstract: (p) => [
    makeObject('Main Sphere', 'sphere', [0, 0.25, 0], p[1], [1.1, 1.1, 1.1], { animation: 'float' }),
    makeObject('Accent Ring', 'torus', [0, 0.25, 0], p[2], [1.55, 1.55, 1.55], { rotation: [Math.PI / 2.8, 0, 0] }),
  ],
};

const modelSpecs = [
  ['Low Poly Tree', 'Nature', 'tree', ['tree', 'low poly', 'nature']],
  ['Basic House', 'Architecture', 'house', ['house', 'architecture', 'starter']],
  ['Geometric Sphere', 'Abstract', 'abstract', ['sphere', 'geometry', 'abstract']],
  ['Rotating Cube', 'Abstract', 'product', ['cube', 'rotation', 'geometry']],
  ['Mountain Terrain', 'Nature', 'terrain', ['mountain', 'terrain', 'landscape']],
  ['Product Box', 'Product', 'product', ['box', 'packaging', 'mockup']],
  ['Smartphone Mockup', 'Device', 'device', ['phone', 'device', 'mockup']],
  ['Laptop Mockup', 'Device', 'device', ['laptop', 'screen', 'mockup']],
  ['Chair Model', 'Furniture', 'furniture', ['chair', 'furniture', 'interior']],
  ['Table Model', 'Furniture', 'furniture', ['table', 'furniture', 'product']],
  ['Sofa Model', 'Furniture', 'furniture', ['sofa', 'interior', 'furniture']],
  ['Room Interior', 'Interior', 'city', ['room', 'interior', 'space']],
  ['Jewellery Ring', 'Retail', 'jewellery', ['ring', 'jewellery', 'gold']],
  ['Gold Coin', 'Finance', 'coin', ['coin', 'gold', 'finance']],
  ['Watch Model', 'Product', 'jewellery', ['watch', 'wearable', 'mockup']],
  ['Bottle Model', 'Product', 'product', ['bottle', 'packaging', 'product']],
  ['Perfume Bottle', 'Product', 'product', ['perfume', 'bottle', 'luxury']],
  ['Car Model Placeholder', 'Vehicle', 'product', ['car', 'vehicle', 'placeholder']],
  ['Bike Model Placeholder', 'Vehicle', 'product', ['bike', 'vehicle', 'placeholder']],
  ['Building Model', 'Architecture', 'city', ['building', 'architecture', 'city']],
  ['Shop Front Model', 'Retail', 'house', ['shop', 'storefront', 'retail']],
  ['Restaurant Interior', 'Interior', 'city', ['restaurant', 'interior', 'hospitality']],
  ['Gym Equipment', 'Fitness', 'product', ['gym', 'equipment', 'fitness']],
  ['Dumbbell Model', 'Fitness', 'coin', ['dumbbell', 'fitness', 'product']],
  ['Logo 3D Text', 'Branding', 'abstract', ['logo', 'text', 'branding']],
  ['Floating Icons Set', 'UI', 'abstract', ['icons', 'floating', 'ui']],
  ['Abstract Shapes', 'Abstract', 'abstract', ['shapes', 'modern', 'geometry']],
  ['Planet Scene', 'Space', 'abstract', ['planet', 'space', 'orbit']],
  ['Character Placeholder', 'Characters', 'product', ['character', 'avatar', 'placeholder']],
  ['Trophy Model', 'Awards', 'jewellery', ['trophy', 'award', 'winner']],
  ['Product Display Stand', 'Product', 'product', ['display', 'stand', 'retail']],
  ['Packaging Box', 'Product', 'product', ['packaging', 'box', 'commerce']],
  ['Exhibition Booth', 'Events', 'city', ['booth', 'event', 'exhibition']],
  ['UI Device Mockup', 'Device', 'device', ['ui', 'device', 'mockup']],
  ['Isometric City Block', 'Architecture', 'city', ['isometric', 'city', 'block']],
];

const buildThreeContent = (spec, index) => {
  const [, , preset] = spec;
  const palette = paletteSets[index % paletteSets.length];
  const objects = (scenePresets[preset] || scenePresets.abstract)(palette);
  return {
    threeScene: {
      name: spec[0],
      camera: [0, 2.2, 5],
      lights: [
        { type: 'ambient', intensity: 0.65, color: '#ffffff' },
        { type: 'directional', intensity: 1.25, color: '#ffffff', position: [4, 6, 5] },
      ],
      background: '#050816',
      objects,
      controls: { orbit: true, zoom: true, pan: true },
      exportFormats: ['GLB', 'OBJ'],
    },
  };
};

export const modelTemplates = modelSpecs.map((spec, index) =>
  createTemplate({
    type: '3d',
    title: spec[0],
    category: spec[1],
    tags: spec[3],
    description: `Three.js-ready ${spec[1].toLowerCase()} scene with editable objects, materials, lights, camera, and export placeholders.`,
    palette: paletteSets[(index + 4) % paletteSets.length],
    index,
    content: buildThreeContent(spec, index),
  })
);

const animationSpecs = [
  ['Logo Intro', 'Intro', 'logo', ['logo', 'intro', 'brand']],
  ['Loading Spinner', 'Loaders', 'spinner', ['loader', 'spinner', 'ui']],
  ['Text Typewriter', 'Text', 'typewriter', ['text', 'typing', 'headline']],
  ['Bouncing Ball', 'Motion', 'bounce', ['ball', 'motion', 'loop']],
  ['Particle Explosion', 'Effects', 'particles', ['particles', 'burst', 'effects']],
  ['Slide In Cards', 'UI', 'cards', ['cards', 'slide', 'ui']],
  ['Fade In Hero', 'Hero', 'fadeHero', ['hero', 'fade', 'landing']],
  ['Button Hover Glow', 'Microinteraction', 'buttonGlow', ['button', 'hover', 'glow']],
  ['Pricing Card Hover', 'UI', 'cardHover', ['pricing', 'hover', 'cards']],
  ['Page Transition', 'Transitions', 'pageTransition', ['page', 'transition', 'route']],
  ['Scroll Reveal', 'Scroll', 'scrollReveal', ['scroll', 'reveal', 'sections']],
  ['Floating Icons', 'Decorative', 'floatingIcons', ['icons', 'floating', 'loop']],
  ['Rotating Cube Animation', '3D', 'cube', ['cube', '3d', 'rotate']],
  ['3D Product Spin', '3D', 'productSpin', ['product', 'spin', 'showcase']],
  ['Text Reveal', 'Text', 'textReveal', ['text', 'reveal', 'headline']],
  ['Gradient Background Loop', 'Background', 'gradient', ['gradient', 'background', 'loop']],
  ['Neon Pulse', 'Effects', 'pulse', ['neon', 'pulse', 'glow']],
  ['Navbar Dropdown Animation', 'Navigation', 'dropdown', ['navbar', 'dropdown', 'menu']],
  ['Modal Pop Animation', 'UI', 'modalPop', ['modal', 'pop', 'ui']],
  ['Toast Notification Animation', 'UI', 'toast', ['toast', 'notification', 'ui']],
  ['Image Gallery Transition', 'Media', 'gallery', ['gallery', 'image', 'transition']],
  ['Counter Number Animation', 'Data', 'counter', ['counter', 'number', 'stats']],
  ['Progress Bar Animation', 'Data', 'progress', ['progress', 'bar', 'loading']],
  ['Skeleton Loader', 'Loaders', 'skeleton', ['skeleton', 'loader', 'ui']],
  ['Wave Animation', 'Decorative', 'wave', ['wave', 'svg', 'loop']],
  ['Confetti Animation', 'Effects', 'confetti', ['confetti', 'celebration', 'success']],
  ['Carousel Slide Animation', 'Media', 'carousel', ['carousel', 'slide', 'gallery']],
  ['Parallax Hero', 'Hero', 'parallax', ['parallax', 'hero', 'scroll']],
  ['Card Flip Animation', 'UI', 'flip', ['card', 'flip', 'interaction']],
  ['Menu Morph Animation', 'Navigation', 'menuMorph', ['menu', 'morph', 'navigation']],
  ['Search Bar Expand', 'Forms', 'searchExpand', ['search', 'expand', 'input']],
  ['Form Success Checkmark', 'Forms', 'checkmark', ['form', 'success', 'check']],
  ['Social Icon Hover', 'Microinteraction', 'socialHover', ['social', 'hover', 'icons']],
  ['AI Chat Typing Dots', 'AI', 'typingDots', ['ai', 'chat', 'typing']],
  ['Dashboard Chart Animation', 'Data', 'chart', ['dashboard', 'chart', 'data']],
];

const animationHtmlByKind = (kind, title) => {
  const label = title.replace('Animation', '').trim();
  const particles = Array.from({ length: 14 }, (_, index) => `<span style="--i:${index}"></span>`).join('');
  const bars = Array.from({ length: 6 }, (_, index) => `<span style="--i:${index}"></span>`).join('');

  const map = {
    logo: `<div class="logo-mark">SC</div><h2>${label}</h2>`,
    spinner: '<div class="spinner"></div>',
    typewriter: `<h2 class="typewriter">Build faster with ShopCraft</h2>`,
    bounce: '<div class="floor"></div><div class="ball"></div>',
    particles: `<div class="particle-field">${particles}</div>`,
    cards: '<div class="cards"><article>Plan</article><article>Build</article><article>Launch</article></div>',
    fadeHero: '<section class="mini-hero"><h2>Launch Today</h2><p>Hero copy fades into focus.</p></section>',
    buttonGlow: '<button class="glow-button">Hover Ready</button>',
    cardHover: '<article class="pricing-card"><span>Pro</span><strong>$29</strong><p>Animated lift and glow.</p></article>',
    pageTransition: '<div class="page-swipe"></div><h2>New Page</h2>',
    scrollReveal: '<div class="reveal-stack"><article></article><article></article><article></article></div>',
    floatingIcons: '<div class="icon-cloud"><span>+</span><span>*</span><span>#</span><span>@</span></div>',
    cube: '<div class="css-cube"><span></span><span></span><span></span></div>',
    productSpin: '<div class="product-spin"><span></span></div>',
    textReveal: '<h2 class="text-reveal"><span>Reveal the message</span></h2>',
    gradient: '<div class="gradient-loop"><h2>Gradient Loop</h2></div>',
    pulse: '<div class="neon-ring"></div>',
    dropdown: '<div class="dropdown-demo"><button>Menu</button><ul><li>Projects</li><li>Templates</li><li>Settings</li></ul></div>',
    modalPop: '<div class="modal-demo"><strong>Success</strong><p>Your modal is ready.</p></div>',
    toast: '<div class="toast-demo">Saved successfully</div>',
    gallery: '<div class="gallery-demo"><span></span><span></span><span></span></div>',
    counter: '<div class="counter-demo">12,480</div>',
    progress: '<div class="progress-demo"><span></span></div>',
    skeleton: '<div class="skeleton-demo"><span></span><span></span><span></span></div>',
    wave: '<div class="wave-demo"><span></span></div>',
    confetti: `<div class="confetti-demo">${particles}</div>`,
    carousel: '<div class="carousel-demo"><article>01</article><article>02</article><article>03</article></div>',
    parallax: '<div class="parallax-demo"><span></span><h2>Depth</h2></div>',
    flip: '<div class="flip-card"><span>Front</span><strong>Back</strong></div>',
    menuMorph: '<button class="menu-morph"><span></span><span></span><span></span></button>',
    searchExpand: '<div class="search-expand">Search templates</div>',
    checkmark: '<div class="checkmark-demo"></div>',
    socialHover: '<div class="social-demo"><span>in</span><span>x</span><span>ig</span></div>',
    typingDots: '<div class="typing-dots"><span></span><span></span><span></span></div>',
    chart: `<div class="chart-demo">${bars}</div>`,
  };

  return map[kind] || `<h2>${label}</h2>`;
};

const animationCssByKind = (kind, scope) => {
  const base = `
    .${scope} {
      --accent: var(--template-accent, #6366f1);
      --support: var(--template-support, #22d3ee);
      --duration: var(--template-duration, 2.4s);
      min-height: 320px;
      display: grid;
      place-items: center;
      padding: 40px;
      overflow: hidden;
      color: #fff;
      background: radial-gradient(circle at 50% 20%, rgba(99,102,241,0.28), transparent 38%), #020617;
      font-family: Inter, ui-sans-serif, system-ui, sans-serif;
    }
    .${scope} * { box-sizing: border-box; }
    .${scope} h2 { margin: 14px 0 0; font-size: 32px; line-height: 1.15; text-align: center; }
  `;

  const patterns = {
    logo: `.${scope} .logo-mark{width:96px;height:96px;border-radius:28px;display:grid;place-items:center;background:linear-gradient(135deg,var(--accent),var(--support));font-size:32px;font-weight:900;animation:${scope}-pop var(--duration) ease infinite alternate;} @keyframes ${scope}-pop{from{transform:scale(.72) rotate(-8deg);opacity:.5}to{transform:scale(1) rotate(0);opacity:1}}`,
    spinner: `.${scope} .spinner{width:92px;height:92px;border:10px solid rgba(255,255,255,.16);border-top-color:var(--accent);border-radius:50%;animation:${scope}-spin var(--duration) linear infinite;} @keyframes ${scope}-spin{to{transform:rotate(360deg)}}`,
    typewriter: `.${scope} .typewriter{width:28ch;overflow:hidden;white-space:nowrap;border-right:4px solid var(--support);animation:${scope}-type var(--duration) steps(28) infinite alternate;} @keyframes ${scope}-type{from{width:0}to{width:28ch}}`,
    bounce: `.${scope} .ball{width:76px;height:76px;border-radius:50%;background:var(--accent);animation:${scope}-bounce var(--duration) cubic-bezier(.28,.84,.42,1) infinite;} .${scope} .floor{position:absolute;width:260px;height:10px;border-radius:99px;background:rgba(255,255,255,.16);transform:translateY(82px)} @keyframes ${scope}-bounce{0%,100%{transform:translateY(-90px)}50%{transform:translateY(54px) scale(1.06,.88)}}`,
    particles: `.${scope} .particle-field{position:relative;width:240px;height:240px}.${scope} .particle-field span{position:absolute;left:50%;top:50%;width:14px;height:14px;border-radius:50%;background:var(--accent);animation:${scope}-burst var(--duration) ease-out infinite;transform:rotate(calc(var(--i)*26deg)) translateX(0)} @keyframes ${scope}-burst{to{transform:rotate(calc(var(--i)*26deg)) translateX(112px);opacity:0}}`,
    cards: `.${scope} .cards{display:flex;gap:16px}.${scope} .cards article{width:108px;height:132px;border-radius:18px;background:rgba(255,255,255,.12);display:grid;place-items:center;font-weight:900;animation:${scope}-slide var(--duration) ease infinite alternate;animation-delay:calc(var(--i,0)*.12s)} .${scope} .cards article:nth-child(2){--i:1}.${scope} .cards article:nth-child(3){--i:2}@keyframes ${scope}-slide{from{transform:translateY(44px);opacity:.35}to{transform:translateY(0);opacity:1}}`,
    fadeHero: `.${scope} .mini-hero{text-align:center;animation:${scope}-fade var(--duration) ease infinite alternate}.${scope} .mini-hero p{color:#cbd5e1}@keyframes ${scope}-fade{from{opacity:.2;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}`,
    buttonGlow: `.${scope} .glow-button{border:0;border-radius:16px;padding:18px 28px;background:var(--accent);color:#fff;font-weight:900;box-shadow:0 0 0 rgba(99,102,241,0);animation:${scope}-glow var(--duration) ease infinite alternate}@keyframes ${scope}-glow{to{box-shadow:0 0 34px var(--accent);transform:translateY(-5px)}}`,
    cardHover: `.${scope} .pricing-card{width:230px;border-radius:24px;padding:28px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.18);animation:${scope}-lift var(--duration) ease infinite alternate}.${scope} .pricing-card strong{display:block;font-size:48px}@keyframes ${scope}-lift{to{transform:translateY(-14px);border-color:var(--support)}}`,
    pageTransition: `.${scope} .page-swipe{position:absolute;inset:0;background:linear-gradient(90deg,var(--accent),var(--support));animation:${scope}-wipe var(--duration) ease infinite}.${scope} h2{position:relative}@keyframes ${scope}-wipe{0%{transform:translateX(-100%)}45%,55%{transform:translateX(0)}100%{transform:translateX(100%)}}`,
    scrollReveal: `.${scope} .reveal-stack{display:grid;gap:14px;width:280px}.${scope} .reveal-stack article{height:58px;border-radius:16px;background:rgba(255,255,255,.14);animation:${scope}-reveal var(--duration) ease infinite alternate;animation-delay:calc(var(--i,0)*.14s)}.${scope} .reveal-stack article:nth-child(2){--i:1}.${scope} .reveal-stack article:nth-child(3){--i:2}@keyframes ${scope}-reveal{from{opacity:.2;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}`,
    floatingIcons: `.${scope} .icon-cloud{position:relative;width:260px;height:220px}.${scope} .icon-cloud span{position:absolute;width:58px;height:58px;border-radius:18px;background:rgba(255,255,255,.12);display:grid;place-items:center;font-weight:900;animation:${scope}-float var(--duration) ease-in-out infinite alternate}.${scope} .icon-cloud span:nth-child(2){right:0;top:20px}.${scope} .icon-cloud span:nth-child(3){left:34px;bottom:0}.${scope} .icon-cloud span:nth-child(4){right:46px;bottom:18px}@keyframes ${scope}-float{to{transform:translateY(-22px)}}`,
    cube: `.${scope} .css-cube{width:110px;height:110px;transform-style:preserve-3d;animation:${scope}-cube var(--duration) linear infinite}.${scope} .css-cube span{position:absolute;inset:0;background:linear-gradient(135deg,var(--accent),var(--support));opacity:.85;border:1px solid rgba(255,255,255,.35)}.${scope} .css-cube span:nth-child(2){transform:rotateY(90deg)}.${scope} .css-cube span:nth-child(3){transform:rotateX(90deg)}@keyframes ${scope}-cube{to{transform:rotateX(360deg) rotateY(360deg)}}`,
    productSpin: `.${scope} .product-spin{width:140px;height:190px;border-radius:24px;background:linear-gradient(135deg,var(--accent),var(--support));animation:${scope}-product var(--duration) ease-in-out infinite}.${scope} .product-spin span{display:block;width:70%;height:46%;margin:42px auto;border-radius:18px;background:rgba(255,255,255,.26)}@keyframes ${scope}-product{50%{transform:rotateY(180deg)}}`,
    textReveal: `.${scope} .text-reveal{overflow:hidden}.${scope} .text-reveal span{display:block;animation:${scope}-text var(--duration) ease infinite alternate}@keyframes ${scope}-text{from{transform:translateY(120%)}to{transform:translateY(0)}}`,
    gradient: `.${scope} .gradient-loop{width:320px;height:190px;border-radius:28px;display:grid;place-items:center;background:linear-gradient(120deg,var(--accent),var(--support),#f97316);background-size:240% 240%;animation:${scope}-gradient var(--duration) ease infinite alternate}@keyframes ${scope}-gradient{to{background-position:100% 50%}}`,
    pulse: `.${scope} .neon-ring{width:132px;height:132px;border-radius:50%;border:4px solid var(--support);box-shadow:0 0 24px var(--support);animation:${scope}-pulse var(--duration) ease infinite}@keyframes ${scope}-pulse{50%{transform:scale(1.18);box-shadow:0 0 54px var(--accent)}}`,
    dropdown: `.${scope} .dropdown-demo{position:relative}.${scope} .dropdown-demo button{padding:14px 28px;border:0;border-radius:14px;background:var(--accent);color:#fff;font-weight:900}.${scope} .dropdown-demo ul{list-style:none;margin:10px 0 0;padding:12px;width:180px;border-radius:18px;background:#fff;color:#0f172a;animation:${scope}-drop var(--duration) ease infinite alternate}.${scope} .dropdown-demo li{padding:8px 10px}@keyframes ${scope}-drop{from{opacity:.2;transform:translateY(-16px)}to{opacity:1;transform:translateY(0)}}`,
    modalPop: `.${scope} .modal-demo{width:270px;border-radius:28px;padding:32px;background:#fff;color:#0f172a;text-align:center;animation:${scope}-modal var(--duration) cubic-bezier(.2,.8,.2,1) infinite alternate}.${scope} .modal-demo strong{font-size:28px}@keyframes ${scope}-modal{from{opacity:.25;transform:scale(.72)}to{opacity:1;transform:scale(1)}}`,
    toast: `.${scope} .toast-demo{border-radius:18px;padding:18px 24px;background:#fff;color:#0f172a;font-weight:900;animation:${scope}-toast var(--duration) ease infinite alternate}@keyframes ${scope}-toast{from{transform:translateX(90px);opacity:.2}to{transform:translateX(0);opacity:1}}`,
    gallery: `.${scope} .gallery-demo{display:flex;width:340px;height:210px;overflow:hidden;border-radius:26px}.${scope} .gallery-demo span{min-width:100%;background:linear-gradient(135deg,var(--accent),var(--support));animation:${scope}-gallery var(--duration) ease infinite}.${scope} .gallery-demo span:nth-child(2){background:linear-gradient(135deg,#f97316,var(--support))}.${scope} .gallery-demo span:nth-child(3){background:linear-gradient(135deg,#22c55e,var(--accent))}@keyframes ${scope}-gallery{50%{transform:translateX(-100%)}100%{transform:translateX(-200%)}}`,
    counter: `.${scope} .counter-demo{font-size:72px;font-weight:900;color:var(--support);animation:${scope}-counter var(--duration) ease infinite alternate}@keyframes ${scope}-counter{from{filter:blur(10px);opacity:.25;transform:translateY(18px)}to{filter:blur(0);opacity:1;transform:translateY(0)}}`,
    progress: `.${scope} .progress-demo{width:340px;height:20px;border-radius:99px;background:rgba(255,255,255,.12);overflow:hidden}.${scope} .progress-demo span{display:block;height:100%;width:80%;border-radius:inherit;background:linear-gradient(90deg,var(--accent),var(--support));animation:${scope}-progress var(--duration) ease infinite alternate}@keyframes ${scope}-progress{from{width:8%}to{width:86%}}`,
    skeleton: `.${scope} .skeleton-demo{width:320px;display:grid;gap:14px}.${scope} .skeleton-demo span{height:36px;border-radius:14px;background:linear-gradient(90deg,rgba(255,255,255,.1),rgba(255,255,255,.24),rgba(255,255,255,.1));background-size:220% 100%;animation:${scope}-skeleton var(--duration) linear infinite}.${scope} .skeleton-demo span:nth-child(1){width:80%}.${scope} .skeleton-demo span:nth-child(3){width:62%}@keyframes ${scope}-skeleton{to{background-position:-220% 0}}`,
    wave: `.${scope} .wave-demo{position:relative;width:360px;height:180px;overflow:hidden;border-radius:28px;background:rgba(255,255,255,.08)}.${scope} .wave-demo span{position:absolute;left:-20%;right:-20%;bottom:18px;height:74px;border-radius:50%;background:var(--support);animation:${scope}-wave var(--duration) ease-in-out infinite alternate}@keyframes ${scope}-wave{to{transform:translateX(72px) translateY(-20px)}}`,
    confetti: `.${scope} .confetti-demo{position:relative;width:260px;height:220px}.${scope} .confetti-demo span{position:absolute;left:50%;top:10%;width:10px;height:26px;background:var(--accent);animation:${scope}-confetti var(--duration) ease-in infinite;animation-delay:calc(var(--i)*.04s);transform:translateX(calc((var(--i) - 7)*18px))}@keyframes ${scope}-confetti{to{transform:translateX(calc((var(--i) - 7)*28px)) translateY(210px) rotate(240deg);opacity:0}}`,
    carousel: `.${scope} .carousel-demo{display:flex;gap:18px;animation:${scope}-carousel var(--duration) ease infinite alternate}.${scope} .carousel-demo article{width:120px;height:150px;border-radius:22px;background:rgba(255,255,255,.12);display:grid;place-items:center;font-weight:900}@keyframes ${scope}-carousel{to{transform:translateX(-92px)}}`,
    parallax: `.${scope} .parallax-demo{position:relative;width:360px;height:220px;border-radius:28px;overflow:hidden;background:linear-gradient(135deg,var(--accent),#020617)}.${scope} .parallax-demo span{position:absolute;inset:36px;border-radius:24px;background:rgba(255,255,255,.15);animation:${scope}-parallax var(--duration) ease infinite alternate}.${scope} .parallax-demo h2{position:relative;margin-top:78px}@keyframes ${scope}-parallax{to{transform:translateY(-28px) scale(1.08)}}`,
    flip: `.${scope} .flip-card{position:relative;width:210px;height:150px;transform-style:preserve-3d;animation:${scope}-flip var(--duration) ease infinite}.${scope} .flip-card span,.${scope} .flip-card strong{position:absolute;inset:0;border-radius:24px;display:grid;place-items:center;background:var(--accent);backface-visibility:hidden}.${scope} .flip-card strong{background:var(--support);transform:rotateY(180deg)}@keyframes ${scope}-flip{50%,100%{transform:rotateY(180deg)}}`,
    menuMorph: `.${scope} .menu-morph{width:96px;height:76px;border:0;border-radius:22px;background:rgba(255,255,255,.12);display:grid;place-items:center;padding:18px}.${scope} .menu-morph span{display:block;width:48px;height:5px;border-radius:99px;background:#fff;animation:${scope}-menu var(--duration) ease infinite alternate}.${scope} .menu-morph span:nth-child(2){animation-delay:.08s}.${scope} .menu-morph span:nth-child(3){animation-delay:.16s}@keyframes ${scope}-menu{to{transform:rotate(38deg);background:var(--support)}}`,
    searchExpand: `.${scope} .search-expand{width:190px;border-radius:999px;padding:18px 24px;background:#fff;color:#64748b;animation:${scope}-search var(--duration) ease infinite alternate}@keyframes ${scope}-search{to{width:340px;color:#0f172a;box-shadow:0 20px 60px rgba(99,102,241,.3)}}`,
    checkmark: `.${scope} .checkmark-demo{width:118px;height:118px;border-radius:50%;border:8px solid var(--support);position:relative;animation:${scope}-check-circle var(--duration) ease infinite alternate}.${scope} .checkmark-demo:after{content:"";position:absolute;width:54px;height:28px;border-left:8px solid #fff;border-bottom:8px solid #fff;left:29px;top:35px;transform:rotate(-45deg);animation:${scope}-check var(--duration) ease infinite alternate}@keyframes ${scope}-check-circle{from{opacity:.25;transform:scale(.8)}to{opacity:1;transform:scale(1)}}@keyframes ${scope}-check{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}}`,
    socialHover: `.${scope} .social-demo{display:flex;gap:16px}.${scope} .social-demo span{width:70px;height:70px;border-radius:22px;background:rgba(255,255,255,.12);display:grid;place-items:center;font-weight:900;animation:${scope}-social var(--duration) ease infinite alternate}.${scope} .social-demo span:nth-child(2){animation-delay:.12s}.${scope} .social-demo span:nth-child(3){animation-delay:.24s}@keyframes ${scope}-social{to{transform:translateY(-16px);background:var(--accent)}}`,
    typingDots: `.${scope} .typing-dots{display:flex;gap:12px;padding:20px 24px;border-radius:24px;background:rgba(255,255,255,.12)}.${scope} .typing-dots span{width:18px;height:18px;border-radius:50%;background:var(--support);animation:${scope}-dots var(--duration) ease infinite}.${scope} .typing-dots span:nth-child(2){animation-delay:.15s}.${scope} .typing-dots span:nth-child(3){animation-delay:.3s}@keyframes ${scope}-dots{50%{transform:translateY(-16px);opacity:.45}}`,
    chart: `.${scope} .chart-demo{height:220px;display:flex;align-items:end;gap:14px}.${scope} .chart-demo span{width:34px;border-radius:12px 12px 0 0;background:linear-gradient(180deg,var(--support),var(--accent));height:calc(42px + var(--i)*22px);animation:${scope}-chart var(--duration) ease infinite alternate;animation-delay:calc(var(--i)*.06s)}@keyframes ${scope}-chart{from{height:16px;opacity:.4}}`,
  };

  return `${base}\n${patterns[kind] || patterns.logo}`;
};

const buildAnimationContent = (spec, index) => {
  const [title, , kind] = spec;
  const scope = `sca-${slugifyTitle(title)}`;
  const [, accent, support] = paletteSets[index % paletteSets.length];
  const css = animationCssByKind(kind, scope);
  const html = `<div class="${scope}" style="--template-accent:${accent};--template-support:${support};--template-duration:${1.8 + (index % 5) * 0.3}s">${animationHtmlByKind(kind, title)}</div>`;
  const js = `const animationRoot = document.querySelector('.${scope}');\nif (animationRoot) animationRoot.dataset.loop = 'true';`;

  return {
    html,
    css,
    js,
    animationCode: `${html}\n\n<style>\n${css}\n</style>\n\n<script>\n${js}\n</script>`,
    settings: {
      duration: `${1.8 + (index % 5) * 0.3}s`,
      animationType: kind,
      color: accent,
      loop: true,
      direction: 'normal',
    },
  };
};

export const animationTemplates = animationSpecs.map((spec, index) =>
  createTemplate({
    type: 'animation',
    title: spec[0],
    category: spec[1],
    tags: spec[3],
    description: `Live ${spec[1].toLowerCase()} animation preset with editable timing, color, loop behavior, and copy-ready CSS/JS code.`,
    palette: paletteSets[(index + 6) % paletteSets.length],
    index,
    content: buildAnimationContent(spec, index),
  })
);

export { websiteDesignTypes, websiteProfessions };
export const websiteTemplates = designWebsiteTemplates;

export const templates = [
  ...websiteTemplates,
  ...designTemplates,
  ...animationTemplates,
  ...modelTemplates,
];

export const templatesByType = templates.reduce((groups, template) => {
  groups[template.type] = groups[template.type] || [];
  groups[template.type].push(template);
  return groups;
}, {});

export const templateCounts = Object.keys(templateTypeLabels).reduce((counts, type) => {
  counts[type] = templatesByType[type]?.length || 0;
  return counts;
}, {});

export const getTemplateById = (templateId) =>
  templates.find((template) => template.id === templateId) || null;



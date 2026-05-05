import { getSectionBlueprint } from './sectionBlocks';
import { getThemePreset } from './themePresets';
import { deepClone } from '../utils/deepClone';

const makeSections = (types, businessName) =>
  types.map((type) => {
    const section = deepClone(getSectionBlueprint(type));
    if (type === 'hero' && section.elements?.[0]) {
      section.elements[0].content = `${businessName} built for modern customers.`;
    }
    if (type === 'footer' && section.elements?.[0]) {
      section.elements[0].content = businessName;
    }
    return section;
  });

const template = (id, name, category, themeId, types, thumbnail) => {
  const sections = makeSections(types, name);
  return {
    id,
    name,
    category,
    thumbnail,
    theme: getThemePreset(themeId),
    pages: [
      { id: `${id}-home`, name: 'Home', slug: 'home', isHome: true, sections },
      { id: `${id}-about`, name: 'About', slug: 'about', isHome: false, sections: makeSections(['about', 'team', 'footer'], name) },
      { id: `${id}-contact`, name: 'Contact', slug: 'contact', isHome: false, sections: makeSections(['contact', 'footer'], name) },
    ],
    sections,
  };
};

export const websiteTemplates = [
  template('modern-portfolio', 'Modern Portfolio', 'portfolio', 'minimal-portfolio', ['hero', 'about', 'gallery', 'testimonials', 'contact', 'footer'], 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=900&auto=format&fit=crop'),
  template('business-landing', 'Business Landing', 'business', 'clean-white', ['hero', 'services', 'pricing', 'testimonials', 'faq', 'contact', 'footer'], 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&auto=format&fit=crop'),
  template('restaurant-menu', 'Restaurant Menu', 'restaurant', 'restaurant-warm', ['hero', 'about', 'product', 'gallery', 'testimonials', 'contact', 'footer'], 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&auto=format&fit=crop'),
  template('ecommerce-store', 'E-commerce Store', 'ecommerce', 'clean-white', ['hero', 'product', 'services', 'testimonials', 'faq', 'contact', 'footer'], 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900&auto=format&fit=crop'),
  template('photography-studio', 'Photography Studio', 'photography', 'luxury-black', ['hero', 'gallery', 'about', 'services', 'testimonials', 'contact', 'footer'], 'https://images.unsplash.com/photo-1493863641943-9b68992a8d07?w=900&auto=format&fit=crop'),
  template('gym-fitness', 'Gym & Fitness', 'fitness', 'fitness-bold', ['hero', 'services', 'pricing', 'gallery', 'testimonials', 'contact', 'footer'], 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&auto=format&fit=crop'),
  template('education-coaching', 'Education Coaching', 'education', 'startup-gradient', ['hero', 'about', 'services', 'pricing', 'faq', 'contact', 'footer'], 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=900&auto=format&fit=crop'),
  template('healthcare-clinic', 'Healthcare Clinic', 'healthcare', 'clean-white', ['hero', 'services', 'about', 'testimonials', 'faq', 'contact', 'footer'], 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=900&auto=format&fit=crop'),
  template('real-estate', 'Real Estate', 'real-estate', 'minimal-portfolio', ['hero', 'services', 'gallery', 'testimonials', 'contact', 'footer'], 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=900&auto=format&fit=crop'),
  template('event-landing', 'Event Landing', 'event', 'creative-studio', ['hero', 'about', 'services', 'pricing', 'faq', 'contact', 'footer'], 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=900&auto=format&fit=crop'),
  template('salon-beauty', 'Salon & Beauty', 'salon', 'clean-white', ['hero', 'services', 'gallery', 'pricing', 'testimonials', 'booking', 'contact', 'footer'], 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=900&auto=format&fit=crop'),
  template('cafe-bistro', 'Cafe & Bistro', 'cafe', 'restaurant-warm', ['hero', 'about', 'restaurantMenu', 'gallery', 'testimonials', 'contact', 'footer'], 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=900&auto=format&fit=crop'),
  template('freelancer-resume', 'Freelancer Resume', 'freelancer', 'minimal-portfolio', ['hero', 'about', 'services', 'portfolio', 'testimonials', 'contact', 'footer'], 'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?w=900&auto=format&fit=crop'),
  template('saas-startup', 'SaaS Startup', 'saas', 'startup-gradient', ['hero', 'services', 'pricing', 'testimonials', 'faq', 'newsletter', 'footer'], 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&auto=format&fit=crop'),
  template('nonprofit-charity', 'Nonprofit & Charity', 'nonprofit', 'clean-white', ['hero', 'about', 'services', 'team', 'testimonials', 'contact', 'newsletter', 'footer'], 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=900&auto=format&fit=crop'),
  template('travel-agency', 'Travel Agency', 'travel', 'creative-studio', ['hero', 'services', 'gallery', 'testimonials', 'booking', 'faq', 'contact', 'footer'], 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=900&auto=format&fit=crop'),
  template('law-firm', 'Law Firm', 'legal', 'luxury-black', ['hero', 'about', 'services', 'team', 'testimonials', 'faq', 'contact', 'footer'], 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=900&auto=format&fit=crop'),
  template('music-band', 'Music & Band', 'music', 'fitness-bold', ['hero', 'about', 'gallery', 'blog', 'newsletter', 'contact', 'footer'], 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=900&auto=format&fit=crop'),
  template('pet-services', 'Pet Services', 'pets', 'clean-white', ['hero', 'services', 'gallery', 'pricing', 'testimonials', 'booking', 'contact', 'footer'], 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=900&auto=format&fit=crop'),
  template('construction-builder', 'Construction & Builder', 'construction', 'fitness-bold', ['hero', 'about', 'services', 'portfolio', 'testimonials', 'contact', 'footer'], 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900&auto=format&fit=crop'),
];

export const websiteCategories = [
  { id: 'portfolio', name: 'Portfolio' },
  { id: 'business', name: 'Business Landing' },
  { id: 'restaurant', name: 'Restaurant' },
  { id: 'ecommerce', name: 'E-commerce' },
  { id: 'photography', name: 'Photography' },
  { id: 'fitness', name: 'Gym & Fitness' },
  { id: 'education', name: 'Education' },
  { id: 'healthcare', name: 'Healthcare' },
  { id: 'real-estate', name: 'Real Estate' },
  { id: 'event', name: 'Event' },
  { id: 'salon', name: 'Salon & Beauty' },
  { id: 'cafe', name: 'Cafe & Bistro' },
  { id: 'freelancer', name: 'Freelancer' },
  { id: 'saas', name: 'SaaS Startup' },
  { id: 'nonprofit', name: 'Nonprofit' },
  { id: 'travel', name: 'Travel' },
  { id: 'legal', name: 'Law Firm' },
  { id: 'music', name: 'Music & Band' },
  { id: 'pets', name: 'Pet Services' },
  { id: 'construction', name: 'Construction' },
  { id: 'custom', name: 'Custom' },
];

export const getWebsiteTemplate = (templateId) =>
  websiteTemplates.find((templateItem) => templateItem.id === templateId);


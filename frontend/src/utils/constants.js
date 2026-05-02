export const APP_NAME = 'ShopCraft Studio';

export const PROJECT_TYPES = [
  { 
    id: 'website-builder', 
    name: 'Website Builder', 
    icon: '🌐', 
    color: '#6366f1', 
    description: 'Create a professional business website using AI templates.',
    path: '/dashboard/website-builder'
  },
  { 
    id: 'design-2d', 
    name: '2D Design', 
    icon: '🎨', 
    color: '#ec4899', 
    description: 'Design posters, banners, social posts, business cards, and marketing graphics.',
    path: '/dashboard/design-2d'
  },
  { 
    id: 'design-3d', 
    name: '3D Design', 
    icon: '🧊', 
    color: '#10b981', 
    description: 'Create simple 3D product visuals, mockups, and presentation graphics.',
    path: '/dashboard/design-3d'
  },
  { 
    id: 'animations', 
    name: 'Animation Studio', 
    icon: '🎬', 
    color: '#f59e0b', 
    description: 'Create intro animations, product motion, website effects, and visual animations.',
    path: '/dashboard/animations'
  },
];

export const API_URL = 'http://localhost:5000/api';

export const STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
};

export const COLORS = {
  primary: '#6366f1',
  secondary: '#ec4899',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  dark: '#0f172a',
  light: '#f8fafc',
};

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

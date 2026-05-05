export type TemplateKind = 'website' | '2d' | '3d' | 'animation' | string;
export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced' | string;

export interface TemplateContent {
  html?: string;
  css?: string;
  js?: string;
  reactComponent?: string;
  canvasJson?: Record<string, unknown>;
  threeScene?: Record<string, unknown>;
  animationCode?: string;
  sections?: string[];
  sectionOrder?: string[];
  settings?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface Template {
  id: string;
  title: string;
  type: TemplateKind;
  category?: string;
  designType?: string;
  suitableFor?: string[];
  difficulty?: Difficulty;
  tags?: string[];
  description?: string;
  thumbnail?: string;
  workspaceType?: string;
  content?: TemplateContent;
  layout?: Record<string, unknown>;
  sections?: string[];
  [key: string]: unknown;
}

export interface WebsiteTemplate extends Template {
  type: 'website';
  content: TemplateContent & {
    html?: string;
    css?: string;
    js?: string;
  };
}

export interface DesignTemplate extends Template {
  type: '2d';
  content: TemplateContent & {
    canvasJson?: Record<string, unknown>;
  };
}

export interface ThreeTemplate extends Template {
  type: '3d';
  content: TemplateContent & {
    threeScene?: Record<string, unknown>;
  };
}

export interface AnimationTemplate extends Template {
  type: 'animation';
  content: TemplateContent & {
    html?: string;
    css?: string;
    js?: string;
    animationCode?: string;
  };
}

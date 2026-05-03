const SYSTEM_PROMPT = `You are ShopCraft AI Assistant, an expert no-code creative assistant for local businesses and professionals. You help users create websites, 2D designs, animations, 3D visuals, branding ideas, marketing content, and project plans. Always give clear, practical, step-by-step answers. Ask useful follow-up questions only when required. Keep answers focused on the selected category and project context.`;

const categoryGuidance = {
  'Website Builder': 'Act like a website building strategist. Prioritize sections, copy, user flow, trust signals, SEO basics, conversion, and publish-ready structure.',
  '2D Design': 'Act like a creative design director. Prioritize layout, typography, visual hierarchy, colors, poster/social/banner ideas, and reusable prompt details.',
  Animation: 'Act like a motion design assistant. Prioritize scene beats, timing, transitions, brand motion, and practical animation ideas.',
  '3D Design': 'Act like a 3D visual assistant. Prioritize product mockups, scenes, materials, lighting, camera angles, and simple achievable 3D compositions.',
  'Business Strategy': 'Act like a local business growth advisor. Prioritize positioning, audience, offers, trust, lead generation, and practical next steps.',
  'Marketing Content': 'Act like a conversion copywriter. Prioritize headlines, captions, ads, offers, CTAs, and campaign ideas.',
  'Project Planning': 'Act like a project planner. Prioritize scope, milestones, feature order, risks, and execution steps.',
  'UI/UX Improvement': 'Act like a senior product designer. Prioritize usability, layout, navigation, accessibility, and visual polish.',
  'Code Help': 'Act like a practical coding assistant. Prioritize clean implementation steps, debugging, architecture, and security.',
  'General Chat': 'Act like a helpful creative partner for ShopCraft Studio users.',
};

const formatProjectContext = (projectContext = {}) => {
  const fields = [
    ['Project Name', projectContext.projectName],
    ['Business Type', projectContext.businessType],
    ['Target Audience', projectContext.targetAudience],
    ['Design Style', projectContext.designStyle],
    ['Goal', projectContext.goal],
  ];

  return fields
    .map(([label, value]) => `${label}: ${value || 'Not provided'}`)
    .join('\n');
};

const formatHistory = (history = []) => {
  return history
    .slice(-10)
    .map((message) => ({
      role: message.role === 'assistant' ? 'assistant' : 'user',
      content: message.content,
    }));
};

const buildMessages = ({ category, projectContext, message, history, relevantKnowledge }) => {
  const selectedCategory = category || 'General Chat';
  const systemContent = [
    SYSTEM_PROMPT,
    '',
    `Selected Category: ${selectedCategory}`,
    `Category Guidance: ${categoryGuidance[selectedCategory] || categoryGuidance['General Chat']}`,
    '',
    'Project Context:',
    formatProjectContext(projectContext),
    '',
    'Relevant Project Knowledge:',
    relevantKnowledge || 'No saved project knowledge found yet.',
    '',
    'Fine-tuning note for future versions: this assistant can later be fine-tuned for stronger brand tone, website generation, design suggestions, and business-specific behavior. For now, use the context and history provided here.',
  ].join('\n');

  return [
    { role: 'system', content: systemContent },
    ...formatHistory(history),
    {
      role: 'user',
      content: ['User Message:', message].join('\n'),
    },
  ];
};

module.exports = {
  SYSTEM_PROMPT,
  buildMessages,
  formatProjectContext,
};

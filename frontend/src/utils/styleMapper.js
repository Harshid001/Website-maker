const kebab = (value = '') =>
  String(value)
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/_/g, '-')
    .toLowerCase();

export const styleObjectToCss = (styles = {}) =>
  Object.entries(styles)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${key.startsWith('--') ? key : kebab(key)}: ${value};`)
    .join('\n');

export const mergeNodeStyles = (node = {}, device = 'desktop') => ({
  ...(node.styles || {}),
  ...((node.responsive || {})[device] || {}),
});

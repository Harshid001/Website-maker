export const createId = (prefix = 'id') => {
  const time = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${time}-${random}`;
};

export const rekeyTree = (node) => {
  if (!node || typeof node !== 'object') return node;

  if (Array.isArray(node)) {
    return node.map((item) => rekeyTree(item));
  }

  const next = { ...node };
  if ('id' in next) {
    const prefix = String(next.type || next.id || 'item').split('-')[0];
    next.id = createId(prefix);
  }

  Object.keys(next).forEach((key) => {
    if (next[key] && typeof next[key] === 'object') {
      next[key] = rekeyTree(next[key]);
    }
  });

  return next;
};

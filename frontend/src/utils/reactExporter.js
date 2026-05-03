import { NODE_TAG_MAP } from '../data/nodeSchema';
import { generateTailwindClasses } from './codeGenerator';

/**
 * Traverses a node tree and generates a pure React component string
 */
export const exportToReact = (nodesMap, rootIds, componentName = 'ShopCraftComponent') => {
  let imports = `import React from 'react';\n`;
  let hasLucide = false;
  const lucideIcons = new Set();

  const renderNode = (nodeId, indentLevel = 2) => {
    const node = nodesMap[nodeId];
    if (!node) return '';

    const indent = '  '.repeat(indentLevel);
    const tag = NODE_TAG_MAP[node.type] || 'div';
    
    // Generate classes from styles and layout
    const className = generateTailwindClasses(node.styles, node.layout);
    const classProp = className ? ` className="${className}"` : '';
    
    // Handle specific props
    let propsStr = '';
    if (node.props) {
      Object.entries(node.props).forEach(([key, value]) => {
        if (key === 'src' || key === 'href' || key === 'alt' || key === 'target') {
          propsStr += ` ${key}="${value}"`;
        }
      });
    }

    // Special case for Icons
    if (node.type === 'icon') {
      hasLucide = true;
      const iconName = node.content?.trim() || 'Sparkles';
      lucideIcons.add(iconName);
      return `${indent}<${iconName}${classProp} />\n`;
    }

    const selfClosing = ['img', 'hr', 'input'].includes(tag);
    if (selfClosing) {
      return `${indent}<${tag}${classProp}${propsStr} />\n`;
    }

    let innerContent = '';
    
    if (node.children?.length > 0) {
      innerContent = '\n' + node.children.map(childId => renderNode(childId, indentLevel + 1)).join('') + indent;
    } else if (node.content) {
      innerContent = node.content;
    }

    return `${indent}<${tag}${classProp}${propsStr}>${innerContent}</${tag}>\n`;
  };

  const jsxTree = rootIds.map(id => renderNode(id, 2)).join('\n');

  if (hasLucide && lucideIcons.size > 0) {
    imports += `import { ${Array.from(lucideIcons).join(', ')} } from 'lucide-react';\n`;
  }

  return `${imports}
export default function ${componentName}() {
  return (
    <>
${jsxTree}
    </>
  );
}
`;
};

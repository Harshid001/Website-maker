/**
 * Converts style and layout objects into Tailwind CSS classes
 */
export const generateTailwindClasses = (styles = {}, layout = {}) => {
  const classes = [];

  // Layout mode
  if (layout.positionMode === 'flex-row') {
    classes.push('flex flex-row');
  } else if (layout.positionMode === 'flex-column') {
    classes.push('flex flex-col');
  } else if (layout.positionMode === 'grid') {
    classes.push('grid');
  } else if (layout.positionMode === 'free') {
    classes.push('absolute');
  } else if (styles.display === 'flex') {
    classes.push('flex');
    if (styles.flexDirection === 'column') classes.push('flex-col');
  } else if (styles.display === 'grid') {
    classes.push('grid');
  } else if (styles.display === 'inline-flex') {
    classes.push('inline-flex');
  }

  // Alignment
  if (layout.alignItems || styles.alignItems) {
    const align = layout.alignItems || styles.alignItems;
    if (align === 'center') classes.push('items-center');
    if (align === 'flex-start') classes.push('items-start');
    if (align === 'flex-end') classes.push('items-end');
    if (align === 'stretch') classes.push('items-stretch');
  }

  if (layout.justifyContent || styles.justifyContent) {
    const justify = layout.justifyContent || styles.justifyContent;
    if (justify === 'center') classes.push('justify-center');
    if (justify === 'flex-start') classes.push('justify-start');
    if (justify === 'flex-end') classes.push('justify-end');
    if (justify === 'space-between') classes.push('justify-between');
  }

  // Text alignment
  if (styles.textAlign) {
    if (styles.textAlign === 'center') classes.push('text-center');
    if (styles.textAlign === 'right') classes.push('text-right');
    if (styles.textAlign === 'left') classes.push('text-left');
  }

  // Font weight
  if (styles.fontWeight) {
    const weight = parseInt(styles.fontWeight, 10);
    if (weight === 400) classes.push('font-normal');
    if (weight === 500) classes.push('font-medium');
    if (weight === 600) classes.push('font-semibold');
    if (weight === 700) classes.push('font-bold');
    if (weight === 800) classes.push('font-extrabold');
    if (weight === 900) classes.push('font-black');
  }

  // Generate arbitrary tailwind values for things that don't easily map to presets
  if (layout.width && layout.width !== 'auto') classes.push(`w-[${layout.width}]`);
  else if (layout.width === '100%') classes.push('w-full');
  
  if (layout.height && layout.height !== 'auto') classes.push(`h-[${layout.height}]`);
  else if (layout.height === '100%') classes.push('h-full');
  else if (styles.minHeight) classes.push(`min-h-[${styles.minHeight}]`);

  if (layout.positionMode === 'free') {
    if (layout.x !== undefined) classes.push(`left-[${layout.x}px]`);
    if (layout.y !== undefined) classes.push(`top-[${layout.y}px]`);
  }

  if (styles.padding) classes.push(`p-[${styles.padding.replace(/ /g, '_')}]`);
  if (styles.margin) classes.push(`m-[${styles.margin.replace(/ /g, '_')}]`);
  
  // Specific padding/margin
  if (styles.paddingTop) classes.push(`pt-[${styles.paddingTop}]`);
  if (styles.paddingBottom) classes.push(`pb-[${styles.paddingBottom}]`);
  if (styles.paddingLeft) classes.push(`pl-[${styles.paddingLeft}]`);
  if (styles.paddingRight) classes.push(`pr-[${styles.paddingRight}]`);
  
  if (styles.marginTop) classes.push(`mt-[${styles.marginTop}]`);
  if (styles.marginBottom) classes.push(`mb-[${styles.marginBottom}]`);
  if (styles.marginLeft) classes.push(`ml-[${styles.marginLeft}]`);
  if (styles.marginRight) classes.push(`mr-[${styles.marginRight}]`);

  if (layout.gap || styles.gap) classes.push(`gap-[${layout.gap || styles.gap}]`);
  
  if (styles.backgroundColor && styles.backgroundColor !== 'transparent') {
    classes.push(`bg-[${styles.backgroundColor}]`);
  }
  
  if (styles.color && styles.color !== 'inherit') {
    classes.push(`text-[${styles.color}]`);
  }

  if (styles.fontSize) classes.push(`text-[${styles.fontSize}]`);
  if (styles.borderRadius) classes.push(`rounded-[${styles.borderRadius}]`);
  if (styles.borderWidth && styles.borderStyle !== 'none') {
    classes.push(`border-[${styles.borderWidth}]`);
    if (styles.borderColor) classes.push(`border-[${styles.borderColor}]`);
    if (styles.borderStyle === 'dashed') classes.push('border-dashed');
    if (styles.borderStyle === 'dotted') classes.push('border-dotted');
  }

  if (styles.opacity) classes.push(`opacity-[${styles.opacity}]`);
  if (styles.boxShadow && styles.boxShadow !== 'none') {
    classes.push(`shadow-[${styles.boxShadow.replace(/ /g, '_')}]`);
  }

  return classes.join(' ');
};

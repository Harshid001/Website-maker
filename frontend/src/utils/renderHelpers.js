export const deviceWidths = {
  desktop: 1440,
  tablet: 768,
  mobile: 390,
};

export const getDeviceWidth = (device = 'desktop') => deviceWidths[device] || deviceWidths.desktop;

export const zoomValues = {
  '25': 0.25,
  '50': 0.5,
  '75': 0.75,
  '100': 1,
  '125': 1.25,
  '150': 1.5,
};

export const getZoomScale = (zoomMode = '100', fitScale = 1) =>
  zoomMode === 'fit' ? fitScale : zoomValues[zoomMode] || 1;

export const isTextElement = (type) =>
  ['heading', 'paragraph', 'button', 'navLink', 'footerLink', 'whatsappButton', 'countdown', 'card', 'serviceCard', 'testimonialCard', 'pricingCard', 'productCard', 'blogCard'].includes(type);

export const animationClassFor = (animation = {}) => {
  const type = animation.type || 'none';
  if (type === 'fade-in') return 'builder-anim-fade';
  if (type === 'slide-up') return 'builder-anim-slide-up';
  if (type === 'slide-left') return 'builder-anim-slide-left';
  if (type === 'slide-right') return 'builder-anim-slide-right';
  if (type === 'zoom-in') return 'builder-anim-zoom';
  if (type === 'bounce') return 'builder-anim-bounce';
  if (type === 'button-glow') return 'builder-anim-glow';
  return '';
};

export const responsiveHidden = (item = {}, device = 'desktop') =>
  Boolean(item.responsive?.[`hideOn${device[0].toUpperCase()}${device.slice(1)}`]);

export const responsiveStylesFor = (item = {}, device = 'desktop') => {
  const legacy = {};
  if (device === 'mobile') {
    if (item.responsive?.mobileFontSize) legacy.fontSize = item.responsive.mobileFontSize;
    if (item.responsive?.mobilePadding) legacy.padding = item.responsive.mobilePadding;
  }
  if (device === 'tablet') {
    if (item.responsive?.tabletFontSize) legacy.fontSize = item.responsive.tabletFontSize;
    if (item.responsive?.tabletPadding) legacy.padding = item.responsive.tabletPadding;
  }
  return { ...legacy, ...(item.responsive?.[device] || {}) };
};

import { Box, GalleryHorizontal, Heading, Image, LayoutPanelTop, Link as LinkIcon, Minus, MousePointerClick, Square, Type, Video } from 'lucide-react';
import { useBuilderStore } from '../../../store/builderStore';
import { ActionButton, PanelSection, PanelShell } from './PanelShell';

const basic = [
  ['heading', 'Heading', Heading],
  ['paragraph', 'Paragraph', Type],
  ['button', 'Button', MousePointerClick],
  ['image', 'Image', Image],
  ['video', 'Video', Video],
  ['icon', 'Icon', Square],
  ['divider', 'Divider', Minus],
  ['spacer', 'Spacer', Box],
  ['container', 'Container', LayoutPanelTop],
  ['card', 'Card', Square],
];

const advanced = [
  ['navbar', 'Navbar'],
  ['footer', 'Footer'],
  ['hero', 'Hero Section'],
  ['services', 'Services Section'],
  ['pricing', 'Pricing Section'],
  ['testimonials', 'Testimonial Section'],
  ['contactForm', 'Contact Form'],
  ['bookingForm', 'Booking Form'],
  ['productCard', 'Product Card'],
  ['gallery', 'Gallery'],
  ['faq', 'FAQ Section'],
  ['mapEmbed', 'Map Embed'],
  ['whatsappButton', 'WhatsApp Button'],
  ['socialLinks', 'Social Links'],
  ['countdown', 'Countdown Timer'],
  ['slider', 'Slider / Carousel'],
  ['blogCard', 'Blog Card'],
];

const sectionInsertTypes = ['navbar', 'footer', 'hero', 'services', 'pricing', 'testimonials', 'faq'];

const dragPayload = (dragType, value) => (event) => {
  const payload = dragType === 'new-section' ? { dragType, sectionType: value } : { dragType, elementType: value };
  if (typeof window !== 'undefined') window.__shopcraftBuilderDragPayload = payload;
  event.dataTransfer.setData('application/shopcraft-builder', JSON.stringify(payload));
  event.dataTransfer.effectAllowed = 'copy';
};

export default function AddElementsPanel() {
  const { startSmartInsert } = useBuilderStore();

  return (
    <PanelShell eyebrow="Insert" title="Add Elements">
      <PanelSection title="Basic elements">
        <div className="grid grid-cols-2 gap-2">
          {basic.map(([type, label, Icon]) => (
            <button key={label} type="button" draggable onDragStart={dragPayload('new-element', type)} onClick={() => startSmartInsert({ dragType: 'new-element', elementType: type })} className="rounded-2xl border border-slate-800 bg-slate-950 p-3 text-left hover:border-indigo-500/60 hover:bg-indigo-500/10">
              <Icon size={17} className="mb-3 text-indigo-300" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white">{label}</span>
            </button>
          ))}
        </div>
      </PanelSection>
      <PanelSection title="Advanced elements">
        {advanced.map(([type, label]) => (
          <ActionButton
            key={label}
            icon={label.includes('Gallery') || label.includes('Slider') ? GalleryHorizontal : LinkIcon}
            label={label}
            description="Click to add, or drag into the canvas."
            onDragStart={dragPayload(sectionInsertTypes.includes(type) ? 'new-section' : 'new-element', type)}
            onClick={() => startSmartInsert(sectionInsertTypes.includes(type)
              ? { dragType: 'new-section', sectionType: type }
              : { dragType: 'new-element', elementType: type })}
          />
        ))}
        <ActionButton icon={LinkIcon} label="HTML Embed" onClick={() => startSmartInsert({ dragType: 'new-element', elementType: 'customHtml' })} />
      </PanelSection>
    </PanelShell>
  );
}

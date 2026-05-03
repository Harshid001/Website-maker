import React from 'react';
import { Component } from 'lucide-react';
import { useBuilderStore } from '../../../store/builderStore';
import { ActionButton, PanelSection, PanelShell } from './PanelShell';

const components = [
  ['hero', 'Navbar'],
  ['footer', 'Footer'],
  ['card', 'Service card'],
  ['productCard', 'Product card'],
  ['testimonialCard', 'Testimonial card'],
  ['pricingCard', 'Pricing card'],
  ['form', 'Contact form'],
  ['form', 'Booking form'],
  ['button', 'Button group'],
  ['services', 'Feature grid'],
  ['socialLinks', 'Social links'],
  ['button', 'WhatsApp floating button'],
];

export default function ComponentsPanel() {
  const { addElement, addSection } = useBuilderStore();
  return (
    <PanelShell eyebrow="Reusable UI" title="Components">
      <PanelSection title="Components">
        {components.map(([type, label]) => (
          <ActionButton key={label} icon={Component} label={label} onClick={() => (['hero', 'footer', 'services'].includes(type) ? addSection(type) : addElement(type))} />
        ))}
      </PanelSection>
    </PanelShell>
  );
}

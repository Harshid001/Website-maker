import { Component } from 'lucide-react';
import { useBuilderStore } from '../../../store/builderStore';
import { ActionButton, PanelSection, PanelShell } from './PanelShell';

const components = [
  ['navbar', 'Navbar', 'section'],
  ['footer', 'Footer', 'section'],
  ['button', 'Buttons'],
  ['card', 'Cards'],
  ['contactForm', 'Forms'],
  ['productCard', 'Product Cards'],
  ['serviceCard', 'Service Cards'],
  ['pricingCard', 'Pricing Cards'],
  ['testimonialCard', 'Testimonial Cards'],
  ['searchBar', 'Search Bar'],
  ['tabs', 'Tabs'],
  ['accordion', 'Accordion'],
  ['modal', 'Modal'],
  ['dropdown', 'Dropdown'],
  ['sidebar', 'Sidebar'],
  ['breadcrumb', 'Breadcrumb'],
];

export default function ComponentsPanel() {
  const { addElement, addSection } = useBuilderStore();
  return (
    <PanelShell eyebrow="Reusable UI" title="Components">
      <PanelSection title="Components">
        {components.map(([type, label, mode]) => (
          <ActionButton key={label} icon={Component} label={label} onClick={() => (mode === 'section' ? addSection(type) : addElement(type))} />
        ))}
      </PanelSection>
    </PanelShell>
  );
}

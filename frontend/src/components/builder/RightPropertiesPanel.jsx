import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { useBuilderStore } from '../../store/builderStore';
import SelectionProperties from './properties/SelectionProperties';
import LayoutProperties from './properties/LayoutProperties';
import TextProperties from './properties/TextProperties';
import DesignProperties from './properties/DesignProperties';
import BackgroundProperties from './properties/BackgroundProperties';
import MediaProperties from './properties/MediaProperties';
import ButtonProperties from './properties/ButtonProperties';
import SEOProperties from './properties/SEOProperties';
import AnimationProperties from './properties/AnimationProperties';
import ResponsiveProperties from './properties/ResponsiveProperties';
import AdvancedProperties from './properties/AdvancedProperties';
import AccessibilityProperties from './properties/AccessibilityProperties';
import ExportCodeProperties from './properties/ExportCodeProperties';
import InteractionProperties from './prototype/InteractionProperties';

export default function RightPropertiesPanel() {
  const { builderMode, selectedItem, selectedInteraction } = useBuilderStore();

  return (
    <aside className="w-[360px] shrink-0 overflow-y-auto border-l border-slate-800 bg-slate-900 custom-scrollbar">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-800 bg-slate-900 px-5 py-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-400">Edit selected things</p>
          <h2 className="text-lg font-black uppercase tracking-tight text-white">Properties</h2>
        </div>
        <SlidersHorizontal size={18} className="text-slate-500" />
      </div>
      {!selectedItem && !selectedInteraction && (
        <div className="border-b border-slate-800 p-5">
          <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950 p-4 text-xs leading-5 text-slate-500">
            Page frame settings are shown below. Select a section or element on the canvas to edit layout, content, style, media, animation, and responsive settings.
          </div>
        </div>
      )}
      {selectedInteraction && <InteractionProperties />}
      {!selectedInteraction && <SelectionProperties />}
      {builderMode === 'prototype' && selectedItem && <InteractionProperties />}
      {selectedItem && !selectedInteraction && (
        <>
          <LayoutProperties />
          <TextProperties />
          <DesignProperties />
          <ButtonProperties />
          <MediaProperties />
          <SEOProperties />
          <AnimationProperties />
          <BackgroundProperties />
          <ResponsiveProperties />
          <AdvancedProperties />
          <AccessibilityProperties />
        </>
      )}
      {!selectedItem && !selectedInteraction && <SEOProperties />}
      <ExportCodeProperties />
    </aside>
  );
}

import React from 'react';
import { useBuilderStore } from '../../../store/builderStore';
import { MiniButton, PropertyGroup } from './PropertyControls';

export default function ExportCodeProperties() {
  const { showToast } = useBuilderStore();
  return (
    <PropertyGroup title="Export / Code Settings">
      <div className="grid grid-cols-2 gap-2">
        <MiniButton onClick={() => showToast('HTML export placeholder ready.')}>HTML</MiniButton>
        <MiniButton onClick={() => showToast('CSS export placeholder ready.')}>CSS</MiniButton>
        <MiniButton onClick={() => showToast('React export placeholder ready.')}>React</MiniButton>
        <MiniButton onClick={() => showToast('PDF export placeholder ready.')}>PDF</MiniButton>
      </div>
    </PropertyGroup>
  );
}

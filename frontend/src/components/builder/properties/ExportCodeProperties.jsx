import React from 'react';
import { useBuilderStore } from '../../../store/builderStore';
import { MiniButton, PropertyGroup } from './PropertyControls';
import { exportToReact } from '../../../utils/reactExporter';

export default function ExportCodeProperties() {
  const { showToast, nodesMap, currentPage } = useBuilderStore();

  const handleExportReact = () => {
    if (!currentPage) return;
    const rootNodes = Object.values(nodesMap).filter(n => n.parentId === currentPage.id).map(n => n.id);
    const code = exportToReact(nodesMap, rootNodes, currentPage.name.replace(/[^a-zA-Z0-9]/g, '') || 'Page');
    
    navigator.clipboard.writeText(code);
    showToast('React component code copied to clipboard!', 'success');
  };

  return (
    <PropertyGroup title="Export / Code Settings">
      <div className="grid grid-cols-2 gap-2">
        <MiniButton onClick={() => showToast('HTML export placeholder ready.')}>HTML</MiniButton>
        <MiniButton onClick={() => showToast('CSS export placeholder ready.')}>CSS</MiniButton>
        <MiniButton onClick={handleExportReact}>React</MiniButton>
        <MiniButton onClick={() => showToast('PDF export placeholder ready.')}>PDF</MiniButton>
      </div>
    </PropertyGroup>
  );
}

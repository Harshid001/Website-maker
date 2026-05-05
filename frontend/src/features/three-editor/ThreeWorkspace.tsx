import React, { useMemo, useState } from 'react';
import type { Template } from '../../types/template.types';
import ThreeCanvas from './ThreeCanvas';
import ThreeToolbar from './ThreeToolbar';
import ThreePropertiesPanel from './ThreePropertiesPanel';
import { loadThreeSceneFromTemplate } from './threeTemplateLoader';

export default function ThreeWorkspace({ template }: { template?: Template | null }) {
  const scene = useMemo(() => loadThreeSceneFromTemplate(template), [template]);
  const [activeTool, setActiveTool] = useState('Move');

  return (
    <div className="grid min-h-screen grid-rows-[auto_1fr] gap-4 bg-slate-950 p-4 text-white">
      <ThreeToolbar onSelectTool={setActiveTool} />
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="mb-3 text-sm text-slate-400">Active tool: {activeTool}</div>
          <ThreeCanvas scene={scene} />
        </div>
        <ThreePropertiesPanel scene={scene} />
      </div>
    </div>
  );
}

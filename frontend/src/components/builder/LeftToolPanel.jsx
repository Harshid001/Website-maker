import React from 'react';
import { useBuilderStore } from '../../store/builderStore';
import AICreatePanel from './panels/AICreatePanel';
import AddElementsPanel from './panels/AddElementsPanel';
import SectionsPanel from './panels/SectionsPanel';
import TemplatesPanel from './panels/TemplatesPanel';
import ThemePanel from './panels/ThemePanel';
import MediaPanel from './panels/MediaPanel';
import TextPanel from './panels/TextPanel';
import ComponentsPanel from './panels/ComponentsPanel';
import PagesPanel from './panels/PagesPanel';
import AnimationPanel from './panels/AnimationPanel';
import Design2DPanel from './panels/Design2DPanel';
import Elements3DPanel from './panels/Elements3DPanel';
import IntegrationsPanel from './panels/IntegrationsPanel';
import TutorialsPanel from './panels/TutorialsPanel';
import SettingsPanel from './panels/SettingsPanel';
import LayersPanel from './LayersPanel';
import { PanelShell } from './panels/PanelShell';

const panelByTool = {
  ai: AICreatePanel,
  add: AddElementsPanel,
  sections: SectionsPanel,
  templates: TemplatesPanel,
  theme: ThemePanel,
  media: MediaPanel,
  text: TextPanel,
  components: ComponentsPanel,
  pages: PagesPanel,
  animation: AnimationPanel,
  design2d: Design2DPanel,
  elements3d: Elements3DPanel,
  integrations: IntegrationsPanel,
  tutorials: TutorialsPanel,
  settings: SettingsPanel,
  layers: () => <PanelShell eyebrow="Structure" title="Layers"><LayersPanel /></PanelShell>,
};

export default function LeftToolPanel() {
  const { activeLeftTool } = useBuilderStore();
  const Panel = panelByTool[activeLeftTool] || AICreatePanel;

  return (
    <aside className="w-[320px] shrink-0 border-r border-slate-800 bg-slate-900">
      <Panel />
    </aside>
  );
}

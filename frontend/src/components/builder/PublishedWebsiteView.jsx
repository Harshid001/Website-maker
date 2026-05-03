import React, { useEffect } from 'react';
import { useBuilderStore } from '../../store/builderStore';
import SectionRenderer from './SectionRenderer';

export default function PublishedWebsiteView({ device = 'desktop', runtimeMode = 'published' }) {
  const { project, sections, setActiveDevice } = useBuilderStore();

  useEffect(() => {
    setActiveDevice(device);
  }, [device, setActiveDevice]);

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: project?.theme?.colors?.background || '#ffffff',
        color: project?.theme?.colors?.text || '#0f172a',
        fontFamily: project?.theme?.fonts?.body || 'Inter',
      }}
    >
      {sections.map((section, index) => (
        <SectionRenderer key={section.id} section={section} index={index} readonly device={device} runtimeMode={runtimeMode} />
      ))}
    </div>
  );
}

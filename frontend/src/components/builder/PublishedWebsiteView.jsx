import { useEffect } from 'react';
import { useBuilderStore } from '../../store/builderStore';
import CleanRenderer from './CleanRenderer';

export default function PublishedWebsiteView({ device = 'desktop' }) {
  const { project, currentPage, nodesMap, setActiveDevice } = useBuilderStore();

  useEffect(() => {
    setActiveDevice(device);
  }, [device, setActiveDevice]);

  // Extract root nodes for the current page
  const pageNode = currentPage?.id ? nodesMap[currentPage.id] : null;
  const rootNodeIds = pageNode?.children?.length
    ? pageNode.children
    : Object.values(nodesMap)
      .filter(node => node.parentId === currentPage?.id)
      .map(node => node.id);

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: project?.theme?.colors?.background || '#ffffff',
        color: project?.theme?.colors?.text || '#0f172a',
        fontFamily: project?.theme?.fonts?.body || 'Inter',
      }}
    >
      {rootNodeIds.map((nodeId) => (
        <CleanRenderer key={nodeId} nodeId={nodeId} nodesMap={nodesMap} device={device} />
      ))}
    </div>
  );
}

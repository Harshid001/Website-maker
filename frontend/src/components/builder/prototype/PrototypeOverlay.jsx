import { useEffect, useMemo, useState } from 'react';
import { useBuilderStore } from '../../../store/builderStore';
import { getConnectorEndPoint, getConnectorStartPoint, getInteractionTargetNodeId, getNodeRect, pointFromClient } from '../../../utils/nodeGeometry';
import { resolveInteraction } from '../../../utils/interactionResolver';
import PageTargetPanel from './PageTargetPanel';
import PrototypeConnector from './PrototypeConnector';

export default function PrototypeOverlay() {
  const [overlayRoot, setOverlayRoot] = useState(null);
  const {
    project,
    currentPage,
    builderMode,
    connectionDraft,
    selectedInteractionId,
    selectInteraction,
  } = useBuilderStore();
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (builderMode !== 'prototype' || !overlayRoot) return undefined;
    const tick = () => setVersion((item) => item + 1);
    const observer = new ResizeObserver(tick);
    document.querySelectorAll('[data-node-id]').forEach((node) => observer.observe(node));
    tick();
    window.addEventListener('scroll', tick, true);
    window.addEventListener('resize', tick);
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', tick, true);
      window.removeEventListener('resize', tick);
    };
  }, [builderMode, project, currentPage, overlayRoot]);

  const connectors = useMemo(() => {
    if (builderMode !== 'prototype' || !overlayRoot) return [];
    const root = overlayRoot;
    return (project?.interactions || [])
      .filter((interaction) => interaction.sourcePageId === currentPage?.id || interaction.targetPageId === currentPage?.id)
      .map((interaction) => {
        const sourceRect = getNodeRect(interaction.sourceNodeId, root);
        const targetRect = getNodeRect(getInteractionTargetNodeId(interaction), root);
        if (!sourceRect || !targetRect) return null;
        const resolved = resolveInteraction(interaction, project);
        return {
          interaction,
          start: getConnectorStartPoint(sourceRect),
          end: getConnectorEndPoint(targetRect),
          label: resolved.targetLabel,
        };
      })
      .filter(Boolean);
  }, [builderMode, currentPage, overlayRoot, project, version]);

  const temporaryConnector = useMemo(() => {
    if (builderMode !== 'prototype' || !overlayRoot || !connectionDraft?.sourceNodeId || !connectionDraft?.position) return null;
    const root = overlayRoot;
    const sourceRect = getNodeRect(connectionDraft.sourceNodeId, root);
    const end = pointFromClient(connectionDraft.position, root);
    if (!sourceRect || !end) return null;
    return { start: getConnectorStartPoint(sourceRect), end };
  }, [builderMode, connectionDraft, overlayRoot, version]);

  if (builderMode !== 'prototype') return null;

  return (
    <div ref={setOverlayRoot} className="pointer-events-none absolute inset-0 z-30">
      <svg className="absolute inset-0 h-full w-full overflow-visible">
        <defs>
          <marker id="prototype-arrow-head" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto" markerUnits="strokeWidth">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#0ea5e9" />
          </marker>
          <filter id="prototype-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {connectors.map(({ interaction, start, end, label }) => (
          <PrototypeConnector
            key={interaction.id}
            id={interaction.id}
            start={start}
            end={end}
            label={label}
            selected={selectedInteractionId === interaction.id}
            onSelect={selectInteraction}
          />
        ))}
        {temporaryConnector && <PrototypeConnector start={temporaryConnector.start} end={temporaryConnector.end} temporary />}
      </svg>
      <PageTargetPanel />
      <div
        data-node-id="external-target-prototype"
        data-prototype-target="external"
        className="pointer-events-auto absolute bottom-4 right-4 rounded-2xl border border-sky-300/50 bg-sky-50 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-sky-700 shadow-xl"
      >
        Drop for external URL
      </div>
    </div>
  );
}

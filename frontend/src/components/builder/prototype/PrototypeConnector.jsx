import { createCurvePath } from '../../../utils/nodeGeometry';

export default function PrototypeConnector({ id, start, end, selected, label, onSelect, temporary = false }) {
  if (!start || !end) return null;
  const path = createCurvePath(start, end);

  return (
    <g className="prototype-connector">
      <path
        d={path}
        fill="none"
        stroke={temporary ? '#7dd3fc' : selected ? '#38bdf8' : '#0ea5e9'}
        strokeWidth={selected ? 4 : 3}
        strokeLinecap="round"
        markerEnd="url(#prototype-arrow-head)"
        opacity={temporary ? 0.72 : 0.95}
        filter={selected ? 'url(#prototype-glow)' : undefined}
        className="drop-shadow-sm"
      />
      {!temporary && (
        <path
          d={path}
          fill="none"
          stroke="transparent"
          strokeWidth={18}
          strokeLinecap="round"
          className="pointer-events-auto cursor-pointer"
          onClick={(event) => {
            event.stopPropagation();
            onSelect?.(id);
          }}
        />
      )}
      {label && !temporary && (
        <text
          x={(start.x + end.x) / 2}
          y={(start.y + end.y) / 2 - 10}
          textAnchor="middle"
          className="pointer-events-none fill-sky-700 text-[10px] font-black uppercase tracking-widest"
        >
          {label}
        </text>
      )}
    </g>
  );
}

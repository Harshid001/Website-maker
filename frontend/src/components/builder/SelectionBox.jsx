export default function SelectionBox({ box }) {
  if (!box) return null;
  const left = Math.min(box.startX, box.endX);
  const top = Math.min(box.startY, box.endY);
  const width = Math.abs(box.endX - box.startX);
  const height = Math.abs(box.endY - box.startY);

  return (
    <div
      className="pointer-events-none absolute z-50 border border-sky-400 bg-sky-400/10"
      style={{ left, top, width, height }}
    />
  );
}

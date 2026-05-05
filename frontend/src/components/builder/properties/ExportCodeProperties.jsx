import { useEffect, useState } from 'react';
import { useBuilderStore } from '../../../store/builderStore';
import { generateWebsiteCode } from '../../../services/codeGenerator';
import { MiniButton, PropertyGroup } from './PropertyControls';

const copyToClipboard = async (text) => {
  if (navigator?.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
};

export default function ExportCodeProperties() {
  const { showToast, nodesMap, project } = useBuilderStore();
  const [generated, setGenerated] = useState(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (project) setGenerated(generateWebsiteCode({ ...project, nodesMap }));
    }, 650);
    return () => window.clearTimeout(timer);
  }, [nodesMap, project]);

  const handleCopy = async (label, value) => {
    if (!value) {
      showToast(`${label} is still generating.`, 'error');
      return;
    }
    await copyToClipboard(value);
    showToast(`${label} copied to clipboard.`, 'success');
  };

  const report = generated?.report;

  return (
    <PropertyGroup title="Export / Code Settings">
      <div className="grid grid-cols-2 gap-2">
        <MiniButton onClick={() => handleCopy('HTML', generated?.html)}>Copy HTML</MiniButton>
        <MiniButton onClick={() => handleCopy('CSS', generated?.css)}>Copy CSS</MiniButton>
        <MiniButton onClick={() => handleCopy('React', generated?.react)}>Copy React</MiniButton>
        <MiniButton onClick={() => handleCopy('Project JSON', JSON.stringify({ ...project, nodesMap }, null, 2))}>Project JSON</MiniButton>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <MiniButton onClick={() => showToast('ZIP download is structured as the next export adapter.')}>Download ZIP</MiniButton>
        <MiniButton onClick={() => handleCopy('Asset manifest', JSON.stringify(generated?.assets || [], null, 2))}>Assets</MiniButton>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Optimization report</p>
        {report ? (
          <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] font-bold text-slate-300">
            <span>Pages: {report.pages}</span>
            <span>Nodes: {report.nodes}</span>
            <span>Exported: {report.exportedNodes}</span>
            <span>Hidden removed: {report.removedHiddenNodes}</span>
            <span>HTML: {Math.round(report.htmlSize / 1024)} KB</span>
            <span>CSS: {Math.round(report.cssSize / 1024)} KB</span>
            <span>SEO: {report.seoScore}</span>
            <span>A11y: {report.accessibilityWarnings.length}</span>
          </div>
        ) : (
          <p className="mt-3 text-xs text-slate-500">Generating clean production code...</p>
        )}
      </div>
    </PropertyGroup>
  );
}

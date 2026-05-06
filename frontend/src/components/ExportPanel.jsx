import { useState } from 'react';
import { Copy, Download, Eye, X } from 'lucide-react';
import { generatePreviewHTML } from '../export-engine/previewRenderer.js';
import { downloadWebsiteZip } from '../export-engine/zipExporter.js';

const buttonBase = 'inline-flex items-center gap-2 rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest shadow-2xl transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60';

export function PreviewModal({ html, onClose }) {
  if (!html) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-black/70 p-4 sm:p-6">
      <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 sm:px-5">
          <div>
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-900">Live Website Preview</h2>
            <p className="mt-1 text-xs text-slate-500">Static export render</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white transition hover:bg-slate-800"
            aria-label="Close preview"
            title="Close preview"
          >
            <X size={18} />
          </button>
        </div>
        <iframe
          title="Website Preview"
          srcDoc={html}
          className="min-h-0 flex-1 border-0"
          sandbox="allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
        />
      </div>
    </div>
  );
}

export default function ExportPanel({ builderState, onPreview, onStatus }) {
  const [busyAction, setBusyAction] = useState(null);
  const disabled = !builderState || Boolean(busyAction);

  const runAction = async (action, callback) => {
    if (!builderState) return;
    setBusyAction(action);
    try {
      await callback();
    } catch (error) {
      console.error(`Export ${action} failed`, error);
      onStatus?.('Export failed. Please try again.', 'error');
    } finally {
      setBusyAction(null);
    }
  };

  const handlePreview = () => runAction('preview', async () => {
    const previewHTML = generatePreviewHTML(builderState);
    onPreview(previewHTML);
    onStatus?.('Website preview generated.', 'success');
  });

  const handleDownload = () => runAction('download', async () => {
    await downloadWebsiteZip(builderState);
    onStatus?.('Website ZIP downloaded.', 'success');
  });

  const handleCopy = () => runAction('copy', async () => {
    const html = generatePreviewHTML(builderState);
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(html);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = html;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
    }
    onStatus?.('Standalone HTML copied.', 'success');
  });

  return (
    <div className="pointer-events-none fixed bottom-20 right-5 z-[90] flex flex-col gap-2">
      <button
        type="button"
        onClick={handlePreview}
        disabled={disabled}
        title="Preview Website"
        className={`${buttonBase} pointer-events-auto border border-white/15 bg-slate-950 text-white hover:bg-slate-900`}
      >
        <Eye size={16} />
        {busyAction === 'preview' ? 'Generating' : 'Preview Website'}
      </button>
      <button
        type="button"
        onClick={handleDownload}
        disabled={disabled}
        title="Download ZIP"
        className={`${buttonBase} pointer-events-auto bg-indigo-600 text-white hover:bg-indigo-500`}
      >
        <Download size={16} />
        {busyAction === 'download' ? 'Building ZIP' : 'Download ZIP'}
      </button>
      <button
        type="button"
        onClick={handleCopy}
        disabled={disabled}
        title="Copy HTML"
        className={`${buttonBase} pointer-events-auto border border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800`}
      >
        <Copy size={16} />
        {busyAction === 'copy' ? 'Copying' : 'Copy HTML'}
      </button>
    </div>
  );
}

import { useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { useBuilderStore } from '../../../store/builderStore';

const targetTypes = [
  { value: 'page', label: 'Navigate to page' },
  { value: 'section', label: 'Scroll to section' },
  { value: 'external', label: 'Open external URL' },
  { value: 'email', label: 'Email link' },
  { value: 'phone', label: 'Phone link' },
  { value: 'whatsapp', label: 'WhatsApp link' },
  { value: 'modal', label: 'Open modal placeholder' },
];

export default function InteractionModal() {
  const { project, connectionDraft, completeConnection, cancelConnection } = useBuilderStore();
  const defaultPageId = project?.currentPageId || project?.pages?.[0]?.id || '';
  const [targetType, setTargetType] = useState('page');
  const [targetPageId, setTargetPageId] = useState(defaultPageId);
  const [targetSectionId, setTargetSectionId] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [transition, setTransition] = useState('smartAnimate');

  const selectedPage = useMemo(() => (project?.pages || []).find((page) => page.id === targetPageId) || project?.pages?.[0], [project, targetPageId]);
  const sections = selectedPage?.sections || [];

  if (!connectionDraft?.needsTarget) return null;

  const save = () => {
    completeConnection({
      targetType,
      targetPageId: targetType === 'page' || targetType === 'section' ? targetPageId : null,
      targetSectionId: targetType === 'section' ? targetSectionId || sections[0]?.id : null,
      targetUrl: ['external', 'email', 'phone', 'whatsapp'].includes(targetType) ? targetUrl : '',
      transition,
    });
  };

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center bg-slate-950/70 p-5 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-2xl">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-sky-400">Prototype target</p>
            <h2 className="text-xl font-black uppercase tracking-tight text-white">Create interaction</h2>
          </div>
          <button type="button" onClick={cancelConnection} className="rounded-xl p-2 text-slate-500 hover:bg-slate-800 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-slate-500">Action</span>
            <select value={targetType} onChange={(event) => setTargetType(event.target.value)} className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-3 text-xs text-white outline-none focus:border-sky-500">
              {targetTypes.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
            </select>
          </label>

          {(targetType === 'page' || targetType === 'section') && (
            <label className="block">
              <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-slate-500">Target page</span>
              <select value={targetPageId} onChange={(event) => setTargetPageId(event.target.value)} className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-3 text-xs text-white outline-none focus:border-sky-500">
                {(project?.pages || []).map((page) => <option key={page.id} value={page.id}>{page.name}</option>)}
              </select>
            </label>
          )}

          {targetType === 'section' && (
            <label className="block">
              <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-slate-500">Target section</span>
              <select value={targetSectionId} onChange={(event) => setTargetSectionId(event.target.value)} className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-3 text-xs text-white outline-none focus:border-sky-500">
                {sections.map((section) => <option key={section.id} value={section.id}>{section.name}</option>)}
              </select>
            </label>
          )}

          {['external', 'email', 'phone', 'whatsapp'].includes(targetType) && (
            <label className="block">
              <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-slate-500">Target value</span>
              <input value={targetUrl} onChange={(event) => setTargetUrl(event.target.value)} placeholder="https://example.com, email, phone..." className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-3 text-xs text-white outline-none focus:border-sky-500" />
            </label>
          )}

          <label className="block">
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-slate-500">Transition</span>
            <select value={transition} onChange={(event) => setTransition(event.target.value)} className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-3 text-xs text-white outline-none focus:border-sky-500">
              {['instant', 'dissolve', 'slideLeft', 'slideRight', 'slideUp', 'slideDown', 'smartAnimate', 'fade', 'push'].map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
        </div>

        <div className="mt-6 flex gap-3">
          <button type="button" onClick={cancelConnection} className="flex-1 rounded-xl border border-slate-800 px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-300 hover:bg-slate-800">
            Cancel
          </button>
          <button type="button" onClick={save} className="flex-1 rounded-xl bg-sky-500 px-4 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-sky-400">
            Save connection
          </button>
        </div>
      </div>
    </div>
  );
}

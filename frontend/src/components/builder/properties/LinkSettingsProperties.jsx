import { ExternalLink, Globe, Hash, Link2, Mail, Phone } from 'lucide-react';
import { useBuilderStore } from '../../../store/builderStore';
import { PropertyGroup, SelectInput, TextInput, ToggleInput } from './PropertyControls';

const LINKABLE_TYPES = new Set([
  'button', 'navLink', 'footerLink', 'whatsappButton',
  'image', 'icon', 'card', 'pricingCard', 'testimonialCard', 'productCard',
  'heading', 'paragraph', 'container', 'logo',
]);

const LINK_TYPES = [
  { value: 'none', label: 'None' },
  { value: 'internal', label: 'Internal Page' },
  { value: 'external', label: 'External URL' },
  { value: 'section', label: 'Scroll to Section' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
];

const LINK_ICONS = {
  none: Link2,
  internal: Globe,
  external: ExternalLink,
  section: Hash,
  email: Mail,
  phone: Phone,
};

export default function LinkSettingsProperties() {
  const {
    project,
    currentPage,
    currentPageNodes,
    getSelectedNode,
    selectedElement,
    updateSelectedProps,
  } = useBuilderStore();

  const node = getSelectedNode || selectedElement;
  if (!node || !LINKABLE_TYPES.has(node.type)) return null;

  const linkAction = node.props?.linkAction || { type: 'none' };
  const pages = project?.pages || [];
  const sections = currentPage?.sections?.length ? currentPage.sections : currentPageNodes;

  const updateLink = (patch) => {
    const next = { ...linkAction, ...patch };

    // Auto-resolve path for internal links
    if (next.type === 'internal' && next.pageId) {
      const targetPage = pages.find((p) => p.id === next.pageId);
      next.path = targetPage?.path || `/${targetPage?.slug || ''}`;
    }

    // Build href for backward-compat
    let href = '';
    let target = '_self';
    if (next.type === 'internal') {
      href = next.path || '/';
    } else if (next.type === 'external') {
      href = next.url || '#';
      target = next.openInNewTab ? '_blank' : '_self';
    } else if (next.type === 'section') {
      href = `#${next.sectionId || ''}`;
    } else if (next.type === 'email') {
      href = `mailto:${next.value || ''}`;
    } else if (next.type === 'phone') {
      href = `tel:${next.value || ''}`;
    }

    updateSelectedProps({ linkAction: next, href, target });
  };

  const ActiveIcon = LINK_ICONS[linkAction.type] || Link2;

  return (
    <PropertyGroup title="Link Settings">
      <div className="mb-1 flex items-center gap-2 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-3">
        <ActiveIcon size={14} className="shrink-0 text-indigo-300" />
        <p className="text-[10px] font-bold leading-4 text-indigo-200">
          Set where this {node.type} navigates when clicked.
        </p>
      </div>

      <SelectInput
        label="Link type"
        value={linkAction.type}
        onChange={(value) => updateLink({ type: value })}
        options={LINK_TYPES}
      />

      {linkAction.type === 'internal' && (
        <SelectInput
          label="Target page"
          value={linkAction.pageId || ''}
          onChange={(value) => updateLink({ pageId: value })}
          options={[
            { value: '', label: '— Select a page —' },
            ...pages.map((page) => ({
              value: page.id,
              label: `${page.name}${page.isHome ? ' (Home)' : ''} — /${page.slug}`,
            })),
          ]}
        />
      )}

      {linkAction.type === 'external' && (
        <TextInput
          label="URL"
          value={linkAction.url || ''}
          onChange={(value) => updateLink({ url: value })}
          placeholder="https://example.com"
        />
      )}

      {linkAction.type === 'section' && (
        <SelectInput
          label="Target section"
          value={linkAction.sectionId || ''}
          onChange={(value) => updateLink({ sectionId: value })}
          options={[
            { value: '', label: '— Select a section —' },
            ...sections.map((s) => ({ value: s.id, label: s.name || s.type })),
          ]}
        />
      )}

      {linkAction.type === 'email' && (
        <TextInput
          label="Email address"
          value={linkAction.value || ''}
          onChange={(value) => updateLink({ value })}
          placeholder="hello@example.com"
        />
      )}

      {linkAction.type === 'phone' && (
        <TextInput
          label="Phone number"
          value={linkAction.value || ''}
          onChange={(value) => updateLink({ value })}
          placeholder="+1 234 567 8900"
        />
      )}

      {(linkAction.type === 'external' || linkAction.type === 'internal') && (
        <ToggleInput
          label="Open in new tab"
          checked={linkAction.openInNewTab || false}
          onChange={(value) => updateLink({ openInNewTab: value })}
        />
      )}

      {linkAction.type !== 'none' && (
        <div className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2">
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-600">Generated href</p>
          <p className="mt-1 break-all text-xs font-bold text-slate-300">{node.props?.href || '—'}</p>
        </div>
      )}
    </PropertyGroup>
  );
}

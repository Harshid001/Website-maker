import React, { useState } from 'react';
import { Plug } from 'lucide-react';
import { useBuilderStore } from '../../../store/builderStore';
import { ActionButton, PanelSection, PanelShell } from './PanelShell';

const integrations = ['WhatsApp Chat', 'Google Maps', 'Payment Gateway', 'Razorpay placeholder', 'Stripe placeholder', 'Contact Form Backend', 'Newsletter', 'Social Media Links', 'Google Analytics', 'Facebook Pixel', 'Custom API', 'HTML Embed'];

export default function IntegrationsPanel() {
  const [active, setActive] = useState(null);
  const [value, setValue] = useState('');
  const { updateProjectSettings, showToast } = useBuilderStore();

  return (
    <PanelShell eyebrow="Connections" title="Integrations">
      <PanelSection title="Available integrations">
        {integrations.map((label) => <ActionButton key={label} icon={Plug} label={label} onClick={() => { setActive(label); setValue(''); }} />)}
      </PanelSection>
      {active && (
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
          <p className="text-xs font-black uppercase tracking-widest text-white">{active}</p>
          <input value={value} onChange={(event) => setValue(event.target.value)} placeholder="Configuration value or embed code" className="mt-3 w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white outline-none" />
          <button type="button" onClick={() => { updateProjectSettings({ [active]: value || 'configured-placeholder' }); showToast(`${active} configuration saved.`); }} className="mt-3 rounded-xl bg-indigo-600 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white">
            Apply integration
          </button>
        </div>
      )}
    </PanelShell>
  );
}

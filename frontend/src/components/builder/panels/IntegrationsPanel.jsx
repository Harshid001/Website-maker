import { useState } from 'react';
import { Plug, CreditCard, MapPin, MessageCircle, Share2, Mail, BarChart3, Target, Calendar, Video, Camera, CheckCircle } from 'lucide-react';
import { useBuilderStore } from '../../../store/builderStore';
import { ActionButton, PanelSection, PanelShell } from './PanelShell';

const integrations = [
  { id: 'whatsapp', label: 'WhatsApp Chat', icon: MessageCircle, insertsNode: true, placeholder: 'Phone number (e.g. +919999999999)' },
  { id: 'googleMaps', label: 'Google Maps', icon: MapPin, insertsNode: true, placeholder: 'Address or location name' },
  { id: 'razorpay', label: 'Razorpay Payment', icon: CreditCard, placeholder: 'Razorpay Key ID' },
  { id: 'stripe', label: 'Stripe Payment', icon: CreditCard, placeholder: 'Stripe Publishable Key' },
  { id: 'socialMedia', label: 'Social Media Links', icon: Share2, insertsNode: true, placeholder: 'Instagram URL' },
  { id: 'newsletter', label: 'Email Newsletter', icon: Mail, insertsNode: true, placeholder: 'Newsletter service endpoint' },
  { id: 'contactBackend', label: 'Contact Form Backend', icon: Mail, placeholder: 'API endpoint for form submissions' },
  { id: 'googleAnalytics', label: 'Google Analytics', icon: BarChart3, placeholder: 'GA Measurement ID (G-XXXXXXXXXX)' },
  { id: 'metaPixel', label: 'Meta Pixel', icon: Target, placeholder: 'Facebook Pixel ID' },
  { id: 'calendly', label: 'Calendly / Booking', icon: Calendar, insertsNode: true, placeholder: 'Calendly URL or booking endpoint' },
  { id: 'youtube', label: 'YouTube Embed', icon: Video, insertsNode: true, placeholder: 'YouTube video URL' },
  { id: 'instagram', label: 'Instagram Embed', icon: Camera, insertsNode: true, placeholder: 'Instagram post embed code' },
];

export default function IntegrationsPanel() {
  const [active, setActive] = useState(null);
  const [value, setValue] = useState('');
  const [configured, setConfigured] = useState({});
  const { addElement, updateProjectSettings, showToast } = useBuilderStore();

  const activeConfig = integrations.find((i) => i.id === active);

  const applyIntegration = () => {
    const config = value || 'configured-placeholder';

    // Insert appropriate nodes
    if (active === 'whatsapp') addElement('whatsappButton', undefined, { props: { phone: config, href: `https://wa.me/${String(config).replace(/\D/g, '') || '919999999999'}` } });
    else if (active === 'googleMaps') addElement('mapEmbed', undefined, { props: { location: config } });
    else if (active === 'socialMedia') addElement('socialLinks');
    else if (active === 'newsletter') addElement('contactForm', undefined, { name: 'Newsletter Form', props: { fields: ['Email'], requiredFields: ['Email'], buttonText: 'Subscribe', successMessage: 'You are subscribed.' } });
    else if (active === 'calendly') addElement('bookingForm');
    else if (active === 'youtube') addElement('video', undefined, { props: { src: config } });
    else if (active === 'instagram') addElement('customHtml', undefined, { content: config || '<div>Instagram embed placeholder</div>' });

    // Save config to project settings
    updateProjectSettings({ integrations: { [activeConfig.label]: config }, [activeConfig.label]: config });
    setConfigured((prev) => ({ ...prev, [active]: true }));
    showToast(`${activeConfig.label} configured successfully.${activeConfig.insertsNode ? ' Element inserted on canvas.' : ' Settings saved for build pipeline.'}`, 'success');
  };

  return (
    <PanelShell eyebrow="Connections" title="Integrations">
      <PanelSection title="Available integrations">
        {integrations.map((item) => (
          <ActionButton
            key={item.id}
            icon={configured[item.id] ? CheckCircle : item.icon}
            label={item.label}
            description={configured[item.id] ? 'Configured ✓' : (item.insertsNode ? 'Inserts element + saves config' : 'Configuration only')}
            onClick={() => { setActive(item.id); setValue(''); }}
          />
        ))}
      </PanelSection>

      {active && activeConfig && (
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
          <div className="mb-3 flex items-center gap-2">
            <activeConfig.icon size={16} className="text-indigo-300" />
            <p className="text-xs font-black uppercase tracking-widest text-white">{activeConfig.label}</p>
          </div>

          <label className="block">
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Configuration</span>
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={activeConfig.placeholder}
              className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
            />
          </label>

          {/* Payment-specific fields */}
          {(active === 'razorpay' || active === 'stripe') && (
            <div className="mt-3 space-y-2 rounded-xl bg-amber-500/10 p-3">
              <p className="text-[9px] font-bold uppercase tracking-widest text-amber-300">Payment gateway setup</p>
              <p className="text-[10px] leading-4 text-amber-200/70">
                {active === 'razorpay'
                  ? 'Enter your Razorpay Key ID. Secret key should be stored server-side. Payment checkout will be activated during the publish build.'
                  : 'Enter your Stripe publishable key. Secret key should be stored server-side. Checkout sessions will be created via your backend API.'
                }
              </p>
              <input placeholder="Display currency (INR / USD / EUR)" className="w-full rounded-lg border border-amber-500/20 bg-slate-900 px-2 py-1.5 text-xs text-white outline-none" />
            </div>
          )}

          {/* Analytics-specific fields */}
          {(active === 'googleAnalytics' || active === 'metaPixel') && (
            <div className="mt-3 space-y-2 rounded-xl bg-emerald-500/10 p-3">
              <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-300">Tracking setup</p>
              <p className="text-[10px] leading-4 text-emerald-200/70">
                {active === 'googleAnalytics'
                  ? 'The GA tracking script will be injected into the published site\'s <head> tag automatically.'
                  : 'The Meta Pixel base code will be injected into the published site. Custom events can be added via Advanced Properties.'
                }
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={applyIntegration}
            className="mt-3 w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-white hover:bg-indigo-500"
          >
            {configured[active] ? 'Update configuration' : 'Apply integration'}
          </button>
        </div>
      )}
    </PanelShell>
  );
}

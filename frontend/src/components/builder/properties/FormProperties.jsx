import { useBuilderStore } from '../../../store/builderStore';
import { MiniButton, PropertyGroup, TextArea, TextInput, ToggleInput } from './PropertyControls';

const formTypes = new Set(['form', 'contactForm', 'bookingForm']);

export default function FormProperties() {
  const { getSelectedNode, updateSelectedProps, showToast } = useBuilderStore();
  const node = getSelectedNode;
  if (!node || !formTypes.has(node.type)) return null;

  const props = node.props || {};
  const fields = props.fields || ['Name', 'Email', 'Message'];
  const requiredFields = props.requiredFields || [];
  const placeholders = props.placeholders || {};

  const updateFields = (value) => {
    updateSelectedProps({ fields: value.split(',').map((item) => item.trim()).filter(Boolean) });
  };

  const toggleRequired = (field, checked) => {
    updateSelectedProps({
      requiredFields: checked
        ? Array.from(new Set([...requiredFields, field]))
        : requiredFields.filter((item) => item !== field),
    });
  };

  const updatePlaceholder = (field, value) => {
    updateSelectedProps({ placeholders: { ...placeholders, [field]: value } });
  };

  return (
    <PropertyGroup title="Form Settings">
      <TextInput label="Form fields (comma-separated)" value={fields.join(', ')} onChange={updateFields} placeholder="Name, Email, Message" />
      
      <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-950 p-3">
        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Field configuration</p>
        {fields.map((field) => (
          <div key={field} className="space-y-1">
            <ToggleInput label={`Require ${field}`} checked={requiredFields.includes(field)} onChange={(checked) => toggleRequired(field, checked)} />
            <TextInput label={`${field} placeholder`} value={placeholders[field] || ''} onChange={(value) => updatePlaceholder(field, value)} placeholder={`Enter your ${field.toLowerCase()}`} />
          </div>
        ))}
      </div>

      <TextInput label="Submit button text" value={props.buttonText || ''} onChange={(value) => updateSelectedProps({ buttonText: value })} />
      <TextArea label="Success message" value={props.successMessage || ''} onChange={(value) => updateSelectedProps({ successMessage: value })} />
      <TextInput label="Email receiver" value={props.receiver || ''} onChange={(value) => updateSelectedProps({ receiver: value })} placeholder="hello@example.com" />
      <TextInput label="Redirect after submit" value={props.redirectUrl || ''} onChange={(value) => updateSelectedProps({ redirectUrl: value })} placeholder="/thank-you" />

      <div className="grid grid-cols-2 gap-2">
        <MiniButton onClick={() => { updateSelectedProps({ saveToDatabase: true }); showToast('Responses will be saved when a backend endpoint is connected.'); }}>Save response</MiniButton>
        <MiniButton onClick={() => { updateSelectedProps({ spamProtection: true, spamMethod: props.spamMethod || 'honeypot' }); showToast('Spam protection enabled.'); }}>Spam protect</MiniButton>
        <MiniButton onClick={() => { updateSelectedProps({ integrationEnabled: true, endpoint: props.endpoint || '' }); showToast('Form integration enabled. Add an endpoint when ready.'); }}>Form integration</MiniButton>
        <MiniButton onClick={() => { updateSelectedProps({ emailNotification: true }); showToast('Email notification enabled. Configure receiver email above.'); }}>Email notify</MiniButton>
      </div>
    </PropertyGroup>
  );
}

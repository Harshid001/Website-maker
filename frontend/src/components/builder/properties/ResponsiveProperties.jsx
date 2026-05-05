import { useBuilderStore } from '../../../store/builderStore';
import { MiniButton, PropertyGroup, SelectInput, TextInput, ToggleInput } from './PropertyControls';

export default function ResponsiveProperties() {
  const { selectedItem, getSelectedNode, updateSelectedResponsive, setActiveDevice, activeDevice, showToast } = useBuilderStore();
  const selectedNode = getSelectedNode;
  const responsive = (selectedNode || selectedItem)?.responsive || {};
  const desktop = responsive.desktop || {};
  const laptop = responsive.laptop || {};
  const tablet = responsive.tablet || {};
  const mobile = responsive.mobile || {};
  const activeOverrides = responsive[activeDevice] || {};
  const update = (key) => (value) => updateSelectedResponsive({ [key]: value });
  const updateDevice = (key) => (value) => updateSelectedResponsive(activeDevice, { [key]: value });

  return (
    <PropertyGroup title="Responsive Settings">
      <div className="mb-3 grid grid-cols-4 gap-1">
        {['desktop', 'laptop', 'tablet', 'mobile'].map((device) => (
          <button
            key={device}
            type="button"
            onClick={() => setActiveDevice(device)}
            className={`rounded-lg px-2 py-1.5 text-[9px] font-bold uppercase tracking-widest ${activeDevice === device ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
          >
            {device}
          </button>
        ))}
      </div>

      <ToggleInput label="Hide on desktop" checked={responsive.hideOnDesktop} onChange={update('hideOnDesktop')} />
      <ToggleInput label="Hide on laptop" checked={responsive.hideOnLaptop} onChange={update('hideOnLaptop')} />
      <ToggleInput label="Hide on tablet" checked={responsive.hideOnTablet} onChange={update('hideOnTablet')} />
      <ToggleInput label="Hide on mobile" checked={responsive.hideOnMobile} onChange={update('hideOnMobile')} />

      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3 mt-3">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">Current device overrides</p>
        <div className="grid grid-cols-2 gap-2">
          <TextInput label={`${activeDevice} width`} value={activeOverrides.width || ''} onChange={updateDevice('width')} />
          <TextInput label={`${activeDevice} height`} value={activeOverrides.height || ''} onChange={updateDevice('height')} />
          <TextInput label={`${activeDevice} font`} value={activeOverrides.fontSize || ''} onChange={updateDevice('fontSize')} />
          <TextInput label={`${activeDevice} padding`} value={activeOverrides.padding || ''} onChange={updateDevice('padding')} />
          <TextInput label={`${activeDevice} gap`} value={activeOverrides.gap || ''} onChange={updateDevice('gap')} />
          <TextInput label={`${activeDevice} align`} value={activeOverrides.textAlign || ''} onChange={updateDevice('textAlign')} />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3 mt-3">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">All device width presets</p>
        <div className="grid grid-cols-2 gap-2">
          <TextInput label="Desktop width" value={desktop.width || ''} onChange={(value) => updateSelectedResponsive('desktop', { width: value })} />
          <TextInput label="Laptop width" value={laptop.width || ''} onChange={(value) => updateSelectedResponsive('laptop', { width: value })} />
          <TextInput label="Tablet width" value={tablet.width || ''} onChange={(value) => updateSelectedResponsive('tablet', { width: value })} />
          <TextInput label="Mobile width" value={mobile.width || ''} onChange={(value) => updateSelectedResponsive('mobile', { width: value })} />
          <TextInput label="Mobile font" value={responsive.mobileFontSize || ''} onChange={update('mobileFontSize')} />
          <TextInput label="Laptop font" value={responsive.laptopFontSize || ''} onChange={update('laptopFontSize')} />
          <TextInput label="Tablet font" value={responsive.tabletFontSize || ''} onChange={update('tabletFontSize')} />
          <TextInput label="Desktop font" value={desktop.fontSize || ''} onChange={(value) => updateSelectedResponsive('desktop', { fontSize: value })} />
          <TextInput label="Mobile padding" value={responsive.mobilePadding || ''} onChange={update('mobilePadding')} />
          <TextInput label="Laptop padding" value={responsive.laptopPadding || ''} onChange={update('laptopPadding')} />
          <TextInput label="Tablet padding" value={responsive.tabletPadding || ''} onChange={update('tabletPadding')} />
          <TextInput label="Desktop padding" value={desktop.padding || ''} onChange={(value) => updateSelectedResponsive('desktop', { padding: value })} />
        </div>
      </div>

      <SelectInput label="Stack on mobile" value={responsive.stackDirectionOnMobile || 'column'} onChange={update('stackDirectionOnMobile')} options={['column', 'row']} />
      <SelectInput label="Mobile text align" value={responsive.mobileTextAlign || 'inherit'} onChange={update('mobileTextAlign')} options={['inherit', 'left', 'center', 'right']} />
      <ToggleInput label="Full width on mobile" checked={responsive.fullWidthOnMobile} onChange={update('fullWidthOnMobile')} />
      <ToggleInput label="Center on mobile" checked={responsive.centerOnMobile} onChange={update('centerOnMobile')} />

      <MiniButton onClick={() => {
        const devices = ['desktop', 'laptop', 'tablet', 'mobile'];
        const next = devices[(devices.indexOf(activeDevice) + 1) % devices.length];
        showToast(`Switched to ${next} preview.`);
        setActiveDevice(next);
      }}>
        Cycle device preview
      </MiniButton>
    </PropertyGroup>
  );
}

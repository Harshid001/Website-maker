import React from 'react';
import { useBuilderStore } from '../../../store/builderStore';
import { PropertyGroup, SelectInput, TextInput, ToggleInput } from './PropertyControls';

export default function ResponsiveProperties() {
  const { selectedItem, updateSelectedResponsive } = useBuilderStore();
  const responsive = selectedItem?.responsive || {};
  const desktop = responsive.desktop || {};
  const tablet = responsive.tablet || {};
  const mobile = responsive.mobile || {};
  const update = (key) => (value) => updateSelectedResponsive({ [key]: value });

  return (
    <PropertyGroup title="Responsive Settings">
      <ToggleInput label="Hide on desktop" checked={responsive.hideOnDesktop} onChange={update('hideOnDesktop')} />
      <ToggleInput label="Hide on tablet" checked={responsive.hideOnTablet} onChange={update('hideOnTablet')} />
      <ToggleInput label="Hide on mobile" checked={responsive.hideOnMobile} onChange={update('hideOnMobile')} />
      <div className="grid grid-cols-2 gap-2">
        <TextInput label="Desktop width" value={desktop.width || ''} onChange={(value) => updateSelectedResponsive('desktop', { width: value })} />
        <TextInput label="Tablet width" value={tablet.width || ''} onChange={(value) => updateSelectedResponsive('tablet', { width: value })} />
        <TextInput label="Mobile width" value={mobile.width || ''} onChange={(value) => updateSelectedResponsive('mobile', { width: value })} />
        <TextInput label="Mobile font" value={responsive.mobileFontSize || ''} onChange={update('mobileFontSize')} />
        <TextInput label="Tablet font" value={responsive.tabletFontSize || ''} onChange={update('tabletFontSize')} />
        <TextInput label="Desktop font" value={desktop.fontSize || ''} onChange={(value) => updateSelectedResponsive('desktop', { fontSize: value })} />
        <TextInput label="Mobile padding" value={responsive.mobilePadding || ''} onChange={update('mobilePadding')} />
        <TextInput label="Tablet padding" value={responsive.tabletPadding || ''} onChange={update('tabletPadding')} />
        <TextInput label="Desktop padding" value={desktop.padding || ''} onChange={(value) => updateSelectedResponsive('desktop', { padding: value })} />
      </div>
      <SelectInput label="Stack on mobile" value={responsive.stackDirectionOnMobile || 'column'} onChange={update('stackDirectionOnMobile')} options={['column', 'row']} />
      <ToggleInput label="Full width on mobile" checked={responsive.fullWidthOnMobile} onChange={update('fullWidthOnMobile')} />
    </PropertyGroup>
  );
}

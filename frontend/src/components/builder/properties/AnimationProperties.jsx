import { useBuilderStore } from '../../../store/builderStore';
import { MiniButton, PropertyGroup, SelectInput, TextInput, ToggleInput } from './PropertyControls';

export default function AnimationProperties() {
  const { selectedItem, getSelectedNode, updateSelectedAnimation, showToast } = useBuilderStore();
  const selectedNode = getSelectedNode;
  const animation = (selectedNode || selectedItem)?.animation || {};

  const previewAnimation = () => {
    const node = selectedNode || selectedItem;
    if (!node) return showToast('Select an element first.', 'error');
    const el = document.querySelector(`[data-node-id="${node.id}"]`);
    if (!el) return showToast('Element not found on canvas.', 'error');
    
    const type = animation.type || 'fade-in';
    const duration = animation.duration || 700;
    
    // Remove existing animation
    el.style.animation = '';
    el.style.opacity = '';
    
    // Force reflow
    void el.offsetHeight;
    
    // Apply temporary animation
    const keyframes = {
      'fade-in': 'builderFade',
      'slide-up': 'builderSlideUp',
      'slide-left': 'builderSlideLeft',
      'slide-right': 'builderSlideRight',
      'zoom-in': 'builderZoom',
      'bounce': 'builderBounce',
      'button-glow': 'builderGlow',
    };
    
    const kf = keyframes[type] || 'builderFade';
    el.style.animation = `${kf} ${duration}ms ${animation.easing || 'ease-out'} forwards`;
    
    // Clean up after animation
    setTimeout(() => {
      el.style.animation = '';
    }, duration + 100);
    
    showToast(`Previewing: ${type} (${duration}ms)`, 'success');
  };

  return (
    <PropertyGroup title="AI Animations">
      <MiniButton onClick={() => { updateSelectedAnimation({ type: 'slide-up', duration: 700, delay: 80, easing: 'ease-out', trigger: 'scroll' }); showToast('Suggested animation applied.'); }}>Suggest animation</MiniButton>
      <SelectInput label="Animation type" value={animation.type || 'none'} onChange={(value) => updateSelectedAnimation({ type: value })} options={['none', 'fade-in', 'slide-up', 'slide-left', 'slide-right', 'zoom-in', 'bounce', 'button-glow', 'card-flip', 'text-reveal', 'parallax']} />
      <div className="grid grid-cols-2 gap-2">
        <TextInput label="Duration (ms)" value={animation.duration || ''} onChange={(value) => updateSelectedAnimation({ duration: Number(value) || value })} />
        <TextInput label="Delay (ms)" value={animation.delay || ''} onChange={(value) => updateSelectedAnimation({ delay: Number(value) || value })} />
      </div>
      <SelectInput label="Easing" value={animation.easing || 'ease-out'} onChange={(value) => updateSelectedAnimation({ easing: value })} options={['ease-out', 'ease-in', 'ease-in-out', 'linear', 'cubic-bezier(0.22, 1, 0.36, 1)']} />
      <SelectInput label="Trigger" value={animation.trigger || 'load'} onChange={(value) => updateSelectedAnimation({ trigger: value })} options={['load', 'scroll', 'hover', 'click']} />
      <ToggleInput label="Loop" checked={animation.loop} onChange={(value) => updateSelectedAnimation({ loop: value })} />
      <div className="grid grid-cols-2 gap-2">
        <MiniButton onClick={previewAnimation}>Preview animation</MiniButton>
        <MiniButton onClick={() => { updateSelectedAnimation({ type: 'none', duration: 0, delay: 0, loop: false }); showToast('Animation removed.'); }}>Remove animation</MiniButton>
      </div>
    </PropertyGroup>
  );
}

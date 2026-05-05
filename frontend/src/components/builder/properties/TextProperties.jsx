import { useBuilderStore } from '../../../store/builderStore';
import { isTextElement, responsiveStylesFor } from '../../../utils/renderHelpers';
import { ColorInput, MiniButton, PropertyGroup, SelectInput, TextArea, TextInput } from './PropertyControls';

export default function TextProperties() {
  const { activeDevice, selectedElement, getSelectedNode, updateSelectedContent, updateSelectedProps, updateSelectedStyles, rewriteSelectedText } = useBuilderStore();
  const selectedNode = getSelectedNode;
  const item = selectedNode || selectedElement;
  if (!item || !isTextElement(item.type)) return null;

  const content = item.content;
  const styles = { ...(item.styles || {}), ...responsiveStylesFor(item, activeDevice) };
  const updateStyle = (key) => (value) => updateSelectedStyles({ [key]: value });

  return (
    <PropertyGroup title="Text Properties">
      {typeof content === 'object' ? (
        <>
          {'title' in content && <TextInput label="Title" value={content.title} onChange={(value) => updateSelectedContent({ ...content, title: value })} />}
          {'price' in content && <TextInput label="Price" value={content.price} onChange={(value) => updateSelectedContent({ ...content, price: value })} />}
          {'quote' in content && <TextArea label="Quote" value={content.quote} onChange={(value) => updateSelectedContent({ ...content, quote: value })} />}
          {'body' in content && <TextArea label="Body" value={content.body} onChange={(value) => updateSelectedContent({ ...content, body: value })} />}
          {'author' in content && <TextInput label="Author" value={content.author} onChange={(value) => updateSelectedContent({ ...content, author: value })} />}
        </>
      ) : (
        <TextArea label="Text content" value={content} onChange={updateSelectedContent} rows={4} />
      )}
      <SelectInput label="Font family" value={styles.fontFamily || ''} onChange={updateStyle('fontFamily')} options={['Inter', 'Georgia', 'Arial', 'system-ui', 'Roboto', 'Outfit', 'Poppins', 'Playfair Display', 'Montserrat', 'Lora']} />
      <div className="grid grid-cols-2 gap-2">
        <TextInput label="Font size" value={styles.fontSize} onChange={updateStyle('fontSize')} placeholder="18px" />
        <TextInput label="Weight" value={styles.fontWeight} onChange={updateStyle('fontWeight')} placeholder="700" />
        <TextInput label="Line height" value={styles.lineHeight} onChange={updateStyle('lineHeight')} placeholder="1.5" />
        <TextInput label="Letter spacing" value={styles.letterSpacing} onChange={updateStyle('letterSpacing')} placeholder="0" />
      </div>
      <SelectInput label="Text align" value={styles.textAlign || 'left'} onChange={updateStyle('textAlign')} options={['left', 'center', 'right', 'justify']} />
      <ColorInput label="Text color" value={styles.color === 'inherit' ? '#0f172a' : styles.color} onChange={updateStyle('color')} />
      <div className="grid grid-cols-3 gap-2">
        <MiniButton onClick={() => updateSelectedStyles({ fontWeight: String(styles.fontWeight || '') === '700' || String(styles.fontWeight || '') === '800' ? '400' : '700' })}>B</MiniButton>
        <MiniButton onClick={() => updateSelectedStyles({ fontStyle: styles.fontStyle === 'italic' ? 'normal' : 'italic' })}>I</MiniButton>
        <MiniButton onClick={() => updateSelectedStyles({ textDecoration: styles.textDecoration === 'underline' ? 'none' : 'underline' })}>U</MiniButton>
      </div>
      <SelectInput label="Transform" value={styles.textTransform || 'none'} onChange={updateStyle('textTransform')} options={['none', 'uppercase', 'capitalize', 'lowercase']} />
      <SelectInput label="Decoration" value={styles.textDecoration || 'none'} onChange={updateStyle('textDecoration')} options={['none', 'underline', 'line-through', 'overline']} />
      <SelectInput label="Font style" value={styles.fontStyle || 'normal'} onChange={updateStyle('fontStyle')} options={['normal', 'italic']} />
      <TextInput label="Word spacing" value={styles.wordSpacing || ''} onChange={updateStyle('wordSpacing')} placeholder="normal" />
      <TextInput label="Link URL" value={item.props?.href || ''} onChange={(value) => updateSelectedProps({ href: value, linkAction: value ? { ...(item.props?.linkAction || {}), type: 'external', url: value } : { type: 'none' } })} placeholder="https://example.com" />
      <div className="grid grid-cols-2 gap-2">
        <MiniButton onClick={() => rewriteSelectedText('professional')}>AI Rewrite</MiniButton>
        <MiniButton onClick={() => rewriteSelectedText('cta')}>AI CTA</MiniButton>
        <MiniButton onClick={() => rewriteSelectedText('shorter')}>Make Shorter</MiniButton>
        <MiniButton onClick={() => rewriteSelectedText('longer')}>Make Longer</MiniButton>
      </div>
    </PropertyGroup>
  );
}

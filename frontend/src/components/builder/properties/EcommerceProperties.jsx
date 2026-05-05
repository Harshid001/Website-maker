import { useBuilderStore } from '../../../store/builderStore';
import { MiniButton, PropertyGroup, SelectInput, TextArea, TextInput } from './PropertyControls';

const ecommerceTypes = new Set(['productCard', 'pricingCard']);

export default function EcommerceProperties() {
  const { getSelectedNode, updateNodeContentInMap, updateSelectedProps, showToast } = useBuilderStore();
  const node = getSelectedNode;
  if (!node || !ecommerceTypes.has(node.type)) return null;

  const props = node.props || {};
  const content = typeof node.content === 'object' && node.content !== null ? node.content : {};

  const updateContent = (patch) => updateNodeContentInMap(node.id, { ...content, ...patch });

  return (
    <PropertyGroup title="E-commerce Settings">
      <TextInput label="Product name" value={content.title || node.name || ''} onChange={(value) => updateContent({ title: value })} />
      <TextInput label="Product price" value={content.price || props.price || ''} onChange={(value) => updateContent({ price: value })} />
      <TextInput label="Product image" value={props.image || props.src || ''} onChange={(value) => updateSelectedProps({ image: value, src: value })} placeholder="https://..." />
      <TextArea label="Product description" value={content.body || props.description || ''} onChange={(value) => updateContent({ body: value })} />
      <TextInput label="Product category" value={props.category || ''} onChange={(value) => updateSelectedProps({ category: value })} />
      <TextInput label="Add to cart text" value={props.cartButtonText || content.buttonText || 'Add to Cart'} onChange={(value) => updateSelectedProps({ cartButtonText: value })} />
      <SelectInput label="Inventory status" value={props.inventoryStatus || 'in stock'} onChange={(value) => updateSelectedProps({ inventoryStatus: value })} options={['in stock', 'low stock', 'sold out', 'preorder']} />
      <TextInput label="Coupon code" value={props.couponCode || ''} onChange={(value) => updateSelectedProps({ couponCode: value })} />
      <SelectInput label="Payment gateway" value={props.paymentGateway || 'placeholder'} onChange={(value) => updateSelectedProps({ paymentGateway: value })} options={['placeholder', 'razorpay', 'stripe', 'cod']} />
      <div className="grid grid-cols-2 gap-2">
        <MiniButton onClick={() => { updateSelectedProps({ checkoutConfigured: true }); showToast('Checkout settings placeholder configured.'); }}>Checkout</MiniButton>
        <MiniButton onClick={() => showToast('Live payment requires backend/API keys. Placeholder saved on this product.')}>Payment setup</MiniButton>
      </div>
    </PropertyGroup>
  );
}

import { useId } from 'react';

const controlClass = 'w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white outline-none focus:border-indigo-500';
const labelClass = 'mb-1 block text-[10px] font-bold uppercase tracking-widest text-slate-500';

const isHexColor = (value = '') => /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(String(value).trim());

export function PropertyGroup({ title, children }) {
  return (
    <section className="border-b border-slate-800 px-5 py-5">
      <h3 className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{title}</h3>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

export function TextInput({ label, value, onChange, placeholder, type = 'text' }) {
  const id = useId();
  return (
    <label htmlFor={id} className="block">
      <span className={labelClass}>{label}</span>
      <input
        id={id}
        type={type}
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={controlClass}
      />
    </label>
  );
}

export function NumberInput({ label, value, onChange, min, max, step = 1, placeholder, suffix = '', allowEmpty = true }) {
  const id = useId();

  const commit = (raw) => {
    if (raw === '') {
      if (allowEmpty) onChange('');
      return;
    }
    const numeric = Number(raw);
    if (!Number.isFinite(numeric)) return;
    const clamped = Math.min(max ?? numeric, Math.max(min ?? numeric, numeric));
    onChange(suffix ? `${clamped}${suffix}` : clamped);
  };

  return (
    <label htmlFor={id} className="block">
      <span className={labelClass}>{label}</span>
      <input
        id={id}
        type="number"
        min={min}
        max={max}
        step={step}
        value={value ?? ''}
        onChange={(event) => commit(event.target.value)}
        placeholder={placeholder}
        className={controlClass}
      />
    </label>
  );
}

export function SliderControl({ label, value, onChange, min = 0, max = 100, step = 1 }) {
  const numeric = Number.parseFloat(value ?? min);
  const safeValue = Number.isFinite(numeric) ? Math.min(max, Math.max(min, numeric)) : min;

  return (
    <label className="block rounded-xl border border-slate-800 bg-slate-950 px-3 py-2">
      <span className="mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
        <span>{label}</span>
        <span className="text-slate-500">{safeValue}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={safeValue}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-indigo-600"
      />
    </label>
  );
}

export function TextArea({ label, value, onChange, rows = 3 }) {
  const id = useId();
  return (
    <label htmlFor={id} className="block">
      <span className={labelClass}>{label}</span>
      <textarea
        id={id}
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        className="w-full resize-none rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
      />
    </label>
  );
}

export function SelectInput({ label, value, onChange, options }) {
  const id = useId();
  return (
    <label htmlFor={id} className="block">
      <span className={labelClass}>{label}</span>
      <select
        id={id}
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
        className={controlClass}
      >
        {options.map((option) => (
          <option key={option.value ?? option} value={option.value ?? option}>
            {option.label ?? option}
          </option>
        ))}
      </select>
    </label>
  );
}

export function ToggleInput({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 px-3 py-2">
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</span>
      <input type="checkbox" checked={Boolean(checked)} onChange={(event) => onChange(event.target.checked)} className="h-4 w-4 accent-indigo-600" />
    </label>
  );
}

export function ColorInput({ label, value, onChange }) {
  const id = useId();
  const textValue = value ?? '';
  const swatchValue = isHexColor(textValue) ? textValue : '#ffffff';

  return (
    <label htmlFor={id} className="block rounded-xl border border-slate-800 bg-slate-950 px-3 py-2">
      <span className="mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
        <span>{label}</span>
        <input
          type="color"
          value={swatchValue}
          onChange={(event) => onChange(event.target.value)}
          className="h-7 w-9 rounded-lg border border-slate-800 bg-transparent"
        />
      </span>
      <input
        id={id}
        value={textValue}
        onChange={(event) => onChange(event.target.value)}
        placeholder="#ffffff"
        className="w-full rounded-lg border border-slate-800 bg-slate-900 px-2 py-1.5 text-[11px] text-white outline-none focus:border-indigo-500"
      />
    </label>
  );
}

export function MiniButton({ children, onClick, tone = 'default', disabled = false, title }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-widest transition-all disabled:cursor-not-allowed disabled:opacity-45 ${
        tone === 'danger' ? 'bg-red-500/10 text-red-200 hover:bg-red-500/20' : 'bg-slate-950 text-slate-300 hover:bg-indigo-600 hover:text-white'
      }`}
    >
      {children}
    </button>
  );
}

export const ColorPicker = ColorInput;
export const SelectControl = SelectInput;
export const ToggleControl = ToggleInput;
export const AlignmentControls = ({ children }) => <div className="grid grid-cols-3 gap-2">{children}</div>;
export const LayerControls = ({ children }) => <div className="grid grid-cols-2 gap-2">{children}</div>;
export const SpacingControls = ({ children }) => <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3">{children}</div>;
export const TypographyControls = ({ children }) => <div className="space-y-3">{children}</div>;
export const ShadowControls = ({ children }) => <div className="space-y-3">{children}</div>;
export const BorderControls = ({ children }) => <div className="grid grid-cols-2 gap-2">{children}</div>;

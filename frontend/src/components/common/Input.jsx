import React from 'react';

const Input = ({ label, error, icon: Icon, className = '', ...props }) => {
  return (
    <div className="w-full space-y-1.5">
      {label && <label className="block text-sm font-medium text-gray-300 ml-1">{label}</label>}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-500 transition-colors">
            <Icon size={18} />
          </div>
        )}
        <input
          {...props}
          className={`
            w-full bg-gray-900/50 border border-gray-700 rounded-xl py-2.5 outline-none transition-all
            focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-white placeholder-gray-500
            ${Icon ? 'pl-10 pr-4' : 'px-4'}
            ${error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/10' : ''}
            ${className}
          `}
        />
      </div>
      {error && <p className="text-xs text-rose-500 ml-1 mt-1">{error}</p>}
    </div>
  );
};

export default Input;

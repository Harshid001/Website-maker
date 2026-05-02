import React from 'react';

export default function ThemeSelector({ themes, onSelect, currentTheme }) {
  if (!themes) return null;

  return (
    <div className="grid grid-cols-2 gap-4">
      {themes.map(theme => (
        <button 
          key={theme.id} 
          onClick={() => onSelect && onSelect(theme)} 
          className={`p-4 rounded-lg transition-all ${
            currentTheme?.id === theme.id ? 'bg-primary text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          {theme.name}
        </button>
      ))}
    </div>
  );
}

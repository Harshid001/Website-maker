import React from 'react';

export default function TemplateCard({ template, onSelect }) {
  if (!template) return null;

  return (
    <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden group hover:border-primary transition-all">
      <div className="aspect-video bg-gray-900 relative overflow-hidden">
        <img src={template.thumbnail} alt={template.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button 
            onClick={() => onSelect && onSelect(template)}
            className="bg-primary px-6 py-2 rounded-lg text-white font-bold"
          >
            Use Template
          </button>
        </div>
      </div>
      <div className="p-4 flex justify-between items-center">
        <span className="font-bold text-white">{template.name}</span>
      </div>
    </div>
  );
}

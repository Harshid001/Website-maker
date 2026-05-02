import React from 'react';

export default function LeftToolsPanel({ children }) {
  return (
    <aside className="w-16 bg-gray-900 border-r border-gray-800 h-full flex flex-col items-center">
      {children}
    </aside>
  );
}

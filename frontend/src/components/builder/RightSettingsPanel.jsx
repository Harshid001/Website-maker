import React from 'react';

export default function RightSettingsPanel({ children }) {
  return (
    <aside className="w-64 bg-gray-900 border-l border-gray-800 h-full overflow-y-auto">
      {children}
    </aside>
  );
}

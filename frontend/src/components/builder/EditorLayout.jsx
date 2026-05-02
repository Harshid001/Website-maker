import React from 'react';

export default function EditorLayout({ children }) {
  return (
    <div className="flex h-screen w-full bg-black overflow-hidden relative">
      {children}
    </div>
  );
}

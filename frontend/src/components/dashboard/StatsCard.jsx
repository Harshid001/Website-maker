import React from 'react';

export default function StatsCard({ label, value }) {
  return (
    <div className="bg-gray-800/50 px-6 py-4 rounded-xl border border-gray-700 min-w-[120px]">
      <span className="text-gray-500 text-xs uppercase tracking-wider font-bold block mb-1">{label}</span>
      <span className="text-2xl font-bold text-white">{value}</span>
    </div>
  );
}

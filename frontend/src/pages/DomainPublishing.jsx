import React from 'react';
import { Globe, Rocket, Link as LinkIcon, CheckCircle, Info } from 'lucide-react';

export default function DomainPublishing() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Domain & Publishing</h1>
        <p className="text-gray-400">Launch your projects to the world with custom domains and instant publishing.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-800 border border-gray-700 rounded-3xl p-8 space-y-6">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
            <Globe className="text-primary" size={28} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Connect Domain</h3>
            <p className="text-gray-400 text-sm mb-6">Use your own custom domain name (e.g. yourbrand.com) to make your project professional.</p>
            <div className="flex gap-3">
              <input 
                type="text" 
                placeholder="yoursite.com" 
                className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-primary" 
              />
              <button className="bg-primary px-6 py-3 rounded-xl text-white font-bold hover:bg-opacity-90 transition-all">
                Connect
              </button>
            </div>
          </div>
          
          <div className="pt-6 border-t border-gray-700">
            <h4 className="text-white font-bold mb-4">Active Domains</h4>
            <div className="flex items-center justify-between p-4 bg-gray-900 rounded-xl border border-gray-700">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-500" size={18} />
                <span className="text-white text-sm font-medium">shopcraft.studio/yourname</span>
              </div>
              <span className="text-[10px] uppercase font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded">Primary</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-3xl p-8 space-y-6 flex flex-col">
          <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center">
            <Rocket className="text-secondary" size={28} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Instant Publishing</h3>
            <p className="text-gray-400 text-sm">Every change you make is saved. When you're ready, hit publish to update your live site globally.</p>
          </div>
          
          <div className="mt-auto space-y-4">
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex gap-3">
              <Info className="text-blue-400 shrink-0" size={20} />
              <p className="text-[11px] text-blue-300">Publishing ensures your visitors see the latest version of your work. DNS changes for custom domains may take up to 24 hours.</p>
            </div>
            <button className="w-full bg-secondary py-4 rounded-xl text-white font-bold text-lg hover:opacity-90 transition-all shadow-lg shadow-secondary/20">
              Manage Live Sites
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

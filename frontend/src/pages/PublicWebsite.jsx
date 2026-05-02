import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Loader from '../components/common/Loader';

export default function PublicWebsite() {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading a site
    setTimeout(() => setLoading(false), 1500);
  }, [slug]);

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white text-gray-900">
        <Loader />
        <p className="mt-4 font-bold animate-pulse text-gray-400">Loading {slug}...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <nav className="h-20 px-8 flex justify-between items-center border-b border-gray-100">
        <div className="text-2xl font-black uppercase tracking-tighter">{slug || 'Brand'}</div>
        <div className="hidden md:flex gap-8 text-sm font-bold uppercase tracking-widest text-gray-500">
          <a href="#" className="hover:text-black">Home</a>
          <a href="#" className="hover:text-black">About</a>
          <a href="#" className="hover:text-black">Services</a>
          <a href="#" className="hover:text-black">Contact</a>
        </div>
      </nav>

      <header className="py-32 px-8 text-center max-w-4xl mx-auto">
        <h1 className="text-7xl font-black mb-8 leading-none tracking-tighter">WE BUILD AMAZING THINGS TOGETHER.</h1>
        <p className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto">Welcome to the live version of {slug}. This project was built using ShopCraft Studio's AI-powered platform.</p>
        <button className="bg-black text-white px-10 py-5 rounded-full font-black uppercase tracking-widest hover:scale-105 transition-transform">
          Get Started
        </button>
      </header>

      <section className="bg-gray-50 py-24 px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {[1,2,3].map(i => (
            <div key={i} className="space-y-4">
              <div className="aspect-square bg-gray-200 rounded-2xl"></div>
              <h3 className="text-2xl font-bold">Service {i}</h3>
              <p className="text-gray-500">Providing excellence in every step of our process to ensure your satisfaction.</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="py-12 border-t border-gray-100 text-center text-xs text-gray-400 font-bold uppercase tracking-widest">
        &copy; 2026 {slug} | Built with ShopCraft Studio
      </footer>
    </div>
  );
}

import React from 'react';
import { motion } from 'framer-motion';
import { PROJECT_TYPES } from '../utils/constants';
import CreationCard from '../components/dashboard/CreationCard';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CreateNew() {
  const navigate = useNavigate();

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft size={20} /> Back to Dashboard
      </button>

      <header className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">What will you create today?</h1>
        <p className="text-gray-400 text-lg">Select a category to start your next masterpiece.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {PROJECT_TYPES.map((type, index) => (
          <motion.div
            key={type.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <CreationCard 
              title={type.name}
              description={type.description}
              icon={type.icon}
              color={type.color}
              path={type.id === 'website' ? '/create/website' : `/builder/${type.id}`}
            />
          </motion.div>
        ))}
      </div>

      <div className="mt-16 p-8 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl border border-gray-700 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Need Inspiration?</h2>
        <p className="text-gray-400 mb-6">Browse our templates to see what's possible with ShopCraft Studio.</p>
        <button 
          onClick={() => navigate('/templates')}
          className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-xl font-semibold border border-gray-600 transition-all"
        >
          Explore Templates
        </button>
      </div>
    </div>
  );
}

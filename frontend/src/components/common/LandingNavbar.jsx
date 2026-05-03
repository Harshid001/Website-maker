import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, LayoutDashboard, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import shopcraftLogo from '../../assets/logos/shopcraft-logo.svg';

export default function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Templates', href: '#templates' },
    { name: 'Tutorials', href: '#tutorials' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Contact', href: '#footer' },
  ];

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <img src={shopcraftLogo} alt="ShopCraft Studio" className="h-12 w-auto transition-transform group-hover:scale-[1.02]" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-widest"
            >
              {link.name}
            </a>
          ))}
          
          <div className="h-6 w-px bg-slate-200 mx-2"></div>

          {user ? (
            <Link 
              to="/dashboard" 
              className="flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors uppercase tracking-widest"
            >
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
          ) : (
            <Link 
              to="/login" 
              className="flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors uppercase tracking-widest"
            >
              <LogIn size={18} />
              Login
            </Link>
          )}

          <Link 
            to="/register" 
            className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-indigo-600 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-slate-200"
          >
            Start Creating
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden p-2 text-slate-900"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-slate-100 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-bold text-slate-900 hover:text-indigo-600 transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <Link 
                to="/register" 
                onClick={() => setIsOpen(false)}
                className="bg-indigo-600 text-white text-center py-4 rounded-2xl font-bold text-lg"
              >
                Start Creating
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

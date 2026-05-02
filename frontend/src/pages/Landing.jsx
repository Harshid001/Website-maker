import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Palette, 
  Film, 
  Box, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  MousePointer2, 
  Cloud, 
  BookOpen, 
  Save, 
  Heart,
  CheckCircle2,
  ChevronRight,
  Rocket,
  Share2,
  Send,
  Camera,
  Briefcase
} from 'lucide-react';

// Use aliases for missing social icons in this lucide version
const Facebook = Share2;
const Twitter = Send;
const Instagram = Camera;
const Linkedin = Briefcase;
import LandingNavbar from '../components/common/LandingNavbar';

const features = [
  { 
    title: 'Create a Website', 
    desc: 'Build a professional business website using AI-guided steps and ready-made templates.', 
    btn: 'Open Website Builder', 
    route: '/website-builder',
    icon: Globe,
    color: 'indigo'
  },
  { 
    title: 'Design 2D Graphics', 
    desc: 'Create posters, banners, business cards, social media posts, and marketing designs.', 
    btn: 'Open 2D Designer', 
    route: '/design-2d',
    icon: Palette,
    color: 'pink'
  },
  { 
    title: 'Create Animations', 
    desc: 'Add smooth animations, intro effects, product animations, and website motion effects.', 
    btn: 'Open Animation Studio', 
    route: '/animations',
    icon: Film,
    color: 'amber'
  },
  { 
    title: 'Create 3D Visuals', 
    desc: 'Generate simple 3D product visuals, mockups, and business presentation graphics.', 
    btn: 'Open 3D Studio', 
    route: '/three-d-visuals',
    icon: Box,
    color: 'cyan'
  },
  { 
    title: 'Browse Templates', 
    desc: 'Choose from pre-built templates for shops, portfolios, restaurants, services, and local businesses.', 
    btn: 'View Templates', 
    route: '/templates',
    icon: Layers,
    color: 'purple'
  },
  { 
    title: 'Learn With Tutorials', 
    desc: 'Step-by-step tutorials to help users build, edit, save, and publish their projects.', 
    btn: 'Start Learning', 
    route: '/tutorials',
    icon: BookOpen,
    color: 'emerald'
  },
];

const templateCategories = [
  'Jewellery Shop', 'Restaurant', 'Portfolio', 'Coaching Class', 
  'Local Store', 'Salon', 'Real Estate', 'Repair Services', 
  'Freelancer', 'Small Business'
];

export default function Landing() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="bg-white text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-700">
      <LandingNavbar />

      {/* 2. HERO SECTION */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[800px] h-[800px] bg-indigo-50 rounded-full blur-3xl opacity-50 -z-10" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[600px] h-[600px] bg-pink-50 rounded-full blur-3xl opacity-30 -z-10" />

        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 mb-8">
              <Sparkles className="text-indigo-600" size={16} />
              <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest">AI-Powered Creation Tool</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[0.9] text-slate-900">
              BUILD WEBSITES, <br />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                DESIGNS & VISUALS
              </span> <br />
              WITHOUT CODING
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto mb-12 font-medium leading-relaxed">
              ShopCraft Studio helps local businesses and professionals create websites, marketing designs, animations, and simple 3D visuals using AI-powered no-code tools.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
              <Link 
                to="/register" 
                className="w-full sm:w-auto bg-slate-900 text-white px-10 py-5 rounded-2xl text-lg font-bold uppercase tracking-widest hover:bg-indigo-600 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-200"
              >
                Start Creating Now
              </Link>
              <a 
                href="#templates" 
                className="w-full sm:w-auto border-2 border-slate-200 text-slate-900 px-10 py-5 rounded-2xl text-lg font-bold uppercase tracking-widest hover:border-indigo-600 hover:text-indigo-600 transition-all"
              >
                Explore Templates
              </a>
            </div>

            {/* Hero Visual Card */}
            <motion.div 
              className="relative max-w-6xl mx-auto rounded-[2rem] p-4 bg-slate-100/50 border border-slate-200 shadow-2xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.95, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 1 }}
            >
              <div className="bg-white rounded-[1.5rem] overflow-hidden shadow-inner aspect-[16/9]">
                <img 
                  src="/hero.png" 
                  alt="ShopCraft Studio Interface" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Floating Labels */}
              <div className="hidden lg:block absolute top-12 -left-8 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <Globe className="text-white" size={20} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tool</p>
                    <p className="text-sm font-black text-slate-900">AI Website Builder</p>
                  </div>
                </div>
              </div>

              <div className="hidden lg:block absolute bottom-24 -right-8 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 animate-float" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pink-600 rounded-lg flex items-center justify-center">
                    <Palette className="text-white" size={20} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">New</p>
                    <p className="text-sm font-black text-slate-900">2D Design Tool</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 3. DIRECT NAVIGATION SECTION */}
      <section id="features" className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 uppercase">
              Choose What You Want <br /> <span className="text-indigo-600">to Create</span>
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Everything you need to build your digital presence in one integrated creative suite.
            </p>
          </div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature) => (
              <motion.div 
                key={feature.title} 
                variants={itemVariants}
                className="group bg-white p-8 rounded-[2rem] border border-slate-200 hover:border-indigo-600 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-100/50 flex flex-col h-full"
              >
                <div className={`w-14 h-14 rounded-2xl bg-${feature.color}-100 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                  <feature.icon className={`text-${feature.color}-600`} size={28} />
                </div>
                <h3 className="text-2xl font-black mb-4 tracking-tight">{feature.title}</h3>
                <p className="text-slate-500 mb-8 flex-grow leading-relaxed">
                  {feature.desc}
                </p>
                <Link 
                  to={feature.route}
                  className="inline-flex items-center gap-2 font-bold uppercase tracking-widest text-sm text-indigo-600 hover:translate-x-2 transition-transform"
                >
                  {feature.btn} <ArrowRight size={16} />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. HOW IT WORKS SECTION */}
      <section className="py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-10 uppercase leading-[0.9]">
                HOW IT <span className="text-indigo-600">WORKS</span>
              </h2>
              <div className="space-y-12">
                {[
                  { step: '01', title: 'Select your profession', desc: 'Choose your industry to get tailored templates and AI tools.' },
                  { step: '02', title: 'Choose what you want to create', desc: 'Websites, 2D designs, animations, or 3D visuals — it is all here.' },
                  { step: '03', title: 'Customize with AI tools', desc: 'Let AI generate your content and use our drag-and-drop editor to refine.' },
                  { step: '04', title: 'Save, publish, or download', desc: 'Go live with one click or export your designs in high resolution.' },
                ].map((item, i) => (
                  <motion.div 
                    key={item.step}
                    className="flex gap-6"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="text-4xl font-black text-indigo-100 leading-none">{item.step}</div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 uppercase tracking-tight">{item.title}</h3>
                      <p className="text-slate-500">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-600/5 rounded-[3rem] -rotate-3 scale-105" />
              <div className="relative bg-white border border-slate-200 rounded-[3rem] p-8 shadow-xl">
                <div className="aspect-square bg-slate-50 rounded-[2rem] flex items-center justify-center">
                  <Rocket size={120} className="text-indigo-600 animate-float" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FEATURE SECTION (Grid) */}
      <section className="py-32 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 uppercase">
              POWERFUL <span className="text-indigo-400">TOOLS</span> <br /> FOR EVERY NEED
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              'AI guided website creation', 'Profession-based templates', 
              'Pre-built website sections', 'AI-generated text and images',
              'Drag-and-drop editing tools', 'Animation library',
              '2D design tools', 'Simple 3D visual tools',
              'Project saving workspace', 'Favorite templates and assets',
              'Tutorials for beginners', 'Direct domain publishing'
            ].map((feature, i) => (
              <motion.div 
                key={feature}
                className="p-6 bg-slate-800/50 border border-slate-700 rounded-2xl hover:bg-slate-800 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <CheckCircle2 className="text-indigo-400 mb-4" size={24} />
                <p className="font-bold uppercase tracking-widest text-xs">{feature}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. TEMPLATE CATEGORY SECTION */}
      <section id="templates" className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 uppercase leading-[0.9]">
                TEMPLATES FOR <br /> <span className="text-indigo-600">YOUR PROFESSION</span>
              </h2>
              <p className="text-slate-500 text-lg">
                Choose a pre-built structure that works for your specific business type.
              </p>
            </div>
            <Link to="/templates" className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-indigo-600 transition-all flex items-center gap-2">
              All Templates <ChevronRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {templateCategories.map((category) => (
              <div 
                key={category} 
                className="group relative overflow-hidden rounded-3xl aspect-[3/4] bg-slate-100 flex flex-col items-center justify-center p-6 text-center border border-transparent hover:border-indigo-600 transition-all cursor-pointer"
              >
                <div className="mb-4 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Rocket size={32} className="text-indigo-600" />
                </div>
                <h4 className="font-black uppercase tracking-tighter text-lg leading-none mb-4">{category}</h4>
                <button className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full transition-all">
                  Use Template
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. PROJECT WORKSPACE SECTION */}
      <section className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white rounded-[3rem] p-12 md:p-20 border border-slate-200 shadow-xl grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 uppercase leading-[0.9]">
                YOUR PERSONAL <br /> <span className="text-indigo-600">WORKSPACE</span>
              </h2>
              <p className="text-slate-500 text-lg mb-12">
                Save everything in your personal project space. Manage your digital assets with ease.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { icon: Globe, label: 'Saved Websites' },
                  { icon: Heart, label: 'Favorite Templates' },
                  { icon: Film, label: 'Saved Animations' },
                  { icon: Palette, label: '2D Designs' },
                  { icon: Box, label: '3D Visuals' },
                  { icon: Save, label: 'Draft Projects' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <item.icon size={20} className="text-indigo-600" />
                    <span className="font-bold uppercase tracking-widest text-xs">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 pt-12">
                <div className="aspect-[4/5] bg-indigo-600 rounded-[2rem] shadow-lg flex items-center justify-center">
                  <Cloud size={60} className="text-white opacity-20" />
                </div>
                <div className="aspect-square bg-slate-200 rounded-[2rem]"></div>
              </div>
              <div className="space-y-4">
                <div className="aspect-square bg-pink-500 rounded-[2rem] shadow-lg flex items-center justify-center">
                  <Heart size={60} className="text-white opacity-20" />
                </div>
                <div className="aspect-[4/5] bg-slate-800 rounded-[2rem] shadow-lg flex items-center justify-center">
                  <Layers size={60} className="text-slate-400 opacity-20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. PUBLISHING SECTION */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 uppercase">
              PUBLISH YOUR WEBSITE <br /> <span className="text-indigo-600">DIRECTLY</span>
            </h2>
            <p className="text-slate-500 text-lg">
              Take your business online in seconds. No complex hosting setups required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            {[
              { icon: MousePointer2, title: 'Preview Site', desc: 'See how your site looks on all devices before going live.' },
              { icon: Cloud, title: 'Custom Domain', desc: 'Connect your own domain or use our free subdomain.' },
              { icon: Rocket, title: 'Publish Live', desc: 'One click and your business is officially online.' },
              { icon: CheckCircle2, title: 'Instant Updates', desc: 'Change content anytime and see updates instantly.' },
            ].map((item) => (
              <div key={item.title} className="flex flex-col items-center">
                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                  <item.icon size={32} />
                </div>
                <h4 className="text-xl font-bold uppercase tracking-tight mb-4">{item.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <button className="bg-indigo-600 text-white px-12 py-5 rounded-2xl text-lg font-bold uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100">
            Publish My Website
          </button>
        </div>
      </section>

      {/* 9. CTA SECTION */}
      <section className="py-32 bg-slate-900 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,var(--color-indigo-500)_0%,transparent_70%)]" />
        </div>
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-8 uppercase leading-none">
            START BUILDING YOUR <br /> <span className="text-indigo-400">ONLINE PRESENCE</span> TODAY
          </h2>
          <p className="text-slate-400 text-xl mb-12">
            No coding. No design experience. Just choose, customize, save, and publish.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/register" className="bg-white text-slate-900 px-12 py-5 rounded-2xl text-lg font-bold uppercase tracking-widest hover:bg-indigo-400 hover:text-white transition-all">
              Get Started Free
            </Link>
            <button className="border-2 border-slate-700 text-white px-12 py-5 rounded-2xl text-lg font-bold uppercase tracking-widest hover:border-white transition-all">
              View Demo
            </button>
          </div>
        </div>
      </section>

      {/* 10. FOOTER */}
      <footer id="footer" className="bg-white border-t border-slate-100 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            <div className="lg:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-8">
                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
                  <Rocket className="text-white" size={20} />
                </div>
                <span className="text-2xl font-black tracking-tighter uppercase">ShopCraft</span>
              </Link>
              <p className="text-slate-500 leading-relaxed mb-8">
                The all-in-one no-code creative platform for local businesses and professionals.
              </p>
              <div className="flex gap-4">
                {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all">
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h5 className="font-black uppercase tracking-widest text-xs mb-8">Quick Links</h5>
              <ul className="space-y-4">
                {['Home', 'Templates', 'Pricing', 'Tutorials', 'About Us'].map(item => (
                  <li key={item}>
                    <a href="#" className="text-slate-500 hover:text-indigo-600 transition-colors font-medium">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="font-black uppercase tracking-widest text-xs mb-8">Creative Tools</h5>
              <ul className="space-y-4">
                {['Website Builder', '2D Designer', 'Animation Studio', '3D Visuals', 'Image Editor'].map(item => (
                  <li key={item}>
                    <a href="#" className="text-slate-500 hover:text-indigo-600 transition-colors font-medium">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="font-black uppercase tracking-widest text-xs mb-8">Contact</h5>
              <p className="text-slate-500 mb-4 font-medium">support@shopcraftstudio.com</p>
              <p className="text-slate-500 font-medium">123 Creative Way, Digital City</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-slate-100 gap-6">
            <p className="text-slate-400 text-sm font-medium">
              &copy; 2026 ShopCraft Studio. All rights reserved.
            </p>
            <div className="flex gap-8 text-sm text-slate-400 font-medium">
              <a href="#" className="hover:text-indigo-600">Privacy Policy</a>
              <a href="#" className="hover:text-indigo-600">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

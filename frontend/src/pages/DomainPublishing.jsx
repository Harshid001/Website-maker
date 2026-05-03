import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ExternalLink, Globe, Info, Rocket } from 'lucide-react';
import { ProjectContext } from '../context/ProjectContext';

export default function DomainPublishing() {
  const navigate = useNavigate();
  const { projects, updateProject } = useContext(ProjectContext);
  const [domain, setDomain] = useState('');
  const [notice, setNotice] = useState('');
  const publishedProjects = projects.filter((project) => project.published || project.status === 'published');

  const connectDomain = () => {
    const cleanDomain = domain.trim().replace(/^https?:\/\//, '').replace(/\/$/, '');
    if (!cleanDomain) {
      setNotice('Enter a domain name first.');
      return;
    }
    if (!publishedProjects.length) {
      setNotice('Publish a website before connecting a custom domain.');
      return;
    }
    const target = publishedProjects[0];
    updateProject(target.id, { ...target, settings: { ...(target.settings || {}), customDomain: cleanDomain } });
    setDomain('');
    setNotice(`${cleanDomain} saved as a domain placeholder for ${target.name}.`);
  };

  return (
    <div className="mx-auto max-w-5xl p-8">
      <header className="mb-12">
        <h1 className="mb-4 text-4xl font-bold text-white">Domain & Publishing</h1>
        <p className="text-gray-400">Launch websites, inspect live links, and prepare custom domain settings.</p>
      </header>

      {notice && (
        <div className="mb-6 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 px-5 py-4 text-sm font-bold text-indigo-100">
          {notice}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-6 rounded-3xl border border-gray-700 bg-gray-800 p-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <Globe className="text-primary" size={28} />
          </div>
          <div>
            <h3 className="mb-2 text-2xl font-bold text-white">Connect Domain</h3>
            <p className="mb-6 text-sm text-gray-400">Save custom domain settings now; DNS verification can be wired to the backend later.</p>
            <div className="flex gap-3">
              <input
                type="text"
                value={domain}
                onChange={(event) => setDomain(event.target.value)}
                placeholder="yoursite.com"
                className="flex-1 rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-primary"
              />
              <button type="button" onClick={connectDomain} className="rounded-xl bg-primary px-6 py-3 font-bold text-white transition-all hover:bg-opacity-90">
                Connect
              </button>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-6">
            <h4 className="mb-4 font-bold text-white">Live Sites</h4>
            <div className="space-y-3">
              {publishedProjects.length ? publishedProjects.map((project) => (
                <div key={project.id} className="rounded-xl border border-gray-700 bg-gray-900 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <CheckCircle className="shrink-0 text-green-500" size={18} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-white">{project.name}</p>
                        <p className="truncate text-xs text-gray-500">/site/{project.slug}</p>
                      </div>
                    </div>
                    <button type="button" onClick={() => navigate(`/site/${project.slug}`)} className="rounded-lg border border-gray-700 p-2 text-gray-300 hover:text-white">
                      <ExternalLink size={15} />
                    </button>
                  </div>
                  {project.settings?.customDomain && (
                    <p className="mt-3 rounded-lg bg-green-500/10 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-green-300">
                      Domain placeholder: {project.settings.customDomain}
                    </p>
                  )}
                </div>
              )) : (
                <div className="rounded-xl border border-dashed border-gray-700 bg-gray-900 p-4 text-sm text-gray-500">
                  No published websites yet.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-6 rounded-3xl border border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 p-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/10">
            <Rocket className="text-secondary" size={28} />
          </div>
          <div>
            <h3 className="mb-2 text-2xl font-bold text-white">Instant Publishing</h3>
            <p className="text-sm text-gray-400">Publishing stores the latest saved project and exposes it at a clean local site route.</p>
          </div>

          <div className="mt-auto space-y-4">
            <div className="flex gap-3 rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4">
              <Info className="shrink-0 text-blue-400" size={20} />
              <p className="text-[11px] text-blue-300">Custom domain DNS, SSL, and deployment provider hooks are represented as backend-ready placeholders.</p>
            </div>
            <button type="button" onClick={() => navigate('/dashboard/projects')} className="w-full rounded-xl bg-secondary py-4 text-lg font-bold text-white shadow-lg shadow-secondary/20 transition-all hover:opacity-90">
              Manage Projects
            </button>
            <button type="button" onClick={() => navigate('/create/website')} className="w-full rounded-xl border border-gray-700 py-4 text-sm font-black uppercase tracking-widest text-gray-300 transition-all hover:text-white">
              Create Website
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

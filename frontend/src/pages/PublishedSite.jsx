import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PublishedWebsiteView from '../components/builder/PublishedWebsiteView';
import { BuilderProvider, useBuilderStore } from '../store/builderStore';
import { projectStorage } from '../services/projectStorage';

function PublishedSiteInner({ project, pageSlug }) {
  const navigate = useNavigate();
  const { project: liveProject, switchPage } = useBuilderStore();

  useEffect(() => {
    if (!pageSlug || !liveProject?.pages?.length) return;
    const page = liveProject.pages.find((item) => item.slug === pageSlug);
    if (page && page.id !== liveProject.currentPageId) switchPage(page.id);
  }, [pageSlug, liveProject, switchPage]);

  useEffect(() => {
    document.title = project?.seo?.metaTitle || project?.name || 'Published Website';
    const description = document.querySelector('meta[name="description"]') || document.createElement('meta');
    description.setAttribute('name', 'description');
    description.setAttribute('content', project?.seo?.metaDescription || '');
    document.head.appendChild(description);
  }, [project]);

  return <PublishedWebsiteView device="desktop" runtimeMode="published" onNavigate={(slug) => navigate(`/site/${project.slug}/${slug}`)} />;
}

export default function PublishedSite() {
  const { slug, pageSlug } = useParams();
  const [project, setProject] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setProject(projectStorage.getPublishedSite(slug));
    setChecked(true);
  }, [slug]);

  if (!checked) {
    return <div className="flex min-h-screen items-center justify-center bg-white text-slate-900">Loading site...</div>;
  }

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">
        <div className="max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center">
          <h1 className="text-3xl font-black">404</h1>
          <p className="mt-2 text-slate-400">Published site not found for `{slug}`.</p>
          <Link to="/dashboard" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-xs font-black uppercase tracking-widest text-white">
            <ArrowLeft size={15} />
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <BuilderProvider projectId={project.id}>
      <PublishedSiteInner project={project} pageSlug={pageSlug} />
    </BuilderProvider>
  );
}

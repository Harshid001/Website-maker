import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Rocket } from 'lucide-react';
import DeviceSwitcher from '../components/builder/DeviceSwitcher';
import WebsiteCanvas from '../components/builder/WebsiteCanvas';
import { BuilderProvider, useBuilderStore } from '../store/builderStore';

function PreviewInner() {
  const navigate = useNavigate();
  const { pageSlug } = useParams();
  const { project, publishProject, switchPage } = useBuilderStore();

  useEffect(() => {
    if (!pageSlug || !project?.pages?.length) return;
    const page = project.pages.find((item) => item.slug === pageSlug);
    if (page && page.id !== project.currentPageId) switchPage(page.id);
  }, [pageSlug, project, switchPage]);

  const handlePublish = async () => {
    const published = await publishProject();
    if (published) navigate(`/site/${published.slug}`);
  };

  return (
    <div className="flex h-screen flex-col bg-slate-950 text-white">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900 px-5">
        <Link to={`/builder/website/${project?.id}`} className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white">
          <ArrowLeft size={17} />
          Back to editor
        </Link>
        <DeviceSwitcher />
        <button type="button" onClick={handlePublish} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-black uppercase tracking-widest text-white hover:bg-indigo-500">
          <Rocket size={15} />
          Publish
        </button>
      </header>
      <main className="min-h-0 flex-1 overflow-hidden">
        <WebsiteCanvas readonly runtimeMode="preview" />
      </main>
    </div>
  );
}

export default function PreviewPage() {
  const { projectId } = useParams();
  return (
    <BuilderProvider projectId={projectId}>
      <PreviewInner />
    </BuilderProvider>
  );
}

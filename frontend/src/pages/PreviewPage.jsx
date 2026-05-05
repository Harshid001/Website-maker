import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Rocket } from 'lucide-react';
import DeviceSwitcher from '../components/builder/DeviceSwitcher';
import PublishedWebsiteView from '../components/builder/PublishedWebsiteView';
import { BuilderProvider, useBuilderStore } from '../store/builderStore';
import { getDeviceWidth } from '../utils/renderHelpers';

function PreviewInner() {
  const navigate = useNavigate();
  const { pageSlug } = useParams();
  const { activeDevice, project, publishProject, switchPage } = useBuilderStore();
  const width = getDeviceWidth(activeDevice);

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
        <div className="flex items-center gap-4">
          <DeviceSwitcher />
          <button type="button" onClick={handlePublish} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-black uppercase tracking-widest text-white hover:bg-indigo-500">
            <Rocket size={15} />
            Publish
          </button>
        </div>
      </header>

      {(project?.pages?.length > 1) && (
        <div className="flex justify-center border-b border-slate-800 bg-slate-950 p-2">
          <div className="flex items-center gap-1 rounded-xl bg-slate-900 p-1">
            {project.pages.map((page) => (
              <button
                key={page.id}
                type="button"
                onClick={() => navigate(`/preview/${project.id}/${page.slug}`)}
                className={`rounded-lg px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-colors ${
                  project.currentPageId === page.id ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {page.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <main className="min-h-0 flex-1 overflow-auto bg-slate-200 p-6">
        <div className="mx-auto min-h-full bg-white shadow-2xl transition-[width] duration-300" style={{ width, maxWidth: 'calc(100vw - 48px)' }}>
          <PublishedWebsiteView device={activeDevice} onNavigate={(slug) => navigate(`/preview/${project.id}/${slug}`)} />
        </div>
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

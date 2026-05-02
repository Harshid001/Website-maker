import React from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import { AuthProvider } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectContext';
import { UIProvider } from './context/UIContext';

function LayoutWrapper({ children }) {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const isEditorPage = 
    location.pathname.startsWith('/builder/') || 
    ['/website-builder', '/design-2d', '/animations', '/three-d-visuals'].includes(location.pathname) ||
    ['/dashboard/website-builder', '/dashboard/design-2d', '/dashboard/design-3d', '/dashboard/animations'].includes(location.pathname);
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';


  // Editor pages have no top navbar and no standard sidebar
  if (isEditorPage) {
    return <main className="h-screen w-full overflow-hidden bg-slate-950">{children}</main>;
  }

  // Landing page has its own navbar (implemented within Landing.jsx or as a separate component)
  if (isLandingPage || isAuthPage) {
    return <main className="min-h-screen bg-white text-slate-900">{children}</main>;
  }

  // Dashboard and other management pages
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-white">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <UIProvider>
          <Router>
            <LayoutWrapper>
              <AppRoutes />
            </LayoutWrapper>
          </Router>
        </UIProvider>
      </ProjectProvider>
    </AuthProvider>
  );
}

export default App;

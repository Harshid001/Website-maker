import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import CreateNew from '../pages/CreateNew';
import CreateWebsite from '../pages/CreateWebsite';
import WebsiteBuilder from '../pages/WebsiteBuilder';
import PreviewPage from '../pages/PreviewPage';
import PublishedSite from '../pages/PublishedSite';
import Design2DStudio from '../pages/Design2DStudio';
import AnimationStudio from '../pages/AnimationStudio';
import Model3DStudio from '../pages/Model3DStudio';
import Templates from '../pages/Templates';
import Favorites from '../pages/Favorites';
import MyProjects from '../pages/MyProjects';
import Tutorials from '../pages/Tutorials';
import DomainPublishing from '../pages/DomainPublishing';
import Settings from '../pages/Settings';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/projects" element={<MyProjects />} />
      <Route path="/dashboard/templates" element={<Templates />} />
      <Route path="/dashboard/favorites" element={<Favorites />} />
      <Route path="/dashboard/published" element={<DomainPublishing />} />
      <Route path="/dashboard/settings" element={<Settings />} />
      <Route path="/create-new" element={<CreateNew />} />
      <Route path="/create" element={<CreateWebsite />} />
      <Route path="/create/website" element={<CreateWebsite />} />
      <Route path="/create/website/details" element={<CreateWebsite />} />
      <Route path="/create/website/templates" element={<CreateWebsite />} />
      <Route path="/create/website/ai" element={<CreateWebsite />} />
      <Route path="/create/website/blank" element={<CreateWebsite />} />
      
      {/* Dashboard Tool Routes */}
      <Route path="/dashboard/website-builder" element={<WebsiteBuilder />} />
      <Route path="/dashboard/design-2d" element={<Design2DStudio />} />
      <Route path="/dashboard/design-3d" element={<Model3DStudio />} />
      <Route path="/dashboard/animations" element={<AnimationStudio />} />
      
      {/* Legacy/Alias Tool Routes */}
      <Route path="/builder/website" element={<WebsiteBuilder />} />
      <Route path="/builder/website/:projectId" element={<WebsiteBuilder />} />
      <Route path="/builder/design-2d" element={<Design2DStudio />} />
      <Route path="/builder/animation" element={<AnimationStudio />} />
      <Route path="/builder/model-3d" element={<Model3DStudio />} />
      
      <Route path="/website-builder" element={<WebsiteBuilder />} />
      <Route path="/design-2d" element={<Design2DStudio />} />
      <Route path="/animations" element={<AnimationStudio />} />
      <Route path="/three-d-visuals" element={<Model3DStudio />} />
      
      <Route path="/templates" element={<Templates />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/my-projects" element={<MyProjects />} />
      <Route path="/tutorials" element={<Tutorials />} />
      <Route path="/publishing" element={<DomainPublishing />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/preview/:projectId" element={<PreviewPage />} />
      <Route path="/preview/:projectId/:pageSlug" element={<PreviewPage />} />
      <Route path="/site/:slug" element={<PublishedSite />} />
      <Route path="/site/:slug/:pageSlug" element={<PublishedSite />} />
      <Route path="/published/:slug" element={<PublishedSite />} />
      <Route path="/published/:slug/:pageSlug" element={<PublishedSite />} />
    </Routes>
  );
};

export default AppRoutes;

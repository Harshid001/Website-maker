import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import CreateNew from '../pages/CreateNew';
import WebsiteBuilder from '../pages/WebsiteBuilder';
import Design2DStudio from '../pages/Design2DStudio';
import AnimationStudio from '../pages/AnimationStudio';
import Model3DStudio from '../pages/Model3DStudio';
import Templates from '../pages/Templates';
import Favorites from '../pages/Favorites';
import MyProjects from '../pages/MyProjects';
import Tutorials from '../pages/Tutorials';
import DomainPublishing from '../pages/DomainPublishing';
import Settings from '../pages/Settings';
import PublicWebsite from '../pages/PublicWebsite';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/create-new" element={<CreateNew />} />
      
      {/* Dashboard Tool Routes */}
      <Route path="/dashboard/website-builder" element={<WebsiteBuilder />} />
      <Route path="/dashboard/design-2d" element={<Design2DStudio />} />
      <Route path="/dashboard/design-3d" element={<Model3DStudio />} />
      <Route path="/dashboard/animations" element={<AnimationStudio />} />
      
      {/* Legacy/Alias Tool Routes */}
      <Route path="/builder/website" element={<WebsiteBuilder />} />
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
      <Route path="/site/:slug" element={<PublicWebsite />} />
    </Routes>
  );
};

export default AppRoutes;


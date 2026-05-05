import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { getTemplateProject } from '../utils/projectStorage';
import { getWorkspaceRoute } from '../utils/templateUtils';

export default function Workspace() {
  const { projectId } = useParams();
  const project = getTemplateProject(projectId);

  if (!project) return <Navigate to="/templates" replace />;

  return <Navigate to={getWorkspaceRoute(project)} replace />;
}

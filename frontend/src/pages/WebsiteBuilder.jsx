import React from 'react';
import { useParams } from 'react-router-dom';
import BuilderLayout from '../components/builder/BuilderLayout';
import { BuilderProvider } from '../store/builderStore';

export default function WebsiteBuilder() {
  const { projectId, pageId } = useParams();

  return (
    <BuilderProvider projectId={projectId} initialPageId={pageId}>
      <BuilderLayout />
    </BuilderProvider>
  );
}

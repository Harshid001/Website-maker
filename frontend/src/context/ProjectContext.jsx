import React, { createContext, useCallback, useEffect, useState } from 'react';
import { projectStorage } from '../services/projectStorage';

export const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState(() => projectStorage.listProjects());
  const [currentProject, setCurrentProject] = useState(null);
  const [favorites, setFavorites] = useState(() => projectStorage.listProjects().filter((project) => project.favorite).map((project) => project.id));

  const refreshProjects = useCallback(() => {
    const nextProjects = projectStorage.listProjects();
    setProjects(nextProjects);
    setFavorites(nextProjects.filter((project) => project.favorite).map((project) => project.id));
  }, []);

  useEffect(() => {
    refreshProjects();
  }, [refreshProjects]);

  const addProject = (project) => {
    const newProject = projectStorage.createProject(project);
    refreshProjects();
    return newProject;
  };

  const updateProject = (id, updates) => {
    const updated = projectStorage.updateProject(id, updates);
    refreshProjects();
    return updated;
  };

  const deleteProject = (id) => {
    projectStorage.deleteProject(id);
    refreshProjects();
  };

  const duplicateProject = (id) => {
    const copy = projectStorage.duplicateProject(id);
    refreshProjects();
    return copy;
  };

  const publishProject = (id) => {
    const published = projectStorage.publishProject(id);
    refreshProjects();
    return published;
  };

  const toggleFavorite = (projectId) => {
    const project = projectStorage.getProject(projectId);
    if (!project) return null;
    const updated = projectStorage.updateProject(projectId, { ...project, favorite: !project.favorite });
    refreshProjects();
    return updated;
  };

  const isFavorite = (projectId) => projects.some((project) => project.id === projectId && project.favorite);

  return (
    <ProjectContext.Provider
      value={{
        projects,
        setProjects,
        currentProject,
        setCurrentProject,
        favorites,
        addProject,
        updateProject,
        deleteProject,
        duplicateProject,
        publishProject,
        refreshProjects,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

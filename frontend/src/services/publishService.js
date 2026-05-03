import { publishProject, getPublishedSite } from './projectStorage';

export const publishWebsiteProject = (projectId) => publishProject(projectId);

export const getPublishedWebsite = (slug) => getPublishedSite(slug);

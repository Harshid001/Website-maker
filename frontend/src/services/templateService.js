import api from './api';

export const getTemplates = async (type) => {
  const response = await api.get(`/templates?type=${type}`);
  return response.data;
};

export const getTemplateById = async (id) => {
  const response = await api.get(`/templates/${id}`);
  return response.data;
};

export const getTemplatesByCategory = async (type, category) => {
  const response = await api.get(`/templates?type=${type}&category=${category}`);
  return response.data;
};

import api from './api';

export const generateWebsiteContent = async (businessData) => {
  try {
    const response = await api.post('/ai/generate-content', businessData);
    return response.data;
  } catch (error) {
    console.error('Error generating website content:', error);
    throw error;
  }
};

export const generateSEO = async (businessData) => {
  try {
    const response = await api.post('/ai/generate-seo', businessData);
    return response.data;
  } catch (error) {
    console.error('Error generating SEO:', error);
    throw error;
  }
};

export const suggestTemplate = async (data) => {
  try {
    const response = await api.post('/ai/suggest-template', data);
    return response.data;
  } catch (error) {
    console.error('Error suggesting template:', error);
    throw error;
  }
};

export const suggestAnimation = async (data) => {
  try {
    const response = await api.post('/ai/suggest-animation', data);
    return response.data;
  } catch (error) {
    console.error('Error suggesting animation:', error);
    throw error;
  }
};

export const generateDesignText = async (data) => {
  try {
    const response = await api.post('/ai/generate-design-text', data);
    return response.data;
  } catch (error) {
    console.error('Error generating design text:', error);
    throw error;
  }
};

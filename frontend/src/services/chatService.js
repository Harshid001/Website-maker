import api from './api';

export const sendChatMessage = async (payload) => {
  const response = await api.post('/chat/send', payload);
  return response.data;
};

export const fetchChatHistory = async (projectId, userId) => {
  const response = await api.get(`/chat/history/${projectId}`, {
    params: { userId },
  });
  return response.data;
};

export const clearChatHistory = async (projectId, userId) => {
  const response = await api.delete(`/chat/clear/${projectId}`, {
    params: { userId },
  });
  return response.data;
};

export const saveChatOutput = async (payload) => {
  const response = await api.post('/chat/save-output', payload);
  return response.data;
};

import api from './api';

export const loginUser = async (email, password) => {
  // Mock login for development
  const mockUser = {
    id: '1',
    name: 'Demo User',
    email: email,
    token: 'mock-token-123'
  };
  localStorage.setItem('shopcraft_token', mockUser.token);
  localStorage.setItem('shopcraft_user', JSON.stringify(mockUser));
  return mockUser;
};

export const registerUser = async (name, email, password) => {
  const response = await api.post('/auth/register', { name, email, password });
  if (response.data.token) {
    localStorage.setItem('shopcraft_token', response.data.token);
  }
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem('shopcraft_token');
  localStorage.removeItem('shopcraft_user');
};

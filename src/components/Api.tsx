import axios from 'axios';

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://trainapp-production-8bab.up.railway.app/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// إضافة الـ Token تلقائياً في كل طلب لو المستخدم مسجل دخول
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
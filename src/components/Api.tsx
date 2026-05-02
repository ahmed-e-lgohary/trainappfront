import axios from 'axios';

const api = axios.create({
  baseURL: 'https://trainbookingapp.fly.dev/api/v1',
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
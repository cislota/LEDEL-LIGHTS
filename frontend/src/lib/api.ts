// API Client для работы с backend
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

// Создаем базовый instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Функция для установки токена авторизации
export const setAuthToken = (username: string, password: string) => {
  const token = btoa(`${username}:${password}`);
  apiClient.defaults.headers.common['Authorization'] = `Basic ${token}`;
  
  // Сохраняем в localStorage для client-side
  localStorage.setItem('adminAuth', JSON.stringify({ username, token }));
  
  // Сохраняем в cookies для middleware (на 7 дней)
  const expires = new Date();
  expires.setDate(expires.getDate() + 7);
  document.cookie = `adminAuth=${JSON.stringify({ username, token })}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;
};

// Функция для удаления токена
export const removeAuthToken = () => {
  delete apiClient.defaults.headers.common['Authorization'];
  localStorage.removeItem('adminAuth');
  document.cookie = 'adminAuth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
};

// Восстановление токена из localStorage
export const restoreAuthToken = () => {
  const stored = localStorage.getItem('adminAuth');
  if (stored) {
    try {
      const { username, token } = JSON.parse(stored);
      apiClient.defaults.headers.common['Authorization'] = `Basic ${token}`;
      return { username, token };
    } catch {
      removeAuthToken();
    }
  }
  return null;
};

// Проверка авторизации
export const isAuthenticated = () => {
  return !!apiClient.defaults.headers.common['Authorization'];
};

// API методы
export const api = {
  // Health check
  health: () => apiClient.get('/health'),
  
  // Orders
  orders: {
    list: (params?: { page?: number; page_size?: number; status?: string; source?: string }) =>
      apiClient.get('/orders', { params }),
    get: (id: number) => apiClient.get(`/orders/${id}`),
    create: (data: any) => apiClient.post('/orders', data),
    update: (id: number, data: any) => apiClient.patch(`/orders/${id}`, data),
  },
  
  // Quiz Results
  quiz: {
    list: (params?: { page?: number; page_size?: number; is_processed?: boolean }) =>
      apiClient.get('/quiz/results', { params }),
    get: (id: number) => apiClient.get(`/quiz/results/${id}`),
    update: (id: number, data: { is_processed?: boolean; manager_comment?: string }) =>
      apiClient.patch(`/quiz/results/${id}`, data),
  },
  
  // Contact Form Submissions
  contacts: {
    list: (params?: { page?: number; page_size?: number; is_processed?: boolean; form_type?: string }) =>
      apiClient.get('/contact/submissions', { params }),
    get: (id: number) => apiClient.get(`/contact/submissions/${id}`),
    update: (id: number, data: { is_processed?: boolean; manager_comment?: string }) =>
      apiClient.patch(`/contact/submissions/${id}`, data),
  },
  
  // Products
  products: {
    list: (params?: { page?: number; page_size?: number; category?: string; type?: string; brand?: string; search?: string; is_available?: boolean }) =>
      apiClient.get('/products', { params }),
    get: (id: number) => apiClient.get(`/products/id/${id}`),
    getBySlug: (slug: string) => apiClient.get(`/products/${slug}`),
  },
  
  // Categories
  categories: {
    list: (params?: { parent_id?: number | null; is_active?: boolean }) =>
      apiClient.get('/categories', { params }),
    tree: () => apiClient.get('/categories/tree'),
  },
  
  // Sync
  sync: {
    start: () => apiClient.post('/sync/products'),
    status: () => apiClient.get('/sync/status'),
  },
  
  // Init DB
  initDb: () => apiClient.post('/init-db'),
};

export default apiClient;

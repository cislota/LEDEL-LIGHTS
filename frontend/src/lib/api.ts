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

// Интерцептор для добавления JWT токена
apiClient.interceptors.request.use((config) => {
  const stored = localStorage.getItem('adminAuth');
  if (stored) {
    try {
      const { token } = JSON.parse(stored);
      config.headers.Authorization = `Bearer ${token}`;
    } catch {
      // Игнорируем ошибки парсинга
    }
  }
  return config;
});

// Интерцептор для обработки 401 ошибок
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Не редиректим если это запрос логина
      const url = error.config?.url || '';
      if (!url.includes('/auth/login')) {
        localStorage.removeItem('adminAuth');
        if (typeof window !== 'undefined') {
          window.location.href = '/admin/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Функция для установки токена авторизации (JWT)
export const setAuthToken = async (username: string, password: string): Promise<boolean> => {
  try {
    console.log('🔑 setAuthToken: отправка запроса на /auth/login');
    
    const response = await apiClient.post('/auth/login', { username, password });
    
    console.log('🔑 setAuthToken: ответ получен', response.data);
    
    const data = response.data;
    if (!data?.access_token) {
      console.error('❌ Токен не найден в ответе:', data);
      return false;
    }

    const { access_token, expires_in } = data;
    const expiresAt = Date.now() + (expires_in * 1000);

    // Сохраняем в localStorage для клиентских запросов
    localStorage.setItem('adminAuth', JSON.stringify({
      username,
      token: access_token,
      expiresAt,
    }));

    // Сохраняем в cookies для middleware (Next.js проверяет cookies на сервере)
    const expiresDate = new Date(expiresAt);
    document.cookie = `adminAuth=${JSON.stringify({ token: access_token })}; expires=${expiresDate.toUTCString()}; path=/; SameSite=Strict`;

    console.log('✅ Токен сохранён в localStorage и cookies');
    return true;
  } catch (error: any) {
    console.error('❌ Login failed:', error.response?.data || error.message);
    return false;
  }
};

// Функция для удаления токена
export const removeAuthToken = () => {
  localStorage.removeItem('adminAuth');
  document.cookie = 'adminAuth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
};

// Восстановление токена из localStorage
export const restoreAuthToken = (): { username: string; token: string } | null => {
  const stored = localStorage.getItem('adminAuth');
  if (stored) {
    try {
      const { username, token, expiresAt } = JSON.parse(stored);
      
      // Проверяем срок действия
      if (expiresAt && Date.now() > expiresAt) {
        removeAuthToken();
        return null;
      }
      
      return { username, token };
    } catch {
      removeAuthToken();
    }
  }
  return null;
};

// Проверка авторизации
export const isAuthenticated = (): boolean => {
  const auth = restoreAuthToken();
  return !!auth;
};

// Проверка токена на сервере
export const verifyToken = async (): Promise<boolean> => {
  try {
    await apiClient.get('/auth/verify');
    return true;
  } catch {
    return false;
  }
};

// API методы
export const api = {
  // Auth
  auth: {
    login: (username: string, password: string) => setAuthToken(username, password),
    verify: () => apiClient.get('/auth/verify'),
    me: () => apiClient.get('/auth/me'),
  },

  // Health check
  health: () => apiClient.get('/health'),

  // Orders
  orders: {
    list: (params?: { page?: number; page_size?: number; status?: string; source?: string }) =>
      apiClient.get('/orders', { params }),
    get: (id: number) => apiClient.get(`/orders/${id}`),
    create: (data: any) => apiClient.post('/orders', data),
    update: (id: number, data: any) => apiClient.patch(`/orders/${id}`, data),
    updateStatus: (id: number, data: { status: string; manager_comment?: string }) =>
      apiClient.patch(`/orders/${id}/status`, data),
    cancel: (id: number, comment?: string) =>
      apiClient.post(`/orders/${id}/cancel`, null, { params: { comment } }),
    complete: (id: number, comment?: string) =>
      apiClient.post(`/orders/${id}/complete`, null, { params: { comment } }),
    getStats: () => apiClient.get('/orders/admin/stats/summary'),
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
    syncTilda: () => apiClient.post('/products/admin/sync/tilda'),
    getSyncStatus: () => apiClient.get('/products/admin/sync/status'),
  },

  // Categories
  categories: {
    list: (params?: { parent_id?: number | null; is_active?: boolean }) =>
      apiClient.get('/categories', { params }),
    tree: () => apiClient.get('/categories/tree'),
  },

  // Init DB
  initDb: () => apiClient.post('/init-db'),
};

export default apiClient;

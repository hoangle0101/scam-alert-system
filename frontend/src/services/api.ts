const API_BASE_URL = 'http://localhost:8001/api/v1';

export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('sg_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Handle unauthorized - maybe logout user
    localStorage.removeItem('sg_token');
    localStorage.removeItem('sg_user');
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'API request failed');
  }

  return response.json();
};

export const api = {
  auth: {
    login: (credentials: any) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    getMe: () => apiRequest('/auth/me'),
  },
  scanner: {
    scanUrl: (url: string) => apiRequest('/scan/url', { method: 'POST', body: JSON.stringify({ url }) }),
    scanMessage: (content: string) => apiRequest('/scan/message', { method: 'POST', body: JSON.stringify({ content }) }),
    getHistory: (page = 1) => apiRequest(`/scan/history?page=${page}`),
  },
  admin: {
    getDashboard: () => apiRequest('/admin/dashboard'),
    getScans: (page = 1) => apiRequest(`/admin/scans?page=${page}`),
    getUsers: () => apiRequest('/admin/users'),
  },
  knowledge: {
    getArticles: (category?: string) => apiRequest(`/knowledge/articles${category ? `?category=${category}` : ''}`),
    getArticle: (id: number) => apiRequest(`/knowledge/articles/${id}`),
  },
  community: {
    getPosts: (page = 1) => apiRequest(`/community/posts?page=${page}`),
    createPost: (data: any) => apiRequest('/community/posts', { method: 'POST', body: JSON.stringify(data) }),
  }
};

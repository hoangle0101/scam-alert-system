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
    getHistory: (page: number = 1, limit: number = 20) => apiRequest(`/scan/history?page=${page}&limit=${limit}`),
    getStats: () => apiRequest('/scan/stats'),
  },
  admin: {
    getDashboard: () => apiRequest('/admin/dashboard'),
    getScans: (page = 1) => apiRequest(`/admin/scans?page=${page}`),
    getUsers: () => apiRequest('/admin/users'),
    getReports: () => apiRequest('/admin/reports'),
    getModelMetrics: () => apiRequest('/admin/model-metrics'),
    getAuditLogs: (page = 1, action?: string) => apiRequest(`/admin/audit-logs?page=${page}${action ? `&action=${action}` : ''}`),
    updateReportStatus: (type: string, id: number, status: string) => 
      apiRequest(`/admin/reports/${type}/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
    getSettings: () => apiRequest('/admin/settings'),
    updateSettings: (data: any) => apiRequest('/admin/settings', { method: 'PATCH', body: JSON.stringify(data) }),
  },
  knowledge: {
    getArticles: (category?: string, search?: string) => {
      const params = new URLSearchParams();
      if (category && category !== 'all') params.append('category', category);
      if (search) params.append('search', search);
      return apiRequest(`/knowledge/articles?${params.toString()}`);
    },
    getArticle: (id: number) => apiRequest(`/knowledge/articles/${id}`),
  },
  community: {
    getPosts: (page = 1) => apiRequest(`/community/posts?page=${page}`),
    createPost: (data: any) => apiRequest('/community/posts', { method: 'POST', body: JSON.stringify(data) }),
    getPostComments: (postId: number) => apiRequest(`/community/posts/${postId}/comments`),
    addComment: (postId: number, content: string) => apiRequest(`/community/posts/${postId}/comments`, { method: 'POST', body: JSON.stringify({ content }) }),
    votePost: (postId: number, voteType: 'up' | 'down') => apiRequest(`/community/posts/${postId}/vote`, { method: 'POST', body: JSON.stringify({ vote_type: voteType }) }),
  },
  reports: {
    submitScamReport: (data: any) => apiRequest('/reports/scam', { method: 'POST', body: JSON.stringify(data) }),
    submitAppeal: (data: any) => apiRequest('/reports/appeal', { method: 'POST', body: JSON.stringify(data) }),
    getMyReports: () => apiRequest('/reports/my-reports'),
  },
  users: {
    getMe: () => apiRequest('/users/me'),
    updateProfile: (data: any) => apiRequest('/users/me', { method: 'PATCH', body: JSON.stringify(data) }),
    getFamilyMembers: () => apiRequest('/users/family'),
    addFamilyMember: (email: string) => apiRequest('/users/family', { method: 'POST', body: JSON.stringify({ email }) }),
    removeFamilyMember: (linkId: number) => apiRequest(`/users/family/${linkId}`, { method: 'DELETE' }),
  }
};

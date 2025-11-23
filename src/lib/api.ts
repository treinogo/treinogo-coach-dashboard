// API configuration and client  
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Get token from localStorage
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

// API client with automatic token inclusion
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies in requests
      ...options,
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  async get(endpoint: string): Promise<any> {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint: string, data: any): Promise<any> {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint: string, data: any): Promise<any> {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint: string): Promise<any> {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiClient(API_BASE_URL);

// Auth helpers
export const setAuthToken = (token: string, user: any) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

export const removeAuthToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getStoredUser = () => {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Auth service
export const authService = {
  async getCurrentUser() {
    try {
      const response = await api.get('/users/me');
      // Backend returns { user: {...} }, we need just the user object
      return response.user || response;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  },

  async logout(): Promise<void> {
    try {
      console.log('🚪 Calling logout API...');
      await api.post('/auth/logout', {});
      console.log('✅ Logout API successful');
    } catch (error) {
      console.error('❌ Logout error:', error);
    } finally {
      const landingUrl = import.meta.env.VITE_LANDING_PAGE_URL || 'http://localhost:3002';
      console.log('🔀 Redirecting to landing page:', landingUrl);
      window.location.href = landingUrl;
    }
  },

  async validateToken(): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      return !!user && user.role === 'COACH';
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  }
};
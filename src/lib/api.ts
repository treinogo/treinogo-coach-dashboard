// API configuration and client  
const API_BASE_URL = 'http://localhost:3001/api';

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
    const token = getAuthToken();
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
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
  isAuthenticated(): boolean {
    return !!getAuthToken();
  },

  getCurrentUser() {
    return getStoredUser();
  },

  logout(): void {
    removeAuthToken();
    window.location.href = 'http://localhost:5173'; // URL do landing page
  },

  async validateToken(): Promise<boolean> {
    try {
      const token = getAuthToken();
      if (!token) return false;

      // Try to make an authenticated request to validate the token
      // Using a simpler endpoint that we know exists
      await api.get('/users/me');
      
      const user = getStoredUser();
      return !!user && user.role === 'COACH';
    } catch (error) {
      console.error('Token validation failed:', error);
      // If validation fails, clean up stored data but don't remove in dev
      // removeAuthToken();
      return false;
    }
  }
};
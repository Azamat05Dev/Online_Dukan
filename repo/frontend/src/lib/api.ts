// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';

export const API_ENDPOINTS = {
    // Auth
    auth: {
        register: '/api/auth/register',
        login: '/api/auth/login',
        logout: '/api/auth/logout',
    },

    // Users
    users: {
        me: '/api/users/me',
        addresses: '/api/users/addresses',
    },

    // Products
    products: {
        list: '/api/products',
        byId: (id: number) => `/api/products/${id}`,
        bySlug: (slug: string) => `/api/products/slug/${slug}`,
    },

    // Categories
    categories: {
        list: '/api/categories',
        tree: '/api/categories/tree',
        bySlug: (slug: string) => `/api/categories/slug/${slug}`,
    },

    // Cart
    cart: {
        get: '/api/cart',
        items: '/api/cart/items',
        itemById: (id: number) => `/api/cart/items/${id}`,
        clear: '/api/cart/clear',
        summary: '/api/cart/summary',
    },

    // Orders
    orders: {
        list: '/api/orders',
        create: '/api/orders',
        byId: (id: string) => `/api/orders/${id}`,
    },

    // Search
    search: {
        query: '/api/search',
        suggestions: '/api/search/suggestions',
    },
};

// Fetch wrapper with error handling
export async function api<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = typeof window !== 'undefined'
        ? localStorage.getItem('token')
        : null;

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }

    return data;
}

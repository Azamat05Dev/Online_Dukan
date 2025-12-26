'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, API_ENDPOINTS } from '@/lib/api';
import { User } from '@/lib/types';

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
}

interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Load user from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            fetchUser(storedToken);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUser = async (authToken: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost'}/api/users/me`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
            });
            const data = await response.json();
            if (data.success) {
                setUser(data.data);
            } else {
                // Token invalid
                localStorage.removeItem('token');
                setToken(null);
            }
        } catch (error) {
            console.error('Failed to fetch user:', error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        const response = await api<{ success: boolean; data: { user: User; token: string } }>(
            API_ENDPOINTS.auth.login,
            {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            }
        );

        if (response.success) {
            setUser(response.data.user);
            setToken(response.data.token);
            localStorage.setItem('token', response.data.token);
        }
    };

    const register = async (data: RegisterData) => {
        const response = await api<{ success: boolean; data: { user: User } }>(
            API_ENDPOINTS.auth.register,
            {
                method: 'POST',
                body: JSON.stringify(data),
            }
        );

        if (response.success) {
            // Auto login after registration
            await login(data.email, data.password);
        }
    };

    const logout = async () => {
        try {
            if (token) {
                await api(API_ENDPOINTS.auth.logout, {
                    method: 'POST',
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            setToken(null);
            localStorage.removeItem('token');
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                login,
                register,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

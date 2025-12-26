'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { api, API_ENDPOINTS } from '@/lib/api';
import { Cart, CartItem, CartSummary } from '@/lib/types';
import { useAuth } from './AuthContext';

interface CartContextType {
    items: CartItem[];
    summary: CartSummary | null;
    loading: boolean;
    addItem: (productId: number, quantity?: number) => Promise<void>;
    updateQuantity: (itemId: number, quantity: number) => Promise<void>;
    removeItem: (itemId: number) => Promise<void>;
    clearCart: () => Promise<void>;
    itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const { user, token } = useAuth();
    const [items, setItems] = useState<CartItem[]>([]);
    const [summary, setSummary] = useState<CartSummary | null>(null);
    const [loading, setLoading] = useState(false);

    // Fetch cart when user logs in
    const fetchCart = useCallback(async () => {
        if (!user || !token) {
            setItems([]);
            setSummary(null);
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost'}/api/cart`,
                {
                    headers: {
                        'X-User-Id': user.id,
                    },
                }
            );
            const data = await response.json();

            if (data.success) {
                setItems(data.data.items || []);
                setSummary(data.data.summary || null);
            }
        } catch (error) {
            console.error('Failed to fetch cart:', error);
        } finally {
            setLoading(false);
        }
    }, [user, token]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const addItem = async (productId: number, quantity = 1) => {
        if (!user) {
            throw new Error('Please login to add items');
        }

        setLoading(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost'}/api/cart/items`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-User-Id': user.id,
                    },
                    body: JSON.stringify({ productId, quantity }),
                }
            );
            const data = await response.json();

            if (data.success) {
                await fetchCart();
            } else {
                throw new Error(data.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (itemId: number, quantity: number) => {
        if (!user) return;

        setLoading(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost'}/api/cart/items/${itemId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-User-Id': user.id,
                    },
                    body: JSON.stringify({ quantity }),
                }
            );
            const data = await response.json();

            if (data.success) {
                await fetchCart();
            }
        } finally {
            setLoading(false);
        }
    };

    const removeItem = async (itemId: number) => {
        if (!user) return;

        setLoading(true);
        try {
            await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost'}/api/cart/items/${itemId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'X-User-Id': user.id,
                    },
                }
            );
            await fetchCart();
        } finally {
            setLoading(false);
        }
    };

    const clearCart = async () => {
        if (!user) return;

        setLoading(true);
        try {
            await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost'}/api/cart/clear`,
                {
                    method: 'DELETE',
                    headers: {
                        'X-User-Id': user.id,
                    },
                }
            );
            setItems([]);
            setSummary(null);
        } finally {
            setLoading(false);
        }
    };

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                summary,
                loading,
                addItem,
                updateQuantity,
                removeItem,
                clearCart,
                itemCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}

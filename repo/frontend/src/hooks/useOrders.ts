'use client';

import { useState } from 'react';
import { Order, ShippingAddress } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';

interface CreateOrderData {
    shippingAddress: ShippingAddress;
    paymentMethod: 'CASH' | 'CARD' | 'ONLINE';
}

export function useOrders() {
    const { user, token } = useAuth();
    const { clearCart } = useCart();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchOrders = async () => {
        if (!user || !token) return;

        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/orders`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();

            if (data.success) {
                setOrders(data.data || []);
            }
        } catch (err) {
            setError('Failed to fetch orders');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const createOrder = async (orderData: CreateOrderData): Promise<Order | null> => {
        if (!user || !token) {
            throw new Error('Please login to create order');
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_URL}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    userId: user.id,
                    ...orderData,
                }),
            });

            const data = await response.json();

            if (data.success) {
                await clearCart();
                return data.data;
            } else {
                throw new Error(data.message || 'Failed to create order');
            }
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getOrder = async (orderId: string): Promise<Order | null> => {
        if (!token) return null;

        try {
            const response = await fetch(`${API_URL}/api/orders/${orderId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();

            if (data.success) {
                return data.data;
            }
            return null;
        } catch (err) {
            console.error(err);
            return null;
        }
    };

    return {
        orders,
        loading,
        error,
        fetchOrders,
        createOrder,
        getOrder,
    };
}

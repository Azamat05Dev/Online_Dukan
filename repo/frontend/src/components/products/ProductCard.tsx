'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ProductListItem } from '@/lib/types';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

interface ProductCardProps {
    product: ProductListItem;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addItem, loading: cartLoading } = useCart();
    const { isAuthenticated } = useAuth();
    const [adding, setAdding] = useState(false);

    const discount = product.comparePrice
        ? Math.round((1 - product.price / product.comparePrice) * 100)
        : 0;

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('uz-UZ').format(price);
    };

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            window.location.href = '/auth/login';
            return;
        }

        setAdding(true);
        try {
            await addItem(product.id, 1);
        } catch (error) {
            console.error('Failed to add to cart:', error);
        } finally {
            setAdding(false);
        }
    };

    return (
        <Link href={`/product/${product.slug}`} className="card group">
            {/* Image */}
            <div className="relative aspect-square bg-gray-100 dark:bg-slate-800 overflow-hidden">
                {product.images?.[0] ? (
                    <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}

                {/* Discount badge */}
                {discount > 0 && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        -{discount}%
                    </span>
                )}

                {/* Featured badge */}
                {product.isFeatured && (
                    <span className="absolute top-3 right-3 bg-violet-600 text-white text-xs font-bold px-2 py-1 rounded">
                        TOP
                    </span>
                )}

                {/* Quick actions */}
                <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={handleAddToCart}
                        disabled={adding || cartLoading}
                        className="flex-1 bg-violet-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-violet-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {adding ? (
                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                        ) : (
                            'Savatga'
                        )}
                    </button>
                    <button
                        onClick={(e) => { e.preventDefault(); /* Add to favorites */ }}
                        className="w-10 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition flex items-center justify-center"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Name */}
                <h3 className="font-medium text-gray-900 dark:text-gray-100 line-clamp-2 mb-2 group-hover:text-violet-600 transition">
                    {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {product.rating.toFixed(1)}
                        </span>
                    </div>
                    <span className="text-sm text-gray-400">
                        ({product.reviewCount} sharh)
                    </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-violet-600">
                        {formatPrice(product.price)} so'm
                    </span>
                    {product.comparePrice && product.comparePrice > product.price && (
                        <span className="text-sm text-gray-400 line-through">
                            {formatPrice(product.comparePrice)}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}

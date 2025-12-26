'use client';

import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

export default function CartPage() {
    const { user, isAuthenticated } = useAuth();
    const { items, summary, loading, updateQuantity, removeItem } = useCart();

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('uz-UZ').format(price);
    };

    const subtotal = items.reduce((sum, item) => sum + item.productPrice * item.quantity, 0);
    const shippingCost = subtotal >= 500000 ? 0 : 25000;
    const total = subtotal + shippingCost;

    // Not logged in
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
                <div className="container-main">
                    <div className="text-center py-16">
                        <div className="w-24 h-24 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold mb-2">Savatni ko'rish uchun kiring</h2>
                        <p className="text-gray-500 mb-6">Mahsulotlarni savatga qo'shish uchun avval hisobingizga kiring</p>
                        <Link href="/auth/login" className="btn btn-primary">
                            Kirish
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
            <div className="container-main">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold">Savatcha</h1>
                    <span className="text-gray-500">{items.length} ta mahsulot</span>
                </div>

                {loading ? (
                    <div className="flex justify-center py-16">
                        <svg className="animate-spin w-8 h-8 text-violet-600" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                    </div>
                ) : items.length > 0 ? (
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {items.map((item) => (
                                <div key={item.id} className="bg-white dark:bg-slate-800 rounded-xl p-4 flex gap-4">
                                    {/* Image */}
                                    <div className="w-24 h-24 bg-gray-100 dark:bg-slate-700 rounded-lg overflow-hidden shrink-0">
                                        {item.productImage ? (
                                            <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">📦</div>
                                        )}
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1">
                                        <Link href={`/product/${item.productId}`} className="font-medium hover:text-violet-600 transition line-clamp-2">
                                            {item.productName}
                                        </Link>
                                        <p className="text-violet-600 font-bold mt-1">{formatPrice(item.productPrice)} so'm</p>

                                        {/* Quantity & Remove */}
                                        <div className="flex items-center justify-between mt-3">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                    disabled={loading}
                                                    className="w-8 h-8 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center hover:bg-gray-200 transition disabled:opacity-50"
                                                >
                                                    −
                                                </button>
                                                <span className="w-10 text-center font-medium">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    disabled={loading}
                                                    className="w-8 h-8 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center hover:bg-gray-200 transition disabled:opacity-50"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                disabled={loading}
                                                className="text-red-500 hover:text-red-600 transition text-sm disabled:opacity-50"
                                            >
                                                O'chirish
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Summary */}
                        <div>
                            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 sticky top-24">
                                <h2 className="font-bold text-lg mb-4">Buyurtma xulosasi</h2>

                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Mahsulotlar</span>
                                        <span>{formatPrice(subtotal)} so'm</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Yetkazib berish</span>
                                        <span className={shippingCost === 0 ? 'text-green-600' : ''}>
                                            {shippingCost === 0 ? 'Bepul' : `${formatPrice(shippingCost)} so'm`}
                                        </span>
                                    </div>
                                    {subtotal < 500000 && subtotal > 0 && (
                                        <div className="bg-violet-50 dark:bg-violet-900/30 p-3 rounded-lg text-violet-700 dark:text-violet-300">
                                            💡 Bepul yetkazib berish uchun yana {formatPrice(500000 - subtotal)} so'm qo'shing
                                        </div>
                                    )}
                                    <hr className="border-gray-200 dark:border-slate-700" />
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Jami</span>
                                        <span className="text-violet-600">{formatPrice(total)} so'm</span>
                                    </div>
                                </div>

                                <Link href="/checkout" className="btn btn-primary w-full mt-6">
                                    Rasmiylashtirish
                                </Link>

                                <Link href="/products" className="btn btn-secondary w-full mt-3">
                                    Xaridni davom ettirish
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Empty Cart */
                    <div className="text-center py-16">
                        <div className="w-24 h-24 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold mb-2">Savatchang bo'sh</h2>
                        <p className="text-gray-500 mb-6">Mahsulotlar qo'shib xarid qilishni boshlang</p>
                        <Link href="/products" className="btn btn-primary">
                            Xarid qilish
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

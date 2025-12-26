'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

export default function Header() {
    const router = useRouter();
    const { user, isAuthenticated, logout } = useAuth();
    const { itemCount } = useCart();
    const [searchQuery, setSearchQuery] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/products?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    const handleLogout = async () => {
        await logout();
        setShowUserMenu(false);
        router.push('/');
    };

    return (
        <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
            {/* Top bar */}
            <div className="bg-violet-600 text-white text-sm py-2">
                <div className="container-main flex justify-between items-center">
                    <span>🚚 500,000 so'mdan yuqori buyurtmalarga bepul yetkazib berish!</span>
                    <div className="hidden md:flex gap-4">
                        <Link href="/seller" className="hover:underline">Sotuvchi bo'lish</Link>
                        <Link href="/help" className="hover:underline">Yordam</Link>
                    </div>
                </div>
            </div>

            {/* Main header */}
            <div className="container-main py-4">
                <div className="flex items-center gap-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 shrink-0">
                        <div className="w-10 h-10 bg-violet-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">E</span>
                        </div>
                        <span className="text-xl font-bold text-violet-600 hidden sm:block">E-Commerce</span>
                    </Link>

                    {/* Categories button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="hidden md:flex items-center gap-2 px-4 py-2 bg-violet-100 dark:bg-violet-900 text-violet-600 dark:text-violet-300 rounded-lg hover:bg-violet-200 transition"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        <span>Katalog</span>
                    </button>

                    {/* Search */}
                    <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Mahsulotlarni qidirish..."
                                className="w-full py-3 px-4 pr-12 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            />
                            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </div>
                    </form>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        {/* Favorites */}
                        <Link href="/favorites" className="p-3 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition hidden sm:block">
                            <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </Link>

                        {/* Cart */}
                        <Link href="/cart" className="relative p-3 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition">
                            <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-violet-600 text-white text-xs rounded-full flex items-center justify-center">
                                    {itemCount > 99 ? '99+' : itemCount}
                                </span>
                            )}
                        </Link>

                        {/* Profile/Login */}
                        {isAuthenticated ? (
                            <div className="relative hidden sm:block">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="p-3 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition flex items-center gap-2"
                                >
                                    <div className="w-8 h-8 bg-violet-100 dark:bg-violet-900 rounded-full flex items-center justify-center">
                                        <span className="text-violet-600 font-medium text-sm">
                                            {user?.firstName?.charAt(0) || 'U'}
                                        </span>
                                    </div>
                                </button>

                                {/* User Dropdown */}
                                {showUserMenu && (
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 py-2 animate-fade-in">
                                        <div className="px-4 py-2 border-b border-gray-100 dark:border-slate-700">
                                            <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                                            <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                                        </div>
                                        <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700" onClick={() => setShowUserMenu(false)}>
                                            👤 Profil
                                        </Link>
                                        <Link href="/profile?tab=orders" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700" onClick={() => setShowUserMenu(false)}>
                                            📦 Buyurtmalar
                                        </Link>
                                        <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-slate-700">
                                            🚪 Chiqish
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link href="/auth/login" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition">
                                Kirish
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Categories dropdown */}
            {isMenuOpen && (
                <div className="absolute w-full bg-white dark:bg-slate-900 border-t shadow-lg animate-fade-in">
                    <div className="container-main py-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {['Elektronika', 'Kiyimlar', 'Uy jihozlari', 'Oziq-ovqat', 'Go\'zallik', 'Sport'].map((cat) => (
                                <Link
                                    key={cat}
                                    href={`/category/${cat.toLowerCase()}`}
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-violet-50 dark:hover:bg-slate-800 transition"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <div className="w-10 h-10 bg-violet-100 dark:bg-violet-900 rounded-lg flex items-center justify-center">
                                        📦
                                    </div>
                                    <span className="font-medium">{cat}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}

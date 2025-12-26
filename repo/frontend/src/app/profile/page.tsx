'use client';

import { useState } from 'react';
import Link from 'next/link';

// Mock user data
const userData = {
    firstName: 'Asilbek',
    lastName: 'Rahimov',
    email: 'asilbek@example.com',
    phone: '+998 90 123 45 67',
    avatar: null,
};

const orders = [
    { id: 'ORD-ABC123', date: '2024-12-25', status: 'DELIVERED', total: 17500000, items: 1 },
    { id: 'ORD-DEF456', date: '2024-12-20', status: 'SHIPPED', total: 8400000, items: 2 },
    { id: 'ORD-GHI789', date: '2024-12-15', status: 'CANCELLED', total: 3200000, items: 1 },
];

const addresses = [
    { id: 1, title: 'Uy', address: 'Toshkent, Chilonzor, 19-kvartal, 5-uy, 32-xonadon', isDefault: true },
    { id: 2, title: 'Ish', address: 'Toshkent, Mirzo Ulug\'bek, IT Park', isDefault: false },
];

const tabs = [
    { id: 'profile', label: 'Profil', icon: '👤' },
    { id: 'orders', label: 'Buyurtmalar', icon: '📦' },
    { id: 'addresses', label: 'Manzillar', icon: '📍' },
    { id: 'favorites', label: 'Sevimlilar', icon: '❤️' },
    { id: 'settings', label: 'Sozlamalar', icon: '⚙️' },
];

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState('profile');
    const [formData, setFormData] = useState(userData);

    const formatPrice = (price: number) => new Intl.NumberFormat('uz-UZ').format(price);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'DELIVERED': return 'text-green-600 bg-green-100';
            case 'SHIPPED': return 'text-blue-600 bg-blue-100';
            case 'CANCELLED': return 'text-red-600 bg-red-100';
            default: return 'text-yellow-600 bg-yellow-100';
        }
    };

    const getStatusText = (status: string) => {
        const map: Record<string, string> = {
            PENDING: 'Kutilmoqda',
            CONFIRMED: 'Tasdiqlangan',
            SHIPPED: 'Yo\'lda',
            DELIVERED: 'Yetkazildi',
            CANCELLED: 'Bekor qilindi',
        };
        return map[status] || status;
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
            <div className="container-main">
                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <aside>
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-6">
                            {/* User Info */}
                            <div className="text-center mb-6">
                                <div className="w-20 h-20 bg-violet-100 dark:bg-violet-900 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <span className="text-3xl">👤</span>
                                </div>
                                <h2 className="font-bold">{userData.firstName} {userData.lastName}</h2>
                                <p className="text-sm text-gray-500">{userData.email}</p>
                            </div>

                            {/* Tabs */}
                            <nav className="space-y-1">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition text-left ${activeTab === tab.id
                                                ? 'bg-violet-100 dark:bg-violet-900 text-violet-600'
                                                : 'hover:bg-gray-100 dark:hover:bg-slate-700'
                                            }`}
                                    >
                                        <span>{tab.icon}</span>
                                        <span>{tab.label}</span>
                                    </button>
                                ))}
                            </nav>

                            {/* Logout */}
                            <button className="w-full mt-4 flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition">
                                <span>🚪</span>
                                <span>Chiqish</span>
                            </button>
                        </div>
                    </aside>

                    {/* Content */}
                    <div className="lg:col-span-3">
                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <div className="bg-white dark:bg-slate-800 rounded-xl p-6">
                                <h2 className="text-xl font-bold mb-6">Shaxsiy ma'lumotlar</h2>
                                <div className="grid gap-4 max-w-xl">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Ism</label>
                                            <input
                                                type="text"
                                                value={formData.firstName}
                                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                className="input"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Familiya</label>
                                            <input
                                                type="text"
                                                value={formData.lastName}
                                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                className="input"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Email</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="input"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Telefon</label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="input"
                                        />
                                    </div>
                                    <button className="btn btn-primary w-fit">
                                        Saqlash
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Orders Tab */}
                        {activeTab === 'orders' && (
                            <div className="bg-white dark:bg-slate-800 rounded-xl p-6">
                                <h2 className="text-xl font-bold mb-6">Buyurtmalar tarixi</h2>
                                {orders.length > 0 ? (
                                    <div className="space-y-4">
                                        {orders.map((order) => (
                                            <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                                                <div>
                                                    <Link href={`/orders/${order.id}`} className="font-medium hover:text-violet-600">
                                                        {order.id}
                                                    </Link>
                                                    <p className="text-sm text-gray-500">{order.date} • {order.items} ta mahsulot</p>
                                                </div>
                                                <div className="text-right">
                                                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(order.status)}`}>
                                                        {getStatusText(order.status)}
                                                    </span>
                                                    <p className="font-bold mt-1">{formatPrice(order.total)} so'm</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-gray-500">
                                        <p className="text-4xl mb-2">📦</p>
                                        <p>Hali buyurtmalar yo'q</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Addresses Tab */}
                        {activeTab === 'addresses' && (
                            <div className="bg-white dark:bg-slate-800 rounded-xl p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold">Manzillar</h2>
                                    <button className="btn btn-primary">
                                        + Yangi manzil
                                    </button>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {addresses.map((addr) => (
                                        <div key={addr.id} className="p-4 border border-gray-200 dark:border-slate-700 rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-medium">{addr.title}</span>
                                                {addr.isDefault && (
                                                    <span className="text-xs bg-violet-100 text-violet-600 px-2 py-1 rounded">Asosiy</span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-500 mb-3">{addr.address}</p>
                                            <div className="flex gap-2">
                                                <button className="text-sm text-violet-600 hover:underline">Tahrirlash</button>
                                                <button className="text-sm text-red-600 hover:underline">O'chirish</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Favorites Tab */}
                        {activeTab === 'favorites' && (
                            <div className="bg-white dark:bg-slate-800 rounded-xl p-6">
                                <h2 className="text-xl font-bold mb-6">Sevimli mahsulotlar</h2>
                                <div className="text-center py-12 text-gray-500">
                                    <p className="text-4xl mb-2">❤️</p>
                                    <p>Sevimli mahsulotlar yo'q</p>
                                    <Link href="/products" className="btn btn-primary mt-4">
                                        Mahsulotlarni ko'rish
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Settings Tab */}
                        {activeTab === 'settings' && (
                            <div className="bg-white dark:bg-slate-800 rounded-xl p-6">
                                <h2 className="text-xl font-bold mb-6">Sozlamalar</h2>
                                <div className="space-y-6 max-w-xl">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Email xabarnomalar</p>
                                            <p className="text-sm text-gray-500">Aksiyalar va yangiliklar haqida</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                                        </label>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">SMS xabarnomalar</p>
                                            <p className="text-sm text-gray-500">Buyurtma holati haqida</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                                        </label>
                                    </div>
                                    <hr className="border-gray-200 dark:border-slate-700" />
                                    <div>
                                        <button className="text-red-600 hover:underline">Hisobni o'chirish</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

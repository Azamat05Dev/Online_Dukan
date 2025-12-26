'use client';

import { useState } from 'react';
import Link from 'next/link';

const cartItems = [
    { id: 1, name: 'iPhone 15 Pro Max 256GB', price: 17500000, quantity: 1, image: '' },
    { id: 2, name: 'Sony WH-1000XM5', price: 4200000, quantity: 2, image: '' },
];

export default function CheckoutPage() {
    const [step, setStep] = useState(1);
    const [shippingData, setShippingData] = useState({
        fullName: '',
        phone: '',
        city: '',
        district: '',
        address: '',
        postalCode: '',
    });
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [loading, setLoading] = useState(false);

    const formatPrice = (price: number) => new Intl.NumberFormat('uz-UZ').format(price);

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingCost = subtotal >= 500000 ? 0 : 25000;
    const total = subtotal + shippingCost;

    const handleSubmit = async () => {
        setLoading(true);
        // Simulate order creation
        setTimeout(() => {
            setLoading(false);
            window.location.href = '/orders/success';
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
            <div className="container-main">
                {/* Breadcrumb */}
                <nav className="text-sm mb-6">
                    <ol className="flex items-center gap-2 text-gray-500">
                        <li><Link href="/" className="hover:text-violet-600">Bosh sahifa</Link></li>
                        <li>/</li>
                        <li><Link href="/cart" className="hover:text-violet-600">Savatcha</Link></li>
                        <li>/</li>
                        <li className="text-gray-900 dark:text-white">Checkout</li>
                    </ol>
                </nav>

                {/* Progress Steps */}
                <div className="flex items-center justify-center mb-8">
                    {[
                        { num: 1, label: 'Manzil' },
                        { num: 2, label: 'To\'lov' },
                        { num: 3, label: 'Tasdiqlash' },
                    ].map((s, idx) => (
                        <div key={s.num} className="flex items-center">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= s.num
                                        ? 'bg-violet-600 text-white'
                                        : 'bg-gray-200 dark:bg-slate-700 text-gray-500'
                                    }`}
                            >
                                {step > s.num ? '✓' : s.num}
                            </div>
                            <span className={`ml-2 hidden sm:block ${step >= s.num ? 'font-medium' : 'text-gray-500'}`}>
                                {s.label}
                            </span>
                            {idx < 2 && (
                                <div className={`w-16 h-1 mx-4 ${step > s.num ? 'bg-violet-600' : 'bg-gray-200 dark:bg-slate-700'}`} />
                            )}
                        </div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Form */}
                    <div className="lg:col-span-2">
                        {/* Step 1: Shipping */}
                        {step === 1 && (
                            <div className="bg-white dark:bg-slate-800 rounded-xl p-6">
                                <h2 className="text-xl font-bold mb-6">Yetkazib berish manzili</h2>
                                <div className="grid gap-4">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">To'liq ism</label>
                                            <input
                                                type="text"
                                                value={shippingData.fullName}
                                                onChange={(e) => setShippingData({ ...shippingData, fullName: e.target.value })}
                                                className="input"
                                                placeholder="Ism Familiya"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Telefon</label>
                                            <input
                                                type="tel"
                                                value={shippingData.phone}
                                                onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                                                className="input"
                                                placeholder="+998 90 123 45 67"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Shahar/viloyat</label>
                                            <select
                                                value={shippingData.city}
                                                onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                                                className="input"
                                                required
                                            >
                                                <option value="">Tanlang</option>
                                                <option value="tashkent">Toshkent</option>
                                                <option value="samarkand">Samarqand</option>
                                                <option value="bukhara">Buxoro</option>
                                                <option value="fergana">Farg'ona</option>
                                                <option value="andijan">Andijon</option>
                                                <option value="namangan">Namangan</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Tuman</label>
                                            <input
                                                type="text"
                                                value={shippingData.district}
                                                onChange={(e) => setShippingData({ ...shippingData, district: e.target.value })}
                                                className="input"
                                                placeholder="Tuman"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Manzil</label>
                                        <textarea
                                            value={shippingData.address}
                                            onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                                            className="input min-h-[100px]"
                                            placeholder="Ko'cha, uy, xonadon..."
                                            required
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={() => setStep(2)}
                                    className="btn btn-primary w-full mt-6"
                                >
                                    Davom etish
                                </button>
                            </div>
                        )}

                        {/* Step 2: Payment */}
                        {step === 2 && (
                            <div className="bg-white dark:bg-slate-800 rounded-xl p-6">
                                <h2 className="text-xl font-bold mb-6">To'lov usuli</h2>
                                <div className="space-y-4">
                                    {[
                                        { id: 'cash', label: 'Naqd pul', desc: 'Yetkazib berishda to\'lash', icon: '💵' },
                                        { id: 'card', label: 'Karta orqali', desc: 'Payme, Click, Uzcard', icon: '💳' },
                                        { id: 'installment', label: 'Muddatli to\'lov', desc: '3-12 oy muddatga', icon: '📅' },
                                    ].map((method) => (
                                        <label
                                            key={method.id}
                                            className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition ${paymentMethod === method.id
                                                    ? 'border-violet-600 bg-violet-50 dark:bg-violet-900/30'
                                                    : 'border-gray-200 dark:border-slate-700 hover:border-violet-300'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="payment"
                                                value={method.id}
                                                checked={paymentMethod === method.id}
                                                onChange={() => setPaymentMethod(method.id)}
                                                className="sr-only"
                                            />
                                            <span className="text-3xl">{method.icon}</span>
                                            <div>
                                                <div className="font-medium">{method.label}</div>
                                                <div className="text-sm text-gray-500">{method.desc}</div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                                <div className="flex gap-4 mt-6">
                                    <button onClick={() => setStep(1)} className="btn btn-secondary flex-1">
                                        Orqaga
                                    </button>
                                    <button onClick={() => setStep(3)} className="btn btn-primary flex-1">
                                        Davom etish
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Confirm */}
                        {step === 3 && (
                            <div className="bg-white dark:bg-slate-800 rounded-xl p-6">
                                <h2 className="text-xl font-bold mb-6">Buyurtmani tasdiqlash</h2>

                                {/* Shipping Info */}
                                <div className="mb-6 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-medium">Yetkazib berish manzili</h3>
                                        <button onClick={() => setStep(1)} className="text-violet-600 text-sm">O'zgartirish</button>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {shippingData.fullName}<br />
                                        {shippingData.phone}<br />
                                        {shippingData.city}, {shippingData.district}<br />
                                        {shippingData.address}
                                    </p>
                                </div>

                                {/* Payment */}
                                <div className="mb-6 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-medium">To'lov usuli</h3>
                                        <button onClick={() => setStep(2)} className="text-violet-600 text-sm">O'zgartirish</button>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {paymentMethod === 'cash' ? '💵 Naqd pul' : paymentMethod === 'card' ? '💳 Karta orqali' : '📅 Muddatli to\'lov'}
                                    </p>
                                </div>

                                {/* Items */}
                                <div className="space-y-3 mb-6">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                                            <div className="w-16 h-16 bg-gray-200 dark:bg-slate-600 rounded-lg flex items-center justify-center">📦</div>
                                            <div className="flex-1">
                                                <p className="font-medium line-clamp-1">{item.name}</p>
                                                <p className="text-sm text-gray-500">{item.quantity} x {formatPrice(item.price)}</p>
                                            </div>
                                            <p className="font-bold">{formatPrice(item.price * item.quantity)}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-4">
                                    <button onClick={() => setStep(2)} className="btn btn-secondary flex-1">
                                        Orqaga
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={loading}
                                        className="btn btn-primary flex-1"
                                    >
                                        {loading ? (
                                            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                        ) : 'Buyurtma berish'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div>
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 sticky top-24">
                            <h2 className="font-bold text-lg mb-4">Buyurtma</h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Mahsulotlar ({cartItems.length})</span>
                                    <span>{formatPrice(subtotal)} so'm</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Yetkazib berish</span>
                                    <span className={shippingCost === 0 ? 'text-green-600' : ''}>
                                        {shippingCost === 0 ? 'Bepul' : `${formatPrice(shippingCost)} so'm`}
                                    </span>
                                </div>
                                <hr className="border-gray-200 dark:border-slate-700" />
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Jami</span>
                                    <span className="text-violet-600">{formatPrice(total)} so'm</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

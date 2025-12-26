'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import ProductCard from '@/components/products/ProductCard';
import { mockProducts, mockCategories } from '@/lib/mockData';

const sortOptions = [
    { label: 'Mashhur', value: 'popular' },
    { label: 'Arzon', value: 'price-asc' },
    { label: 'Qimmat', value: 'price-desc' },
    { label: 'Yangi', value: 'newest' },
    { label: 'Reyting', value: 'rating' },
];

export default function ProductsPage() {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('popular');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000000]);
    const [showFilters, setShowFilters] = useState(false);

    const formatPrice = (price: number) => new Intl.NumberFormat('uz-UZ').format(price);

    // Filter and sort products using mock data
    const filteredProducts = useMemo(() => {
        let products = [...mockProducts];

        // Category filter
        if (selectedCategory !== 'all') {
            products = products.filter(p => p.categorySlug === selectedCategory);
        }

        // Price filter
        products = products.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

        // Sort
        switch (sortBy) {
            case 'price-asc':
                products.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                products.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                products.sort((a, b) => b.rating - a.rating);
                break;
            default:
                products.sort((a, b) => b.soldCount - a.soldCount);
        }

        return products;
    }, [selectedCategory, sortBy, priceRange]);

    // Transform to ProductListItem format
    const productListItems = filteredProducts.map(p => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        comparePrice: p.comparePrice,
        images: p.images,
        rating: p.rating,
        reviewCount: p.reviewCount,
        isFeatured: p.isFeatured,
    }));

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
            <div className="container-main py-8">
                {/* Breadcrumb */}
                <nav className="text-sm mb-6">
                    <ol className="flex items-center gap-2 text-gray-500">
                        <li><Link href="/" className="hover:text-violet-600">Bosh sahifa</Link></li>
                        <li>/</li>
                        <li className="text-gray-900 dark:text-white">Mahsulotlar</li>
                    </ol>
                </nav>

                <div className="flex gap-8">
                    {/* Sidebar Filters */}
                    <aside className={`w-64 shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 sticky top-24">
                            <h2 className="font-bold text-lg mb-4">Filtrlar</h2>

                            {/* Categories */}
                            <div className="mb-6">
                                <h3 className="font-medium mb-3">Kategoriya</h3>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => setSelectedCategory('all')}
                                        className={`w-full text-left px-3 py-2 rounded-lg transition ${selectedCategory === 'all'
                                                ? 'bg-violet-100 dark:bg-violet-900 text-violet-600'
                                                : 'hover:bg-gray-100 dark:hover:bg-slate-700'
                                            }`}
                                    >
                                        Barcha ({mockProducts.length})
                                    </button>
                                    {mockCategories.map((cat) => (
                                        <button
                                            key={cat.slug}
                                            onClick={() => setSelectedCategory(cat.slug)}
                                            className={`w-full text-left px-3 py-2 rounded-lg transition flex items-center gap-2 ${selectedCategory === cat.slug
                                                    ? 'bg-violet-100 dark:bg-violet-900 text-violet-600'
                                                    : 'hover:bg-gray-100 dark:hover:bg-slate-700'
                                                }`}
                                        >
                                            <span>{cat.icon}</span>
                                            <span>{cat.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div className="mb-6">
                                <h3 className="font-medium mb-3">Narx oralig'i</h3>
                                <div className="space-y-3">
                                    <input
                                        type="range"
                                        min="0"
                                        max="50000000"
                                        step="500000"
                                        value={priceRange[1]}
                                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                        className="w-full accent-violet-600"
                                    />
                                    <div className="flex justify-between text-sm text-gray-500">
                                        <span>{formatPrice(priceRange[0])}</span>
                                        <span>{formatPrice(priceRange[1])}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Reset Filters */}
                            <button
                                onClick={() => {
                                    setSelectedCategory('all');
                                    setPriceRange([0, 50000000]);
                                }}
                                className="w-full btn btn-secondary"
                            >
                                Filtrlarni tozalash
                            </button>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Header */}
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                            <div>
                                <h1 className="text-2xl font-bold">Mahsulotlar</h1>
                                <p className="text-gray-500">{filteredProducts.length} ta mahsulot topildi</p>
                            </div>

                            <div className="flex items-center gap-4">
                                {/* Mobile filter toggle */}
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="lg:hidden btn btn-secondary"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                    </svg>
                                    Filtrlar
                                </button>

                                {/* Sort */}
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="input w-auto"
                                >
                                    {sortOptions.map((opt) => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Products Grid */}
                        {filteredProducts.length > 0 ? (
                            <div className="product-grid">
                                {productListItems.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <div className="w-24 h-24 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <span className="text-4xl">🔍</span>
                                </div>
                                <h2 className="text-xl font-bold mb-2">Mahsulot topilmadi</h2>
                                <p className="text-gray-500">Boshqa filtrlarni sinab ko'ring</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

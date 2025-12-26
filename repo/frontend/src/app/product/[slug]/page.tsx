'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import ProductCard from '@/components/products/ProductCard';
import { getProductBySlug, getFeaturedProducts, mockProducts } from '@/lib/mockData';

export default function ProductDetailPage() {
    const params = useParams();
    const slug = params.slug as string;

    const product = getProductBySlug(slug) || mockProducts.find(p => p.id.toString() === slug);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">😕</div>
                    <h1 className="text-2xl font-bold mb-2">Mahsulot topilmadi</h1>
                    <Link href="/products" className="btn btn-primary mt-4">
                        Mahsulotlarga qaytish
                    </Link>
                </div>
            </div>
        );
    }

    const formatPrice = (price: number) => new Intl.NumberFormat('uz-UZ').format(price);

    const discount = product.comparePrice
        ? Math.round((1 - product.price / product.comparePrice) * 100)
        : 0;

    const relatedProducts = getFeaturedProducts()
        .filter(p => p.id !== product.id)
        .slice(0, 4)
        .map(p => ({
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
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
            <div className="container-main">
                {/* Breadcrumb */}
                <nav className="text-sm mb-6">
                    <ol className="flex items-center gap-2 text-gray-500">
                        <li><Link href="/" className="hover:text-violet-600">Bosh sahifa</Link></li>
                        <li>/</li>
                        <li><Link href="/products" className="hover:text-violet-600">Mahsulotlar</Link></li>
                        <li>/</li>
                        <li className="text-gray-900 dark:text-white line-clamp-1">{product.name}</li>
                    </ol>
                </nav>

                <div className="grid lg:grid-cols-2 gap-8 mb-12">
                    {/* Images */}
                    <div className="space-y-4">
                        <div className="aspect-square bg-white dark:bg-slate-800 rounded-xl overflow-hidden flex items-center justify-center">
                            {product.images[selectedImage] ? (
                                <img
                                    src={product.images[selectedImage]}
                                    alt={product.name}
                                    className="w-full h-full object-contain p-4"
                                />
                            ) : (
                                <div className="text-8xl">📦</div>
                            )}
                        </div>
                        {product.images.length > 1 && (
                            <div className="flex gap-2">
                                {product.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`w-20 h-20 bg-white dark:bg-slate-800 rounded-lg overflow-hidden border-2 ${selectedImage === idx ? 'border-violet-600' : 'border-transparent'
                                            }`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div>
                        {/* Brand */}
                        <p className="text-violet-600 font-medium mb-2">{product.brand}</p>

                        {/* Name */}
                        <h1 className="text-2xl lg:text-3xl font-bold mb-4">{product.name}</h1>

                        {/* Rating */}
                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex items-center gap-1">
                                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className="font-medium">{product.rating}</span>
                            </div>
                            <span className="text-gray-400">|</span>
                            <span className="text-gray-500">{product.reviewCount} ta sharh</span>
                            <span className="text-gray-400">|</span>
                            <span className="text-gray-500">{product.soldCount}+ sotilgan</span>
                        </div>

                        {/* Price */}
                        <div className="bg-violet-50 dark:bg-violet-900/30 rounded-xl p-6 mb-6">
                            <div className="flex items-center gap-4">
                                <span className="text-3xl font-bold text-violet-600">
                                    {formatPrice(product.price)} so'm
                                </span>
                                {product.comparePrice && (
                                    <>
                                        <span className="text-xl text-gray-400 line-through">
                                            {formatPrice(product.comparePrice)}
                                        </span>
                                        <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                                            -{discount}%
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Short Description */}
                        <p className="text-gray-600 dark:text-gray-400 mb-6">{product.shortDescription}</p>

                        {/* Stock */}
                        <div className="flex items-center gap-2 mb-6">
                            {product.stock > 0 ? (
                                <>
                                    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                                    <span className="text-green-600">Mavjud ({product.stock} dona)</span>
                                </>
                            ) : (
                                <>
                                    <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                                    <span className="text-red-600">Tugagan</span>
                                </>
                            )}
                        </div>

                        {/* Quantity */}
                        <div className="flex items-center gap-4 mb-6">
                            <span className="font-medium">Soni:</span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-10 h-10 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center hover:bg-gray-200 transition"
                                >
                                    −
                                </button>
                                <span className="w-12 text-center font-medium">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                    className="w-10 h-10 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center hover:bg-gray-200 transition"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4">
                            <button className="btn btn-primary flex-1 py-4 text-lg">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Savatga qo'shish
                            </button>
                            <button
                                onClick={() => setIsFavorite(!isFavorite)}
                                className={`w-14 h-14 rounded-xl flex items-center justify-center border-2 transition ${isFavorite
                                        ? 'bg-red-50 border-red-500 text-red-500'
                                        : 'border-gray-200 dark:border-slate-700 hover:border-red-500 hover:text-red-500'
                                    }`}
                            >
                                <svg className="w-6 h-6" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 mb-12">
                    <h2 className="text-xl font-bold mb-4">Mahsulot haqida</h2>
                    <div className="prose dark:prose-invert max-w-none whitespace-pre-line">
                        {product.description}
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div>
                        <h2 className="text-xl font-bold mb-6">O'xshash mahsulotlar</h2>
                        <div className="product-grid">
                            {relatedProducts.map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

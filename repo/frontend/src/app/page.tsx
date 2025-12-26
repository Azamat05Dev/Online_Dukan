import Link from 'next/link';
import ProductCard from '@/components/products/ProductCard';
import { mockProducts, mockCategories, getFeaturedProducts } from '@/lib/mockData';

export default function Home() {
  const featuredProducts = getFeaturedProducts().slice(0, 8).map(p => ({
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white py-16 md:py-24">
        <div className="container-main">
          <div className="max-w-2xl">
            <span className="inline-block bg-white/20 px-4 py-2 rounded-full text-sm font-medium mb-6">
              🎉 Yangiliklar! Barcha mahsulotlarga 20% chegirma
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              O'zbekistonning eng katta online do'koni
            </h1>
            <p className="text-lg md:text-xl text-violet-100 mb-8">
              Minglab mahsulotlar, ishonchli sotuvchilar va tez yetkazib berish.
              Hoziroq xarid qiling!
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products" className="btn bg-white text-violet-600 hover:bg-gray-100 px-8 py-4 text-lg">
                Xarid qilish
              </Link>
              <Link href="/auth/register" className="btn border-2 border-white text-white hover:bg-white/10 px-8 py-4 text-lg">
                Ro'yxatdan o'tish
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-gray-50 dark:bg-slate-900">
        <div className="container-main">
          <h2 className="text-2xl font-bold mb-8">Kategoriyalar</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {mockCategories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="bg-white dark:bg-slate-800 rounded-xl p-4 text-center hover:shadow-lg transition group"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <h3 className="font-medium text-sm">{category.name}</h3>
                <p className="text-xs text-gray-500">{category.productCount}+ mahsulot</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12">
        <div className="container-main">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Top mahsulotlar</h2>
            <Link href="/products" className="text-violet-600 hover:underline font-medium">
              Barchasini ko'rish →
            </Link>
          </div>
          <div className="product-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 bg-violet-50 dark:bg-slate-800">
        <div className="container-main">
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: '🚚', title: 'Bepul yetkazib berish', desc: '500 000 so\'mdan yuqori' },
              { icon: '💳', title: 'Xavfsiz to\'lov', desc: 'Payme, Click, Uzum' },
              { icon: '🔄', title: '14 kun qaytarish', desc: 'Savolsiz qaytarish' },
              { icon: '📞', title: '24/7 yordam', desc: 'Har doim siz bilan' },
            ].map((benefit) => (
              <div key={benefit.title} className="text-center">
                <div className="text-4xl mb-3">{benefit.icon}</div>
                <h3 className="font-bold mb-1">{benefit.title}</h3>
                <p className="text-gray-500 text-sm">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="py-12">
        <div className="container-main">
          <h2 className="text-2xl font-bold mb-8 text-center">Ishonchli brendlar</h2>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {['Apple', 'Samsung', 'Xiaomi', 'Sony', 'LG', 'ASUS', 'Lenovo', 'Dyson'].map((brand) => (
              <div key={brand} className="text-2xl font-bold text-gray-400">
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-gradient-to-r from-violet-600 to-purple-600 text-white">
        <div className="container-main">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-violet-200">Mahsulotlar</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-violet-200">Xaridorlar</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100+</div>
              <div className="text-violet-200">Sotuvchilar</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99%</div>
              <div className="text-violet-200">Ijobiy fikrlar</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Mock data store for frontend development
// This data simulates backend API responses

export interface MockProduct {
    id: number;
    name: string;
    slug: string;
    description: string;
    shortDescription: string;
    price: number;
    comparePrice?: number;
    stock: number;
    categoryId: number;
    categorySlug: string;
    brand: string;
    images: string[];
    rating: number;
    reviewCount: number;
    soldCount: number;
    isFeatured: boolean;
}

export interface MockCategory {
    id: number;
    name: string;
    slug: string;
    icon: string;
    productCount: number;
}

// Categories
export const mockCategories: MockCategory[] = [
    { id: 1, name: 'Telefonlar', slug: 'telefonlar', icon: '📱', productCount: 45 },
    { id: 2, name: 'Noutbuklar', slug: 'noutbuklar', icon: '💻', productCount: 32 },
    { id: 3, name: 'Televizorlar', slug: 'televizorlar', icon: '📺', productCount: 28 },
    { id: 4, name: 'Audio', slug: 'audio', icon: '🎧', productCount: 56 },
    { id: 5, name: 'Planshetlar', slug: 'planshetlar', icon: '📱', productCount: 18 },
    { id: 6, name: 'Gaming', slug: 'gaming', icon: '🎮', productCount: 42 },
    { id: 7, name: 'Maishiy texnika', slug: 'maishiy-texnika', icon: '🏠', productCount: 65 },
    { id: 8, name: 'Kiyimlar', slug: 'kiyimlar', icon: '👕', productCount: 120 },
];

// Products
export const mockProducts: MockProduct[] = [
    // Telefonlar
    {
        id: 1,
        name: 'iPhone 15 Pro Max 256GB Natural Titanium',
        slug: 'iphone-15-pro-max-256gb',
        shortDescription: 'A17 Pro chip, titanium design, 48MP camera',
        description: `iPhone 15 Pro Max - Apple'ning eng kuchli smartfoni.

**Xususiyatlari:**
• A17 Pro chip - eng tez mobil protsessor
• 48MP asosiy kamera + 12MP ultra wide + 12MP telephoto
• 6.7" Super Retina XDR OLED display
• Titanium korpus - engil va mustahkam
• USB-C port
• 29 soatgacha video ko'rish
• Action button

**Kafolat:** 1 yil`,
        price: 17500000,
        comparePrice: 19000000,
        stock: 25,
        categoryId: 1,
        categorySlug: 'telefonlar',
        brand: 'Apple',
        images: ['https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-naturaltitanium?wid=800'],
        rating: 4.9,
        reviewCount: 234,
        soldCount: 1250,
        isFeatured: true,
    },
    {
        id: 2,
        name: 'Samsung Galaxy S24 Ultra 512GB Titanium Black',
        slug: 'samsung-galaxy-s24-ultra',
        shortDescription: 'Galaxy AI, S Pen, 200MP camera',
        description: `Samsung Galaxy S24 Ultra - AI kuchiga ega flagship.

**Xususiyatlari:**
• Snapdragon 8 Gen 3 protsessor
• 200MP asosiy kamera
• 6.8" Dynamic AMOLED 2X display
• Galaxy AI - aqlli yordamchi
• S Pen qo'llab-quvvatlash
• 5000mAh batareya
• IP68 suv va changdan himoya

**Kafolat:** 2 yil`,
        price: 16800000,
        comparePrice: 18500000,
        stock: 30,
        categoryId: 1,
        categorySlug: 'telefonlar',
        brand: 'Samsung',
        images: ['https://images.samsung.com/is/image/samsung/p6pim/uz/2401/gallery/uz-galaxy-s24-s928-sm-s928bztqskz-thumb-539295631'],
        rating: 4.8,
        reviewCount: 189,
        soldCount: 890,
        isFeatured: true,
    },
    {
        id: 3,
        name: 'Xiaomi 14 Pro 512GB Black',
        slug: 'xiaomi-14-pro',
        shortDescription: 'Leica camera, Snapdragon 8 Gen 3',
        description: `Xiaomi 14 Pro - professional kamerali smartfon.

**Xususiyatlari:**
• Leica professional kamera tizimi
• Snapdragon 8 Gen 3
• 6.73" LTPO AMOLED display
• 120W tez quvvatlash
• 4880mAh batareya

**Kafolat:** 1 yil`,
        price: 12500000,
        comparePrice: 14000000,
        stock: 40,
        categoryId: 1,
        categorySlug: 'telefonlar',
        brand: 'Xiaomi',
        images: [],
        rating: 4.7,
        reviewCount: 156,
        soldCount: 654,
        isFeatured: true,
    },
    // Noutbuklar
    {
        id: 4,
        name: "MacBook Pro 14\" M3 Pro 18GB 512GB Space Gray",
        slug: 'macbook-pro-14-m3-pro',
        shortDescription: 'M3 Pro chip, 18GB RAM, professional ish uchun',
        description: `MacBook Pro 14" M3 Pro - professionallar uchun.

**Xususiyatlari:**
• Apple M3 Pro chip (12-core CPU, 18-core GPU)
• 18GB unified memory
• 512GB SSD
• 14.2" Liquid Retina XDR display
• 17 soatgacha batareya

**Kafolat:** 1 yil`,
        price: 32000000,
        stock: 15,
        categoryId: 2,
        categorySlug: 'noutbuklar',
        brand: 'Apple',
        images: ['https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spacegray-select-202310?wid=800'],
        rating: 4.9,
        reviewCount: 98,
        soldCount: 420,
        isFeatured: true,
    },
    {
        id: 5,
        name: 'ASUS ROG Strix G16 RTX 4070 i9-13980HX',
        slug: 'asus-rog-strix-g16',
        shortDescription: "Gaming noutbuk, RTX 4070, 165Hz",
        description: `ASUS ROG Strix G16 - o'yinlar uchun maxsus.

**Xususiyatlari:**
• Intel Core i9-13980HX
• NVIDIA RTX 4070 8GB
• 16GB DDR5 RAM
• 1TB SSD
• 16" QHD 165Hz display

**Kafolat:** 2 yil`,
        price: 28500000,
        comparePrice: 32000000,
        stock: 10,
        categoryId: 2,
        categorySlug: 'noutbuklar',
        brand: 'ASUS',
        images: [],
        rating: 4.8,
        reviewCount: 67,
        soldCount: 198,
        isFeatured: true,
    },
    // Audio
    {
        id: 6,
        name: 'Sony WH-1000XM5 Wireless Headphones Black',
        slug: 'sony-wh1000xm5-black',
        shortDescription: 'Industry-leading noise cancellation',
        description: `Sony WH-1000XM5 - eng yaxshi shovqinni bekor qilish.

**Xususiyatlari:**
• Industry-leading noise cancellation
• 30 soatgacha batareya
• Hi-Res Audio
• Speak-to-Chat

**Kafolat:** 1 yil`,
        price: 4200000,
        comparePrice: 4800000,
        stock: 50,
        categoryId: 4,
        categorySlug: 'audio',
        brand: 'Sony',
        images: ['https://m.media-amazon.com/images/I/51aXvjzcukL._AC_SL1500_.jpg'],
        rating: 4.7,
        reviewCount: 312,
        soldCount: 1560,
        isFeatured: true,
    },
    {
        id: 7,
        name: 'Apple AirPods Pro 2nd Generation USB-C',
        slug: 'airpods-pro-2-usbc',
        shortDescription: 'Active Noise Cancellation, Spatial Audio',
        description: `AirPods Pro 2 - eng yaxshi true wireless.

**Xususiyatlari:**
• Active Noise Cancellation
• Adaptive Transparency
• Spatial Audio with head tracking
• USB-C charging case

**Kafolat:** 1 yil`,
        price: 3200000,
        comparePrice: 3500000,
        stock: 60,
        categoryId: 4,
        categorySlug: 'audio',
        brand: 'Apple',
        images: [],
        rating: 4.8,
        reviewCount: 445,
        soldCount: 2340,
        isFeatured: true,
    },
    // Gaming
    {
        id: 8,
        name: 'Sony PlayStation 5 Slim 1TB',
        slug: 'playstation-5-slim',
        shortDescription: 'Next-gen gaming, 4K 120fps',
        description: `PlayStation 5 Slim - yangi avlod o'yinlari.

**Xususiyatlari:**
• Custom AMD CPU/GPU
• 1TB SSD
• 4K 120fps support
• Ray Tracing
• DualSense controller

**Kafolat:** 1 yil`,
        price: 8500000,
        comparePrice: 9500000,
        stock: 20,
        categoryId: 6,
        categorySlug: 'gaming',
        brand: 'Sony',
        images: [],
        rating: 4.9,
        reviewCount: 567,
        soldCount: 890,
        isFeatured: true,
    },
    {
        id: 9,
        name: 'Nintendo Switch OLED Model White',
        slug: 'nintendo-switch-oled',
        shortDescription: '7" OLED screen, portable gaming',
        description: `Nintendo Switch OLED - eng yaxshi portable.

**Xususiyatlari:**
• 7" OLED display
• 64GB internal storage
• Joy-Con controllers

**Kafolat:** 1 yil`,
        price: 5200000,
        stock: 25,
        categoryId: 6,
        categorySlug: 'gaming',
        brand: 'Nintendo',
        images: [],
        rating: 4.8,
        reviewCount: 234,
        soldCount: 567,
        isFeatured: false,
    },
    // Planshetlar
    {
        id: 10,
        name: 'iPad Pro 12.9" M2 256GB Wi-Fi Space Gray',
        slug: 'ipad-pro-129-m2',
        shortDescription: 'M2 chip, Liquid Retina XDR display',
        description: `iPad Pro 12.9" - eng kuchli planshet.

**Xususiyatlari:**
• Apple M2 chip
• 12.9" Liquid Retina XDR display
• Face ID

**Kafolat:** 1 yil`,
        price: 15500000,
        comparePrice: 17000000,
        stock: 18,
        categoryId: 5,
        categorySlug: 'planshetlar',
        brand: 'Apple',
        images: [],
        rating: 4.9,
        reviewCount: 89,
        soldCount: 345,
        isFeatured: true,
    },
    {
        id: 11,
        name: 'Samsung Galaxy Tab S9 Ultra 512GB',
        slug: 'galaxy-tab-s9-ultra',
        shortDescription: '14.6" AMOLED, S Pen included',
        description: `Galaxy Tab S9 Ultra - katta ekranli planshet.

**Xususiyatlari:**
• 14.6" Dynamic AMOLED 2X display
• Snapdragon 8 Gen 2
• S Pen included

**Kafolat:** 1 yil`,
        price: 14800000,
        stock: 15,
        categoryId: 5,
        categorySlug: 'planshetlar',
        brand: 'Samsung',
        images: [],
        rating: 4.6,
        reviewCount: 123,
        soldCount: 234,
        isFeatured: false,
    },
    // Televizorlar
    {
        id: 12,
        name: 'Samsung 65" Neo QLED 4K QN90C',
        slug: 'samsung-65-neo-qled-qn90c',
        shortDescription: 'Neo Quantum Processor, 120Hz',
        description: `Samsung Neo QLED - premium TV.

**Xususiyatlari:**
• 65" 4K display
• 120Hz refresh rate
• Gaming Hub

**Kafolat:** 2 yil`,
        price: 22000000,
        comparePrice: 25000000,
        stock: 8,
        categoryId: 3,
        categorySlug: 'televizorlar',
        brand: 'Samsung',
        images: [],
        rating: 4.8,
        reviewCount: 78,
        soldCount: 156,
        isFeatured: true,
    },
    {
        id: 13,
        name: 'LG 55" OLED evo C3 4K Smart TV',
        slug: 'lg-55-oled-c3',
        shortDescription: 'Perfect blacks, α9 AI Processor',
        description: `LG OLED C3 - mukammal qora ranglar.

**Xususiyatlari:**
• 55" 4K OLED display
• α9 AI Processor Gen6

**Kafolat:** 2 yil`,
        price: 18500000,
        comparePrice: 20000000,
        stock: 10,
        categoryId: 3,
        categorySlug: 'televizorlar',
        brand: 'LG',
        images: [],
        rating: 4.7,
        reviewCount: 156,
        soldCount: 234,
        isFeatured: false,
    },
    // Maishiy texnika
    {
        id: 14,
        name: 'Dyson V15 Detect Absolute',
        slug: 'dyson-v15-detect',
        shortDescription: 'Laser dust detection, LCD screen',
        description: `Dyson V15 Detect - eng aqlli changyutgich.

**Xususiyatlari:**
• Laser dust detection
• 60 daqiqa ishlash vaqti
• HEPA filtration

**Kafolat:** 2 yil`,
        price: 9500000,
        comparePrice: 11000000,
        stock: 12,
        categoryId: 7,
        categorySlug: 'maishiy-texnika',
        brand: 'Dyson',
        images: [],
        rating: 4.9,
        reviewCount: 89,
        soldCount: 234,
        isFeatured: true,
    },
    // More products
    {
        id: 15,
        name: 'Apple Watch Series 9 45mm GPS Midnight',
        slug: 'apple-watch-series-9-45mm',
        shortDescription: 'S9 SiP, Double tap gesture',
        description: `Apple Watch Series 9 - eng aqlli soat.

**Xususiyatlari:**
• S9 SiP dual-core processor
• Double tap gesture
• 18 soatgacha batareya

**Kafolat:** 1 yil`,
        price: 6500000,
        stock: 30,
        categoryId: 1,
        categorySlug: 'telefonlar',
        brand: 'Apple',
        images: [],
        rating: 4.8,
        reviewCount: 178,
        soldCount: 567,
        isFeatured: false,
    },
    {
        id: 16,
        name: 'Lenovo ThinkPad X1 Carbon Gen 11 i7',
        slug: 'lenovo-thinkpad-x1-carbon',
        shortDescription: 'Biznes noutbuk, engil va kuchli',
        description: `ThinkPad X1 Carbon - biznes uchun ideal.

**Xususiyatlari:**
• Intel Core i7-1365U
• 16GB LPDDR5 RAM
• 14" 2.8K OLED display
• 1.12kg og'irlik

**Kafolat:** 3 yil`,
        price: 24000000,
        stock: 12,
        categoryId: 2,
        categorySlug: 'noutbuklar',
        brand: 'Lenovo',
        images: [],
        rating: 4.7,
        reviewCount: 67,
        soldCount: 189,
        isFeatured: false,
    },
];

// Mock Users
export const mockUsers = [
    {
        id: 'user-1',
        email: 'admin@ecommerce.uz',
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'User',
        phone: '+998901234567',
        role: 'ADMIN',
    },
    {
        id: 'user-2',
        email: 'user@example.com',
        password: 'user123',
        firstName: 'Asilbek',
        lastName: 'Rahimov',
        phone: '+998909876543',
        role: 'USER',
    },
    {
        id: 'user-3',
        email: 'test@test.com',
        password: 'test123',
        firstName: 'Test',
        lastName: 'User',
        phone: '+998900001111',
        role: 'USER',
    },
];

// Helper functions
export function getProductById(id: number): MockProduct | undefined {
    return mockProducts.find(p => p.id === id);
}

export function getProductBySlug(slug: string): MockProduct | undefined {
    return mockProducts.find(p => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): MockProduct[] {
    return mockProducts.filter(p => p.categorySlug === categorySlug);
}

export function getFeaturedProducts(): MockProduct[] {
    return mockProducts.filter(p => p.isFeatured);
}

export function searchProducts(query: string): MockProduct[] {
    const q = query.toLowerCase();
    return mockProducts.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
}

export function authenticateUser(email: string, password: string) {
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (user) {
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    return null;
}

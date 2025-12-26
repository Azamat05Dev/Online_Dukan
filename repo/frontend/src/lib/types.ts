// Product Types
export interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    shortDescription: string;
    sku: string;
    price: number;
    comparePrice?: number;
    stock: number;
    images: string[];
    category?: Category;
    brand?: string;
    rating: number;
    reviewCount: number;
    soldCount: number;
    isFeatured: boolean;
    isActive: boolean;
}

export interface ProductListItem {
    id: number;
    name: string;
    slug: string;
    price: number;
    comparePrice?: number;
    images: string[];
    rating: number;
    reviewCount: number;
    isFeatured: boolean;
}

// Category Types
export interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    parentId?: number;
    subcategories?: Category[];
}

// User Types
export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    avatar?: string;
    role: 'USER' | 'SELLER' | 'ADMIN';
    addresses?: Address[];
}

export interface Address {
    id: string;
    type: 'HOME' | 'WORK' | 'OTHER';
    title: string;
    fullAddress: string;
    city: string;
    district?: string;
    postalCode?: string;
    isDefault: boolean;
}

// Cart Types
export interface CartItem {
    id: number;
    productId: number;
    productName: string;
    productImage?: string;
    productPrice: number;
    quantity: number;
}

export interface Cart {
    id: number;
    userId: string;
    items: CartItem[];
    summary: CartSummary;
}

export interface CartSummary {
    itemCount: number;
    subtotal: number;
    shippingCost: number;
    total: number;
    freeShippingThreshold: number;
    amountToFreeShipping: number;
}

// Order Types
export interface Order {
    id: string;
    orderNumber: string;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    paymentMethod: PaymentMethod;
    subtotal: number;
    shippingCost: number;
    discount: number;
    totalAmount: number;
    shippingAddress: ShippingAddress;
    items: OrderItem[];
    createdAt: string;
}

export interface OrderItem {
    id: string;
    productId: number;
    productName: string;
    productImage?: string;
    productSku: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

export interface ShippingAddress {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    district?: string;
    postalCode?: string;
}

export type OrderStatus =
    | 'PENDING'
    | 'CONFIRMED'
    | 'PROCESSING'
    | 'SHIPPED'
    | 'DELIVERED'
    | 'CANCELLED'
    | 'REFUNDED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
export type PaymentMethod = 'CASH' | 'CARD' | 'ONLINE';

// API Response Types
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// Search Types
export interface SearchFilters {
    query?: string;
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: 'price' | 'rating' | 'sales' | 'newest';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}

export interface SearchResult extends PaginatedResponse<ProductListItem> {
    facets?: {
        categories: { name: string; count: number }[];
        brands: { name: string; count: number }[];
        priceRanges: { range: string; count: number }[];
    };
}

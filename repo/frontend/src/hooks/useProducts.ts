'use client';

import { useState, useEffect, useCallback } from 'react';
import { Product, ProductListItem, Category, SearchFilters, SearchResult, PaginatedResponse } from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';

// Fetch products with filters
export function useProducts(filters: SearchFilters = {}) {
    const [products, setProducts] = useState<ProductListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams();
            if (filters.query) params.append('q', filters.query);
            if (filters.category) params.append('category', filters.category);
            if (filters.minPrice) params.append('min_price', String(filters.minPrice));
            if (filters.maxPrice) params.append('max_price', String(filters.maxPrice));
            if (filters.sortBy) params.append('sort', filters.sortBy);
            if (filters.sortOrder) params.append('order', filters.sortOrder);
            if (filters.page) params.append('page', String(filters.page));
            if (filters.limit) params.append('limit', String(filters.limit));

            const response = await fetch(`${API_URL}/api/products?${params}`);
            const data = await response.json();

            if (data.success) {
                setProducts(data.data.items || data.data);
                setTotal(data.data.total || data.data.length);
                setTotalPages(data.data.totalPages || 1);
            } else {
                setError(data.message || 'Failed to fetch products');
            }
        } catch (err) {
            setError('Failed to fetch products');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [filters.query, filters.category, filters.minPrice, filters.maxPrice, filters.sortBy, filters.sortOrder, filters.page, filters.limit]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return { products, loading, error, total, totalPages, refetch: fetchProducts };
}

// Fetch single product by ID or slug
export function useProduct(idOrSlug: string | number) {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            setError(null);

            try {
                const isSlug = typeof idOrSlug === 'string' && isNaN(Number(idOrSlug));
                const endpoint = isSlug
                    ? `${API_URL}/api/products/slug/${idOrSlug}`
                    : `${API_URL}/api/products/${idOrSlug}`;

                const response = await fetch(endpoint);
                const data = await response.json();

                if (data.success || data.id) {
                    setProduct(data.data || data);
                } else {
                    setError('Product not found');
                }
            } catch (err) {
                setError('Failed to fetch product');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (idOrSlug) {
            fetchProduct();
        }
    }, [idOrSlug]);

    return { product, loading, error };
}

// Fetch categories
export function useCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${API_URL}/api/categories`);
                const data = await response.json();

                if (data.success) {
                    setCategories(data.data || []);
                }
            } catch (err) {
                setError('Failed to fetch categories');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return { categories, loading, error };
}

// Search products
export function useSearch(query: string, filters: Omit<SearchFilters, 'query'> = {}) {
    const [results, setResults] = useState<SearchResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const search = useCallback(async () => {
        if (!query || query.length < 2) {
            setResults(null);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams({ q: query });
            if (filters.category) params.append('category', filters.category);
            if (filters.minPrice) params.append('min_price', String(filters.minPrice));
            if (filters.maxPrice) params.append('max_price', String(filters.maxPrice));
            if (filters.page) params.append('page', String(filters.page));

            const response = await fetch(`${API_URL}/api/search?${params}`);
            const data = await response.json();

            if (data.success) {
                setResults(data.data);
            }
        } catch (err) {
            setError('Search failed');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [query, filters.category, filters.minPrice, filters.maxPrice, filters.page]);

    useEffect(() => {
        const debounce = setTimeout(search, 300);
        return () => clearTimeout(debounce);
    }, [search]);

    return { results, loading, error };
}

// Get search suggestions
export function useSearchSuggestions(query: string) {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!query || query.length < 2) {
            setSuggestions([]);
            return;
        }

        const fetchSuggestions = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_URL}/api/search/suggestions?q=${encodeURIComponent(query)}`);
                const data = await response.json();

                if (data.success) {
                    setSuggestions(data.data || []);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        const debounce = setTimeout(fetchSuggestions, 200);
        return () => clearTimeout(debounce);
    }, [query]);

    return { suggestions, loading };
}

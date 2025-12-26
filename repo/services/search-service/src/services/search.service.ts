import { SearchProduct, ISearchProduct } from '../models/SearchProduct';

interface SearchFilters {
    query?: string;
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    isFeatured?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}

interface SearchResult {
    items: ISearchProduct[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    facets?: {
        categories: { name: string; count: number }[];
        brands: { name: string; count: number }[];
        priceRanges: { range: string; count: number }[];
    };
}

export class SearchService {
    async search(filters: SearchFilters): Promise<SearchResult> {
        const {
            query,
            category,
            brand,
            minPrice,
            maxPrice,
            minRating,
            isFeatured,
            sortBy = 'relevance',
            sortOrder = 'desc',
            page = 1,
            limit = 10,
        } = filters;

        const skip = (page - 1) * limit;

        // Build query
        const searchQuery: any = { isActive: true };

        if (query) {
            searchQuery.$text = { $search: query };
        }

        if (category) {
            searchQuery.categorySlug = category;
        }

        if (brand) {
            searchQuery.brand = { $regex: brand, $options: 'i' };
        }

        if (minPrice !== undefined || maxPrice !== undefined) {
            searchQuery.price = {};
            if (minPrice !== undefined) searchQuery.price.$gte = minPrice;
            if (maxPrice !== undefined) searchQuery.price.$lte = maxPrice;
        }

        if (minRating !== undefined) {
            searchQuery.rating = { $gte: minRating };
        }

        if (isFeatured !== undefined) {
            searchQuery.isFeatured = isFeatured;
        }

        // Build sort
        let sort: any = {};
        switch (sortBy) {
            case 'price':
                sort = { price: sortOrder === 'asc' ? 1 : -1 };
                break;
            case 'rating':
                sort = { rating: -1, reviewCount: -1 };
                break;
            case 'sales':
                sort = { soldCount: -1 };
                break;
            case 'newest':
                sort = { createdAt: -1 };
                break;
            case 'relevance':
            default:
                if (query) {
                    sort = { score: { $meta: 'textScore' }, soldCount: -1 };
                } else {
                    sort = { soldCount: -1, rating: -1 };
                }
        }

        // Execute query
        let queryBuilder = SearchProduct.find(searchQuery);

        if (query) {
            queryBuilder = queryBuilder.select({ score: { $meta: 'textScore' } });
        }

        const [items, total] = await Promise.all([
            queryBuilder.sort(sort).skip(skip).limit(limit).lean(),
            SearchProduct.countDocuments(searchQuery),
        ]);

        // Get facets for filtering
        const facets = await this.getFacets(searchQuery);

        return {
            items: items as ISearchProduct[],
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            facets,
        };
    }

    async getSuggestions(query: string, limit: number = 5): Promise<string[]> {
        if (!query || query.length < 2) return [];

        const results = await SearchProduct.find(
            {
                isActive: true,
                name: { $regex: query, $options: 'i' },
            },
            { name: 1 }
        )
            .limit(limit)
            .lean();

        return results.map((r) => r.name);
    }

    async indexProduct(productData: Partial<ISearchProduct>): Promise<ISearchProduct> {
        const existing = await SearchProduct.findOne({ productId: productData.productId });

        if (existing) {
            Object.assign(existing, productData);
            return existing.save();
        }

        const product = new SearchProduct(productData);
        return product.save();
    }

    async removeProduct(productId: number): Promise<boolean> {
        const result = await SearchProduct.deleteOne({ productId });
        return result.deletedCount > 0;
    }

    async bulkIndex(products: Partial<ISearchProduct>[]): Promise<number> {
        const operations = products.map((product) => ({
            updateOne: {
                filter: { productId: product.productId },
                update: { $set: product },
                upsert: true,
            },
        }));

        const result = await SearchProduct.bulkWrite(operations);
        return result.modifiedCount + result.upsertedCount;
    }

    private async getFacets(baseQuery: any): Promise<{
        categories: { name: string; count: number }[];
        brands: { name: string; count: number }[];
        priceRanges: { range: string; count: number }[];
    }> {
        const [categories, brands, priceRanges] = await Promise.all([
            SearchProduct.aggregate([
                { $match: { ...baseQuery, category: { $ne: '' } } },
                { $group: { _id: '$category', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 20 },
                { $project: { name: '$_id', count: 1, _id: 0 } },
            ]),
            SearchProduct.aggregate([
                { $match: { ...baseQuery, brand: { $ne: '' } } },
                { $group: { _id: '$brand', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 20 },
                { $project: { name: '$_id', count: 1, _id: 0 } },
            ]),
            SearchProduct.aggregate([
                { $match: baseQuery },
                {
                    $bucket: {
                        groupBy: '$price',
                        boundaries: [0, 100000, 500000, 1000000, 5000000, Infinity],
                        default: 'Other',
                        output: { count: { $sum: 1 } },
                    },
                },
            ]).then((results) =>
                results.map((r) => ({
                    range: this.formatPriceRange(r._id),
                    count: r.count,
                }))
            ),
        ]);

        return { categories, brands, priceRanges };
    }

    private formatPriceRange(boundary: number | string): string {
        if (boundary === 'Other') return '5,000,000+';
        const ranges: Record<number, string> = {
            0: '0 - 100,000',
            100000: '100,000 - 500,000',
            500000: '500,000 - 1,000,000',
            1000000: '1,000,000 - 5,000,000',
            5000000: '5,000,000+',
        };
        return ranges[boundary as number] || String(boundary);
    }
}

export default new SearchService();

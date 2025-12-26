import mongoose, { Document, Schema } from 'mongoose';

export interface ISearchProduct extends Document {
    productId: number;
    name: string;
    slug: string;
    description: string;
    shortDescription: string;
    category: string;
    categorySlug: string;
    brand: string;
    price: number;
    comparePrice: number;
    images: string[];
    rating: number;
    reviewCount: number;
    soldCount: number;
    isActive: boolean;
    isFeatured: boolean;
    sellerId: string;
    attributes: Record<string, any>;
    searchText: string;
    createdAt: Date;
    updatedAt: Date;
}

const SearchProductSchema = new Schema<ISearchProduct>(
    {
        productId: {
            type: Number,
            required: true,
            unique: true,
            index: true,
        },
        name: {
            type: String,
            required: true,
            index: true,
        },
        slug: {
            type: String,
            required: true,
            index: true,
        },
        description: {
            type: String,
            default: '',
        },
        shortDescription: {
            type: String,
            default: '',
        },
        category: {
            type: String,
            default: '',
            index: true,
        },
        categorySlug: {
            type: String,
            default: '',
            index: true,
        },
        brand: {
            type: String,
            default: '',
            index: true,
        },
        price: {
            type: Number,
            required: true,
            index: true,
        },
        comparePrice: {
            type: Number,
            default: 0,
        },
        images: {
            type: [String],
            default: [],
        },
        rating: {
            type: Number,
            default: 0,
            index: true,
        },
        reviewCount: {
            type: Number,
            default: 0,
        },
        soldCount: {
            type: Number,
            default: 0,
            index: true,
        },
        isActive: {
            type: Boolean,
            default: true,
            index: true,
        },
        isFeatured: {
            type: Boolean,
            default: false,
            index: true,
        },
        sellerId: {
            type: String,
            required: true,
            index: true,
        },
        attributes: {
            type: Schema.Types.Mixed,
            default: {},
        },
        searchText: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

// Create text index for full-text search
SearchProductSchema.index(
    {
        name: 'text',
        description: 'text',
        shortDescription: 'text',
        category: 'text',
        brand: 'text',
        searchText: 'text',
    },
    {
        weights: {
            name: 10,
            brand: 5,
            category: 3,
            shortDescription: 2,
            description: 1,
            searchText: 1,
        },
        name: 'ProductTextIndex',
    }
);

// Compound indexes for filtering
SearchProductSchema.index({ isActive: 1, price: 1 });
SearchProductSchema.index({ isActive: 1, rating: -1 });
SearchProductSchema.index({ isActive: 1, soldCount: -1 });
SearchProductSchema.index({ isActive: 1, createdAt: -1 });
SearchProductSchema.index({ category: 1, isActive: 1 });
SearchProductSchema.index({ brand: 1, isActive: 1 });

// Pre-save hook to generate searchText
SearchProductSchema.pre('save', function (next) {
    this.searchText = [
        this.name,
        this.brand,
        this.category,
        Object.values(this.attributes || {}).join(' '),
    ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
    next();
});

export const SearchProduct = mongoose.model<ISearchProduct>(
    'SearchProduct',
    SearchProductSchema
);

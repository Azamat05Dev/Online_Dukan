import { Router, Request, Response } from 'express';
import searchService from '../services/search.service';

const router = Router();

/**
 * @route   GET /api/search
 * @desc    Search products
 */
router.get('/', async (req: Request, res: Response) => {
    try {
        const {
            q: query,
            category,
            brand,
            min_price: minPrice,
            max_price: maxPrice,
            min_rating: minRating,
            featured,
            sort,
            order,
            page,
            limit,
        } = req.query;

        const result = await searchService.search({
            query: query as string,
            category: category as string,
            brand: brand as string,
            minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
            maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
            minRating: minRating ? parseFloat(minRating as string) : undefined,
            isFeatured: featured === 'true' ? true : featured === 'false' ? false : undefined,
            sortBy: sort as string,
            sortOrder: (order as 'asc' | 'desc') || 'desc',
            page: page ? parseInt(page as string) : 1,
            limit: limit ? parseInt(limit as string) : 10,
        });

        res.json({
            success: true,
            data: result,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Search failed',
        });
    }
});

/**
 * @route   GET /api/search/suggestions
 * @desc    Get search suggestions
 */
router.get('/suggestions', async (req: Request, res: Response) => {
    try {
        const { q: query, limit } = req.query;

        if (!query) {
            return res.json({
                success: true,
                data: [],
            });
        }

        const suggestions = await searchService.getSuggestions(
            query as string,
            limit ? parseInt(limit as string) : 5
        );

        res.json({
            success: true,
            data: suggestions,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to get suggestions',
        });
    }
});

/**
 * @route   POST /api/search/index
 * @desc    Index a product (from Product Service)
 */
router.post('/index', async (req: Request, res: Response) => {
    try {
        const product = await searchService.indexProduct(req.body);

        res.status(201).json({
            success: true,
            message: 'Product indexed',
            data: product,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to index product',
        });
    }
});

/**
 * @route   POST /api/search/bulk-index
 * @desc    Bulk index products
 */
router.post('/bulk-index', async (req: Request, res: Response) => {
    try {
        const { products } = req.body;

        if (!Array.isArray(products)) {
            return res.status(400).json({
                success: false,
                message: 'Products array required',
            });
        }

        const count = await searchService.bulkIndex(products);

        res.json({
            success: true,
            message: `${count} products indexed`,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to bulk index',
        });
    }
});

/**
 * @route   DELETE /api/search/:productId
 * @desc    Remove product from index
 */
router.delete('/:productId', async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;
        const success = await searchService.removeProduct(parseInt(productId));

        if (!success) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        res.json({
            success: true,
            message: 'Product removed from index',
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to remove product',
        });
    }
});

export default router;

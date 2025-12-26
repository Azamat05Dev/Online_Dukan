const express = require('express');
const { body, param, validationResult } = require('express-validator');
const cartService = require('../services/cart.service');

const router = express.Router();

// Validation middleware
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
};

// Get user ID from header
const getUserId = (req) => req.headers['x-user-id'];

/**
 * @route   GET /api/cart
 * @desc    Get user's cart
 */
router.get('/', async (req, res) => {
    try {
        const userId = getUserId(req);
        if (!userId) {
            return res.status(401).json({ success: false, message: 'User ID required' });
        }

        const cart = await cartService.getCart(userId);
        const summary = await cartService.getCartSummary(userId);

        res.json({
            success: true,
            data: {
                ...cart.toJSON ? cart.toJSON() : cart,
                summary,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch cart',
        });
    }
});

/**
 * @route   GET /api/cart/summary
 * @desc    Get cart summary
 */
router.get('/summary', async (req, res) => {
    try {
        const userId = getUserId(req);
        if (!userId) {
            return res.status(401).json({ success: false, message: 'User ID required' });
        }

        const summary = await cartService.getCartSummary(userId);

        res.json({
            success: true,
            data: summary,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch cart summary',
        });
    }
});

/**
 * @route   POST /api/cart/items
 * @desc    Add item to cart
 */
router.post(
    '/items',
    [
        body('productId').isInt({ min: 1 }).withMessage('Valid product ID required'),
        body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    ],
    validate,
    async (req, res) => {
        try {
            const userId = getUserId(req);
            if (!userId) {
                return res.status(401).json({ success: false, message: 'User ID required' });
            }

            const { productId, quantity = 1 } = req.body;
            const cart = await cartService.addItem(userId, productId, quantity);

            res.status(201).json({
                success: true,
                message: 'Item added to cart',
                data: cart,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message || 'Failed to add item',
            });
        }
    }
);

/**
 * @route   PUT /api/cart/items/:id
 * @desc    Update item quantity
 */
router.put(
    '/items/:id',
    [
        param('id').isInt({ min: 1 }),
        body('quantity').isInt({ min: 0 }).withMessage('Quantity must be 0 or greater'),
    ],
    validate,
    async (req, res) => {
        try {
            const userId = getUserId(req);
            if (!userId) {
                return res.status(401).json({ success: false, message: 'User ID required' });
            }

            const { id } = req.params;
            const { quantity } = req.body;
            const cart = await cartService.updateItemQuantity(userId, parseInt(id), quantity);

            res.json({
                success: true,
                message: 'Cart updated',
                data: cart,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message || 'Failed to update item',
            });
        }
    }
);

/**
 * @route   DELETE /api/cart/items/:id
 * @desc    Remove item from cart
 */
router.delete('/items/:id', async (req, res) => {
    try {
        const userId = getUserId(req);
        if (!userId) {
            return res.status(401).json({ success: false, message: 'User ID required' });
        }

        const { id } = req.params;
        const cart = await cartService.removeItem(userId, parseInt(id));

        res.json({
            success: true,
            message: 'Item removed from cart',
            data: cart,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to remove item',
        });
    }
});

/**
 * @route   DELETE /api/cart/clear
 * @desc    Clear cart
 */
router.delete('/clear', async (req, res) => {
    try {
        const userId = getUserId(req);
        if (!userId) {
            return res.status(401).json({ success: false, message: 'User ID required' });
        }

        await cartService.clearCart(userId);

        res.json({
            success: true,
            message: 'Cart cleared successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to clear cart',
        });
    }
});

module.exports = router;

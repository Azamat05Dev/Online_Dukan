import { Router } from 'express';
import { body, query, param, validationResult } from 'express-validator';
import orderService from '../services/order.service';
import { OrderStatus, PaymentStatus, PaymentMethod } from '../entities/Order';

const router = Router();

// Validation helper
const validate = (req: any, res: any, next: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
};

/**
 * @route   POST /api/orders
 * @desc    Create a new order
 */
router.post(
    '/',
    [
        body('items').isArray({ min: 1 }).withMessage('At least one item required'),
        body('items.*.productId').isInt().withMessage('Product ID must be an integer'),
        body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
        body('shippingAddress.fullName').notEmpty(),
        body('shippingAddress.phone').notEmpty(),
        body('shippingAddress.address').notEmpty(),
        body('shippingAddress.city').notEmpty(),
        body('paymentMethod').isIn(Object.values(PaymentMethod)),
    ],
    validate,
    async (req: any, res: any) => {
        try {
            const userId = req.headers['x-user-id'];
            if (!userId) {
                return res.status(401).json({ success: false, message: 'User ID required' });
            }

            const order = await orderService.createOrder({
                userId,
                ...req.body,
            });

            res.status(201).json({
                success: true,
                message: 'Order created successfully',
                data: order,
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message || 'Failed to create order',
            });
        }
    }
);

/**
 * @route   GET /api/orders
 * @desc    Get orders with filtering
 */
router.get(
    '/',
    [
        query('page').optional().isInt({ min: 1 }),
        query('limit').optional().isInt({ min: 1, max: 100 }),
        query('status').optional().isIn(Object.values(OrderStatus)),
        query('paymentStatus').optional().isIn(Object.values(PaymentStatus)),
    ],
    validate,
    async (req: any, res: any) => {
        try {
            const userId = req.headers['x-user-id'];
            const userRole = req.headers['x-user-role'];

            const filters: any = {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 10,
                status: req.query.status,
                paymentStatus: req.query.paymentStatus,
            };

            // Non-admin users can only see their own orders
            if (userRole !== 'ADMIN') {
                filters.userId = userId;
            }

            const { orders, total } = await orderService.getOrders(filters);

            res.json({
                success: true,
                data: {
                    items: orders,
                    total,
                    page: filters.page,
                    limit: filters.limit,
                    totalPages: Math.ceil(total / filters.limit),
                },
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to fetch orders',
            });
        }
    }
);

/**
 * @route   GET /api/orders/stats
 * @desc    Get order statistics
 */
router.get('/stats', async (req: any, res: any) => {
    try {
        const userId = req.headers['x-user-id'];
        const userRole = req.headers['x-user-role'];

        const stats = await orderService.getOrderStats(
            userRole === 'ADMIN' ? undefined : userId
        );

        res.json({
            success: true,
            data: stats,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch stats',
        });
    }
});

/**
 * @route   GET /api/orders/:id
 * @desc    Get order by ID
 */
router.get('/:id', async (req: any, res: any) => {
    try {
        const order = await orderService.getOrderById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        // Check access
        const userId = req.headers['x-user-id'];
        const userRole = req.headers['x-user-role'];
        if (userRole !== 'ADMIN' && order.userId !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Access denied',
            });
        }

        res.json({
            success: true,
            data: order,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch order',
        });
    }
});

/**
 * @route   PUT /api/orders/:id/status
 * @desc    Update order status (Admin only)
 */
router.put(
    '/:id/status',
    [body('status').isIn(Object.values(OrderStatus))],
    validate,
    async (req: any, res: any) => {
        try {
            const userRole = req.headers['x-user-role'];
            if (userRole !== 'ADMIN') {
                return res.status(403).json({
                    success: false,
                    message: 'Admin access required',
                });
            }

            const order = await orderService.updateOrderStatus(
                req.params.id,
                req.body.status,
                req.body.reason
            );

            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: 'Order not found',
                });
            }

            res.json({
                success: true,
                message: 'Order status updated',
                data: order,
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message || 'Failed to update order',
            });
        }
    }
);

/**
 * @route   POST /api/orders/:id/cancel
 * @desc    Cancel order
 */
router.post(
    '/:id/cancel',
    [body('reason').notEmpty().withMessage('Cancel reason is required')],
    validate,
    async (req: any, res: any) => {
        try {
            const userId = req.headers['x-user-id'];

            const order = await orderService.cancelOrder(
                req.params.id,
                userId,
                req.body.reason
            );

            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: 'Order not found or access denied',
                });
            }

            res.json({
                success: true,
                message: 'Order cancelled successfully',
                data: order,
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message || 'Failed to cancel order',
            });
        }
    }
);

export default router;

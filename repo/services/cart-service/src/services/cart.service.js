const { Cart, CartItem } = require('../models');
const redis = require('../config/redis');
const axios = require('axios');

const CART_TTL = 60 * 60 * 24 * 7; // 7 days in seconds
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002';

class CartService {
    // Get cart from cache or database
    async getCart(userId) {
        // Try Redis cache first
        const cacheKey = `cart:${userId}`;
        const cached = await redis.get(cacheKey);

        if (cached) {
            return JSON.parse(cached);
        }

        // Get from database
        let cart = await Cart.findOne({
            where: { userId },
            include: [{ model: CartItem, as: 'items' }],
        });

        if (!cart) {
            // Create new cart
            cart = await Cart.create({ userId });
            cart.items = [];
        }

        // Cache cart
        await this.cacheCart(userId, cart);

        return cart;
    }

    // Add item to cart
    async addItem(userId, productId, quantity = 1) {
        const cart = await this.getOrCreateCart(userId);

        // Fetch product details
        const product = await this.fetchProduct(productId);
        if (!product) {
            throw new Error('Product not found');
        }

        if (product.stock < quantity) {
            throw new Error('Insufficient stock');
        }

        // Check if item already exists
        let cartItem = await CartItem.findOne({
            where: { cartId: cart.id, productId },
        });

        if (cartItem) {
            // Update quantity
            const newQuantity = cartItem.quantity + quantity;
            if (product.stock < newQuantity) {
                throw new Error('Insufficient stock');
            }
            cartItem.quantity = newQuantity;
            await cartItem.save();
        } else {
            // Create new item
            cartItem = await CartItem.create({
                cartId: cart.id,
                productId: product.id,
                productName: product.name,
                productImage: product.images?.[0] || null,
                productPrice: product.price,
                quantity,
            });
        }

        // Invalidate cache
        await this.invalidateCache(userId);

        return this.getCart(userId);
    }

    // Update item quantity
    async updateItemQuantity(userId, itemId, quantity) {
        const cart = await this.getOrCreateCart(userId);

        const cartItem = await CartItem.findOne({
            where: { id: itemId, cartId: cart.id },
        });

        if (!cartItem) {
            throw new Error('Item not found in cart');
        }

        // Check stock
        const product = await this.fetchProduct(cartItem.productId);
        if (product && product.stock < quantity) {
            throw new Error('Insufficient stock');
        }

        if (quantity <= 0) {
            await cartItem.destroy();
        } else {
            cartItem.quantity = quantity;
            await cartItem.save();
        }

        await this.invalidateCache(userId);

        return this.getCart(userId);
    }

    // Remove item from cart
    async removeItem(userId, itemId) {
        const cart = await this.getOrCreateCart(userId);

        const result = await CartItem.destroy({
            where: { id: itemId, cartId: cart.id },
        });

        if (!result) {
            throw new Error('Item not found in cart');
        }

        await this.invalidateCache(userId);

        return this.getCart(userId);
    }

    // Clear cart
    async clearCart(userId) {
        const cart = await this.getOrCreateCart(userId);

        await CartItem.destroy({
            where: { cartId: cart.id },
        });

        await this.invalidateCache(userId);

        return { message: 'Cart cleared successfully' };
    }

    // Get cart summary
    async getCartSummary(userId) {
        const cart = await this.getCart(userId);

        const items = cart.items || [];
        const subtotal = items.reduce((sum, item) => {
            return sum + (parseFloat(item.productPrice) * item.quantity);
        }, 0);

        const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
        const shippingCost = subtotal >= 500000 ? 0 : 25000;
        const total = subtotal + shippingCost;

        return {
            itemCount,
            subtotal,
            shippingCost,
            total,
            freeShippingThreshold: 500000,
            amountToFreeShipping: Math.max(0, 500000 - subtotal),
        };
    }

    // Helper methods
    async getOrCreateCart(userId) {
        let cart = await Cart.findOne({ where: { userId } });

        if (!cart) {
            cart = await Cart.create({ userId });
        }

        return cart;
    }

    async fetchProduct(productId) {
        try {
            const response = await axios.get(`${PRODUCT_SERVICE_URL}/api/products/${productId}`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch product:', error.message);
            return null;
        }
    }

    async cacheCart(userId, cart) {
        const cacheKey = `cart:${userId}`;
        await redis.setex(cacheKey, CART_TTL, JSON.stringify(cart));
    }

    async invalidateCache(userId) {
        const cacheKey = `cart:${userId}`;
        await redis.del(cacheKey);
    }
}

module.exports = new CartService();

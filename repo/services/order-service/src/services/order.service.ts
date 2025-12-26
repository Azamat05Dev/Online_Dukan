import { AppDataSource } from '../config/database';
import { Order, OrderStatus, PaymentStatus, PaymentMethod } from '../entities/Order';
import { OrderItem } from '../entities/OrderItem';
import axios from 'axios';

interface CreateOrderInput {
    userId: string;
    items: {
        productId: number;
        quantity: number;
    }[];
    shippingAddress: {
        fullName: string;
        phone: string;
        address: string;
        city: string;
        district?: string;
        postalCode?: string;
    };
    paymentMethod: PaymentMethod;
    notes?: string;
}

interface OrderFilters {
    userId?: string;
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
    page?: number;
    limit?: number;
}

export class OrderService {
    private orderRepository = AppDataSource.getRepository(Order);
    private orderItemRepository = AppDataSource.getRepository(OrderItem);
    private productServiceUrl = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002';

    private generateOrderNumber(): string {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `ORD-${timestamp}-${random}`;
    }

    async createOrder(input: CreateOrderInput): Promise<Order> {
        // Fetch product details from Product Service
        const orderItems: Partial<OrderItem>[] = [];
        let subtotal = 0;

        for (const item of input.items) {
            try {
                const response = await axios.get(
                    `${this.productServiceUrl}/api/products/${item.productId}`
                );
                const product = response.data;

                if (product.stock < item.quantity) {
                    throw new Error(`Insufficient stock for product: ${product.name}`);
                }

                const totalPrice = product.price * item.quantity;
                subtotal += totalPrice;

                orderItems.push({
                    productId: product.id,
                    productName: product.name,
                    productImage: product.images?.[0],
                    productSku: product.sku,
                    quantity: item.quantity,
                    unitPrice: product.price,
                    totalPrice,
                });

                // Update stock in Product Service
                await axios.patch(
                    `${this.productServiceUrl}/api/products/${item.productId}/stock`,
                    null,
                    { params: { quantity: -item.quantity } }
                );
            } catch (error) {
                throw new Error(`Failed to process product ${item.productId}`);
            }
        }

        // Calculate totals
        const shippingCost = subtotal >= 500000 ? 0 : 25000; // Free shipping over 500k
        const totalAmount = subtotal + shippingCost;

        // Create order
        const order = this.orderRepository.create({
            userId: input.userId,
            orderNumber: this.generateOrderNumber(),
            status: OrderStatus.PENDING,
            paymentStatus: PaymentStatus.PENDING,
            paymentMethod: input.paymentMethod,
            subtotal,
            shippingCost,
            discount: 0,
            totalAmount,
            shippingAddress: input.shippingAddress,
            notes: input.notes,
        });

        const savedOrder = await this.orderRepository.save(order);

        // Create order items
        for (const item of orderItems) {
            const orderItem = this.orderItemRepository.create({
                ...item,
                orderId: savedOrder.id,
            });
            await this.orderItemRepository.save(orderItem);
        }

        // Fetch complete order with items
        return this.getOrderById(savedOrder.id) as Promise<Order>;
    }

    async getOrders(filters: OrderFilters): Promise<{ orders: Order[]; total: number }> {
        const { userId, status, paymentStatus, page = 1, limit = 10 } = filters;
        const skip = (page - 1) * limit;

        const queryBuilder = this.orderRepository
            .createQueryBuilder('order')
            .leftJoinAndSelect('order.items', 'items')
            .orderBy('order.createdAt', 'DESC');

        if (userId) {
            queryBuilder.andWhere('order.userId = :userId', { userId });
        }

        if (status) {
            queryBuilder.andWhere('order.status = :status', { status });
        }

        if (paymentStatus) {
            queryBuilder.andWhere('order.paymentStatus = :paymentStatus', { paymentStatus });
        }

        const [orders, total] = await queryBuilder
            .skip(skip)
            .take(limit)
            .getManyAndCount();

        return { orders, total };
    }

    async getOrderById(orderId: string): Promise<Order | null> {
        return this.orderRepository.findOne({
            where: { id: orderId },
            relations: ['items'],
        });
    }

    async getOrderByNumber(orderNumber: string): Promise<Order | null> {
        return this.orderRepository.findOne({
            where: { orderNumber },
            relations: ['items'],
        });
    }

    async updateOrderStatus(
        orderId: string,
        status: OrderStatus,
        cancelReason?: string
    ): Promise<Order | null> {
        const order = await this.getOrderById(orderId);
        if (!order) return null;

        order.status = status;

        switch (status) {
            case OrderStatus.SHIPPED:
                order.shippedAt = new Date();
                break;
            case OrderStatus.DELIVERED:
                order.deliveredAt = new Date();
                order.paymentStatus = PaymentStatus.PAID;
                break;
            case OrderStatus.CANCELLED:
                order.cancelledAt = new Date();
                order.cancelReason = cancelReason;
                // Restore stock
                for (const item of order.items) {
                    await axios.patch(
                        `${this.productServiceUrl}/api/products/${item.productId}/stock`,
                        null,
                        { params: { quantity: item.quantity } }
                    );
                }
                break;
        }

        return this.orderRepository.save(order);
    }

    async updatePaymentStatus(
        orderId: string,
        paymentStatus: PaymentStatus
    ): Promise<Order | null> {
        const order = await this.getOrderById(orderId);
        if (!order) return null;

        order.paymentStatus = paymentStatus;

        if (paymentStatus === PaymentStatus.PAID) {
            order.status = OrderStatus.CONFIRMED;
        }

        return this.orderRepository.save(order);
    }

    async cancelOrder(orderId: string, userId: string, reason: string): Promise<Order | null> {
        const order = await this.getOrderById(orderId);
        if (!order || order.userId !== userId) return null;

        if (![OrderStatus.PENDING, OrderStatus.CONFIRMED].includes(order.status)) {
            throw new Error('Order cannot be cancelled');
        }

        return this.updateOrderStatus(orderId, OrderStatus.CANCELLED, reason);
    }

    async getOrderStats(userId?: string): Promise<any> {
        const queryBuilder = this.orderRepository.createQueryBuilder('order');

        if (userId) {
            queryBuilder.where('order.userId = :userId', { userId });
        }

        const stats = await queryBuilder
            .select([
                'COUNT(*) as totalOrders',
                'SUM(order.totalAmount) as totalRevenue',
                'AVG(order.totalAmount) as averageOrderValue',
            ])
            .getRawOne();

        const statusCounts = await this.orderRepository
            .createQueryBuilder('order')
            .select('order.status', 'status')
            .addSelect('COUNT(*)', 'count')
            .groupBy('order.status')
            .getRawMany();

        return {
            ...stats,
            byStatus: statusCounts,
        };
    }
}

export default new OrderService();

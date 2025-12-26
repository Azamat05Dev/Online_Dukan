import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { OrderItem } from './OrderItem';

export enum OrderStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    PROCESSING = 'PROCESSING',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
    REFUNDED = 'REFUNDED',
}

export enum PaymentStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    FAILED = 'FAILED',
    REFUNDED = 'REFUNDED',
}

export enum PaymentMethod {
    CASH = 'CASH',
    CARD = 'CARD',
    ONLINE = 'ONLINE',
}

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'user_id', type: 'uuid' })
    userId!: string;

    @Column({ name: 'order_number', unique: true })
    orderNumber!: string;

    @Column({
        type: 'enum',
        enum: OrderStatus,
        default: OrderStatus.PENDING,
    })
    status!: OrderStatus;

    @Column({
        name: 'payment_status',
        type: 'enum',
        enum: PaymentStatus,
        default: PaymentStatus.PENDING,
    })
    paymentStatus!: PaymentStatus;

    @Column({
        name: 'payment_method',
        type: 'enum',
        enum: PaymentMethod,
        default: PaymentMethod.CASH,
    })
    paymentMethod!: PaymentMethod;

    @Column({ name: 'subtotal', type: 'decimal', precision: 12, scale: 2 })
    subtotal!: number;

    @Column({ name: 'shipping_cost', type: 'decimal', precision: 12, scale: 2, default: 0 })
    shippingCost!: number;

    @Column({ name: 'discount', type: 'decimal', precision: 12, scale: 2, default: 0 })
    discount!: number;

    @Column({ name: 'total_amount', type: 'decimal', precision: 12, scale: 2 })
    totalAmount!: number;

    @Column({ name: 'shipping_address', type: 'jsonb' })
    shippingAddress!: {
        fullName: string;
        phone: string;
        address: string;
        city: string;
        district?: string;
        postalCode?: string;
    };

    @Column({ type: 'text', nullable: true })
    notes?: string;

    @Column({ name: 'shipped_at', type: 'timestamp', nullable: true })
    shippedAt?: Date;

    @Column({ name: 'delivered_at', type: 'timestamp', nullable: true })
    deliveredAt?: Date;

    @Column({ name: 'cancelled_at', type: 'timestamp', nullable: true })
    cancelledAt?: Date;

    @Column({ name: 'cancel_reason', type: 'text', nullable: true })
    cancelReason?: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

    @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
    items!: OrderItem[];
}

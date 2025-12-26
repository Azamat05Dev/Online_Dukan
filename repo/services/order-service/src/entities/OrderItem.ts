import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Order } from './Order';

@Entity('order_items')
export class OrderItem {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'order_id', type: 'uuid' })
    orderId!: string;

    @Column({ name: 'product_id', type: 'int' })
    productId!: number;

    @Column({ name: 'product_name' })
    productName!: string;

    @Column({ name: 'product_image', nullable: true })
    productImage?: string;

    @Column({ name: 'product_sku' })
    productSku!: string;

    @Column({ type: 'int' })
    quantity!: number;

    @Column({ name: 'unit_price', type: 'decimal', precision: 12, scale: 2 })
    unitPrice!: number;

    @Column({ name: 'total_price', type: 'decimal', precision: 12, scale: 2 })
    totalPrice!: number;

    @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'order_id' })
    order!: Order;
}

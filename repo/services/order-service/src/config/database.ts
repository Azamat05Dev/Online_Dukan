import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Order } from '../entities/Order';
import { OrderItem } from '../entities/OrderItem';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL || 'postgresql://admin:secret123@localhost:5432/ecommerce',
    schema: 'order_service',
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
    entities: [Order, OrderItem],
    migrations: ['src/migrations/*.ts'],
    subscribers: [],
});

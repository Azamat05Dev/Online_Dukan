import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import { AppDataSource } from './config/database';
import orderRoutes from './routes/order.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'order-service' });
});

// Routes
app.use('/api/orders', orderRoutes);

// Error handler
app.use((err: any, req: any, res: any, next: any) => {
    console.error(err);
    res.status(500).json({
        success: false,
        message: err.message || 'Internal server error',
    });
});

// Initialize database and start server
AppDataSource.initialize()
    .then(() => {
        console.log('✅ Database connected');

        app.listen(PORT, () => {
            console.log(`🚀 Order Service running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('❌ Database connection error:', error);
        process.exit(1);
    });

export default app;

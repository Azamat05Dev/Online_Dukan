import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import { connectDatabase } from './config/database';
import searchRoutes from './routes/search.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3005;

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'search-service' });
});

// Routes
app.use('/api/search', searchRoutes);

// Error handler
app.use((err: any, req: any, res: any, next: any) => {
    console.error(err);
    res.status(500).json({
        success: false,
        message: err.message || 'Internal server error',
    });
});

// Initialize and start
connectDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`🚀 Search Service running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Failed to start server:', error);
        process.exit(1);
    });

export default app;

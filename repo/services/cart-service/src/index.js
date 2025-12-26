require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const sequelize = require('./config/sequelize');
const cartRoutes = require('./routes/cart.routes');

const app = express();
const PORT = process.env.PORT || 3004;

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'cart-service' });
});

// Routes
app.use('/api/cart', cartRoutes);

// Error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({
        success: false,
        message: err.message || 'Internal server error',
    });
});

// Initialize database and start server
sequelize.authenticate()
    .then(() => {
        console.log('✅ Database connected');
        return sequelize.sync({ alter: true });
    })
    .then(() => {
        console.log('✅ Models synchronized');
        app.listen(PORT, () => {
            console.log(`🚀 Cart Service running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('❌ Database connection error:', error);
        process.exit(1);
    });

module.exports = app;

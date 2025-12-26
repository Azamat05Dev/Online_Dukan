require('dotenv').config();

module.exports = {
    development: {
        url: process.env.DATABASE_URL || 'mysql://root:secret123@localhost:3306/ecommerce',
        dialect: 'mysql',
        logging: console.log,
    },
    production: {
        url: process.env.DATABASE_URL,
        dialect: 'mysql',
        logging: false,
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    },
};

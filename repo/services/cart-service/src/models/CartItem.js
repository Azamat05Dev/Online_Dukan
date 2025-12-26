const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Cart = require('./Cart');

const CartItem = sequelize.define('CartItem', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    cartId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'cart_id',
        references: {
            model: Cart,
            key: 'id',
        },
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'product_id',
    },
    productName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'product_name',
    },
    productImage: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'product_image',
    },
    productPrice: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        field: 'product_price',
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
            min: 1,
        },
    },
}, {
    tableName: 'cart_items',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

// Associations
Cart.hasMany(CartItem, { foreignKey: 'cartId', as: 'items', onDelete: 'CASCADE' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId', as: 'cart' });

module.exports = CartItem;

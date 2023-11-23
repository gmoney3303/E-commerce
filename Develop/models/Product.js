const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Product extends Model {}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    product_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2), // Example: Allows for a price with 10 digits and 2 decimal places
      allowNull: false,
      validate: {
        isDecimal: true, // Ensures the value is a decimal
      },
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10, // Default value set to 10
      validate: {
        isNumeric: true, // Validates that the value is numeric
      },
    },
    category_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'category', // This refers to the 'category' model
        key: 'id',
      },
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'product',
  }
);

module.exports = Product;
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      const { User, Role, Product, Order } = models;

      Product.hasOne(Order, { foreignKey: "product_id" });
      Order.belongsTo(Product, { foreignKey: "product_id" });
      User.hasOne(Order, { foreignKey: "placedBy" });
      Order.belongsTo(User, { foreignKey: "placedBy" });
    }
    static getProductWithRole() {
      console.log("Order with log called");
    }
  }
  Order.init(
    {
      RefId: {
        type: DataTypes.STRING,
        allowNull: false
      },

      orderDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    },
    {
      sequelize,
      modelName: "Order"
    }
  );

  //   Product.associate = models => {
  //     Product.belongsTo(models.User, { foreignKey: "createdBy", as: "creator" });
  //   };

  return Order;
};

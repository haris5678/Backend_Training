"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      const { User, Role } = models;
      User.hasMany(Product, { foreignKey: "uploadedBy" });
      Product.belongsTo(User, { foreignKey: "uploadedBy" });

      

    }
    static getProductWithRole() {
      console.log("Products with log called");
    }
  }
  Product.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },

      description: DataTypes.STRING,

      price: {
        type: DataTypes.FLOAT,
        allowNull: false
      },

      soldout: DataTypes.BOOLEAN

      //   createdBy: {
      //     type: DataTypes.INTEGER,
      //     allowNull: false
      //   }

      //   createdBy: {
      //     type: DataTypes.INTEGER,
      //     allowNull: false,
      //     references: {
      //       model: "User",
      //       key: "id"
      //     }
      //   }

      //   createdBy: {
      //     type: DataTypes.STRING,
      //     allowNull: false
      //   },
    },
    {
      sequelize,
      modelName: "Product"
    }
  );

  //   Product.associate = models => {
  //     Product.belongsTo(models.User, { foreignKey: "createdBy", as: "creator" });
  //   };

  return Product;
};

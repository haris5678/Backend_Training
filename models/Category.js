"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    //   const { User, Role,Category } = models;
    //   Category.hasMany(Product, { foreignKey: "categoryId" });
    //   Product.belongsTo(Category, { foreignKey: "categoryId" });
    // Many-to-many association with Product through ProductCategory
    Category.belongsToMany(models.Product, {
      through: models.ProductCategory,
      foreignKey: "categoryId",
    })
  }
    static getCategoryWithRole() {
      console.log("Category with log called");
    }
  }
  Category.init(
    {
      type: DataTypes.STRING,
      title: DataTypes.STRING,
      
    },
    {
      sequelize,
      modelName: "Category"
    }
  );
  return Category;
};

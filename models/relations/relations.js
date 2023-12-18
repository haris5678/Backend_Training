//const Product = require("../Product");

module.exports = function(sequelize, DataTypes) {
  const { User, Role, Product } = sequelize.models;


  console.log("Seq")

  Role.hasMany(User, { foreignKey: "role_id" });
  User.belongsTo(Role, { foreignKey: "role_id" });



  //   Product.belongsTo(User, { foreignKey: "createdBy", as: "creator" });
  //   User.hasMany(Product, { foreignKey: "createdBy", as: "createdProducts" });
};

const express = require("express");
const router = express.Router();
const ProductController = require("../app/controllers/ProductController");

// router.get('/login', AuthController.loginPage);
router.post("/create-product", ProductController.createProduct);
router.post("/edit-product", ProductController.updateProduct);
router.delete("/delete-product", ProductController.deleteProduct);
router.get('/show-products', ProductController.getAllProducts);

module.exports = router;

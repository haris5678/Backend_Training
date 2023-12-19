const express = require("express");
const router = express.Router();
const CategoryController = require("../app/controllers/CategoryController");

//user can create orders
router.post("/create-category", CategoryController.createCategory);

module.exports = router;

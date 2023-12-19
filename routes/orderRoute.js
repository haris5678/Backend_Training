const express = require("express");
const router = express.Router();
const OrderController = require("../app/controllers/OrderController");

//user can create orders
router.post("/create-order", OrderController.orderProduct);

//get products for specific user......
router.get("/get-order", OrderController.getUserOrder);

//delete orders for users
router.delete("/delete-order", OrderController.deleteUserOrder);

module.exports = router;

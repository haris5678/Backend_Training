const express = require("express");
const router = express.Router();
const OrderController = require("../app/controllers/OrderController");

//user can create orders
router.post("/create-order", OrderController.orderProduct);

//get products for admin..........
router.get("/get-admin-order", OrderController.getOrder);
//get products for specific user......
router.get("/get-user-order", OrderController.getUserOrder);

//delete orders for users
router.delete("/delete-user-order", OrderController.deleteUserOrder);

//delete order for admin
router.delete("/delete-admin-order", OrderController.deleteAdminOrder);

module.exports = router;

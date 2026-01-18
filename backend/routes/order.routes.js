
// ============================================

// backend/routes/order.routes.js
const router = require("express").Router();
const orderController = require("../controllers/order.controller");
const authController = require("../controllers/auth");

// Protected routes - require authentication
router.use(authController.protect);

router.post("/", orderController.createOrder);
router.get("/my-orders", orderController.getMyOrders);
router.get("/:id", orderController.getOrder);
router.patch("/:id/cancel", orderController.cancelOrder);

// Admin routes
router.get("/admin/all", orderController.getAllOrders);

module.exports = router;
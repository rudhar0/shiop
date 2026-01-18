// backend/routes/admin.routes.js
const router = require("express").Router();
const authController = require("../controllers/auth");
const adminController = require("../controllers/admin.controller");
const productController = require("../controllers/product.controller");
const { restrictToAdmin } = require("../middlewares/admin.middleware");

// Protect all admin routes
router.use(authController.protect);
router.use(restrictToAdmin);

// Dashboard
router.get("/dashboard/stats", adminController.getDashboardStats);

// Orders Management
router.get("/orders", adminController.getAllOrders);
router.patch("/orders/:id/status", adminController.updateOrderStatus);

// Products Management
router.get("/products", adminController.getAdminProducts);
router.post("/products", productController.createProduct);
router.patch("/products/:id", productController.updateProduct);
router.delete("/products/:id", productController.deleteProduct);

// Users Management
router.get("/users", adminController.getAllUsers);

module.exports = router;
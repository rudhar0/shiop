// backend/routes/product.routes.js
const router = require("express").Router();
const productController = require("../controllers/product.controller");

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProduct);
router.post("/", productController.createProduct);
router.patch("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

module.exports = router;

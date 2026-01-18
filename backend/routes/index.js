// backend/routes/index.js - Updated
const router = require("express").Router();

const authRoute = require("./auth");
const userRoute = require("./user");
const productRoute = require("./product.routes");
const orderRoute = require("./order.routes");
const adminRoute = require("./admin.routes");

router.use("/auth", authRoute);
router.use("/user", userRoute);
router.use("/products", productRoute);
router.use("/orders", orderRoute);
router.use("/admin", adminRoute);

module.exports = router;
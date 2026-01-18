const router = require("express").Router()
const authController = require("../controllers/auth")
const userController = require("../controllers/user")


router.patch("/update-me",authController.protect,userController.updateMe)
router.get("/me", authController.protect, userController.getMe)



module.exports = router
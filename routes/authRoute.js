const express = require("express")
const router = express.Router()

// route controller
const authController = require("../controllers/authController")

router.post("/register",authController.PostRegister)
router.post("/login",authController.PostLogin)
router.get('/logout',authController.logout)

module.exports = router
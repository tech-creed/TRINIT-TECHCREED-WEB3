const express = require("express")
const router = express.Router()

// route controller
const pageController = require("../controllers/pageController")


router.get("/",pageController.homePage)

router.get("/login",pageController.loginPage)

router.get("/register",pageController.registerPage)

router.get("/verification",pageController.verificationPage)


module.exports = router
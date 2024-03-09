const express = require("express")
const router = express.Router()

// route controller
const pageController = require("../controllers/pageController")


router.get("/",pageController.homePage)

router.get("/login",pageController.loginPage)

router.get("/register",pageController.registerPage)

router.get("/verification",pageController.verificationPage)

router.get("/profile",pageController.profilePage)

router.get("/adminVerification",pageController.adminVerificationPage)

router.get("/publicProfilePage/:wallet",pageController.publicProfilePage)


module.exports = router
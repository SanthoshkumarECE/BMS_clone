const express = require("express")
const theaterloginconttroller = require("../controller/theaterlogincontroller")
const moviecontroller = require("../controller/moviecontroller")
const Auth = require("../../middlewares/Auth")

const router = express.Router()

router.post("/signin", theaterloginconttroller.signintheater)
router.post("/login", theaterloginconttroller.logintheater)
router.post("/addmovie", Auth, moviecontroller.addMovie)

router.get("/homepage",Auth,moviecontroller.getTheaterHomepage)
router.get("/profile",Auth,moviecontroller.getTheaterProfile)
router.get("/details", moviecontroller.getMovieDetails)

router.put("/updateprofile",Auth,moviecontroller.updateProfile)
router.get("/getfeedback",Auth,moviecontroller.getfeedback)

module.exports = router
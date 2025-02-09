const express = require("express")
const userlogincontroller = require("../controller/userlogincontroller")
const bookingcontroller = require("../controller/bookingcontroller")
const Auth = require("../../middlewares/Auth")

const router = express.Router()


router.post("/signin", userlogincontroller.signinUser)
router.post("/login", userlogincontroller.loginUser)

router.get("/homepage", bookingcontroller.getUserHomepage)
router.get("/location", bookingcontroller.getMoviesByLocation)
router.get("/moviename", bookingcontroller.getMoviesByName)
router.get("/theatername", bookingcontroller.getMoviesByTheaterName)
router.get("/moviedetails/:id",bookingcontroller.getMovieDetails)

router.get("/profile", Auth, bookingcontroller.getProfile)
router.get("/booking",Auth,bookingcontroller.getbookinghistory)

router.post("/bookticket", Auth, bookingcontroller.bookSeats)
router.put("/updateprofile",Auth,bookingcontroller.updateProfile)

router.delete("/cancelbooking", Auth, bookingcontroller.cancelBooking)
router.post("/addfeedback",Auth,bookingcontroller.addfeedback)



module.exports = router
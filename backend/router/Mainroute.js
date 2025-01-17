const express = require("express")
const userRoute = require("../users/router/userRoute")
const theaterRoute = require("../Theaters/router/theaterRoute")
const router = express.Router()
//this is the where route with endpoints for user and theater

router.use("/user", userRoute)
router.use("/theater",theaterRoute)

module.exports = router
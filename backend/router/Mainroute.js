const express = require("express")
const userRoute = require("../users/router/userRoute")
const theaterRoute = require("../Theaters/router/theaterRoute")
const router = express.Router()

router.use("/user", userRoute)
router.use("/theater",theaterRoute)

module.exports = router
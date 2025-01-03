const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
require("dotenv").config()


const app = express()
const MainRoute = require("./router/Mainroute")
app.use(cors())
app.use(express.json())
app.use("/",MainRoute)

mongoose.connect(process.env.MONGODB_CONNECTION)
   .then(() => console.log("Connected to MongoDB"))
   .catch((error) => console.error("MongoDB connection error:", error));

app.listen(process.env.PORT, () => {
   console.log(`server is listening in port ${process.env.PORT}`)
})


const mongoose = require("mongoose")

const userDetailsSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: String,
    age: String,
    city: String,
    mobilenumber: String
});

const userDetails = mongoose.model("userdetails", userDetailsSchema)

module.exports = userDetails
const mongoose = require("mongoose")

const theaterLoginSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    theatername: String,
    city: String
});

const Theater = mongoose.model('theaterdetails', theaterLoginSchema);

module.exports = Theater;


const mongoose = require("mongoose")

const feedbackschema = new mongoose.Schema({
    name: { type: String, require: true },
    feedback: { type: String, require: true },
    theaterId: { type: mongoose.Schema.Types.ObjectId, ref: 'theaterdetails', required: true },
})

const feedbackmodel = mongoose.model("feedbacks", feedbackschema)

module.exports = feedbackmodel
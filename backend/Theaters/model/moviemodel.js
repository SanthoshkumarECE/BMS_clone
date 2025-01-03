const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String }, 
    duration: { type: String, required: true }, 
    seatsAvailable: { type: Number, required: true }, 
    mode:{type : String,required:true},
    theaterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'theaterdetails',
        required: true
    },
    showtime: { type: String, default: "" },
    date: { type: String, default: "" },
    status:{type:String,default:"upcoming"},
    bookedSeats: { type: [Number], default: [] }
}, { timestamps: true });

const Movie = mongoose.model('movies', movieSchema);
module.exports = Movie;

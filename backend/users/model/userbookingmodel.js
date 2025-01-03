const mongoose = require('mongoose');

const userBookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'userdetails', required: true },
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'movies', required: true },
    theaterId: { type: mongoose.Schema.Types.ObjectId, ref: 'theaterdetails', required: true }, 
    bookingTime: { type: Date, default: Date.now }, 
    bookedSeats: { type: [Number], required: true }, 
});

const userBooking = mongoose.model('Userbooking', userBookingSchema);

module.exports = userBooking;

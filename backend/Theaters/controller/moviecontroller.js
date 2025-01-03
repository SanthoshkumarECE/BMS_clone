const Movie = require("../model/moviemodel")
const theaterdetails = require("../model/theaterloginmodel")
const userBooking = require("../../users/model/userbookingmodel")
const feedBack = require("../../users/model/feedbackmodel")

const addMovie = async (req, res) => {
    try {
        const { title, description,duration,seatsAvailable ,mode,showtime,date} = req.body;

        const theaterId = req.user.theaterId;

        if (!theaterId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }    
        const movie = new Movie({
            title,
            description,
            duration,
            seatsAvailable,
            theaterId,
            mode,
            showtime,
            date
        });
        await movie.save();
        res.status(201).json({ message: 'Movie added successfully', movie });
    } catch (error) {
        res.status(500).json({ message: 'Error adding movie', error: error.message });
    }
};

const getTheaterHomepage = async (req, res) => {
    const theaterId = req.user.theaterId
    try {
        const movies = await Movie.find({ theaterId })

        res.status(200).json(movies)
    } catch (error) {
        res.status(500).json({ message: 'Error fetching movies', error: error.message });
    }
};

const getTheaterProfile = async (req, res) => {
    const theaterId = req.user.theaterId
    try {
        const theater = await theaterdetails.find({ _id : theaterId })

        res.status(200).json(theater)
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
}

const getMovieDetails = async (req, res) => {
    try {
        const id = req.query.id;
        if (!id) {
            return res.status(400).json({ error: "Movie ID is required." });
        }
        const movie = await Movie.findOne({ _id: id });
        if (!movie) {
            return res.status(404).json({ error: "Movie not found." });
        }
        const bookings = await userBooking.find({ movieId: id }).populate({
            path: "userId",
            select:"name city"
        });
        res.status(200).json({ moviedetails: movie, bookings: bookings });
    } catch (err) {
        res.status(500).json({ error: "An error occurred while fetching movie details. Please try again later." });
    }
};
const updateProfile = async (req, res) => {
    try {
        const id = req.user.theaterId;
        const { city, theatername} = req.body;
        const updatedtheater = await theaterdetails.findByIdAndUpdate(
            id,
            { $set: { city, theatername } },
            { new: true }
        );

        if (!updatedtheater) {
            return res.status(404).json({ message: "Theater not found" });
        }

        res.status(200).json({ message: "Profile updated successfully", user: updatedtheater });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
};

const getfeedback = async (req, res) => {
    try {
        const id = req.user.theaterId;
        if (!id) {
            return res.status(400).json({ message: "Theater ID is required." });
        }
        const feedbacks = await feedBack.find({ theaterId: id }, "name feedback");

        if (feedbacks.length === 0) {
            return res.status(404).json({ message: "No feedback found for this theater." });
        }

        res.json(feedbacks);
    } catch (error) {
        console.error("Error fetching feedback:", error);

        if (error.name === "MongoError") {
            return res.status(500).json({ message: "Database error occurred.", error: error.message });
        }
        res.status(500).json({ message: "Error getting feedback.", error: error.message });
    }
}; 


module.exports = {
    addMovie, getTheaterHomepage, getTheaterProfile,
    getfeedback,getMovieDetails, updateProfile
}


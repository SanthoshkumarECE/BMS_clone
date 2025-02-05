const Movie = require("../../Theaters/model/moviemodel")
const userDetails = require("../model/userloginmodel")
const userBooking = require("../model/userbookingmodel")
const feedBack = require("../model/feedbackmodel")

const getUserHomepage = async (req, res) => {
    try {
        const movies = await Movie.find()
            .populate('theaterId', 'theatername city')
            .exec();

        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching movies', error: error.message });
    }
};
const getMoviesByLocation = async (req, res) => {
    try {
        const { city } = req.query;

        if (!city) {
            return res.status(400).json({ message: 'City is required in query parameters' });
        }
        const movies = await Movie.find()
            .populate({
                path: 'theaterId',
                match: { city: { $regex: city, $options: 'i' } },
                select: 'theatername city',
            })
            .exec();
        const filteredMovies = movies.filter(movie => movie.theaterId !== null);
        console.log(filteredMovies)
        res.status(200).json(filteredMovies);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching movies', error: error.message });
    }
};

const getMoviesByName = async (req, res) => {
    try {
        const { title } = req.query;

        if (!title) {
            return res.status(400).json({ message: 'title is required in query parameters' });
        }
        const movies = await Movie.find({ title: { $regex: title, $options: 'i' } })
            .populate({
                path: 'theaterId',
                select: 'theatername city'
            })
            .exec();

        console.log(movies)
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching movies', error: error.message });
    }
};

const getMoviesByTheaterName = async (req, res) => {
    try {
        const { theatername } = req.query;

        if (!theatername) {
            return res.status(400).json({ message: 'City is required in query parameters' });
        }
        const movies = await Movie.find()
            .populate({
                path: 'theaterId',
                match: { theatername: { $regex: theatername, $options: 'i' } },
                select: 'theatername city'
            })
            .exec();
        const filteredMovies = movies.filter(movie => movie.theaterId !== null);
        console.log(filteredMovies)
        res.status(200).json(filteredMovies);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching movies', error: error.message });
    }
}

const getProfile = async (req, res) => {
    try {
        const id = req.user.userid;

        if (!id) {
            return res.status(400).json({ error: "User ID is required." });
        }

        const user = await userDetails.findById(id);

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        const userProfile = {
            name: user.name,
            email: user.email,
            mobilenumber: user.mobilenumber, 
            age: user.age,
            city:user.city
            
        };
        res.status(200).json(userProfile);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ error: "An error occurred while fetching the profile. Please try again later." });
    }
};

const bookSeats = async (req, res) => {
    const { movieId, theaterId, bookedSeats } = req.body;
    const userId = req.user.userid;

    try {

        if (!movieId || !theaterId || !Array.isArray(bookedSeats) || bookedSeats.length === 0) {
            return res.status(400).json({ success: false, message: 'Invalid request data' });
        }

        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).json({ success: false, message: 'Movie not found' });
        }

 
        const isAlreadyBooked = bookedSeats.some(seat => movie.bookedSeats.includes(seat));
        if (isAlreadyBooked) {
            return res.status(400).json({ success: false, message: 'One or more seats are already booked' });
        }

        movie.bookedSeats.push(...bookedSeats);
        movie.seatsAvailable -= bookedSeats.length;
        await movie.save();

        const newBooking = new userBooking({
            userId,
            movieId,
            theaterId,
            bookedSeats,
        });

        await newBooking.save();
        return res.status(201).json({
            success: true,
            message: 'Seats booked successfully',
            data: {
                bookingId: newBooking._id,
                bookedSeats: newBooking.bookedSeats,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'An error occurred', error: error.message });
    }
};

const getbookinghistory = async (req, res) => {
    try {
        const userid = req.user.userid;

        if (!userid) {
            return res.status(400).json({ error: "User ID is required." });
        }

        const userbooking = await userBooking.find({ userId: userid })
            .populate({
                path: "movieId",
                select: "title duration mode showtime date",
            })
            .populate({
                path: "userId",
                select: "name email", 
            })
            .populate({
                path: "theaterId",
                select: "theatername",
            })
            .exec();
        
        if (!userbooking || userbooking.length === 0) {
            return res.status(404).json({ message: "No booking history found." });
        }

        res.status(200).json(userbooking);
    } catch (error) {
        console.error("Error fetching booking history:", error);
        res.status(500).json({ error: "An error occurred while fetching booking history. Please try again later." });
    }
}

const updateProfile = async (req, res) => {
    try {
        const userid = req.user.userid; 
        const { city, age, name, mobilenumber } = req.body;
        const updatedUser = await userDetails.findByIdAndUpdate(
            userid,
            { $set : { city, age, name, mobilenumber } }, 
            { new: true } 
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
};

const cancelBooking = async (req, res) => {
    const { bookingId } = req.body;

    try {
        const deletedDocument = await userBooking.findOneAndDelete({
            _id: bookingId
        });

        if (!deletedDocument) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        const seatsCancelled = deletedDocument.bookedSeats;
        const movieId = deletedDocument.movieId;

        const movie = await Movie.findOne(movieId);

        if (!movie) {
            return res.status(404).json({ success: false, message: 'Movie not found' });
        }

        movie.bookedSeats = movie.bookedSeats.filter(seat => !seatsCancelled.includes(seat));

        movie.seatsAvailable += seatsCancelled.length;

        await movie.save();
        return res.status(200).json({
            success: true,
            message: 'Booking canceled successfully',
            data: {
                canceledSeats: seatsCancelled,
                updatedSeatsAvailable: movie.seatsAvailable,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'An error occurred', error: error.message });
    }
};

const addfeedback = async (req, res) => {
    const { theaterId, feedback } = req.body;
    
    try {
        if (!theaterId || !feedback) {
            return res.status(400).json({
                success: false,
                message: "Theater ID and feedback are required."
            });
        }

        const user = await userDetails.findById(req.user.userid);
        console.log(user)
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const newFeedback = new feedBack({
            name: user.name,
            theaterId,
            feedback
        });
        await newFeedback.save();

        res.status(201).json({
            success: true,
            message: "Feedback added successfully",
            data: newFeedback
        });
    } catch (error) {
        console.error("Error adding feedback:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while adding feedback.",
            error: error.message
        });
    }
};



module.exports = {
    getUserHomepage, getMoviesByLocation, getMoviesByName,
    getMoviesByTheaterName, getProfile, bookSeats,
    getbookinghistory, updateProfile, cancelBooking,addfeedback
    
}
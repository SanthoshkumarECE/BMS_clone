// Function to get URL parameters
const getQueryParams = () => {
    const params = new URLSearchParams(window.location.search);
    return {
      movieId: params.get("movieId"),
      theaterId: params.get("theaterId"),
    };
};

// Function to fetch movie details and generate seat layout
const generateSeats = async () => {
    try {
        const { movieId } = getQueryParams();
        if (!movieId) {
            console.error("Movie ID is missing in the URL.");
            return;
        }

        const response = await fetch(`http://127.0.0.1:3000/user/moviedetails/${movieId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch movie details: ${response.status}`);
        }

        const movie = await response.json();
        console.log("Movie Details:", movie);
        
        document.querySelector(".heading").textContent = movie.title;
        document.querySelector(".theatre").textContent = `${movie.theaterId.theatername}, ${movie.theaterId.city}`;

        const { seatsAvailable, bookedSeats } = movie;
        const totalSeats = seatsAvailable + bookedSeats.length;
        const seatsContainer = document.getElementById("seats-container");

        for (let i = 1; i <= totalSeats; i++) {
            const seatButton = document.createElement("button");
            seatButton.classList.add("seat");
            seatButton.textContent = i;
            seatButton.setAttribute("data-seat-number", i);

            // Disable already booked seats
            if (bookedSeats.includes(i)) {
                seatButton.classList.add("booked");
                seatButton.disabled = true;
            }

            seatsContainer.appendChild(seatButton);
        }
    } catch (error) {
        console.error("Error fetching movie details:", error.message);
    }
};

// Call function on page load
generateSeats();

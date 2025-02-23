// Function to get URL parameters
const getQueryParams = () => {
    const params = new URLSearchParams(window.location.search);
    return {
      movieId: params.get("movieId"),
      theaterId: params.get("theaterId"),
    };
};
let selectedSeats = [];

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
            else {
                // Add event listener for seat selection
                seatButton.addEventListener("click", () => toggleSeatSelection(i, seatButton));
            }

            seatsContainer.appendChild(seatButton);

 
        }
    } catch (error) {
        console.error("Error fetching movie details:", error.message);
    }
};
const toggleSeatSelection = (seatNumber, seatButton) => {
    const index = selectedSeats.indexOf(seatNumber);
    if (index > -1) {
        // Deselect seat
        selectedSeats.splice(index, 1);
        seatButton.classList.remove("selected");
    } else {
        // Select seat
        selectedSeats.push(seatNumber);
        seatButton.classList.add("selected");
    }
    document.getElementsByClassName("count")[0].innerText = selectedSeats.length;
    
};

// Function to book selected seats
const bookTickets = async () => {
    const { movieId, theaterId } = getQueryParams();
    console.log(selectedSeats);
    if (selectedSeats.length === 0) {
        alert("Please select at least one seat.");
        return;
    }

    try {
        const response = await fetch("http://127.0.0.1:3000/user/bookticket", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("Atoken")}`, // If authentication is required
            },
            body: JSON.stringify({
                movieId,
                theaterId,
                bookedSeats: selectedSeats,
            }),
        });

        const result = await response.json();

        if (response.ok) {
            alert("Seats booked successfully!");
            location.reload(); // Reload the page to update booked seats
        } else {
            alert(result.message || "Failed to book seats");
        }
    } catch (error) {
        console.error("Error booking seats:", error.message);
        alert("An error occurred while booking seats.");
    }
};
// Call function on page load
generateSeats();

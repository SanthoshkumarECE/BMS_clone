async function GetMovie() {
  const url = {
    home: "http://127.0.0.1:3000/user/homepage",
    movie: "http://127.0.0.1:3000/user/moviename",
    theater: "http://127.0.0.1:3000/user/theatername",
    location: "http://127.0.0.1:3000/user/location",
  };

  const option = document.getElementById("select").value;
  const name = document.getElementsByClassName("searchtext")[0].value;

  // Check if the user selects something other than "Search By" but doesn't type anything
  if (option !== "home" && !name.trim()) {
    alert("Please enter a search term.");
    return; // Exit the function if the search term is empty
  }

  const queryParam = {
    movie: `?title=${encodeURIComponent(name)}`,
    theater: `?theatername=${encodeURIComponent(name)}`,
    location: `?city=${encodeURIComponent(name)}`,
  };

  const fullurl = url[option] + (queryParam[option] || "");

  try {
    const response = await fetch(fullurl);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const movies = await response.json();
    createMovieCards(movies);
  } catch (error) {
    console.error("An error occurred:", error.message);
    alert("Failed to fetch movies. Please try again later.");
  }
}

function createMovieCards(movies) {
  const moviesContainer = document.querySelector('.movies-container');

  // Clear existing content
  moviesContainer.innerHTML = '';

  if (movies && movies.length > 0) {
    // Loop through the movies and create cards
    movies.forEach(movie => {
      const movieCard = document.createElement('div');
      movieCard.className = 'movie-card';
      movieCard.setAttribute('data-movie-id', movie._id); // Set movie ID
      movieCard.setAttribute('data-theater-id', movie.theaterId._id); // Set theater ID

      movieCard.innerHTML = `
        <h3>Movie name: ${movie.title}</h3>
        <p>Duration: ${movie.duration}</p>
        <p>Description: ${movie.description}</p>
        <p style="font-size:10px;">Theater: ${movie.theaterId.theatername}</p>
        <p style="font-size:10px;">City: ${movie.theaterId.city}</p>
        <button class="book">Book</button>
      `;

      // Append the card to the container
      moviesContainer.appendChild(movieCard);
    });
  } else {
    // Display a message if no movies are found
    const noResultsCard = document.createElement('div');
    noResultsCard.className = "movie-card"
    noResultsCard.innerHTML = `<h3>OOPS! No Results Found &#9785</h3>`;
    moviesContainer.appendChild(noResultsCard);
  }
}

// Call GetMovie when the page loads (for testing purposes)
// Remove this line if you're calling GetMovie from another function (e.g., after login)
GetMovie();


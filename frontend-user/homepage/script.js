async function GetMovie() {
  const url = "http://127.0.0.1:3000/user/homepage";

  try {
    // Fetch the data from the API
    const response = await fetch(url);

    // Check if the response is ok (status code 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the JSON response
    const movies = await response.json();

    // Find the dropdown element in the DOM
    const option = document.getElementById("select");
    if (!option) {
      throw new Error("Dropdown element with id 'select' not found");
    }

    // Populate the dropdown with movie data
    for (const movie of movies) {
      console.log(movie);
    }
  } catch (error) {
    // Log any error that occurs during the fetch or DOM manipulation
    console.error("An error occurred:", error.message);
    alert("Failed to fetch movies. Please try again later.");
  }
}

document.addEventListener('DOMContentLoaded', (event) => {
    const movieId = document.getElementById("movieDetails")?.getAttribute("data-movie-id");
    if (movieId) {
        fetchMovieDetails(movieId);
        // fetchReviews(movieId);
    }
});

async function fetchData(user_id) {
    try {
        const movieName = document.getElementById("movie-name").value.toLowerCase();
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${movieName}&api_key=c98f1ce6b6818220d58cd560ddd260de`);
        
        if (!response.ok) {
            throw new Error("Could not fetch resource");
        }
        
        const data = await response.json();
        console.log(data);

        const movieContainer = document.getElementById("moviesList");
        movieContainer.innerHTML = ''; // Clear previous results
        const searchText = document.getElementById("movie-name")
        searchText.value = ''

        data.results.forEach((movie) => {
            const moviePoster = movie.poster_path;
            const movieUrl = moviePoster ? `https://image.tmdb.org/t/p/w200${moviePoster}` : "/assets/no-image.jpg";
            
            const linkElement = document.createElement("a");
            const userId = user_id;
            linkElement.href = `/users/${userId}/movies/${movie.id}`;
            linkElement.style.display = "inline-block"; // Ensure the link wraps tightly around the image
            const imgElement = document.createElement("img");
            imgElement.className = "movie-poster"
            imgElement.src = movieUrl;
            imgElement.alt = movie.title;
            imgElement.style.display = "block"; // Ensure the image is a block element
        
            linkElement.appendChild(imgElement);
            document.getElementById("moviesList").appendChild(linkElement);
        });
    } catch (error) {
        console.error(error);
    }
}

async function fetchMovieDetails(movieId) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=c98f1ce6b6818220d58cd560ddd260de`);
        
        if (!response.ok) {
            throw new Error("Could not fetch movie details");
        }
        
        const movie = await response.json();
        console.log(movie);

        const background = document.querySelector(".background")
        const movieBackdropUrl = movie.belongs_to_collection.backdrop_path
        console.log(movieBackdropUrl)
        background.style.backgroundImage = `url("https://image.tmdb.org/t/p/original${movieBackdropUrl}")`
        background.style.backgroundPosition = "center"
        background.style.backgroundSize = "cover"
        movieDetails.innerHTML = `
            <div class="movie-detail-container">
                <h1>${movie.title}</h1>
                <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}" alt="${movie.title}">
            <div class="movie-detail">
                <p><strong>Release Date:</strong> ${movie.release_date}</p><br>
                <p>${movie.overview}</p><br>
                <p><strong>Genres:</strong> ${movie.genres.map(genre => genre.name).join(', ')}</p><br>
                <p><strong>Rating:</strong> ${movie.vote_average}</p><br>
            </div>
            </div>
        `;
    } catch (error) {
        console.error(error);
        document.getElementById('movieDetails').innerText = 'Error fetching movie details.';
    }
}
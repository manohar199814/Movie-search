const movieHTML = document.getElementById('movie');
function getMovie() {
    let movieId = sessionStorage.getItem('movieId');

    fetch('https://www.omdbapi.com/?i='+movieId+'&apikey=b5a2eba4')
    .then((response) => {
        console.log(response);
        return response.json();
    }).then((movie) => {
        console.log(movie);
        let output =`
        <div class="row">
          <div class="col-md-4">
            <img src="${movie.Poster}" class="thumbnail">
          </div>
          <div class="col-md-8">
            <h2>${movie.Title}</h2>
            <ul class="list-group">
              <li class="list-group-item"><strong>Genre:</strong> ${movie.Genre}</li>
              <li class="list-group-item"><strong>Released:</strong> ${movie.Released}</li>
              <li class="list-group-item"><strong>Rated:</strong> ${movie.Rated}</li>
              <li class="list-group-item"><strong>IMDB Rating:</strong> ${movie.imdbRating}</li>
              <li class="list-group-item"><strong>Director:</strong> ${movie.Director}</li>
              <li class="list-group-item"><strong>Writer:</strong> ${movie.Writer}</li>
              <li class="list-group-item"><strong>Actors:</strong> ${movie.Actors}</li>
            </ul>
          </div>
        </div>
        <div class="row mt-2 mb-3">
          <div class="well">
            <h3>Plot</h3>
            ${movie.Plot}
            <hr>
            <a href="http://imdb.com/title/${movie.imdbID}" target="_blank" class="btn btn-primary">View IMDB</a>
            <a href="index.html" class="btn btn-danger ml-3" >Go Back To Search</a>
            <a href="index.html" class="btn btn-warning ml-3" >Add to favorites</a>
          </div>
        </div>
      `;
        movieHTML.innerHTML = output;   
    })
    .catch((err) => {
        console.log(err);
    })
} 
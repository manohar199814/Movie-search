const searchForm = document.getElementById('searchForm');
const moviesList = document.getElementById('movies');
const movieHTML = document.getElementById('movie');
const input = document.getElementById('searchText');

let favMovies = [];


window.addEventListener('load', (event) => {
    document.addEventListener('click',removeElements);
    if(input) {
        input.addEventListener("keyup", (e) => { searchMovie(input.value)});
    }
    if(searchForm) {
        searchForm.addEventListener('submit',(e) => {
        let searchString = e.target.elements[0].value;
        getMovies(searchString);
        e.preventDefault();
        });
    }
});


//search movie to give suggetions
async function searchMovie(searchText) {
    const res = await fetch('https://www.omdbapi.com/?s='+searchText+'&apikey=b5a2eba4');
    const data = await res.json();
    if(data.Response === 'True'){
        movies = data.Search
        removeElements();
        for (let i of movies) {
            if (
              i.Title.toLowerCase().startsWith(input.value.toLowerCase()) &&
              input.value != ""
            ) {
              //create li element
              let listItem = document.createElement("li");
              //One common class name
              listItem.classList.add("list-group-item");
              listItem.style.cursor = "pointer";
              listItem.setAttribute("onclick", "displayNames('" + i.Title + "')");
              //Display matched part in bold
              let word = "<b>" + i.Title.substr(0, input.value.length) + "</b>";
              word += i.Title.substr(input.value.length);
              //display the value in array
              listItem.innerHTML = word;
              document.querySelector(".list-group").appendChild(listItem);
            }
          }        
    }
}   

function displayNames(value) {
    input.value = value;
    getMovieTitle(value)
    removeElements();
}

function removeElements() {
    //clear all the item
    let items = document.querySelectorAll("#searchForm .list-group-item");
    items.forEach((item) => {
      item.remove();
    });
}

//to get movie by title
async function getMovieTitle(title) {
    const res = await fetch('https://www.omdbapi.com/?t='+title+'&apikey=b5a2eba4');
    const data = await res.json();
    if(data.Response === 'True'){
        let movie = data;
            let output = '';
            if(movie){
                output += `
                <div class="col-md-3">
                    <div class="well text-center">
                        <img src="${movie.Poster}">
                        <h5>${movie.Title}</h5>
                        <div class="button-group">
                            <a onclick="movieSelected('${movie.imdbID}')" class="btn btn-primary btn-sm" href="#">Movie Details</a>
                            <a onclick="addToFavorites('${movie.imdbID}')" class="btn btn-warning btn-sm" href="#">Add to favorites</a>
                        </div>
                    </div>
                </div>
                `;
                moviesList.innerHTML = output;     
            }
    }else{
        output = `<h1>${data.Error}</h1>`;
        moviesList.innerHTML = output;
    }
}

//function to get movie by search string
function getMovies(searchString) {
    fetch('https://www.omdbapi.com/?s='+searchString+'&apikey=b5a2eba4')
    .then((response) => {
        return response.json();
    }).then((data) => {
       if(data.Response === 'True'){
            let movies = data.Search;
            let output = '';
            if(movies){
            movies.forEach((movie) => {
                output += `
                <div class="col-md-3">
                <div class="well text-center">
                <img src="${movie.Poster}">
                <h5>${movie.Title}</h5>
                <div class="button-group">
                    <a onclick="movieSelected('${movie.imdbID}')" class="btn btn-primary btn-sm" href="#">Movie Details</a>
                    <a onclick="addToFavorites('${movie.imdbID}')" class="btn btn-warning btn-sm" href="#">Add to favorites</a>
                </div>
                
                </div>
            </div>
                `;
            })
            moviesList.innerHTML = output; 
        }
    }else{
        getMovieTitle(searchString)
    }
    })
    .catch((err) => {
        console.log(err);
    })
}

// movie selected
function movieSelected(id){
    console.log('movie selected')
    sessionStorage.setItem('movieId',id);
    window.location ='movie.html';
    return false;
}

//get movie from local storage and display in favourite movie
function getMovie() {
    let movieId = sessionStorage.getItem('movieId');

    fetch('https://www.omdbapi.com/?i='+movieId+'&apikey=b5a2eba4')
    .then((response) => {
        return response.json();
    }).then((movie) => {
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
            <a href="https://imdb.com/title/${movie.imdbID}" target="_blank" class="btn btn-primary">View IMDB</a>
            <a href="index.html" class="btn btn-danger ml-3" >Go Back To Search</a>
            <a onclick="addToFavorites('${movie.imdbID}')" class="btn btn-warning ml-3" href="#">Add to favorites</a>
          </div>
        </div>
      `;
        movieHTML.innerHTML = output;   
    })
    .catch((err) => {
        console.log(err);
    })
}

//add to favourites

function addToFavorites(id){
    if(localStorage.getItem('favMovies')){
        var favMovies = localStorage.getItem('favMovies').split(',');
    }else{
        var favMovies = [];
    }

    if(favMovies.includes(id)){
        alert('This movie is already in favourites');
        return;
    }
    favMovies.push(id);
    localStorage.setItem('favMovies',favMovies.join(','));
    window.alert('added to favourites');
}

//get all fav movies
function getFavMovies(){

    if(localStorage.getItem('favMovies')){
        var favMovies = localStorage.getItem('favMovies').split(',');
    }else{
        var favMovies = [];
    }

    let output = '';

    if(favMovies.length === 0){
        moviesList.insertAdjacentHTML('beforeend','<h1 class="mt-5">No favorites!! Add one</h1>');
        moviesList.insertAdjacentHTML('afterend','<a href="index.html" class="btn btn-danger ml-3" >Go Back To Search</a>');
        return;
    }


    favMovies.forEach((movieId) => {

        fetch('https://www.omdbapi.com/?i='+movieId+'&apikey=b5a2eba4')
        .then((response) => {
            return response.json();
        }).then((movie) =>{
            output = `
            <div class="col-md-3 mt-4">
            <div class="well text-center">
            <img src="${movie.Poster}">
            <h5>${movie.Title}</h5>
            <div class="button-group">
                <a onclick="movieSelected('${movie.imdbID}')" class="btn btn-primary btn-sm" href="#">Movie Details</a>
                <a onclick="removeFromFavorites('${movie.imdbID}')" class="btn btn-warning btn-sm" href="#">Remove</a>
            </div>
            </div>
        </div>
        `;
        moviesList.insertAdjacentHTML('beforeend',output)
        }).catch(err => {
            console.log(err)
        })
   });

}

//remove from favourites
function removeFromFavorites(id) {
    var favMovies = localStorage.getItem('favMovies').split(',');
    if(favMovies.includes(id)){
        let index = favMovies.indexOf(id);
        favMovies.splice(index,1);
        localStorage.setItem('favMovies',favMovies.join(','));
        window.location = 'favMovie.html'
    }
}







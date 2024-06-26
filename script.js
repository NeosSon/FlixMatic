const tmdbKey = '6dd4fcd1077c4884f33e9e8c4772181e';
const tmdbBaseUrl = `https://api.themoviedb.org/3`;
const options = {method: 'GET', headers: {accept: 'application/json'}};
const imageBaseUrl = "https://image.tmdb.org/t/p/original/"
let searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
let searchValue = "" 
let searchInputLabel = document.getElementById("search-input-label")
let searchForm = document.getElementById("search-form")
let searchContainer = document.querySelector(".container")
let cards = document.querySelector(".cards");
let image = document.createElement("img");
let overview = document.createElement("p")
let title = document.createElement("h2")
let release_date = document.createElement("p")
let rating = document.createElement("h3")

const cardsContainer = document.createElement("div");
cardsContainer.className = "default-cards";
document.body.appendChild(cardsContainer);
    
searchButton.addEventListener("click", () => {
    cardsContainer.innerHTML = "";
    cards.innerHTML = "";
    searchValue = searchInput.value; // Get the value of the input
    multipleCards()
    searchInput.value = ""; // Reset the input field

});

 function handleKeyPress(event) {
    // Check if the key pressed is Enter (key code 13)
    console.log(searchInput.value)
    if (event.key === "Enter") {
        //saves input value before pressing enter
        event.preventDefault(); // Prevents the default action of the Enter key
        searchInput.blur(); // Blurs the input element
        // Perform the desired action here
        cardsContainer.innerHTML = "";
        cards.innerHTML = "";
        searchValue = searchInput.value; // Get the value of the input
        multipleCards()
        searchInput.value = ""; // Reset the input field
    }
};


const getData = async (searchValue) => {

    const getSpecificMovie = `/search/movie?query=${searchValue}`
  const requestParams = `&api_key=${tmdbKey}`
  const urlToFetch = tmdbBaseUrl + getSpecificMovie + requestParams
    try{
        const response = await fetch(urlToFetch, options)
        if (response.ok) {
            const jsonResponse = await response.json()
            const results = jsonResponse.results
            console.log(results)
            return results
        }
    }catch(error){
        console.log(error)
    }
}

const addPoster = async (cardData, container) => {
    // Check if there's already a title and image in the container, and remove them if present
    const title = container.querySelector(".title");
    const image = container.querySelector("img");
    if (title && image) {
        container.removeChild(title);
        container.removeChild(image);
    }

    // Create elements for title and image
    const titleElement = document.createElement("div");
    const imageElement = document.createElement("img");

    // Set class name for elements
    titleElement.className = "title"
    imageElement.className = "poster"

    // Set styles for image
    imageElement.style.width = "300px";

    // Get title and image link from cardData
    const titleProperty = cardData["title"];
    const imageLink = await getImageLink(cardData); // Wait for the image link

    // Set text content and image source
    titleElement.innerText = titleProperty;
    imageElement.src = imageLink;

    // Append title and image to the container
    container.appendChild(titleElement);
    container.appendChild(imageElement);
}

// Function to get the image link for a specific card
const getImageLink = async (cardData) => {
    const imageBaseUrl = "https://image.tmdb.org/t/p/original/";
    const posterPath = cardData['poster_path'];
    return imageBaseUrl + posterPath;
}

const addSummary = async (cardData, container) => {
    const overview = document.createElement("div");
    const release_date = document.createElement("div");
    const rating = document.createElement("div");

    //Create class name for elements
    overview.className = "overview"
    release_date.className = "release-date"
    rating.className = "rating"

    overview.innerText = cardData["overview"];
    release_date.innerText = cardData["release_date"];
    rating.innerText = "Rating: " + cardData["vote_average"];

    container.appendChild(overview);
    container.appendChild(release_date);
    container.appendChild(rating);
}

async function multipleCards() {
    const jsonResponse = await getData(searchValue);
    const cardsContainer = document.querySelector(".cards");
    document.querySelector("#trending-title").innerText = searchValue.toUpperCase();
    for (const cardData of jsonResponse) {
        const card = document.createElement("div");
        card.className = "card"
        card.classList.add("card");
        await addPoster(cardData, card);
        await addSummary(cardData, card);

        cardsContainer.appendChild(card);
    }
}
//function to show trending movies as default
async function trendingMovies() {
    const getTrendingMovies = `/trending/movie/week`
    const requestParams = `?api_key=${tmdbKey}`
    const urlToFetch = tmdbBaseUrl + getTrendingMovies + requestParams
    try{
        const response = await fetch(urlToFetch, options)
        if (response.ok) {
            const jsonResponse = await response.json()
            const results = jsonResponse.results
            return results
        }
    }catch(error){
        console.log(error)
    }
}
//function to display trending movies
async function displayTrendingMovies() {
    const jsonResponse = await trendingMovies();
    cardsContainer.innerHTML = "";
    cards.innerHTML = "";
    document.getElementById("trending-title").innerText = 'Trending Movies'
    for (const cardData of jsonResponse) {
        const card = document.createElement("div");
        card.className = "card"
        card.classList.add("card");
        await addPoster(cardData, card);
        await addSummary(cardData, card);

        cardsContainer.appendChild(card);
    }
}
displayTrendingMovies()

document.getElementById("header-title").addEventListener("click", displayTrendingMovies)

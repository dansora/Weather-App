// script for js code
// function buildQueryURL() {
//     var queryURL = "http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid=54ebbc38a65cf66330acb405408d7fa7";
    
// }

// document.getElementById("search-button").addEventListener("click", getLocation);

// var getLocation =  function(address) {
//     var geocoder = new google.maps.Geocoder();
//     geocoder.geocode( { 'address': address}, function(results, status) {
  
//     if (status == google.maps.GeocoderStatus.OK) {
//         var latitude = results[0].geometry.location.lat();
//         var longitude = results[0].geometry.location.lng();
//         console.log(latitude, longitude);
//         } 
//     }); 
//   }

const cityInput = document.querySelector(".city-input")
const searchButton = document.querySelector(".search-button");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsSection = document.querySelector(".weather-cards");

const API_KEY = "54ebbc38a65cf66330acb405408d7fa7"; // API key for Open Weather Map API

const createWeatherCard = (cityName, weatherItem, index) => {
    if(index === 0) { // HTML for the today card
        return `<div class="details">
                    <h3>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h3>
                    <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)} °C</h4>
                    <h4>Wind speed: ${weatherItem.wind.speed} m/s</h4>
                    <h4>Humidity: ${weatherItem.main.humidity}%</h4>
                    </div>
                <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="moderate rain">
                    <h4>${weatherItem.weather[0].description}</h4>
                </div>`;
            }
    else { // HTML for the other five day forecast cards
         return`<li class="card">
                <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="rain">
                <h4>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)} °C</h4>
                <h4>Wind speed: ${weatherItem.wind.speed} m/s</h4>
                <h4>Humidity: ${weatherItem.main.humidity}%</h4>
            </li>`;
    }

   
}

const getWeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
        
        // filter the forecast to get only one forecast a day
        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate);
            }  
        });
       // clearing previous weather data
       cityInput.value = "";
       currentWeatherDiv.innerHTML = "";
       weatherCardsSection.innerHTML = "";

        // creating weather cards and dding them to the DOM
        fiveDaysForecast.forEach((weatherItem, index) => {
            if(index === 0) {
                currentWeatherDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
            }
            else {
                weatherCardsSection.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
            }
        });

    }).catch(() => {
        alert("An error occured while fetching the forecast!");
    });
}

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim(); // get the user entered name and remove any extra spaces

    if(!cityName) return; // return if cityName is empty

    const GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}=1&appid={API_KEY}`;

    // get entered city coordinates (name, latitude, longitude) from the API response
    fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
        if(!data.length) return alert(`No coordinates found for ${cityName}`);
        const { name, lat, lon } = data[0];
        getWeatherDetails(name, lat, lon);
    }).catch(() => {
        alert("An error occured while fetching the coordinates!");
    });
    // console.log(cityName);
}

searchButton.addEventListener("click", getCityCoordinates);


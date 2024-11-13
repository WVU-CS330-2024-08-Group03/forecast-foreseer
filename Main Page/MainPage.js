document.addEventListener("DOMContentLoaded", function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(locationAndMap, showError);
    } else {
        document.getElementById("mapFrame").src = "https://www.openstreetmap.org";
        document.getElementById("LocationHeader").textContent = "Location Unavailable";
    }
});

/**
 * Initializes map and retrieves the user's town and state, then fetches weather data.
 */

function locationAndMap(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const locationHeader = document.getElementById("LocationHeader");
    const mapApiKey = "AIzaSyAtitR8lFqlvEyzDrbI01yu5My5OLtF0bE";

    // Set the iframe src for the satellite map
    const mapFrame = document.getElementById("mapFrame");
    mapFrame.src = `https://maps.google.com/maps?q=${lat},${lon}&t=k&z=15&output=embed`;

    // Retrieve the user's town and state
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${mapApiKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.results && data.results[0]) {
                const components = data.results[0].address_components;
                const town = components.find(c => c.types.includes("locality"))?.long_name || "Unknown Town";
                const state = components.find(c => c.types.includes("administrative_area_level_1"))?.short_name || "Unknown State";
                locationHeader.textContent = `${town}, ${state}`;
                
                // Fetch weather data after location is determined
                getWeatherData(lat, lon, `${town}, ${state}`);
            } else {
                locationHeader.textContent = "Location Unavailable";
            }
        })
        .catch(error => {
            console.error("Error fetching location data:", error);
            locationHeader.textContent = "Location Unavailable";
        });
}

/**
 * Function to get weather data from OpenWeatherMap.
 */

function getWeatherData(lat, lon, location) {
    const weatherApiKey = "2e1131575a50d8a246f43f85d40c1d81";
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=metric`;

    fetch(weatherUrl)
        .then(response => response.json())
        .then(data => {
            const weatherDescription = data.weather[0].description;
            const temperature = data.main.temp;
            const humidity = data.main.humidity;
            const windSpeed = data.wind.speed;
            const uvIndex = data.current?.uvi || 0;
            const precipitation = data.rain ? data.rain["1h"] : 0;

            const weatherData = {
                location,
                temperature,
                weatherDescription,
                precipitation,
                humidity,
                uvIndex,
                windSpeed,
                timestamp: new Date().toISOString()
            };

            // Insert weather data into the database
            insertWeatherData(weatherData);

            // Display the current weather
            displayCurrentWeather(weatherData);
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
        });
}

/**
 * Sends weather data to the backend to insert into the Azure SQL database.
 */
function insertWeatherData(weatherData) {
    fetch('/api/insertWeatherData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(weatherData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Weather data inserted:', data);
    })
    .catch(error => {
        console.error('Error inserting weather data:', error);
    });
}

/**
 * Display the current weather on the page.
 */
function displayCurrentWeather(weather) {
    document.getElementById("Temperature").textContent = `Temperature: ${weather.temperature}°C`;
    document.getElementById("WeatherAlerts").textContent = `Weather: ${weather.weatherDescription}`;
    document.getElementById("PrecipitationChance").textContent = `Precipitation Chance: ${weather.precipitation}%`;
    document.getElementById("Humidity").textContent = `Humidity: ${weather.humidity}%`;
    document.getElementById("UVIndex").textContent = `UV Index: ${weather.uvIndex}`;
    document.getElementById("Wind").textContent = `Wind Speed: ${weather.windSpeed} m/s`;
}

/**
 * Error handling for geolocation issues.
 */
function showError(error) {
    console.error("Geolocation error:", error);
    document.getElementById("mapFrame").src = "https://www.openstreetmap.org";
    document.getElementById("LocationHeader").textContent = "Location Unavailable";
}
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
    updateMap(lat, lon);

    // Retrieve the user's town and state
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${mapApiKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.results && data.results[0]) {
                const components = data.results[0].address_components;
                const town = components.find(c => c.types.includes("locality"))?.long_name || "Unknown Town";
                const state = components.find(c => c.types.includes("administrative_area_level_1"))?.short_name || "Unknown State";
                locationHeader.textContent = `${town}, ${state}`;
                locationHeader.setAttribute("data-lat", lat); // Store latitude
                locationHeader.setAttribute("data-lon", lon); // Store longitude

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

// Updates the map iframe source
function updateMap(lat, lon) {
    const mapFrame = document.getElementById("mapFrame");
    mapFrame.src = `https://maps.google.com/maps?q=${lat},${lon}&t=k&z=15&output=embed`;
}

document.addEventListener("DOMContentLoaded", () => {
    const locationHeader = document.getElementById("LocationHeader");
    const magnifyingGlassIcon = document.getElementById("MagnifyingGlassIcon");
    const suggestionBox = document.createElement("div");
    suggestionBox.id = "suggestionBox";
    suggestionBox.style.position = "absolute";
    suggestionBox.style.backgroundColor = "white";
    suggestionBox.style.border = "1px solid #ccc";
    suggestionBox.style.zIndex = "1000";
    suggestionBox.style.display = "none";
    document.body.appendChild(suggestionBox);

    let timeout;

    // Make the location header editable on click
    locationHeader.addEventListener("click", function () {
        if (!locationHeader.isContentEditable) {
            locationHeader.contentEditable = "true";
            locationHeader.focus();
            magnifyingGlassIcon.style.display = "block"; // Show the magnifying glass
        }
    });

    locationHeader.addEventListener("input", function () {
        const query = locationHeader.textContent.trim();
        if (query.length > 2) {
            clearTimeout(timeout);
            timeout = setTimeout(() => fetchSuggestions(query), 300);
        } else {
            suggestionBox.style.display = "none";
        }
    });

    locationHeader.addEventListener("blur", function () {
        setTimeout(() => {
            suggestionBox.style.display = "none";
            magnifyingGlassIcon.style.display = "none"; // Hide the magnifying glass when focus leaves
        }, 200); // Delay to allow click on suggestions
    });

    locationHeader.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            locationHeader.blur();
        }
    });

    function fetchSuggestions(query) {
        const service = new google.maps.places.AutocompleteService();
        service.getPlacePredictions(
            { input: query, types: ["(cities)"] },
            (predictions, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
                    showSuggestions(predictions);
                } else {
                    console.error("Error fetching location suggestions:", status);
                    suggestionBox.style.display = "none";
                }
            }
        );
    }

    function showSuggestions(predictions) {
        suggestionBox.innerHTML = "";
        predictions.forEach(prediction => {
            const suggestion = document.createElement("div");
            suggestion.textContent = prediction.description;
            suggestion.style.padding = "8px";
            suggestion.style.cursor = "pointer";

            suggestion.addEventListener("click", () => {
                locationHeader.textContent = prediction.description;
                locationHeader.blur();
                suggestionBox.style.display = "none";

                // Optional: Fetch lat/lon and update the map
                fetchLocationDetails(prediction.place_id);
            });

            suggestionBox.appendChild(suggestion);
        });

        const rect = locationHeader.getBoundingClientRect();
        suggestionBox.style.top = `${rect.bottom + window.scrollY}px`;
        suggestionBox.style.left = `${rect.left + window.scrollX}px`;
        suggestionBox.style.width = `${rect.width}px`;
        suggestionBox.style.display = "block";
    }

    function fetchLocationDetails(placeId) {
        const apiKey = "AIzaSyAtitR8lFqlvEyzDrbI01yu5My5OLtF0bE"; // Replace with your API key
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.result && data.result.geometry) {
                    const lat = data.result.geometry.location.lat;
                    const lon = data.result.geometry.location.lng;
                    updateMap(lat, lon);
                    getWeatherData(lat, lon, locationHeader.textContent);
                }
            })
            .catch(error => console.error("Error fetching location details:", error));
    }
});

// Save custom location and update map
function saveCustomLocation(customLocation) {
    const locationHeader = document.getElementById("LocationHeader");
    const mapApiKey = "AIzaSyAtitR8lFqlvEyzDrbI01yu5My5OLtF0bE";

    if (!customLocation.trim()) {
        alert("Please enter a valid location.");
        locationHeader.textContent = "Unknown Location";
        return;
    }

    // Use Geocoding API to get coordinates for the custom location
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(customLocation)}&key=${mapApiKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.results && data.results[0]) {
                const location = data.results[0];
                const lat = location.geometry.location.lat;
                const lon = location.geometry.location.lng;
                const components = location.address_components;
                const town = components.find(c => c.types.includes("locality"))?.long_name || customLocation;
                const state = components.find(c => c.types.includes("administrative_area_level_1"))?.short_name || "";

                // Update the header and map with the new location
                locationHeader.textContent = `${town}, ${state}`;
                updateMap(lat, lon);

                // Fetch weather data for the new location
                getWeatherData(lat, lon, `${town}, ${state}`);
            } else {
                alert("Location not found. Please enter a valid location.");
            }
        })
        .catch(error => {
            console.error("Error fetching custom location data:", error);
            alert("An error occurred while setting the location.");
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
            const temperatureC = data.main.temp;
            const temperatureF = (temperatureC * 9/5) + 32;
            const humidity = data.main.humidity;
            const windSpeed = data.wind.speed;
            const uvIndex = data.current?.uvi || 0;
            const precipitation = data.rain ? data.rain["1h"] : 0;

            const weatherData = {
                location,
                temperatureC,
                temperatureF,
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
    document.getElementById("Temperature").textContent = `${weather.temperatureF.toFixed(2)}°F (${weather.temperatureC}°C)`;
    document.getElementById("WeatherAlerts").textContent = `${weather.weatherDescription}`;
    document.getElementById("PrecipitationChance").textContent = `${weather.precipitation}%`;
    document.getElementById("Humidity").textContent = `${weather.humidity}%`;
    document.getElementById("UVIndex").textContent = `${weather.uvIndex}`;
    document.getElementById("Wind").textContent = `${weather.windSpeed} m/s`;
}

/**
 * Error handling for geolocation issues.
 */
function showError(error) {
    console.error("Geolocation error:", error);
    document.getElementById("mapFrame").src = "https://www.openstreetmap.org";
    document.getElementById("LocationHeader").textContent = "Location Unavailable";
}
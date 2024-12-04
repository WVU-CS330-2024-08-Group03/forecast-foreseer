import { Link } from 'react-router-dom';
import React, { useEffect } from 'react';
import './MainPageStyles.css';
import UpcomingEvents from '../Calendar/Upcoming Events/UpcomingEvents';

function MainPage(){

    useEffect(() => {
        // Dynamically load Google Maps API script
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDUO65J4i89TiUkcESwlOMH3LFBKhQOfY8&libraries=places`;
        script.async = true;
        document.body.appendChild(script);
    
        // Geolocation and map logic
        script.onload = () => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(locationAndMap, showError);
          } else {
            document.getElementById("mapFrame").src = "https://www.openstreetmap.org";
            document.getElementById("LocationHeader").textContent = "Location Unavailable";
          }
        };
      }, []);

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
        document.getElementById("Temperature").textContent = `${weather.temperature}°C`;
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

    return(
        <>
        <div id="Header">
            <div id="headerRow1">
                <h3 id="SiteName">FORECAST FORESEER</h3>

                <h1 id="LocationHeader">LOCATION</h1>

                <div id="FlexButtons">
                    <h3 className="OffsetWarning">WARNING</h3>
                    <h3 className="OffsetUser"><Link to="/Sign In" id="userAccount">USER</Link></h3>
                </div>
            </div>

            <div id="FlexCast">
                <div>Now</div>
                <div>Hourly</div>
                <div>10 Day</div>
            </div>

        </div>

        <div id="WebAppBody">

            <div id="CurrentWeather">
                <div id="TempBox">
                    <p>Temperature:</p>
                    <p id="Temperature">Temperature</p>
                </div>

                <div id="WeatherAlertsBox">
                    <p>Weather:</p>
                    <p id="WeatherAlerts">Weather Alerts</p>
                </div>
            </div>

            <div id="columns">
                <div id="leftColumn">
                    <div>
                        <p>Precipitation Chance:</p>
                        <p id="PrecipitationChance">Precipitation Chance</p>
                    </div>

                    <div>
                        <p>Humidity:</p>
                        <p id="Humidity">Humidity</p>
                    </div>

                    <div>
                        <img src="..\images\uv_index.png.png" alt="broken image" width="20px" height="20px" style={{ float: 'left' }}/>
                        <p>UV Index:</p>
                        <p id="UVIndex">UV Index</p>
                    </div>

                    <div>
                        <p>Wind Speed:</p>
                        <p id="Wind">Wind</p>
                    </div>
                </div>

                <div id="middleColumn">

                    <div id="SatelliteMap">
                        <iframe
                            id="mapFrame" 
                            width="100%" 
                            height="100%"
                            style={{ border: '0' }} 
                            allowfullscreen="" 
                            loading="lazy">
                        </iframe>
                    </div>
                </div>

                <div id="rightColumn">
                    <div id="Suggestions">
                        Suggestions
                    </div>

                    <div id="CalendarBox">
                        <UpcomingEvents />
                        <Link to="/Calendar" id="CalendarLink">Calendar</Link>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default MainPage;
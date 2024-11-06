document.addEventListener("DOMContentLoaded", function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(initLocationAndMap, showError);
    } else {
        document.getElementById("mapFrame").src = "https://www.openstreetmap.org";
        document.getElementById("LocationHeader").textContent = "Location Unavailable";
    }
});

/**
 * Initializes map and retrieves the user's town and state.
 * @param {Object} position Geolocation position object.
 */

function initLocationAndMap(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const locationHeader = document.getElementById("LocationHeader");
    const apiKey = "AIzaSyAtitR8lFqlvEyzDrbI01yu5My5OLtF0bE"; // Replace with your API key

    // Set the iframe src for the satellite map
    const mapFrame = document.getElementById("mapFrame");
    mapFrame.src = `https://maps.google.com/maps?q=${lat},${lon}&t=k&z=15&output=embed`;

    // Retrieve the user's town and state
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.results && data.results[0]) {
                const components = data.results[0].address_components;
                const town = components.find(c => c.types.includes("locality"))?.long_name || "Unknown Town";
                const state = components.find(c => c.types.includes("administrative_area_level_1"))?.short_name || "Unknown State";
                locationHeader.textContent = `${town}, ${state}`;
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
 * Error handling for geolocation or map loading issues.
 */

function showError(error) {
    console.error("Geolocation error:", error);
    const mapFrame = document.getElementById("mapFrame");
    mapFrame.src = "https://www.openstreetmap.org";
    document.getElementById("LocationHeader").textContent = "Location Unavailable";
}
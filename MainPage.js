document.addEventListener("DOMContentLoaded", function () {
    // Check if geolocation is supported
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showMap, showError);
    } else {
        document.getElementById("mapFrame").src = "https://www.openstreetmap.org";
    }
});

/**
 * Display satellite map of user's location
 * @param {} position User's location
 */

function showMap(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const mapFrame = document.getElementById("mapFrame");

    // Set the iframe src to display satellite map
    mapFrame.src = `https://maps.google.com/maps?q=${lat},${lon}&t=k&z=15&output=embed`;
}

/**
 * If there is an error displaying Google Maps, display OpenStreetMap
 */

function showError() {
    const mapFrame = document.getElementById("mapFrame");
    mapFrame.src = "https://www.openstreetmap.org"; // Default map if location is unavailable
}